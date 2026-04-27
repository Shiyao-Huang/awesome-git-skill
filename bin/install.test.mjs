import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, lstatSync, readFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const INSTALL = resolve(ROOT, 'install.sh');

function runInstall(env = {}) {
  return spawnSync('bash', [INSTALL], {
    cwd: ROOT,
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf8',
  });
}

test('install.sh stages skill, installs local shim, and links into detected claude/codex homes', () => {
  const fakeHome = mkdtempSync(resolve(tmpdir(), 'oss-scorecard-home-'));
  mkdirSync(resolve(fakeHome, '.claude'));
  mkdirSync(resolve(fakeHome, '.codex'));

  const result = runInstall({
    HOME: fakeHome,
    OSS_SCORECARD_REPO_ROOT: ROOT,
  });

  assert.equal(result.status, 0, result.stderr);

  const stagedSkill = resolve(fakeHome, '.oss-scorecard/skills/oss-scorecard/SKILL.md');
  const claudeLink = resolve(fakeHome, '.claude/skills/oss-scorecard');
  const codexLink = resolve(fakeHome, '.codex/skills/oss-scorecard');
  const shim = resolve(fakeHome, '.local/bin/oss-scorecard');

  assert.ok(existsSync(stagedSkill));
  assert.ok(readFileSync(stagedSkill, 'utf8').includes('OSS Scorecard Skill'));
  assert.ok(lstatSync(claudeLink).isSymbolicLink());
  assert.ok(lstatSync(codexLink).isSymbolicLink());
  assert.ok(existsSync(shim));
  assert.match(readFileSync(shim, 'utf8'), /bin\/oss-scorecard\.mjs/);
  assert.match(result.stdout, /installed local CLI shim/i);
  assert.match(result.stdout, /linked Claude skill/i);
  assert.match(result.stdout, /linked Codex skill/i);
});

test('installed local shim can print help', () => {
  const fakeHome = mkdtempSync(resolve(tmpdir(), 'oss-scorecard-home-run-'));
  mkdirSync(resolve(fakeHome, '.codex'));

  const installResult = runInstall({
    HOME: fakeHome,
    OSS_SCORECARD_REPO_ROOT: ROOT,
  });
  assert.equal(installResult.status, 0, installResult.stderr);

  const shim = resolve(fakeHome, '.local/bin/oss-scorecard');
  const helpResult = spawnSync(shim, ['help'], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOME: fakeHome,
    },
    encoding: 'utf8',
  });

  assert.equal(helpResult.status, 0, helpResult.stderr);
  assert.match(helpResult.stdout, /oss-scorecard — local CLI entrypoint/i);
});

test('install.sh can stage bundle even when no supported agent homes are present', () => {
  const fakeHome = mkdtempSync(resolve(tmpdir(), 'oss-scorecard-home-empty-'));

  const result = runInstall({
    HOME: fakeHome,
    OSS_SCORECARD_REPO_ROOT: ROOT,
  });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(resolve(fakeHome, '.oss-scorecard/skills/oss-scorecard/SKILL.md')));
  assert.ok(existsSync(resolve(fakeHome, '.local/bin/oss-scorecard')));
  assert.match(result.stdout, /staged skill bundle without agent links/i);
});
