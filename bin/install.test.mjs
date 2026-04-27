import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, lstatSync, readFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const INSTALL = resolve(ROOT, 'install.sh');

test('install.sh stages skill and links into detected claude/codex homes', () => {
  const fakeHome = mkdtempSync(resolve(tmpdir(), 'oss-scorecard-home-'));
  mkdirSync(resolve(fakeHome, '.claude'));
  mkdirSync(resolve(fakeHome, '.codex'));

  const result = spawnSync('bash', [INSTALL], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOME: fakeHome,
      OSS_SCORECARD_REPO_ROOT: ROOT,
    },
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);

  const stagedSkill = resolve(fakeHome, '.oss-scorecard/skills/oss-scorecard/SKILL.md');
  const claudeLink = resolve(fakeHome, '.claude/skills/oss-scorecard');
  const codexLink = resolve(fakeHome, '.codex/skills/oss-scorecard');

  assert.ok(existsSync(stagedSkill));
  assert.ok(readFileSync(stagedSkill, 'utf8').includes('OSS Scorecard Skill'));
  assert.ok(lstatSync(claudeLink).isSymbolicLink());
  assert.ok(lstatSync(codexLink).isSymbolicLink());
  assert.match(result.stdout, /linked Claude skill/i);
  assert.match(result.stdout, /linked Codex skill/i);
});

test('install.sh hard-fails when no supported client homes are present', () => {
  const fakeHome = mkdtempSync(resolve(tmpdir(), 'oss-scorecard-home-empty-'));

  const result = spawnSync('bash', [INSTALL], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOME: fakeHome,
      OSS_SCORECARD_REPO_ROOT: ROOT,
    },
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /no supported client homes detected/i);
});
