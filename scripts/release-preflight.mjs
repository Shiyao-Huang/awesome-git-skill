#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const ROOT = process.cwd();
const RUN_LIVE_SMOKE = process.env.OSS_SCORECARD_RUN_LIVE_SMOKE === 'true';

const REQUIRED_PATHS = [
  'README.md',
  'package.json',
  'install.sh',
  'bin/oss-scorecard.mjs',
  'skills/oss-scorecard/SKILL.md',
  'skills/oss-scorecard/USAGE.md',
  'skills/oss-scorecard/agents/openai.yaml',
  'skills/oss-scorecard/references/asset-map.md',
  'packages/core/src/score.ts',
  'packages/core/src/github.ts',
  'packages/collectors/src/github-repo.ts',
  'docs/architecture.md',
  'docs/getting-started.md',
  'history/task-ledger.jsonl',
];

main();

function main() {
  const checks = [];

  checks.push(checkRequiredPaths());
  checks.push(runCommandCheck('npm test', ['npm', 'test']));
  checks.push(runCommandCheck('npm run index', ['npm', 'run', 'index']));
  checks.push(runCommandCheck('oss-scorecard --help', [process.execPath, './bin/oss-scorecard.mjs', '--help']));
  checks.push(runCommandCheck('oss-scorecard history --format=json', [process.execPath, './bin/oss-scorecard.mjs', 'history', '--format=json'], { expectJson: true }));
  checks.push(runCommandCheck('oss-scorecard audit --help', [process.execPath, './bin/oss-scorecard.mjs', 'audit', '--help']));
  checks.push(runCommandCheck('oss-scorecard score --help', [process.execPath, './bin/oss-scorecard.mjs', 'score', '--help']));
  checks.push(runLiveSmokeCheck());

  const failed = checks.filter((check) => check.status === 'failed');
  const payload = {
    tool: 'oss-scorecard-release-preflight',
    ran_at: new Date().toISOString(),
    live_smoke_enabled: RUN_LIVE_SMOKE,
    overall: failed.length === 0 ? 'pass' : 'fail',
    checks,
  };

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

function checkRequiredPaths() {
  const missing = REQUIRED_PATHS.filter((path) => !existsSync(resolve(ROOT, path)));

  return {
    name: 'required-paths',
    status: missing.length === 0 ? 'passed' : 'failed',
    missing,
  };
}

function runCommandCheck(name, command, options = {}) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
  });

  if (result.error) {
    return {
      name,
      status: 'failed',
      error: result.error.message,
    };
  }

  if ((result.status ?? 1) !== 0) {
    return {
      name,
      status: 'failed',
      exit_code: result.status,
      stderr: trimOutput(result.stderr),
      stdout: trimOutput(result.stdout),
    };
  }

  if (options.expectJson) {
    try {
      JSON.parse(result.stdout);
    } catch (error) {
      return {
        name,
        status: 'failed',
        error: `stdout was not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  return {
    name,
    status: 'passed',
  };
}

function runLiveSmokeCheck() {
  if (!RUN_LIVE_SMOKE) {
    return {
      name: 'live-audit-smoke',
      status: 'skipped',
      reason: 'set OSS_SCORECARD_RUN_LIVE_SMOKE=true to enable networked audit smoke',
    };
  }

  const auth = spawnSync('gh', ['auth', 'status'], {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
  });

  if (auth.error) {
    return {
      name: 'live-audit-smoke',
      status: 'failed',
      error: `gh auth status failed to execute: ${auth.error.message}`,
    };
  }

  if ((auth.status ?? 1) !== 0) {
    return {
      name: 'live-audit-smoke',
      status: 'failed',
      error: 'gh auth status is not ready; run gh auth login first',
      stderr: trimOutput(auth.stderr),
    };
  }

  const smoke = spawnSync(
    process.execPath,
    ['./bin/oss-scorecard.mjs', 'audit', 'openclaw/openclaw', '--format', 'json'],
    {
      cwd: ROOT,
      env: process.env,
      encoding: 'utf8',
      timeout: 120000,
    },
  );

  if (smoke.error) {
    return {
      name: 'live-audit-smoke',
      status: 'failed',
      error: smoke.error.message,
    };
  }

  if ((smoke.status ?? 1) !== 0) {
    return {
      name: 'live-audit-smoke',
      status: 'failed',
      exit_code: smoke.status,
      stderr: trimOutput(smoke.stderr),
      stdout: trimOutput(smoke.stdout),
    };
  }

  try {
    const payload = JSON.parse(smoke.stdout);
    return {
      name: 'live-audit-smoke',
      status: 'passed',
      project: payload.project,
      overall: payload.overall?.normalizedFiveScale ?? null,
      mode: payload.mode ?? null,
    };
  } catch (error) {
    return {
      name: 'live-audit-smoke',
      status: 'failed',
      error: `audit output was not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function trimOutput(value) {
  if (!value) return '';
  return value.trim().slice(0, 2000);
}
