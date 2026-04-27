import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import {
  extractFrontmatter,
  loadBenchmark,
  loadCaseStudy,
  loadConfig,
  loadLeafWhitelist,
  renderMarkdownReport,
  runScorecard,
  ScorecardRunError,
} from './scorecard-run.ts';

function withFixture(fn: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'scorecard-run-'));
  try {
    mkdirSync(join(root, 'plans'), { recursive: true });
    mkdirSync(join(root, 'benchmarks'), { recursive: true });
    mkdirSync(join(root, 'case-studies'), { recursive: true });

    writeFileSync(
      join(root, 'plans/01-taxonomy.md'),
      [
        '# taxonomy',
        '- [facade:hero]',
        '- [docs:quickstart]',
        '- [community:seo]',
        '- [tooling:lighthouse]',
      ].join('\n'),
      'utf8',
    );

    writeFileSync(
      join(root, 'benchmarks/facade.md'),
      `---
id: bench-facade
dimension: facade
version: 0.1.0
status: draft
weight: 0.15
last_verified_at: 2026-04-27
---

## hero  [facade:hero]

\`\`\`yaml
subitem_aggregation: weighted
weights: { manual: 0.7, hero_length: 0.3 }
signals:
  - signal_id: facade.hero.manual_rubric
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — absent
      5 — excellent
  - signal_id: facade.hero.hero_length_score
    source: github_repo
    query: alias to facade.hero.word_count
    collector: manual
    thresholds: []
\`\`\`
`,
      'utf8',
    );

    writeFileSync(
      join(root, 'case-studies/example.md'),
      `---
id: case-example
project: Example
repo_url: https://github.com/example/repo
star_count: 1000
star_count_at: 2026-04-27
star_source: gh-api
category: framework
dimensions_covered:
  - facade
  - docs
  - community
status: draft
last_verified_at: 2026-04-27
sources:
  - id: s1
    url: https://api.github.com/repos/example/repo
    captured_at: 2026-04-27
    type: github
  - id: s2
    url: https://example.com/docs
    captured_at: 2026-04-27
    type: docs-site
  - id: s3
    url: https://example.com/blog
    captured_at: 2026-04-27
    type: blog
---

# Example
`,
      'utf8',
    );

    writeFileSync(
      join(root, 'config.json'),
      JSON.stringify(
        {
          project: 'example/repo',
          repo_url: 'https://github.com/example/repo',
          case_study_path: 'case-studies/example.md',
          dimensions: ['facade'],
          allow_partial_dimensions: true,
          signal_values: {
            'facade.hero.manual_rubric': {
              score: 4,
              captured_at: '2026-04-27',
              evidence_paths: ['case-studies/example.md'],
            },
            'facade.hero.word_count': {
              value: 9,
              score: 5,
              captured_at: '2026-04-27',
              evidence_paths: ['case-studies/example.md'],
            },
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('runs a weighted facade scorecard from config + case-study + benchmark', () => {
  withFixture((root) => {
    const leaves = loadLeafWhitelist(join(root, 'plans/01-taxonomy.md'));
    const config = loadConfig(join(root, 'config.json'));
    const caseStudy = loadCaseStudy(join(root, 'case-studies/example.md'), config.repo_url, true);
    const benchmark = loadBenchmark(join(root, 'benchmarks/facade.md'), leaves, true);

    const result = runScorecard({
      config,
      caseStudy,
      strict: true,
      benchmarks: [benchmark],
      requestedDimensions: ['facade'],
    });

    assert.equal(result.project, 'example/repo');
    assert.equal(result.overall_mode, 'partial-normalized');
    assert.equal(result.dimensions.facade.score, 86);
    assert.equal(result.dimensions.facade.subitems['facade:hero'].signals[1].score, 5);
    assert.match(renderMarkdownReport(result), /facade:hero/);
  });
});

test('rejects leaf tags inside case-study dimensions_covered', () => {
  withFixture((root) => {
    const file = join(root, 'case-studies/bad.md');
    const raw = readFileSync(join(root, 'case-studies/example.md'), 'utf8').replace('- docs', '- docs:quickstart');
    writeFileSync(file, raw, 'utf8');
    assert.throws(
      () => loadCaseStudy(file, 'https://github.com/example/repo', true),
      (error: unknown) => error instanceof ScorecardRunError && /dimensions_covered\[]( entries must be strings| only accepts top-level domains)/.test(error.message),
    );
  });
});

test('rejects deprecated benchmark dimension names in strict mode', () => {
  withFixture((root) => {
    writeFileSync(
      join(root, 'benchmarks/bad.md'),
      `---
id: bench-growth
dimension: growth
version: 0.1.0
status: draft
weight: 0.2
last_verified_at: 2026-04-27
---

## fake  [community:seo]

\`\`\`yaml
subitem_aggregation: mean
signals:
  - signal_id: fake.signal
    source: github_repo
    collector: fake
    thresholds:
      - { gte: 1, score: 5 }
\`\`\`
`,
      'utf8',
    );
    const leaves = loadLeafWhitelist(join(root, 'plans/01-taxonomy.md'));
    assert.throws(
      () => loadBenchmark(join(root, 'benchmarks/bad.md'), leaves, true),
      (error: unknown) => error instanceof ScorecardRunError && /invalid benchmark dimension growth/.test(error.message),
    );
  });
});

test('hard-fails when signal input misses captured_at', () => {
  withFixture((root) => {
    const config = JSON.parse(readFileSync(join(root, 'config.json'), 'utf8'));
    delete config.signal_values['facade.hero.word_count'].captured_at;
    writeFileSync(join(root, 'config.bad.json'), JSON.stringify(config, null, 2), 'utf8');

    const leaves = loadLeafWhitelist(join(root, 'plans/01-taxonomy.md'));
    const loaded = loadConfig(join(root, 'config.bad.json'));
    const caseStudy = loadCaseStudy(join(root, 'case-studies/example.md'), loaded.repo_url, true);
    const benchmark = loadBenchmark(join(root, 'benchmarks/facade.md'), leaves, true);

    assert.throws(
      () =>
        runScorecard({
          config: loaded,
          caseStudy,
          strict: true,
          benchmarks: [benchmark],
          requestedDimensions: ['facade'],
        }),
      (error: unknown) => error instanceof ScorecardRunError && /signal_values\.facade.hero.word_count\.captured_at is required/.test(error.message),
    );
  });
});
