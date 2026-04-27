export type GitHubRepoSnapshot = {
  repo: string;
  repo_url: string;
  captured_at: string;
  source: 'github_rest_v3';
  description: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  license_spdx: string;
  last_push_at: string;
  created_at: string;
  default_branch: string;
  homepage: string | null;
  topics: string[];
  has_discussions: boolean;
  primary_language: string | null;
  size_kb: number;
  archived: boolean;
  disabled: boolean;
  is_template: boolean;
};

export type GitHubContributorSummary = {
  contributor_count: number | 'UNVERIFIED';
  contributor_bucket: '<50' | '50-200' | '200-1k' | '1k+' | 'UNVERIFIED';
  top_contributors: Array<{ login: string; contributions: number }>;
};

export type GitHubReleaseCadence = {
  release_count_sampled: number;
  release_timestamps: string[];
  median_interval_hours: number | 'UNVERIFIED';
};

export type GitHubWorkflowSummary = {
  workflow_count: number;
  ci_workflow_count: number;
  release_workflow_count: number;
  has_github_actions: boolean;
  has_test_workflow: boolean;
  has_publish_workflow: boolean;
  workflows: Array<{
    name: string;
    path: string;
    state: string;
  }>;
};

export type GitHubDependencyAutomation = {
  has_dependabot: boolean;
  has_renovate: boolean;
  automation_configs: string[];
  package_manifest_count: number;
  package_manifest_paths: string[];
  lockfile_count: number;
  lockfile_paths: string[];
};

export type GitHubDependencyUpdateSignal = {
  sampled_window_days: number;
  sampled_commit_count: number;
  dependency_update_commit_count: number;
  dependency_update_authors: string[];
  last_dependency_update_at: string | 'UNVERIFIED';
  detection_basis: 'commit_message_heuristic';
};

export type GitHubToolingSignals = {
  workflows: GitHubWorkflowSummary;
  dependency_automation: GitHubDependencyAutomation;
  dependency_updates: GitHubDependencyUpdateSignal;
};

export type GitHubIssueResponseSignals = {
  sampled_window_days: number;
  issue_sample_limit: number;
  sampled_issue_count: number;
  issues_with_comments_count: number;
  issues_with_maintainer_response_count: number;
  median_first_maintainer_response_hours: number | 'UNVERIFIED';
  response_coverage_rate: number | 'UNVERIFIED';
};

export type GitHubPullRequestSignals = {
  sampled_window_days: number;
  pull_request_sample_limit: number;
  sampled_pull_request_count: number;
  merged_pull_request_count: number;
  merge_rate: number | 'UNVERIFIED';
  median_merge_hours: number | 'UNVERIFIED';
};

export type GitHubContributorDiversitySignals = {
  contributor_count: number | 'UNVERIFIED';
  maintainer_login_sample: string[];
  top1_contribution_share: number | 'UNVERIFIED';
  top3_contribution_share: number | 'UNVERIFIED';
  concentration_bucket: 'solo-dominant' | 'top-heavy' | 'distributed' | 'UNVERIFIED';
};

export type GitHubCommunitySignals = {
  issue_response: GitHubIssueResponseSignals;
  pull_requests: GitHubPullRequestSignals;
  contributor_diversity: GitHubContributorDiversitySignals;
};

export type GitHubRepoProfile = {
  snapshot: GitHubRepoSnapshot;
  contributors: GitHubContributorSummary;
  releases: GitHubReleaseCadence;
  tooling: GitHubToolingSignals;
  community: GitHubCommunitySignals;
};
