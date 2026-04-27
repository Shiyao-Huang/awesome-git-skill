import test from 'node:test';
import assert from 'node:assert/strict';

import { scoreRepoSnapshot } from './score.ts';
import type { RepoSnapshot } from './types.ts';

function makeSnapshot(overrides: Partial<RepoSnapshot> = {}): RepoSnapshot {
  return {
    capturedAt: '2026-04-27T12:00:00.000Z',
    repoUrl: 'https://github.com/acme/rocket',
    repoFullName: 'acme/rocket',
    defaultBranch: 'main',
    stars: 42000,
    forks: 1200,
    openIssues: 23,
    watchers: 98,
    language: 'TypeScript',
    description: 'AI-native developer tool for fast local workflows.',
    homepage: 'https://rocket.example.com',
    topics: ['ai', 'developer-tools', 'cli'],
    licenseSpdx: 'MIT',
    archived: false,
    pushedAt: new Date().toISOString(),
    hasIssues: true,
    hasDiscussions: true,
    hasWiki: false,
    rootEntries: ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'package.json', 'examples', 'Dockerfile', '.github'],
    docsEntries: ['index.md'],
    githubEntries: ['pull_request_template.md', 'ISSUE_TEMPLATE', 'workflows'],
    workflowFiles: ['.github/workflows/ci.yml', '.github/workflows/release.yml'],
    issueTemplateFiles: ['.github/ISSUE_TEMPLATE/bug.yml'],
    readmePath: 'README.md',
    readmeText:
      '# Rocket\n\nFast AI-native tooling.\n\n![demo](demo.gif)\n\n## Quickstart\n\nnpm install -g rocket\n\n## Docs\n\nSee docs and examples. Community on Discord. Used by companies in production.\n\n## Migration\n\nUpgrade guide available.',
    contributingText: '# Contributing\n\nOpen a PR.',
    securityText: '# Security\n\nEmail us.',
    packageJsonText: '{\"scripts\":{\"build\":\"tsup\",\"test\":\"vitest\",\"release\":\"changeset publish\"}}',
    workflowTextByPath: {
      '.github/workflows/ci.yml': 'name: ci\njobs:\n  test:\n    steps:\n      - run: npm test\n      - run: npm run lint',
      '.github/workflows/release.yml': 'name: release\njobs:\n  publish:\n    steps:\n      - run: npm run release',
    },
    releasesCount: 12,
    contributorsCount: 6,
    ...overrides,
  };
}

test('scores a well-instrumented repo near the top of the bootstrap range', () => {
  const report = scoreRepoSnapshot(makeSnapshot());
  assert.equal(report.project, 'acme/rocket');
  assert.equal(report.domains.length, 6);
  assert.ok(report.overall.normalizedFiveScale >= 4.5);
  assert.equal(report.recommendations.length, 0);
});

test('surfaces actionable recommendations for weak repos', () => {
  const report = scoreRepoSnapshot(
    makeSnapshot({
      description: null,
      homepage: null,
      topics: [],
      contributingText: null,
      securityText: null,
      workflowFiles: [],
      workflowTextByPath: {},
      issueTemplateFiles: [],
      githubEntries: [],
      releasesCount: 0,
      contributorsCount: 1,
      packageJsonText: null,
      readmeText: '# Bare Repo',
      rootEntries: ['README.md'],
      docsEntries: [],
      licenseSpdx: 'NOASSERTION',
    }),
  );

  assert.ok(report.overall.normalizedFiveScale < 2.5);
  assert.ok(report.recommendations.length >= 5);
  assert.match(report.recommendations[0].text, /补/i);
});
