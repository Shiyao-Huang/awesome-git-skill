---
id: bench-tooling
dimension: tooling
version: 0.1.0
status: draft
weight: 0.10
last_verified_at: 2026-04-27
---

# Tooling Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3 · benchmark schema：[`./_schema.md`](./_schema.md)
> tooling 域评估"我们这套开源优化工具链自身是否可复用、可观测、可 hard-fail"，不是评估某个外部项目。
> 6 个子项；除 `lighthouse` 外，collector 默认只读本仓库产物（`tools/`、`metrics/`、`benchmarks/`、`playbooks/`、`case-studies/`），禁止用缓存结果或手工兜底掩盖工具缺口。

## scorecard-run  `[tooling:scorecard-run]`

```yaml
subitem_aggregation: weighted
weights:
  runtime_seconds: 0.4
  dimension_config_coverage: 0.3
  strict_negative_suite_count: 0.3
signals:
  - signal_id: tooling.scorecard_run.runtime_seconds
    source: github_repo
    query: `node tools/scorecard-run.ts --config <smoke-config>` 在本仓库 smoke fixture 上的 wallclock p50（秒）
    collector: tools/scorecard-run/collectors/scorecard_runtime.ts
    thresholds:
      - { lte: 3, score: 5 }
      - { lte: 10, score: 3 }
      - { lte: 30, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.scorecard_run.dimension_config_coverage
    source: github_repo
    query: 已提交 smoke / fixture config 中被覆盖的顶层维度数 / 6
    collector: tools/scorecard-run/collectors/scorecard_config_coverage.ts
    thresholds:
      - { gte: 1.0, score: 5 }
      - { gte: 0.67, score: 3 }
      - { gte: 0.34, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.scorecard_run.strict_negative_suite_count
    source: github_repo
    query: 覆盖 hard-fail 关键路径的负向 CLI / unit tests 数量（缺字段、缺 captured_at、非法 dimension、collector 缺失等）
    collector: tools/scorecard-run/collectors/scorecard_negative_suite.ts
    thresholds:
      - { gte: 6, score: 5 }
      - { gte: 4, score: 3 }
      - { gte: 2, score: 1 }
      - { gte: 0, score: 0 }
```

## social-gen  `[tooling:social-gen]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: tooling.social_gen.render_success_rate_30d
    source: github_repo
    query: 最近 30d OG / social preview 渲染作业成功率（成功产出文件 / 总触发次数）
    collector: tools/scorecard-run/collectors/social_gen_success.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.social_gen.template_variant_count
    source: github_repo
    query: 已提交并可复用的社交图模板变体数（不同尺寸 / 主题 / 文案布局）
    collector: tools/scorecard-run/collectors/social_gen_templates.ts
    thresholds:
      - { gte: 4, score: 5 }
      - { gte: 2, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.social_gen.snapshot_test_rate
    source: github_repo
    query: 社交图模板中带 snapshot / pixel-diff 测试的模板占比
    collector: tools/scorecard-run/collectors/social_gen_snapshot.ts
    thresholds:
      - { gte: 0.90, score: 5 }
      - { gte: 0.60, score: 3 }
      - { gte: 0.20, score: 1 }
      - { gte: 0, score: 0 }
```

## lighthouse  `[tooling:lighthouse]`

```yaml
subitem_aggregation: weighted
weights:
  perf_score_p50: 0.4
  seo_score_p50: 0.4
  report_freshness_days: 0.2
signals:
  - signal_id: tooling.lighthouse.perf_score_p50
    source: lighthouse
    query: 最近 7d 文档站 Lighthouse performance score p50（0-100）
    collector: tools/scorecard-run/collectors/lighthouse_perf.ts
    thresholds:
      - { gte: 90, score: 5 }
      - { gte: 75, score: 3 }
      - { gte: 50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.lighthouse.seo_score_p50
    source: lighthouse
    query: 最近 7d 文档站 Lighthouse SEO score p50（0-100）
    collector: tools/scorecard-run/collectors/lighthouse_seo.ts
    thresholds:
      - { gte: 95, score: 5 }
      - { gte: 85, score: 3 }
      - { gte: 70, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.lighthouse.report_freshness_days
    source: github_repo
    query: 最新 Lighthouse 报告 / snapshot 距今最大天数
    collector: tools/scorecard-run/collectors/lighthouse_freshness.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 30, score: 3 }
      - { lte: 90, score: 1 }
      - { gte: 0, score: 0 }
```

> 与 `[community:seo]` 的边界：本子项只评估监控/告警工具链，不评估关键词策略、canonical URL 文案质量或内容排名结果。

## release-bot  `[tooling:release-bot]`

```yaml
subitem_aggregation: weighted
weights:
  publish_success_rate_90d: 0.4
  changelog_pr_success_rate_90d: 0.4
  manual_intervention_rate_90d: 0.2
signals:
  - signal_id: tooling.release_bot.publish_success_rate_90d
    source: github_repo
    query: 最近 90d tag → registry / GitHub Release 自动发布成功率
    collector: tools/scorecard-run/collectors/release_bot_publish.ts
    thresholds:
      - { gte: 0.98, score: 5 }
      - { gte: 0.90, score: 3 }
      - { gte: 0.60, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.release_bot.changelog_pr_success_rate_90d
    source: github_repo
    query: 最近 90d release-please / changesets PR 自动创建并进入可合并状态的成功率
    collector: tools/scorecard-run/collectors/release_bot_pr.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.release_bot.manual_intervention_rate_90d
    source: github_repo
    query: 最近 90d 需要手工 rerun / force-publish / hotfix tag 的 release job 占比
    collector: tools/scorecard-run/collectors/release_bot_manual.ts
    thresholds:
      - { lte: 0.02, score: 5 }
      - { lte: 0.10, score: 3 }
      - { lte: 0.25, score: 1 }
      - { gte: 0, score: 0 }
```

> 与 `[quality:ci-cd]` / `[quality:semver]` 的边界：本子项评估自动化编排与稳定性，不评估 release 节奏、tag 命名规范或 changelog 文案本身。

## metrics-fetch  `[tooling:metrics-fetch]`

```yaml
subitem_aggregation: weighted
weights:
  success_rate_7d: 0.4
  required_snapshot_max_age_days: 0.3
  schema_compliance_rate: 0.3
signals:
  - signal_id: tooling.metrics_fetch.success_rate_7d
    source: github_repo
    query: 最近 7d metrics 抓取 cron / 手工采集脚本成功率
    collector: tools/scorecard-run/collectors/metrics_fetch_success.ts
    thresholds:
      - { gte: 0.98, score: 5 }
      - { gte: 0.90, score: 3 }
      - { gte: 0.70, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.metrics_fetch.required_snapshot_max_age_days
    source: github_repo
    query: 必填 metrics 快照（scorecard / seo-signals / issue-response 等）距今最大天数
    collector: tools/scorecard-run/collectors/metrics_fetch_age.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 30, score: 3 }
      - { lte: 90, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.metrics_fetch.schema_compliance_rate
    source: github_repo
    query: metrics 目录 JSON / YAML 快照通过 schema 或字段白名单校验的比例
    collector: tools/scorecard-run/collectors/metrics_fetch_schema.ts
    thresholds:
      - { gte: 1.0, score: 5 }
      - { gte: 0.95, score: 3 }
      - { gte: 0.80, score: 1 }
      - { gte: 0, score: 0 }
```

## fm-indexer  `[tooling:fm-indexer]`

```yaml
subitem_aggregation: weighted
weights:
  runtime_seconds: 0.3
  negative_fixture_detection_rate: 0.4
  verbose_flag_visibility: 0.3
signals:
  - signal_id: tooling.fm_indexer.runtime_seconds
    source: github_repo
    query: `node tools/index.ts --root .` 全仓扫描 wallclock p50（秒）
    collector: tools/scorecard-run/collectors/fm_indexer_runtime.ts
    thresholds:
      - { lte: 1, score: 5 }
      - { lte: 3, score: 3 }
      - { lte: 10, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.fm_indexer.negative_fixture_detection_rate
    source: github_repo
    query: 已提交 invalid fixtures / negative CLI cases 中能稳定返回非 0 + 明确字段原因的比例
    collector: tools/scorecard-run/collectors/fm_indexer_negative.ts
    thresholds:
      - { gte: 1.0, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: tooling.fm_indexer.verbose_flag_visibility
    source: github_repo
    query: `--verbose` 输出中显式打印 strict 模式、BILINGUAL_REQUIRED 状态与 i18n stats 摘要
    collector: tools/scorecard-run/collectors/fm_indexer_verbose.ts
    thresholds:
      - { gte: 3, score: 5 }
      - { gte: 2, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
```

## skip 规则
- `tooling:lighthouse` 仅在文档仍为纯 repo-native Markdown、且尚未存在可被 Lighthouse 抓取的目标 URL / 导出 HTML 时允许显式 `skip`；必须附 `reason: no docs runtime yet`。
- `tooling:social-gen` 仅在仓库 roadmap 尚未立项社交图自动化时允许显式 `skip`；若已存在 task / script / placeholder，则 absence 记 0 分，不允许再跳过。
- `tooling:scorecard-run`、`tooling:metrics-fetch`、`tooling:fm-indexer` 为核心基础设施，不可 skip。

## Hard-fail 边界（与 `_schema.md` §5 对齐）
- `tooling.metrics_fetch.required_snapshot_max_age_days` 若缺任何必填快照，collector 必须返回明确错误并使 scorecard-run 退出码非 0；禁止把缺文件记成 0 分。
- `tooling.fm_indexer.negative_fixture_detection_rate` 若 invalid fixture 缺 stderr 字段原因，collector 必须判失败；不接受仅凭 exit code 成功。
- `tooling.release_bot.publish_success_rate_90d` 与 `tooling.release_bot.changelog_pr_success_rate_90d` 必须能区分 `not_configured` 与 `configured_but_failing`；若区分不了，scorecard-run 退出码非 0。
- `tooling:lighthouse` 若无目标 URL 且也未显式 skip，scorecard-run 退出码非 0；禁止偷用上一次报告或手工截图兜底。
- `weight` 非 0.10 或子项标签不在 6 个 tooling leaves 白名单 → fm-indexer / scorecard-run 直接 hard-fail。
