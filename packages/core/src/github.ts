import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import type { GitHubRepoTarget, RepoSnapshot } from './types.ts';

type ContentEntry = {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'symlink' | 'submodule';
  download_url: string | null;
};

type RepoApiResponse = {
  full_name: string;
  html_url: string;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  language: string | null;
  description: string | null;
  homepage: string | null;
  topics: string[];
  archived: boolean;
  pushed_at: string;
  has_issues: boolean;
  has_discussions: boolean;
  has_wiki: boolean;
  license: { spdx_id: string | null } | null;
};

type TreeApiResponse = {
  tree: Array<{
    path: string;
    type: 'blob' | 'tree';
  }>;
};

const execFileAsync = promisify(execFile);
const TRANSIENT_PATTERNS = [/EOF/i, /connection reset/i, /timed out/i, /TLS/i];
let ghPreflightPromise: Promise<void> | null = null;

export function isTransientGhError(message: string): boolean {
  return TRANSIENT_PATTERNS.some((pattern) => pattern.test(message));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ghApi(args: string[]): Promise<string> {
  await ensureGitHubCliReady();
  let lastMessage = 'unknown error';

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const { stdout } = await execFileAsync('gh', ['api', ...args], {
        maxBuffer: 10 * 1024 * 1024,
        env: process.env,
      });
      return stdout;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastMessage = message;
      if (attempt < 3 && isTransientGhError(message)) {
        await sleep(attempt * 250);
        continue;
      }
      break;
    }
  }

  throw new Error(`gh api ${args.join(' ')} failed after retries: ${lastMessage}`);
}

async function ensureGitHubCliReady(): Promise<void> {
  if (!ghPreflightPromise) {
    ghPreflightPromise = preflightGitHubCli();
  }
  await ghPreflightPromise;
}

async function preflightGitHubCli(): Promise<void> {
  try {
    await execFileAsync('gh', ['--version'], {
      maxBuffer: 1024 * 1024,
      env: process.env,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`GitHub CLI not available. Install 'gh' first. Underlying error: ${message}`);
  }

  const authSource = await detectGitHubAuthSource();
  if (authSource === 'none') {
    throw new Error(buildGitHubAuthHint());
  }
}

async function detectGitHubAuthSource(): Promise<'env:GITHUB_TOKEN' | 'env:GH_TOKEN' | 'gh-cli' | 'none'> {
  if (process.env.GITHUB_TOKEN?.trim()) {
    return 'env:GITHUB_TOKEN';
  }
  if (process.env.GH_TOKEN?.trim()) {
    return 'env:GH_TOKEN';
  }

  try {
    const { stdout } = await execFileAsync('gh', ['auth', 'token'], {
      maxBuffer: 1024 * 1024,
      env: process.env,
    });
    return stdout.trim() ? 'gh-cli' : 'none';
  } catch {
    return 'none';
  }
}

export function buildGitHubAuthHint(): string {
  return [
    'GitHub authentication unavailable for oss-scorecard audit.',
    'Run `gh auth login` or export `GH_TOKEN` / `GITHUB_TOKEN` before scoring a live repository.',
  ].join(' ');
}

function appendRefQuery(path: string, ref?: string): string {
  if (!ref) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}ref=${encodeURIComponent(ref)}`;
}

async function githubJson<T>(path: string): Promise<T> {
  const stdout = await ghApi([path]);
  return JSON.parse(stdout) as T;
}

async function githubText(path: string, ref?: string): Promise<string> {
  return await ghApi(['-H', 'Accept: application/vnd.github.raw+json', appendRefQuery(path, ref)]);
}

async function ghApiWithHeaders(path: string): Promise<{ headers: string; body: string }> {
  const stdout = await ghApi(['-i', path]);
  const parts = stdout.split(/\r?\n\r?\n/);
  if (parts.length < 2) {
    throw new Error(`unexpected gh api -i output for ${path}`);
  }
  const body = parts.slice(1).join('\n\n');
  return {
    headers: parts[0],
    body,
  };
}

async function fetchOptionalFileText(
  owner: string,
  repo: string,
  filePath: string | null,
  ref: string,
): Promise<{
  path: string | null;
  text: string | null;
}> {
  if (!filePath) {
    return { path: null, text: null };
  }
  let text: string | null = null;
  try {
    text = await githubText(`/repos/${owner}/${repo}/contents/${filePath}`, ref);
  } catch {
    text = null;
  }
  return {
    path: filePath,
    text,
  };
}

async function fetchContributorsCount(owner: string, repo: string): Promise<number> {
  const { headers, body } = await ghApiWithHeaders(`/repos/${owner}/${repo}/contributors?per_page=1&anon=1`);
  const match = headers.match(/[?&]page=(\d+)>; rel="last"/i);
  if (match) {
    return Number(match[1]);
  }
  const items = JSON.parse(body) as unknown[];
  return items.length;
}

async function fetchReleasesCount(owner: string, repo: string): Promise<number> {
  const { headers, body } = await ghApiWithHeaders(`/repos/${owner}/${repo}/releases?per_page=1`);
  const match = headers.match(/[?&]page=(\d+)>; rel="last"/i);
  if (match) {
    return Number(match[1]);
  }
  const items = JSON.parse(body) as unknown[];
  return items.length;
}

export function parseRepoTarget(input: string): GitHubRepoTarget {
  const normalized = input.trim();
  if (!normalized) {
    throw new Error(
      'repo is required (expected owner/repo, owner/repo@ref, https://github.com/owner/repo, or https://github.com/owner/repo/tree/ref)',
    );
  }

  const withoutUrl = normalized
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/^git@github\.com:/i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');

  const treeMatch = withoutUrl.match(/^([^/]+)\/([^/]+)\/tree\/(.+)$/);
  if (treeMatch) {
    return {
      owner: treeMatch[1],
      repo: treeMatch[2],
      ref: treeMatch[3],
    };
  }

  const refMatch = withoutUrl.match(/^([^/]+)\/([^/@]+)(?:@(.+))?$/);
  if (!refMatch) {
    throw new Error(`invalid repo target: ${input} (expected owner/repo or owner/repo@ref)`);
  }

  return {
    owner: refMatch[1],
    repo: refMatch[2],
    ref: refMatch[3] || undefined,
  };
}

export async function collectRepoSnapshot(target: GitHubRepoTarget): Promise<RepoSnapshot> {
  const [repo, contributorsCount, releasesCount] = await Promise.all([
    githubJson<RepoApiResponse>(`/repos/${target.owner}/${target.repo}`),
    fetchContributorsCount(target.owner, target.repo),
    fetchReleasesCount(target.owner, target.repo),
  ]);

  const targetRef = target.ref ?? repo.default_branch;
  const tree = await githubJson<TreeApiResponse>(
    `/repos/${target.owner}/${target.repo}/git/trees/${encodeURIComponent(targetRef)}?recursive=1`,
  );

  const paths = tree.tree.map((entry) => entry.path);
  const rootEntries = Array.from(new Set(paths.map((path) => path.split('/')[0])));
  const docsEntries = Array.from(
    new Set(
      paths
        .filter((path) => path.startsWith('docs/'))
        .map((path) => path.split('/')[1])
        .filter(Boolean),
    ),
  );
  const githubEntries = Array.from(
    new Set(
      paths
        .filter((path) => path.startsWith('.github/'))
        .map((path) => path.split('/')[1])
        .filter(Boolean),
    ),
  );
  const workflowFiles = paths.filter((path) => path.startsWith('.github/workflows/'));
  const issueTemplateFiles = paths.filter((path) => path.startsWith('.github/ISSUE_TEMPLATE/'));

  const findPath = (patterns: RegExp[]): string | null =>
    paths.find((path) => patterns.some((pattern) => pattern.test(path))) ?? null;

  const readme = await fetchOptionalFileText(target.owner, target.repo, findPath([/^README/i, /^readme/i]), targetRef);
  const contributing = await fetchOptionalFileText(
    target.owner,
    target.repo,
    findPath([/^CONTRIBUTING/i, /^contributing/i]),
    targetRef,
  );
  const securityRoot = await fetchOptionalFileText(target.owner, target.repo, findPath([/^SECURITY/i, /^security/i]), targetRef);
  const securityGithub = securityRoot.text
    ? securityRoot
    : await fetchOptionalFileText(target.owner, target.repo, findPath([/^\.github\/SECURITY/i]), targetRef);
  const packageJson = await fetchOptionalFileText(target.owner, target.repo, findPath([/^package\.json$/i]), targetRef);

  const workflowTextEntries = await Promise.all(
    workflowFiles.map(async (path) => {
        try {
          return [
            path,
            await githubText(`/repos/${target.owner}/${target.repo}/contents/${path}`, targetRef),
          ] as const;
        } catch {
          return [path, null] as const;
        }
      }),
  );

  const workflowTextByPath = Object.fromEntries(
    workflowTextEntries
      .filter(([, text]) => typeof text === 'string')
      .map(([path, text]) => [path, text as string]),
  );

  return {
    capturedAt: new Date().toISOString(),
    repoUrl: target.ref ? `${repo.html_url}/tree/${target.ref}` : repo.html_url,
    repoFullName: repo.full_name,
    defaultBranch: repo.default_branch,
    targetRef,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    watchers: repo.subscribers_count,
    language: repo.language,
    description: repo.description,
    homepage: repo.homepage,
    topics: repo.topics ?? [],
    licenseSpdx: repo.license?.spdx_id ?? null,
    archived: repo.archived,
    pushedAt: repo.pushed_at,
    hasIssues: repo.has_issues,
    hasDiscussions: repo.has_discussions,
    hasWiki: repo.has_wiki,
    rootEntries,
    docsEntries,
    githubEntries,
    workflowFiles,
    issueTemplateFiles,
    readmePath: readme.path,
    readmeText: readme.text,
    contributingText: contributing.text,
    securityText: securityGithub.text,
    packageJsonText: packageJson.text,
    workflowTextByPath,
    releasesCount,
    contributorsCount,
  };
}
