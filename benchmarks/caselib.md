---
id: bench-caselib
dimension: caselib
version: 0.1.0
status: draft
weight: 0.15
last_verified_at: 2026-04-27
---

# Case Library & Benchmarks Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3
> **自指评分**：caselib 域评估"我们自己的案例库做得多好"，不是评估外部项目。collector 直接读 `case-studies/`、`metrics/` 目录产物，不做网络抓取（与其它 5 域不同）。
> 5 子项；与 `templates/case-study.md` schema 强耦合 — 模板字段缺失即影响本评分。

## head  `[caselib:head]`

```yaml
subitem_aggregation: weighted
weights:
  count: 0.4
  dimension_coverage: 0.4
  freshness: 0.2
signals:
  - signal_id: caselib.head.case_count
    source: github_repo
    query: case-studies/ 目录中 front-matter status=ratified 且 dimensions_covered[].length >= 3 的文件数
    collector: tools/scorecard-run/collectors/caselib_count.ts
    thresholds:
      - { gte: 12, score: 5 }
      - { gte: 8, score: 3 }
      - { gte: 4, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.head.dimension_coverage_pct
    source: github_repo
    query: ratified case-studies 中 dimensions_covered[] 至少覆盖 6 顶层域全集的比例
    collector: tools/scorecard-run/collectors/caselib_dim_coverage.ts
    thresholds:
      - { gte: 0.80, score: 5 }
      - { gte: 0.50, score: 3 }
      - { gte: 0.20, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.head.last_verified_max_age_days
    source: github_repo
    query: ratified case-studies 中 last_verified_at 距今最大值（天）
    collector: tools/scorecard-run/collectors/caselib_freshness.ts
    thresholds:
      - { lte: 30, score: 5 }
      - { lte: 90, score: 3 }
      - { lte: 180, score: 1 }
      - { gte: 0, score: 0 }
```

## scorecard  `[caselib:scorecard]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: caselib.scorecard.replay_dimension_drift
    source: github_repo
    query: 同一目标 commit 跑 scorecard-run 两次，dimension 级 score 差值绝对值最大值
    collector: tools/scorecard-run/collectors/replay_drift.ts
    thresholds:
      - { lte: 0.5, score: 5 }
      - { lte: 1.0, score: 3 }
      - { lte: 2.0, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.scorecard.signal_collector_failure_rate
    source: github_repo
    query: 最近一次 scorecard-run 中 collector 抛错或返回 insufficient_data 的 signal 比例
    collector: tools/scorecard-run/collectors/scorecard_health.ts
    thresholds:
      - { lte: 0.02, score: 5 }
      - { lte: 0.10, score: 3 }
      - { lte: 0.25, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.scorecard.cite_completeness
    source: github_repo
    query: ratified case-studies 中正文事实陈述附 `[s?]` 或 `UNVERIFIED:` 的比例（基于段落级抽样）
    collector: tools/scorecard-run/collectors/cite_audit.ts
    thresholds:
      - { gte: 0.90, score: 5 }
      - { gte: 0.70, score: 3 }
      - { gte: 0.40, score: 1 }
      - { gte: 0, score: 0 }
```

> replay_drift > 2.0 时 scorecard-run 必须 hard-fail（不可发布该次结果）；本子项的"分数"只用于 caselib 评估，不会让 scorecard 自我修复隐藏问题。

## h2h  `[caselib:h2h]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: caselib.h2h.pair_count
    source: github_repo
    query: case-studies/ 中 type=h2h（front-matter 显式声明）或 covers ≥2 个同 dimension head 的对比文件数
    collector: tools/scorecard-run/collectors/h2h_count.ts
    thresholds:
      - { gte: 6, score: 5 }
      - { gte: 3, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.h2h.decision_actionable
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 仅并排比较，无明确"何时选哪个"结论
      1 — 有结论但缺约束条件
      3 — 给出 ≥2 决策分支（按团队规模 / stack / 阶段）
      5 — 决策树 + 数据支撑 + 反案例（什么情况下都不该选）
  - signal_id: caselib.h2h.cite_density
    source: github_repo
    query: h2h 文档中每段事实陈述的 `[s?]` 引用密度（每 100 词引用次数）
    collector: tools/scorecard-run/collectors/cite_density.ts
    thresholds:
      - { gte: 3, score: 5 }
      - { gte: 1.5, score: 3 }
      - { gte: 0.5, score: 1 }
      - { gte: 0, score: 0 }
```

## metrics  `[caselib:metrics]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: caselib.metrics.snapshot_age_days
    source: github_repo
    query: metrics/ 目录中最新快照文件 mtime 距今天数（按项目分组取最大）
    collector: tools/scorecard-run/collectors/metrics_age.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 30, score: 3 }
      - { lte: 90, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.metrics.timeseries_density
    source: github_repo
    query: metrics/<project>/*.json 文件数（同项目时间点数）的 p50
    collector: tools/scorecard-run/collectors/metrics_density.ts
    thresholds:
      - { gte: 12, score: 5 }
      - { gte: 6, score: 3 }
      - { gte: 2, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.metrics.schema_compliance
    source: github_repo
    query: metrics/ 目录所有 JSON 通过 JSON schema 校验的比例
    collector: tools/scorecard-run/collectors/metrics_schema.ts
    thresholds:
      - { gte: 1.0, score: 5 }
      - { gte: 0.95, score: 3 }
      - { gte: 0.80, score: 1 }
      - { gte: 0, score: 0 }
```

> schema_compliance < 1.0 时 fm-indexer 不强制 hard-fail（属软告警），但 scorecard-run 在严格模式（`--strict`）下会 hard-fail。

## adoption  `[caselib:adoption]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: caselib.adoption.story_count
    source: github_repo
    query: case-studies/ 中 dimensions_covered[] 含 `community` 且包含 adoption / case section 的文件数
    collector: tools/scorecard-run/collectors/adoption_count.ts
    thresholds:
      - { gte: 8, score: 5 }
      - { gte: 4, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: caselib.adoption.source_credibility
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 引用来源全部为项目自家博客 / Twitter
      1 — 多数为自家来源，少量第三方提及
      3 — 至少一半引用为第三方报道 / 论文 / 用户公开使用证据
      5 — 多元来源 + 含可量化数据（用户数 / QPS / 业务指标）+ 时间锚点
  - signal_id: caselib.adoption.named_user_count
    source: github_repo
    query: case-studies/ 正文显式列出的 named adopter 数量（公司/团队/产品）
    collector: tools/scorecard-run/collectors/named_adopter.ts
    thresholds:
      - { gte: 20, score: 5 }
      - { gte: 10, score: 3 }
      - { gte: 3, score: 1 }
      - { gte: 0, score: 0 }
```

## skip 规则
- 项目早期（caselib 总文件数 < 4）允许显式 `skip: caselib.h2h`（缺样本），但 `head` / `metrics` / `scorecard` 不可 skip。
- adoption.named_user_count 在闭源 / 内部使用证据多于公开证据时，可降级用 manual_rubric 替代，但需在 case-study 显式声明 `evidence_class: private`。

## Hard-fail 边界（与 `_schema.md` §5 对齐）
- replay_dimension_drift > 2.0 → scorecard-run 必须 hard-fail（不发布结果）
- metrics schema_compliance 在 `--strict` 下 < 1.0 → 退出码非 0
- 任何 collector 直接调用外部网络（caselib 域应只读本仓库产物）→ scorecard-run 退出码非 0
