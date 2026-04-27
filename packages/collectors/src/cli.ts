#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { collectGitHubRepoProfile, fetchRepoSnapshot, fetchToolingSignals } from './github-repo.ts';

type CollectorKind = 'repo' | 'tooling' | 'all';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    process.stdout.write([
      'Usage: node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo> [--kind repo|tooling|all] [--out <path>]',
      '',
      'Examples:',
      '  node --experimental-strip-types packages/collectors/src/cli.ts openclaw/openclaw --kind repo',
      '  node --experimental-strip-types packages/collectors/src/cli.ts openclaw/openclaw --kind tooling --out metrics/openclaw.tooling.json',
    ].join('\n') + '\n');
    return;
  }

  const repo = args[0];
  const outIndex = args.indexOf('--out');
  const outPath = outIndex >= 0 ? args[outIndex + 1] : undefined;
  const kind = parseKind(args);

  const payload =
    kind === 'repo'
      ? await collectGitHubRepoProfile(repo)
      : kind === 'tooling'
        ? await collectStandaloneToolingSignals(repo)
        : await collectGitHubRepoProfile(repo);

  const json = JSON.stringify(payload, null, 2);

  if (outPath) {
    const absolute = resolve(process.cwd(), outPath);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, `${json}\n`, 'utf8');
  }

  process.stdout.write(`${json}\n`);
}

function parseKind(args: string[]): CollectorKind {
  const index = args.indexOf('--kind');
  if (index < 0) return 'repo';
  const value = args[index + 1];
  if (value === 'repo' || value === 'tooling' || value === 'all') return value;
  throw new Error(`invalid --kind value: ${value}`);
}

async function collectStandaloneToolingSignals(repo: string) {
  const snapshot = await fetchRepoSnapshot(repo);
  return {
    repo: snapshot.repo,
    repo_url: snapshot.repo_url,
    captured_at: snapshot.captured_at,
    tooling: await fetchToolingSignals(repo, snapshot.default_branch),
  };
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
});
