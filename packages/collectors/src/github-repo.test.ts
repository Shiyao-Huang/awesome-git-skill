import test from 'node:test';
import assert from 'node:assert/strict';
import { collectGitHubRepoProfile } from './github-repo.ts';

function jsonResponse(body: unknown, init?: { status?: number; headers?: Record<string, string> }): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
}

test('collectGitHubRepoProfile aggregates repo, contributors, releases, tooling, and community signals', async () => {
  const urls: string[] = [];
  const fetchMock: typeof fetch = async (input) => {
    const url = String(input);
    urls.push(url);

    if (url.endsWith('/repos/acme/demo')) {
      return jsonResponse({
        full_name: 'acme/demo',
        html_url: 'https://github.com/acme/demo',
        description: 'Demo repo',
        stargazers_count: 123,
        forks_count: 45,
        open_issues_count: 6,
        license: { spdx_id: 'MIT' },
        pushed_at: '2026-04-27T05:00:00Z',
        created_at: '2026-01-01T00:00:00Z',
        default_branch: 'main',
        homepage: 'https://demo.dev',
        topics: ['ai', 'cli'],
        has_discussions: true,
        language: 'TypeScript',
        size: 321,
        archived: false,
        disabled: false,
        is_template: false,
      });
    }

    if (url.endsWith('/contributors?per_page=10')) {
      return jsonResponse([
        { login: 'alice', contributions: 100 },
        { login: 'bob', contributions: 25 },
        { login: 'carol', contributions: 25 },
      ]);
    }

    if (url.endsWith('/contributors?per_page=1&anon=1')) {
      return jsonResponse([{ login: 'alice', contributions: 100 }], {
        headers: {
          link: '<https://api.github.com/repos/acme/demo/contributors?per_page=1&anon=1&page=37>; rel="last"',
        },
      });
    }

    if (url.endsWith('/releases?per_page=20')) {
      return jsonResponse([
        { published_at: '2026-04-20T00:00:00Z', created_at: '2026-04-20T00:00:00Z' },
        { published_at: '2026-04-18T00:00:00Z', created_at: '2026-04-18T00:00:00Z' },
        { published_at: '2026-04-14T00:00:00Z', created_at: '2026-04-14T00:00:00Z' },
      ]);
    }

    if (url.endsWith('/actions/workflows?per_page=100')) {
      return jsonResponse({
        workflows: [
          { name: 'CI', path: '.github/workflows/ci.yml', state: 'active' },
          { name: 'Publish package', path: '.github/workflows/publish.yml', state: 'active' },
        ],
      });
    }

    if (url.endsWith('/git/trees/main?recursive=1')) {
      return jsonResponse({
        tree: [
          { path: '.github/dependabot.yml', type: 'blob' },
          { path: 'package.json', type: 'blob' },
          { path: 'pnpm-lock.yaml', type: 'blob' },
          { path: 'docs/readme.md', type: 'blob' },
        ],
      });
    }

    if (url.includes('/commits?per_page=100&since=')) {
      return jsonResponse([
        {
          commit: {
            message: 'chore(deps): bump openai from 4.0.0 to 4.1.0',
            committer: { date: '2026-04-24T00:00:00Z' },
          },
          author: { login: 'dependabot[bot]' },
        },
        {
          commit: {
            message: 'fix: adjust score output',
            committer: { date: '2026-04-22T00:00:00Z' },
          },
          author: { login: 'alice' },
        },
      ]);
    }

    if (url.includes('/issues?state=all&sort=updated&direction=desc&per_page=100&since=')) {
      return jsonResponse([
        {
          number: 11,
          created_at: '2026-04-20T00:00:00Z',
          comments: 2,
          user: { login: 'reporter-1' },
        },
        {
          number: 12,
          created_at: '2026-04-22T12:00:00Z',
          comments: 1,
          user: { login: 'reporter-2' },
        },
        {
          number: 99,
          created_at: '2026-04-22T12:00:00Z',
          comments: 4,
          user: { login: 'contributor' },
          pull_request: {},
        },
      ]);
    }

    if (url.endsWith('/issues/11/comments?per_page=100')) {
      return jsonResponse([
        { created_at: '2026-04-20T01:00:00Z', user: { login: 'alice' } },
        { created_at: '2026-04-20T02:00:00Z', user: { login: 'random-user' } },
      ]);
    }

    if (url.endsWith('/issues/12/comments?per_page=100')) {
      return jsonResponse([
        { created_at: '2026-04-22T13:00:00Z', user: { login: 'random-user' } },
      ]);
    }

    if (url.endsWith('/pulls?state=closed&sort=updated&direction=desc&per_page=100')) {
      return jsonResponse([
        {
          number: 201,
          created_at: '2026-04-10T00:00:00Z',
          closed_at: '2026-04-11T00:00:00Z',
          merged_at: '2026-04-11T00:00:00Z',
        },
        {
          number: 202,
          created_at: '2026-04-15T00:00:00Z',
          closed_at: '2026-04-17T00:00:00Z',
          merged_at: null,
        },
        {
          number: 203,
          created_at: '2026-04-18T00:00:00Z',
          closed_at: '2026-04-21T00:00:00Z',
          merged_at: '2026-04-20T12:00:00Z',
        },
      ]);
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const profile = await collectGitHubRepoProfile('acme/demo', fetchMock);
  assert.equal(profile.snapshot.repo, 'acme/demo');
  assert.equal(profile.snapshot.stars, 123);
  assert.deepEqual(profile.snapshot.topics, ['ai', 'cli']);
  assert.equal(profile.contributors.contributor_count, 37);
  assert.equal(profile.contributors.contributor_bucket, '<50');
  assert.equal(profile.releases.release_count_sampled, 3);
  assert.equal(profile.releases.median_interval_hours, 72);
  assert.equal(profile.tooling.workflows.workflow_count, 2);
  assert.equal(profile.tooling.workflows.has_test_workflow, true);
  assert.equal(profile.tooling.workflows.has_publish_workflow, true);
  assert.equal(profile.tooling.dependency_automation.has_dependabot, true);
  assert.equal(profile.tooling.dependency_automation.package_manifest_count, 1);
  assert.equal(profile.tooling.dependency_automation.lockfile_count, 1);
  assert.equal(profile.tooling.dependency_updates.dependency_update_commit_count, 1);
  assert.deepEqual(profile.tooling.dependency_updates.dependency_update_authors, ['dependabot[bot]']);
  assert.equal(profile.tooling.dependency_updates.last_dependency_update_at, '2026-04-24T00:00:00Z');
  assert.equal(profile.community.issue_response.sampled_issue_count, 2);
  assert.equal(profile.community.issue_response.issues_with_comments_count, 2);
  assert.equal(profile.community.issue_response.issues_with_maintainer_response_count, 1);
  assert.equal(profile.community.issue_response.median_first_maintainer_response_hours, 1);
  assert.equal(profile.community.issue_response.response_coverage_rate, 0.5);
  assert.equal(profile.community.pull_requests.sampled_pull_request_count, 3);
  assert.equal(profile.community.pull_requests.merged_pull_request_count, 2);
  assert.equal(profile.community.pull_requests.merge_rate, 0.67);
  assert.equal(profile.community.pull_requests.median_merge_hours, 42);
  assert.equal(profile.community.contributor_diversity.top1_contribution_share, 0.67);
  assert.equal(profile.community.contributor_diversity.top3_contribution_share, 1);
  assert.equal(profile.community.contributor_diversity.concentration_bucket, 'top-heavy');
  assert.deepEqual(profile.community.contributor_diversity.maintainer_login_sample, ['alice', 'bob', 'carol']);
  assert.equal(urls.length, 11);
});
