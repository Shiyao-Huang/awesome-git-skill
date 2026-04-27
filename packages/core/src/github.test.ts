import test from 'node:test';
import assert from 'node:assert/strict';

import { buildGitHubAuthHint, isTransientGhError, parseRepoTarget } from './github.ts';

test('classifies common transient gh api failures', () => {
  assert.equal(isTransientGhError('Get "https://api.github.com/repos/ossf/scorecard": EOF'), true);
  assert.equal(isTransientGhError('request timed out after 10000ms'), true);
  assert.equal(isTransientGhError('TLS handshake failed'), true);
  assert.equal(isTransientGhError('HTTP 404 Not Found'), false);
});

test('builds explicit auth hint instead of silent fallback wording', () => {
  const hint = buildGitHubAuthHint();
  assert.match(hint, /GitHub authentication unavailable/i);
  assert.match(hint, /gh auth login/i);
  assert.match(hint, /GH_TOKEN/);
});

test('parses repo target with optional branch ref', () => {
  assert.deepEqual(parseRepoTarget('Shiyao-Huang/bach-orchestra'), {
    owner: 'Shiyao-Huang',
    repo: 'bach-orchestra',
    ref: undefined,
  });

  assert.deepEqual(parseRepoTarget('Shiyao-Huang/bach-orchestra@remerge/online-v5-packages'), {
    owner: 'Shiyao-Huang',
    repo: 'bach-orchestra',
    ref: 'remerge/online-v5-packages',
  });

  assert.deepEqual(
    parseRepoTarget('https://github.com/Shiyao-Huang/bach-orchestra/tree/remerge/online-v5-packages'),
    {
      owner: 'Shiyao-Huang',
      repo: 'bach-orchestra',
      ref: 'remerge/online-v5-packages',
    },
  );
});


test('parses branch-qualified repo targets', () => {
  assert.deepEqual(parseRepoTarget('Shiyao-Huang/bach-orchestra@remerge/online-v5-packages'), {
    owner: 'Shiyao-Huang',
    repo: 'bach-orchestra',
    ref: 'remerge/online-v5-packages',
  });

  assert.deepEqual(parseRepoTarget('https://github.com/Shiyao-Huang/bach-orchestra/tree/remerge/online-v5-packages'), {
    owner: 'Shiyao-Huang',
    repo: 'bach-orchestra',
    ref: 'remerge/online-v5-packages',
  });
});
