export type Domain = 'facade' | 'docs' | 'community' | 'quality' | 'caselib' | 'tooling';

export type GitHubRepoTarget = {
  owner: string;
  repo: string;
};

export type RepoSnapshot = {
  capturedAt: string;
  repoUrl: string;
  repoFullName: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  description: string | null;
  homepage: string | null;
  topics: string[];
  licenseSpdx: string | null;
  archived: boolean;
  pushedAt: string;
  hasIssues: boolean;
  hasDiscussions: boolean;
  hasWiki: boolean;
  rootEntries: string[];
  docsEntries: string[];
  githubEntries: string[];
  workflowFiles: string[];
  issueTemplateFiles: string[];
  readmePath: string | null;
  readmeText: string | null;
  contributingText: string | null;
  securityText: string | null;
  packageJsonText: string | null;
  workflowTextByPath: Record<string, string>;
  releasesCount: number;
  contributorsCount: number;
};

export type SignalRule = {
  id: string;
  label: string;
  description: string;
  weight?: number;
  recommendation: string;
  evaluate: (snapshot: RepoSnapshot) => boolean;
  evidence: (snapshot: RepoSnapshot) => string;
};

export type DomainRule = {
  domain: Domain;
  label: string;
  summary: string;
  signals: SignalRule[];
};

export type SignalResult = {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  score: number;
  maxScore: number;
  recommendation: string;
  evidence: string;
};

export type DomainScore = {
  domain: Domain;
  label: string;
  summary: string;
  score: number;
  maxScore: number;
  normalizedScore: number;
  normalizedFiveScale: number;
  signals: SignalResult[];
};

export type Recommendation = {
  domain: Domain;
  signalId: string;
  priority: 'high' | 'medium';
  text: string;
};

export type ScoreReport = {
  project: string;
  repoUrl: string;
  capturedAt: string;
  version: string;
  mode: 'bootstrap-v0';
  overall: {
    normalizedScore: number;
    normalizedFiveScale: number;
  };
  domains: DomainScore[];
  recommendations: Recommendation[];
  snapshot: Pick<
    RepoSnapshot,
    | 'stars'
    | 'forks'
    | 'openIssues'
    | 'watchers'
    | 'language'
    | 'licenseSpdx'
    | 'pushedAt'
    | 'contributorsCount'
    | 'releasesCount'
  >;
};
