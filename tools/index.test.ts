import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { buildIndex } from './index.ts';

const execFileAsync = promisify(execFile);
const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(TOOLS_DIR, 'test-fixtures');
const INDEXER_PATH = path.join(TOOLS_DIR, 'index.ts');

function fixtureRoot(name: string): string {
  return path.join(FIXTURES_DIR, name);
}

describe('front-matter indexer', () => {
  it('indexes valid playbook entries, playbook leaves, and case studies while skipping support docs', async () => {
    const result = await buildIndex({ root: fixtureRoot('valid'), strict: true });

    assert.equal(result.entries.length, 3);
    assert.deepEqual(
      result.entries.map((entry) => `${entry.kind}:${entry.path}`),
      [
        'case-study:case-studies/EXAMPLE.md',
        'playbook-entry:playbooks/docs.md',
        'playbook-leaf:playbooks/scorecard.md',
      ],
    );
    assert.deepEqual(result.skipped, [
      { path: 'case-studies/00-target-list.md', reason: 'missing_frontmatter' },
      { path: 'playbooks/README.md', reason: 'missing_frontmatter' },
    ]);
  });

  it('validates playbook covers[] against the 37-leaf whitelist', async () => {
    const result = await buildIndex({ root: fixtureRoot('valid'), strict: true });
    const playbook = result.entries.find((entry) => entry.kind === 'playbook-entry' && entry.path === 'playbooks/docs.md');
    assert.ok(playbook && playbook.kind === 'playbook-entry');
    assert.deepEqual(playbook.covers, ['docs:quickstart', 'docs:examples', 'docs:site-stack']);
  });

  it('fails when a playbook front-matter field is missing', async () => {
    await assert.rejects(
      () => buildIndex({ root: fixtureRoot('invalid-missing-owner'), strict: true }),
      /playbooks\/quality\.md:1 owner_role missing required field/
    );
  });

  it('fails on deprecated 8-dim playbook dimensions in strict mode', async () => {
    await assert.rejects(
      () => buildIndex({ root: fixtureRoot('deprecated-dimension'), strict: true }),
      /playbooks\/growth\.md:3 dimension invalid top-level dimension "growth"/
    );
  });

  it('allows deprecated 8-dim playbook dimensions only in --strict=false mode and records a warning', async () => {
    const result = await buildIndex({ root: fixtureRoot('deprecated-dimension'), strict: false });
    assert.equal(result.entries.length, 1);
    assert.equal(result.warnings.length, 1);
    assert.match(result.warnings[0]?.message ?? '', /deprecated 8-dim value "growth" accepted only because --strict=false/);
  });

  it('fails when a case-study uses leaf tags in dimensions_covered[]', async () => {
    await assert.rejects(
      () => buildIndex({ root: fixtureRoot('invalid-case-study-dimensions'), strict: true }),
      /case-studies\/case-bad\.md:13 dimensions_covered invalid case-study dimension "docs:site-stack"/
    );
  });

  it('fails when a playbook uses an unknown covers[] leaf tag', async () => {
    await assert.rejects(
      () => buildIndex({ root: fixtureRoot('invalid-covers'), strict: true }),
      /playbooks\/release\.md:4 covers unknown leaf tag "community:not-real"/
    );
  });

  it('runs the CLI and exits non-zero for an invalid playbook fixture', async () => {
    await assert.rejects(
      execFileAsync('node', [INDEXER_PATH, '--root', fixtureRoot('invalid-missing-owner')]),
      (error: unknown) => {
        assert.ok(error && typeof error === 'object');
        const stderr = String((error as { stderr?: string }).stderr ?? '');
        assert.match(stderr, /playbooks\/quality\.md:1 owner_role missing required field/);
        return true;
      },
    );
  });

  it('reads stdout JSON in strict mode for valid fixtures', async () => {
    const { stdout } = await execFileAsync('node', [INDEXER_PATH, '--root', fixtureRoot('valid')]);
    const payload = JSON.parse(stdout) as { entries: Array<{ path: string }> };
    assert.deepEqual(payload.entries.map((entry) => entry.path), [
      'case-studies/EXAMPLE.md',
      'playbooks/docs.md',
      'playbooks/scorecard.md',
    ]);
  });
});
