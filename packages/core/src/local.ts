import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { promisify } from 'node:util';

import type { RepoSnapshot } from './types.ts';

const execFileAsync = promisify(execFile);

async function readTextIfExists(path: string): Promise<string | null> {
  try {
    return await fs.readFile(path, 'utf8');
  } catch {
    return null;
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function listImmediateChildren(path: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path);
    return entries.sort();
  } catch {
    return [];
  }
}

async function listRelativeFiles(root: string): Promise<string[]> {
  const output: string[] = [];

  async function walk(current: string, relativePrefix = ''): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
      const abs = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(abs, rel);
      } else if (entry.isFile()) {
        output.push(rel);
      }
    }
  }

  await walk(root);
  return output.sort();
}

async function git(repoPath: string, args: string[]): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: repoPath,
      maxBuffer: 10 * 1024 * 1024,
    });
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

function normalizeGitHubRemote(remote: string | null): { fullName: string | null; url: string | null } {
  if (!remote) {
    return { fullName: null, url: null };
  }

  const normalized = remote
    .replace(/^git@github\.com:/i, '')
    .replace(/^https:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');

  const match = normalized.match(/^([^/]+)\/([^/]+)$/);
  if (!match) {
    return { fullName: null, url: null };
  }

  return {
    fullName: `${match[1]}/${match[2]}`,
    url: `https://github.com/${match[1]}/${match[2]}`,
  };
}

function detectLicenseSpdx(packageJsonText: string | null): string | null {
  if (!packageJsonText) {
    return null;
  }

  try {
    const parsed = JSON.parse(packageJsonText) as { license?: unknown };
    return typeof parsed.license === 'string' ? parsed.license : null;
  } catch {
    return null;
  }
}

function extractKeywords(packageJsonText: string | null): string[] {
  if (!packageJsonText) {
    return [];
  }

  try {
    const parsed = JSON.parse(packageJsonText) as { keywords?: unknown };
    if (Array.isArray(parsed.keywords)) {
      return parsed.keywords.filter((value): value is string => typeof value === 'string');
    }
  } catch {
    return [];
  }

  return [];
}

function extractPackageField(packageJsonText: string | null, key: 'description' | 'homepage'): string | null {
  if (!packageJsonText) {
    return null;
  }

  try {
    const parsed = JSON.parse(packageJsonText) as Record<string, unknown>;
    return typeof parsed[key] === 'string' ? parsed[key] : null;
  } catch {
    return null;
  }
}

export async function collectLocalRepoSnapshot(inputPath: string): Promise<RepoSnapshot> {
  const resolved = resolve(inputPath);
  const repoRoot = (await git(resolved, ['rev-parse', '--show-toplevel'])) ?? resolved;
  const currentBranch =
    (await git(repoRoot, ['branch', '--show-current'])) ??
    (await git(repoRoot, ['rev-parse', '--short', 'HEAD'])) ??
    'UNVERIFIED';
  const defaultBranch =
    ((await git(repoRoot, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'])) ?? '').split('/').pop() ||
    currentBranch;
  const remoteOrigin = await git(repoRoot, ['remote', 'get-url', 'origin']);
  const remote = normalizeGitHubRemote(remoteOrigin);
  const repoFullName = remote.fullName ?? basename(repoRoot);
  const repoUrl = remote.url ? `${remote.url}/tree/${currentBranch}` : `file://${repoRoot}`;

  const paths = await listRelativeFiles(repoRoot);
  const rootEntries = await listImmediateChildren(repoRoot);
  const docsEntries = await listImmediateChildren(join(repoRoot, 'docs'));
  const githubEntries = await listImmediateChildren(join(repoRoot, '.github'));
  const workflowDir = join(repoRoot, '.github', 'workflows');
  const issueTemplateDir = join(repoRoot, '.github', 'ISSUE_TEMPLATE');
  const workflowFiles = (await listRelativeFiles(workflowDir)).map((path) => `.github/workflows/${path}`);
  const issueTemplateFiles = (await listRelativeFiles(issueTemplateDir)).map((path) => `.github/ISSUE_TEMPLATE/${path}`);

  const readmePath = ['README.md', 'README.mdx', 'README.txt'].find((name) => rootEntries.includes(name)) ?? null;
  const contributingPath = ['CONTRIBUTING.md', 'CONTRIBUTING.mdx'].find((name) => rootEntries.includes(name)) ?? null;
  const securityPath =
    ['SECURITY.md', '.github/SECURITY.md'].find((name) => paths.includes(name) || rootEntries.includes(name)) ?? null;
  const packageJsonPath = paths.includes('package.json') ? 'package.json' : null;

  const [readmeText, contributingText, securityText, packageJsonText] = await Promise.all([
    readTextIfExists(readmePath ? join(repoRoot, readmePath) : ''),
    readTextIfExists(contributingPath ? join(repoRoot, contributingPath) : ''),
    readTextIfExists(securityPath ? join(repoRoot, securityPath) : ''),
    readTextIfExists(packageJsonPath ? join(repoRoot, packageJsonPath) : ''),
  ]);

  const workflowTextByPath = Object.fromEntries(
    await Promise.all(
      workflowFiles.map(async (relativePath) => {
        const text = await readTextIfExists(join(repoRoot, relativePath));
        return [relativePath, text ?? ''] as const;
      }),
    ),
  );

  const contributorsLines = (await git(repoRoot, ['shortlog', '-sn', '--all']))?.split('\n').filter(Boolean) ?? [];
  const releasesCount = ((await git(repoRoot, ['tag', '--list']))?.split('\n').filter(Boolean).length ?? 0);
  const pushedAt = (await git(repoRoot, ['log', '-1', '--format=%cI'])) ?? new Date().toISOString();
  const hasDiscussions =
    (await pathExists(join(repoRoot, '.github', 'DISCUSSION_TEMPLATE'))) ||
    /discord|slack|telegram|community|discussion/i.test(readmeText ?? '');

  return {
    capturedAt: new Date().toISOString(),
    repoUrl,
    repoFullName,
    defaultBranch,
    targetRef: currentBranch,
    stars: 0,
    forks: 0,
    openIssues: 0,
    watchers: 0,
    language: null,
    description: extractPackageField(packageJsonText, 'description'),
    homepage: extractPackageField(packageJsonText, 'homepage'),
    topics: extractKeywords(packageJsonText),
    licenseSpdx: detectLicenseSpdx(packageJsonText),
    archived: false,
    pushedAt,
    hasIssues: true,
    hasDiscussions,
    hasWiki: false,
    rootEntries,
    docsEntries,
    githubEntries,
    workflowFiles,
    issueTemplateFiles,
    readmePath,
    readmeText,
    contributingText,
    securityText,
    packageJsonText,
    workflowTextByPath,
    releasesCount,
    contributorsCount: contributorsLines.length,
  };
}
