import type {
  GitHubCommunitySignals,
  GitHubContributorDiversitySignals,
  GitHubContributorSummary,
  GitHubDependencyAutomation,
  GitHubDependencyUpdateSignal,
  GitHubIssueResponseSignals,
  GitHubPullRequestSignals,
  GitHubReleaseCadence,
  GitHubRepoProfile,
  GitHubRepoSnapshot,
  GitHubToolingSignals,
  GitHubWorkflowSummary,
} from './types.ts';

type FetchLike = typeof fetch;

type RepoApiResponse = {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id: string | null } | null;
  pushed_at: string;
  created_at: string;
  default_branch: string;
  homepage: string | null;
  topics?: string[];
  has_discussions?: boolean;
  language: string | null;
  size: number;
  archived: boolean;
  disabled: boolean;
  is_template: boolean;
};

type ContributorApiResponse = Array<{ login: string; contributions: number }>;
type ReleaseApiResponse = Array<{ published_at: string | null; created_at: string }>;

function githubAuthHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
type WorkflowApiResponse = {
  workflows: Array<{ name: string; path: string; state: string }>;
};
type TreeApiResponse = {
  tree: Array<{ path: string; type: string }>;
  truncated?: boolean;
};
type CommitApiResponse = Array<{
  commit: {
    message: string;
    committer?: { date?: string | null };
    author?: { date?: string | null };
  };
  author?: { login?: string | null };
  committer?: { login?: string | null };
}>;
type IssueApiResponse = Array<{
  number: number;
  created_at: string;
  comments: number;
  user?: { login?: string | null };
  pull_request?: unknown;
}>;
type IssueCommentApiResponse = Array<{
  created_at: string;
  user?: { login?: string | null };
}>;
type PullRequestApiResponse = Array<{
  number: number;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
}>;

const WORKFLOW_CI_PATTERN = /(ci|test|verify|build|lint|check|unit|integration|e2e)/i;
const WORKFLOW_RELEASE_PATTERN = /(release|publish|deploy|ship|package|npm)/i;
const DEPENDABOT_CONFIG_PATTERN = /(^|\/)\.github\/dependabot\.ya?ml$/i;
const RENOVATE_CONFIG_PATTERN = /(^|\/)(\.github\/renovate\.json|renovate(\.config)?\.json5?|\.renovaterc(\.json)?)$/i;
const PACKAGE_MANIFEST_PATTERN = /(^|\/)(package\.json|pnpm-workspace\.ya?ml|pyproject\.toml|requirements(-dev)?\.txt|Cargo\.toml|go\.mod|Gemfile|composer\.json|pom\.xml|build\.gradle(\.kts)?|mix\.exs)$/;
const LOCKFILE_PATTERN = /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.ya?ml|bun\.lockb?|Cargo\.lock|go\.sum|Gemfile\.lock|composer\.lock|poetry\.lock)$/;
const DEPENDENCY_UPDATE_PATTERN = /(dependabot|renovate|chore\(deps\)|build\(deps\)|deps?:|bump .+ from .+ to|update .+ dependenc)/i;
const DEPENDENCY_UPDATE_WINDOW_DAYS = 90;
const COMMUNITY_SAMPLE_WINDOW_DAYS = 90;
const ISSUE_SAMPLE_LIMIT = 30;
const PULL_REQUEST_SAMPLE_LIMIT = 50;

export async function collectGitHubRepoProfile(repo: string, fetchImpl: FetchLike = fetch): Promise<GitHubRepoProfile> {
  const snapshot = await fetchRepoSnapshot(repo, fetchImpl);
  const contributors = await fetchContributors(repo, fetchImpl);
  const [releases, tooling, community] = await Promise.all([
    fetchReleaseCadence(repo, fetchImpl),
    fetchToolingSignals(repo, snapshot.default_branch, fetchImpl),
    fetchCommunitySignals(repo, contributors, fetchImpl),
  ]);

  return { snapshot, contributors, releases, tooling, community };
}

export async function fetchRepoSnapshot(repo: string, fetchImpl: FetchLike = fetch): Promise<GitHubRepoSnapshot> {
  const data = await requestJson<RepoApiResponse>(`https://api.github.com/repos/${repo}`, fetchImpl);
  return {
    repo: data.full_name,
    repo_url: data.html_url,
    captured_at: todayIso(),
    source: 'github_rest_v3',
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    open_issues: data.open_issues_count,
    license_spdx: data.license?.spdx_id ?? 'NOASSERTION',
    last_push_at: data.pushed_at,
    created_at: data.created_at,
    default_branch: data.default_branch,
    homepage: data.homepage,
    topics: data.topics ?? [],
    has_discussions: Boolean(data.has_discussions),
    primary_language: data.language,
    size_kb: data.size,
    archived: data.archived,
    disabled: data.disabled,
    is_template: data.is_template,
  };
}

export async function fetchContributors(repo: string, fetchImpl: FetchLike = fetch): Promise<GitHubContributorSummary> {
  const [topResponse, countResponse] = await Promise.all([
    requestResponse(`https://api.github.com/repos/${repo}/contributors?per_page=10`, fetchImpl),
    requestResponse(`https://api.github.com/repos/${repo}/contributors?per_page=1&anon=1`, fetchImpl),
  ]);

  const topContributors = (await topResponse.json()) as ContributorApiResponse;
  const contributorCount = extractContributorCount(countResponse, topContributors.length);

  return {
    contributor_count: contributorCount,
    contributor_bucket: bucketContributors(contributorCount),
    top_contributors: topContributors.map((entry) => ({ login: entry.login, contributions: entry.contributions })),
  };
}

export async function fetchReleaseCadence(repo: string, fetchImpl: FetchLike = fetch): Promise<GitHubReleaseCadence> {
  const response = await requestResponse(`https://api.github.com/repos/${repo}/releases?per_page=20`, fetchImpl);
  const releases = (await response.json()) as ReleaseApiResponse;
  const timestamps = releases
    .map((release) => release.published_at ?? release.created_at)
    .filter((value): value is string => Boolean(value));

  return {
    release_count_sampled: timestamps.length,
    release_timestamps: timestamps,
    median_interval_hours: medianIntervalHours(timestamps),
  };
}

export async function fetchToolingSignals(
  repo: string,
  defaultBranch: string,
  fetchImpl: FetchLike = fetch,
): Promise<GitHubToolingSignals> {
  const [workflows, treePaths, recentCommits] = await Promise.all([
    fetchWorkflowSummary(repo, fetchImpl),
    fetchRepoTreePaths(repo, defaultBranch, fetchImpl),
    fetchRecentCommits(repo, fetchImpl),
  ]);

  return {
    workflows,
    dependency_automation: extractDependencyAutomation(treePaths),
    dependency_updates: extractDependencyUpdateSignals(recentCommits),
  };
}

export async function fetchCommunitySignals(
  repo: string,
  contributors: GitHubContributorSummary,
  fetchImpl: FetchLike = fetch,
): Promise<GitHubCommunitySignals> {
  const maintainerLogins = contributors.top_contributors.map((entry) => entry.login);
  const [issueResponse, pullRequests] = await Promise.all([
    fetchIssueResponseSignals(repo, maintainerLogins, fetchImpl),
    fetchPullRequestSignals(repo, fetchImpl),
  ]);

  return {
    issue_response: issueResponse,
    pull_requests: pullRequests,
    contributor_diversity: extractContributorDiversitySignals(contributors),
  };
}

async function requestJson<T>(url: string, fetchImpl: FetchLike): Promise<T> {
  const response = await requestResponse(url, fetchImpl);
  return (await response.json()) as T;
}

async function requestResponse(url: string, fetchImpl: FetchLike): Promise<Response> {
  const response = await fetchImpl(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'oss-scorecard-collector',
      ...githubAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed (${response.status}) for ${url}`);
  }

  return response;
}

function extractContributorCount(response: Response, fallbackLength: number): number | 'UNVERIFIED' {
  const link = response.headers.get('link');
  if (!link) {
    return fallbackLength;
  }
  const match = link.match(/[?&]page=(\d+)>; rel="last"/);
  if (!match) {
    return fallbackLength;
  }
  const count = Number(match[1]);
  return Number.isFinite(count) ? count : 'UNVERIFIED';
}

function bucketContributors(count: number | 'UNVERIFIED'): GitHubContributorSummary['contributor_bucket'] {
  if (count === 'UNVERIFIED') return 'UNVERIFIED';
  if (count < 50) return '<50';
  if (count < 200) return '50-200';
  if (count < 1000) return '200-1k';
  return '1k+';
}

function medianIntervalHours(timestamps: string[]): number | 'UNVERIFIED' {
  if (timestamps.length < 2) return 'UNVERIFIED';
  const sorted = [...timestamps]
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a);
  if (sorted.length < 2) return 'UNVERIFIED';
  const deltas = [] as number[];
  for (let i = 0; i < sorted.length - 1; i += 1) {
    deltas.push((sorted[i] - sorted[i + 1]) / 36e5);
  }
  deltas.sort((a, b) => a - b);
  const mid = Math.floor(deltas.length / 2);
  return deltas.length % 2 === 1 ? round2(deltas[mid]) : round2((deltas[mid - 1] + deltas[mid]) / 2);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

async function fetchWorkflowSummary(repo: string, fetchImpl: FetchLike): Promise<GitHubWorkflowSummary> {
  const data = await requestJson<WorkflowApiResponse>(
    `https://api.github.com/repos/${repo}/actions/workflows?per_page=100`,
    fetchImpl,
  );
  const workflows = data.workflows.map((workflow) => ({
    name: workflow.name,
    path: workflow.path,
    state: workflow.state,
  }));
  const ciWorkflowCount = workflows.filter(
    (workflow) => WORKFLOW_CI_PATTERN.test(workflow.name) || WORKFLOW_CI_PATTERN.test(workflow.path),
  ).length;
  const releaseWorkflowCount = workflows.filter(
    (workflow) => WORKFLOW_RELEASE_PATTERN.test(workflow.name) || WORKFLOW_RELEASE_PATTERN.test(workflow.path),
  ).length;

  return {
    workflow_count: workflows.length,
    ci_workflow_count: ciWorkflowCount,
    release_workflow_count: releaseWorkflowCount,
    has_github_actions: workflows.length > 0,
    has_test_workflow: ciWorkflowCount > 0,
    has_publish_workflow: releaseWorkflowCount > 0,
    workflows,
  };
}

async function fetchRepoTreePaths(repo: string, defaultBranch: string, fetchImpl: FetchLike): Promise<string[]> {
  const data = await requestJson<TreeApiResponse>(
    `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`,
    fetchImpl,
  );

  if (data.truncated) {
    throw new Error(`GitHub tree response truncated for ${repo}@${defaultBranch}; tooling signals require full tree`);
  }

  return data.tree
    .filter((entry) => entry.type === 'blob')
    .map((entry) => entry.path);
}

async function fetchRecentCommits(repo: string, fetchImpl: FetchLike): Promise<CommitApiResponse> {
  const since = isoDaysAgo(DEPENDENCY_UPDATE_WINDOW_DAYS);
  return requestJson<CommitApiResponse>(
    `https://api.github.com/repos/${repo}/commits?per_page=100&since=${encodeURIComponent(since)}`,
    fetchImpl,
  );
}

async function fetchIssueResponseSignals(
  repo: string,
  maintainerLogins: string[],
  fetchImpl: FetchLike,
): Promise<GitHubIssueResponseSignals> {
  const since = isoDaysAgo(COMMUNITY_SAMPLE_WINDOW_DAYS);
  const issues = await requestJson<IssueApiResponse>(
    `https://api.github.com/repos/${repo}/issues?state=all&sort=updated&direction=desc&per_page=100&since=${encodeURIComponent(since)}`,
    fetchImpl,
  );

  const sampledIssues = issues
    .filter((issue) => !issue.pull_request)
    .filter((issue) => new Date(issue.created_at).getTime() >= new Date(since).getTime())
    .slice(0, ISSUE_SAMPLE_LIMIT);

  let issuesWithComments = 0;
  const responseHours = [] as number[];
  const maintainerSet = new Set(maintainerLogins);

  for (const issue of sampledIssues) {
    if (issue.comments <= 0) continue;
    issuesWithComments += 1;
    const comments = await requestJson<IssueCommentApiResponse>(
      `https://api.github.com/repos/${repo}/issues/${issue.number}/comments?per_page=100`,
      fetchImpl,
    );
    const issueAuthor = issue.user?.login ?? null;
    const firstMaintainerResponse = comments.find((comment) => {
      const commenter = comment.user?.login ?? null;
      if (!commenter) return false;
      if (issueAuthor && commenter === issueAuthor) return false;
      return maintainerSet.has(commenter);
    });

    if (!firstMaintainerResponse) continue;
    const hours =
      (new Date(firstMaintainerResponse.created_at).getTime() - new Date(issue.created_at).getTime()) / 36e5;
    if (Number.isFinite(hours) && hours >= 0) {
      responseHours.push(hours);
    }
  }

  const sampledIssueCount = sampledIssues.length;
  const respondedIssueCount = responseHours.length;

  return {
    sampled_window_days: COMMUNITY_SAMPLE_WINDOW_DAYS,
    issue_sample_limit: ISSUE_SAMPLE_LIMIT,
    sampled_issue_count: sampledIssueCount,
    issues_with_comments_count: issuesWithComments,
    issues_with_maintainer_response_count: respondedIssueCount,
    median_first_maintainer_response_hours: medianNumbers(responseHours),
    response_coverage_rate: sampledIssueCount > 0 ? round2(respondedIssueCount / sampledIssueCount) : 'UNVERIFIED',
  };
}

async function fetchPullRequestSignals(repo: string, fetchImpl: FetchLike): Promise<GitHubPullRequestSignals> {
  const since = isoDaysAgo(COMMUNITY_SAMPLE_WINDOW_DAYS);
  const pulls = await requestJson<PullRequestApiResponse>(
    `https://api.github.com/repos/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=100`,
    fetchImpl,
  );

  const sampledPulls = pulls
    .filter((pull) => pull.closed_at && new Date(pull.closed_at).getTime() >= new Date(since).getTime())
    .slice(0, PULL_REQUEST_SAMPLE_LIMIT);

  const mergedPulls = sampledPulls.filter((pull) => Boolean(pull.merged_at));
  const mergeHours = mergedPulls
    .map((pull) => (new Date(pull.merged_at as string).getTime() - new Date(pull.created_at).getTime()) / 36e5)
    .filter((hours) => Number.isFinite(hours) && hours >= 0);

  return {
    sampled_window_days: COMMUNITY_SAMPLE_WINDOW_DAYS,
    pull_request_sample_limit: PULL_REQUEST_SAMPLE_LIMIT,
    sampled_pull_request_count: sampledPulls.length,
    merged_pull_request_count: mergedPulls.length,
    merge_rate: sampledPulls.length > 0 ? round2(mergedPulls.length / sampledPulls.length) : 'UNVERIFIED',
    median_merge_hours: medianNumbers(mergeHours),
  };
}

function extractDependencyAutomation(paths: string[]): GitHubDependencyAutomation {
  const automationConfigs = paths.filter(
    (path) => DEPENDABOT_CONFIG_PATTERN.test(path) || RENOVATE_CONFIG_PATTERN.test(path),
  );
  const packageManifestPaths = paths.filter((path) => PACKAGE_MANIFEST_PATTERN.test(path)).sort();
  const lockfilePaths = paths.filter((path) => LOCKFILE_PATTERN.test(path)).sort();

  return {
    has_dependabot: automationConfigs.some((path) => DEPENDABOT_CONFIG_PATTERN.test(path)),
    has_renovate: automationConfigs.some((path) => RENOVATE_CONFIG_PATTERN.test(path)),
    automation_configs: automationConfigs.sort(),
    package_manifest_count: packageManifestPaths.length,
    package_manifest_paths: packageManifestPaths,
    lockfile_count: lockfilePaths.length,
    lockfile_paths: lockfilePaths,
  };
}

function extractDependencyUpdateSignals(commits: CommitApiResponse): GitHubDependencyUpdateSignal {
  const dependencyCommits = commits.filter((commit) => DEPENDENCY_UPDATE_PATTERN.test(commit.commit.message));
  const authors = new Set<string>();

  for (const commit of dependencyCommits) {
    const author = commit.author?.login ?? commit.committer?.login;
    if (author) {
      authors.add(author);
    }
  }

  const lastDependencyUpdateAt = dependencyCommits
    .map((commit) => commit.commit.committer?.date ?? commit.commit.author?.date ?? null)
    .find((date): date is string => Boolean(date));

  return {
    sampled_window_days: DEPENDENCY_UPDATE_WINDOW_DAYS,
    sampled_commit_count: commits.length,
    dependency_update_commit_count: dependencyCommits.length,
    dependency_update_authors: [...authors].sort(),
    last_dependency_update_at: lastDependencyUpdateAt ?? 'UNVERIFIED',
    detection_basis: 'commit_message_heuristic',
  };
}

function extractContributorDiversitySignals(
  contributors: GitHubContributorSummary,
): GitHubContributorDiversitySignals {
  const contributorCount = contributors.contributor_count;
  const totalContributions = contributors.top_contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);

  if (contributorCount === 'UNVERIFIED' || totalContributions <= 0) {
    return {
      contributor_count: contributorCount,
      maintainer_login_sample: contributors.top_contributors.map((entry) => entry.login),
      top1_contribution_share: 'UNVERIFIED',
      top3_contribution_share: 'UNVERIFIED',
      concentration_bucket: 'UNVERIFIED',
    };
  }

  const top1Share = contributors.top_contributors[0]
    ? round2(contributors.top_contributors[0].contributions / totalContributions)
    : 'UNVERIFIED';
  const top3Contributions = contributors.top_contributors.slice(0, 3).reduce((sum, contributor) => sum + contributor.contributions, 0);
  const top3Share = round2(top3Contributions / totalContributions);

  return {
    contributor_count: contributorCount,
    maintainer_login_sample: contributors.top_contributors.map((entry) => entry.login),
    top1_contribution_share: top1Share,
    top3_contribution_share: top3Share,
    concentration_bucket: classifyContributionConcentration(top1Share, top3Share),
  };
}

function classifyContributionConcentration(
  top1Share: number | 'UNVERIFIED',
  top3Share: number | 'UNVERIFIED',
): GitHubContributorDiversitySignals['concentration_bucket'] {
  if (top1Share === 'UNVERIFIED' || top3Share === 'UNVERIFIED') {
    return 'UNVERIFIED';
  }
  if (top1Share >= 0.75) return 'solo-dominant';
  if (top3Share >= 0.9) return 'top-heavy';
  return 'distributed';
}

function medianNumbers(values: number[]): number | 'UNVERIFIED' {
  if (values.length === 0) return 'UNVERIFIED';
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? round2(sorted[mid]) : round2((sorted[mid - 1] + sorted[mid]) / 2);
}
