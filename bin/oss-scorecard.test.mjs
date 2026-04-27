import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BIN_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(BIN_DIR, '..');
const CLI = resolve(ROOT, 'bin/oss-scorecard.mjs');

function runCli(args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
  });
}

test('help lists audit/history/index/score commands', () => {
  const result = runCli(['--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /oss-scorecard — local CLI entrypoint/i);
  assert.match(result.stdout, /audit\s+Run the bootstrap repo audit CLI/i);
  assert.match(result.stdout, /history\s+List the curated public history/i);
  assert.match(result.stdout, /score\s+Emit machine-readable repo score JSON/i);
});

test('history --format=json lists curated public history surfaces', () => {
  const result = runCli(['history', '--format=json']);
  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.ok(Array.isArray(payload));
  assert.ok(payload.some((entry) => entry.path === 'history/task-ledger.jsonl' && entry.exists === true));
  assert.ok(payload.some((entry) => entry.path === 'plans/legion-publish-log.md' && entry.exists === true));
});

test('audit --help delegates to packages/cli implementation', () => {
  const result = runCli(['audit', '--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Bootstrap OSS scorecard/i);
  assert.match(result.stdout, /--repo <owner\/repo\[@ref\]\|\/local\/path>/i);
});

test('score --help documents repo mode and legacy mode', () => {
  const result = runCli(['score', '--help']);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /oss-scorecard score <owner\/repo\[@ref\]\|\/local\/path>/i);
  assert.match(result.stdout, /--legacy --config/i);
});

test('unknown command hard-fails', () => {
  const result = runCli(['unknown-command']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown command: unknown-command/);
});
