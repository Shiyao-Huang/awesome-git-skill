import test from 'node:test';
import assert from 'node:assert/strict';

import { renderMarkdownReport, renderTerminalReport } from './format.ts';
import type { ScoreReport } from '../../core/src/types.ts';

const report: ScoreReport = {
  project: 'acme/rocket',
  repoUrl: 'https://github.com/acme/rocket',
  capturedAt: '2026-04-27T12:00:00.000Z',
  targetRef: 'main',
  version: '0.1.0-bootstrap',
  mode: 'bootstrap-v0',
  overall: {
    normalizedScore: 74.2,
    normalizedFiveScale: 3.7,
  },
  snapshot: {
    stars: 42,
    forks: 7,
    openIssues: 3,
    watchers: 2,
    language: 'TypeScript',
    licenseSpdx: 'MIT',
    pushedAt: '2026-04-27T00:00:00.000Z',
    contributorsCount: 2,
    releasesCount: 5,
  },
  domains: [
    {
      domain: 'facade',
      label: 'Facade',
      summary: 'summary',
      score: 4,
      maxScore: 5,
      normalizedScore: 80,
      normalizedFiveScale: 4,
      signals: [],
    },
  ],
  recommendations: [
    {
      domain: 'community',
      signalId: 'community.issue-templates',
      priority: 'high',
      text: '补 issue template',
    },
  ],
};

test('renders terminal report with totals and recommendations', () => {
  const text = renderTerminalReport(report);
  assert.match(text, /acme\/rocket/);
  assert.match(text, /TOTAL:/);
  assert.match(text, /\[high\] community/);
});

test('renders markdown report table', () => {
  const text = renderMarkdownReport(report);
  assert.match(text, /\| Domain \| Score \| Percent \| Failed signals \|/);
  assert.match(text, /\*\*community\*\*/);
});
