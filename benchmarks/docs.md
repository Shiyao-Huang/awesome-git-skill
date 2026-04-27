---
id: bench-docs
dimension: docs
version: 0.1.0
status: draft
weight: 0.20
last_verified_at: 2026-04-27
---

# Docs & Onboarding Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md)
> 6 个子项；docs 是留存的最强决定因子，权重 0.20。

## quickstart  `[docs:quickstart]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.quickstart.runnable_in_minutes
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 没有 quickstart
      1 — 有但无法直接复制粘贴跑通
      3 — 复制粘贴 5 分钟内拿到第一个有意义结果
      5 — 3 分钟内 + 浏览器内可执行（playground/copy button）
  - signal_id: docs.quickstart.has_copy_button
    source: url_fetch
    query: docs site code blocks render copy button
    collector: tools/scorecard-run/collectors/docs_dom.ts
    thresholds:
      - { gte: 1, score: 4 }
      - { gte: 0, score: 0 }
  - signal_id: docs.quickstart.commands_lint_pass
    source: github_repo
    query: extract fenced shell blocks; shellcheck/bash -n syntax pass rate
    collector: tools/scorecard-run/collectors/snippet_lint.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
```

## tutorial  `[docs:tutorial]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.tutorial.endtoend_complete
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 没有完整教程
      3 — 有 1 个端到端教程，可复算
      5 — ≥2 个端到端教程，跨场景，含数据/截图/可下载源码
  - signal_id: docs.tutorial.depth_sections
    source: url_fetch
    query: tutorial 顶层页 H2 数量与平均字数
    collector: tools/scorecard-run/collectors/docs_outline.ts
    thresholds:
      - { gte: 6, score: 5 }
      - { gte: 3, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
```

## api-ref  `[docs:api-ref]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.api_ref.coverage_pct
    source: github_repo
    query: exported symbols documented / total exported symbols
    collector: tools/scorecard-run/collectors/api_doc_coverage.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: docs.api_ref.drift_days
    source: github_repo
    query: max(commit time of public symbol vs its doc page) days
    collector: tools/scorecard-run/collectors/api_doc_drift.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 30, score: 3 }
      - { lte: 90, score: 1 }
      - { gte: 0, score: 0 }
```

## troubleshoot  `[docs:troubleshoot]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.troubleshoot.has_faq
    source: url_fetch
    query: docs has FAQ or Troubleshooting page with ≥10 entries
    collector: tools/scorecard-run/collectors/docs_outline.ts
    thresholds:
      - { gte: 10, score: 5 }
      - { gte: 5, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: docs.troubleshoot.error_code_index
    source: url_fetch
    query: structured error code → explanation page exists
    collector: tools/scorecard-run/collectors/docs_outline.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
```

## i18n  `[docs:i18n]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.i18n.locale_count
    source: url_fetch
    query: docs site exposed locales count
    collector: tools/scorecard-run/collectors/docs_locales.ts
    thresholds:
      - { gte: 3, score: 5 }
      - { gte: 2, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: docs.i18n.translation_lag_days
    source: url_fetch
    query: max age delta between source page and translation page
    collector: tools/scorecard-run/collectors/docs_locales.ts
    thresholds:
      - { lte: 14, score: 5 }
      - { lte: 60, score: 3 }
      - { lte: 180, score: 1 }
      - { gte: 0, score: 0 }
```

## examples  `[docs:examples]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.examples.gallery_count
    source: github_repo
    query: examples/ dir or examples gallery page entries count
    collector: tools/scorecard-run/collectors/examples_dir.ts
    thresholds:
      - { gte: 10, score: 5 }
      - { gte: 5, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: docs.examples.runnable_pct
    source: github_repo
    query: examples that can be cloned & built without manual edits
    collector: tools/scorecard-run/collectors/examples_smoke.ts
    thresholds:
      - { gte: 0.90, score: 5 }
      - { gte: 0.70, score: 3 }
      - { gte: 0.30, score: 1 }
      - { gte: 0, score: 0 }
```

## site-stack  `[docs:site-stack]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: docs.site_stack.choice_documented
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 文档站技术栈未声明（README/ADR 找不到选型说明）
      1 — 仅 package.json 痕迹，无决策记录
      3 — ADR / decision-note 写明了候选与拒绝理由
      5 — ADR + 可复现的迁移脚本 + 选型回顾（含 build/Lighthouse 数据）
  - signal_id: docs.site_stack.build_seconds
    source: github_repo
    query: docs site CI build wallclock seconds (cold cache)
    collector: tools/scorecard-run/collectors/docs_build_time.ts
    thresholds:
      - { lte: 60, score: 5 }
      - { lte: 180, score: 3 }
      - { lte: 600, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: docs.site_stack.lighthouse_perf
    source: lighthouse
    query: docs landing page mobile perf score
    collector: tools/scorecard-run/collectors/lighthouse.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.85, score: 3 }
      - { gte: 0.60, score: 1 }
      - { gte: 0, score: 0 }
```

> 与 `[tooling:lighthouse]` 的边界：本叶子评估"站点技术栈选型与构建产物的健康度"（内容/作者侧）；`tooling:lighthouse` 评估"我们自己跑 Lighthouse 监控这套工具的可用性"（工具侧）。两者复用同一 collector 但记入不同 subitem。

## skip 规则
- 单语言项目可在 `scorecard.config.yaml` 显式 `skip: docs.i18n`，并提供 `reason: single-locale by design`，否则按 0 计入。
