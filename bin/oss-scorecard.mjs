#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const BIN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(BIN_DIR, '..');

const PUBLIC_HISTORY_FILES = [
  'history/README.md',
  'history/decision-log.md',
  'history/timeline-2026-04-27.json',
  'history/team-roster-2026-04-27.json',
  'history/task-summary-2026-04-27.json',
  'history/task-ledger.jsonl',
  'plans/legion-publish-log.md',
];

main();

function main() {
  const [command = 'help', ...rest] = process.argv.slice(2);

  switch (command) {
    case 'audit':
      runAudit(rest);
      return;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      return;
    case 'index':
      runTool('tools/index.ts', rest);
      return;
    case 'score':
      runScore(rest);
      return;
    case 'history':
      printHistory(rest);
      return;
    default:
      fail(`Unknown command: ${command}`);
  }
}

function runAudit(args) {
  const cliPath = resolve(ROOT, 'packages/cli/src/index.ts');
  if (!existsSync(cliPath)) {
    fail('Required CLI implementation missing: packages/cli/src/index.ts');
  }

  const normalizedArgs =
    args.length > 0 && !args[0].startsWith('-') ? ['--repo', args[0], ...args.slice(1)] : args;

  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', cliPath, ...normalizedArgs],
    {
      cwd: ROOT,
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    fail(`Failed to execute audit CLI: ${result.error.message}`);
  }

  process.exit(result.status ?? 1);
}

function runScore(args) {
  if (args.includes('--help') || args.includes('-h')) {
    printScoreHelp();
    return;
  }

  const wantsLegacyMode =
    args.includes('--legacy') ||
    args.includes('--config') ||
    args.some((arg) => arg.startsWith('--config='));

  if (wantsLegacyMode) {
    const forwardedArgs = args.filter((arg) => arg !== '--legacy');
    runTool('tools/scorecard-run.ts', forwardedArgs);
    return;
  }

  const cliPath = resolve(ROOT, 'packages/cli/src/index.ts');
  if (!existsSync(cliPath)) {
    fail('Required CLI implementation missing: packages/cli/src/index.ts');
  }

  const normalizedArgs =
    args.length > 0 && !args[0].startsWith('-')
      ? ['--repo', args[0], '--format', 'json', ...args.slice(1)]
      : ['--format', 'json', ...args];

  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', cliPath, ...normalizedArgs],
    {
      cwd: ROOT,
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    fail(`Failed to execute score CLI: ${result.error.message}`);
  }

  process.exit(result.status ?? 1);
}

function runTool(relativeToolPath, args) {
  const absoluteToolPath = resolve(ROOT, relativeToolPath);
  if (!existsSync(absoluteToolPath)) {
    fail(`Required tool missing: ${relativeToolPath}`);
  }

  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', absoluteToolPath, ...args],
    {
      cwd: ROOT,
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    fail(`Failed to execute ${relativeToolPath}: ${result.error.message}`);
  }

  process.exit(result.status ?? 1);
}

function printHistory(args) {
  const format = args.includes('--format=json') ? 'json' : 'text';
  const payload = PUBLIC_HISTORY_FILES.map((path) => ({
    path,
    exists: existsSync(resolve(ROOT, path)),
  }));

  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }

  process.stdout.write(
    [
      'Public history surfaces for oss-scorecard (execution team: opensource-optimizer):',
      ...payload.map((entry) => `- ${entry.path}${entry.exists ? '' : ' (missing)'}`),
      '',
      'Policy: share curated ledgers and milestone records, not raw high-noise chat streams.',
    ].join('\n') + '\n',
  );
}

function printHelp() {
  process.stdout.write(
    [
      'oss-scorecard — local CLI entrypoint (powered by opensource-optimizer)',
      '',
      'Usage:',
      '  oss-scorecard help',
      '  oss-scorecard audit <owner/repo[@ref]|/local/path> [--format terminal|json|markdown] [--json-out <path>] [--markdown-out <path>]',
      '  oss-scorecard index [--root .] [--strict=false]',
      '  oss-scorecard score <owner/repo[@ref]|/local/path> [--json-out <path>]',
      '  oss-scorecard score --legacy [--config tools/scorecard-run.config.json] [--strict=false]',
      '  oss-scorecard history [--format=json]',
      '',
      'Commands:',
      '  audit    Run the bootstrap repo audit CLI against a GitHub repo, branch ref, or local worktree path',
      '  index    Run the front-matter indexer over playbooks/ and case-studies/',
      '  score    Emit machine-readable repo score JSON (or use --legacy for the old case-study MVP)',
      '  history  List the curated public history/task record surfaces for sharing',
    ].join('\n') + '\n',
  );
}

function printScoreHelp() {
  process.stdout.write(
    [
      'Usage:',
      '  oss-scorecard score <owner/repo[@ref]|/local/path> [--json-out <path>]',
      '  oss-scorecard score --legacy --config tools/scorecard-run.config.json',
      '',
      'Modes:',
      '  default   Score a live GitHub repository, branch ref, or local worktree and emit ScoreReport JSON with evidence trail',
      '  --legacy  Run the older case-study scorecard MVP from tools/scorecard-run.ts',
    ].join('\n') + '\n',
  );
}

function fail(message) {
  process.stderr.write(`oss-scorecard: ${message}\n`);
  process.exit(1);
}
