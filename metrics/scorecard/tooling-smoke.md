# Scorecard Report — shadcn-ui

- Repo: https://github.com/shadcn-ui/ui
- Ran at: 2026-04-27T02:33:44.671Z
- Strict: true
- Overall (partial-normalized): 70
- Requested dimensions: tooling

## Dimension Scores

| Dimension | Weight | Score | Benchmark | Evidence paths |
|---|---:|---:|---|---|
| tooling | 0.10 | 70.0 | benchmarks/tooling.md | benchmarks/tooling.md |

## tooling

### tooling:scorecard-run — 3.5

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.scorecard_run.runtime_seconds | 1 | 5.0 | benchmarks/tooling.md |
| tooling.scorecard_run.dimension_config_coverage | 1 | 5.0 | benchmarks/tooling.md |
| tooling.scorecard_run.strict_negative_suite_count | 1 | 0.0 | benchmarks/tooling.md |

### tooling:social-gen — 3.7

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.social_gen.render_success_rate_30d | 1 | 5.0 | benchmarks/tooling.md |
| tooling.social_gen.template_variant_count | 1 | 1.0 | benchmarks/tooling.md |
| tooling.social_gen.snapshot_test_rate | 1 | 5.0 | benchmarks/tooling.md |

### tooling:lighthouse — 1.0

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.lighthouse.perf_score_p50 | 1 | 0.0 | benchmarks/tooling.md |
| tooling.lighthouse.seo_score_p50 | 1 | 0.0 | benchmarks/tooling.md |
| tooling.lighthouse.report_freshness_days | 1 | 5.0 | benchmarks/tooling.md |

### tooling:release-bot — 4.0

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.release_bot.publish_success_rate_90d | 1 | 5.0 | benchmarks/tooling.md |
| tooling.release_bot.changelog_pr_success_rate_90d | 1 | 5.0 | benchmarks/tooling.md |
| tooling.release_bot.manual_intervention_rate_90d | 1 | 0.0 | benchmarks/tooling.md |

### tooling:metrics-fetch — 5.0

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.metrics_fetch.success_rate_7d | 1 | 5.0 | benchmarks/tooling.md |
| tooling.metrics_fetch.required_snapshot_max_age_days | 1 | 5.0 | benchmarks/tooling.md |
| tooling.metrics_fetch.schema_compliance_rate | 1 | 5.0 | benchmarks/tooling.md |

### tooling:fm-indexer — 3.8

| Signal | Input | Score | Evidence |
|---|---:|---:|---|
| tooling.fm_indexer.runtime_seconds | 1 | 5.0 | benchmarks/tooling.md |
| tooling.fm_indexer.negative_fixture_detection_rate | 1 | 5.0 | benchmarks/tooling.md |
| tooling.fm_indexer.verbose_flag_visibility | 1 | 1.0 | benchmarks/tooling.md |
