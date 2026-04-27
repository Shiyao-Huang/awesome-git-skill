---
id: bench-community
dimension: community
version: 0.1.0
status: draft
weight: 0.20
last_verified_at: 2026-04-27
---

# Community & Growth Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3 · 跨域映射：[`../plans/03-canonical-mapping.md`](../plans/03-canonical-mapping.md) §1
> 8 个子项；community 域承载旧 8-dim 中 `release`/`growth`/`seo` 的主映射，权重 0.20（与 docs 同档）。
> 与 `[tooling:lighthouse]` / `[tooling:release-bot]` 边界：本文件评估"社区表现/内容产出"，工具侧能力评估归 tooling 域。

## issue-tpl  `[community:issue-tpl]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.issue_tpl.has_structured_template
    source: github_repo
    query: .github/ISSUE_TEMPLATE/*.yml or *.md present with required fields
    collector: tools/scorecard-run/collectors/issue_template.ts
    thresholds:
      - { gte: 2, score: 5 }
      - { gte: 1, score: 3 }
      - { gte: 0, score: 0 }
  - signal_id: community.issue_tpl.usage_rate_30d
    source: github_repo
    query: 最近 30d 新建 issue 中使用模板的比例（form 字段非空 / chooser 命中）
    collector: tools/scorecard-run/collectors/issue_usage.ts
    thresholds:
      - { gte: 0.80, score: 5 }
      - { gte: 0.50, score: 3 }
      - { gte: 0.20, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.issue_tpl.first_response_hours_p50
    source: github_repo
    query: 最近 30d 新 issue 首条 maintainer 评论 wallclock p50 (小时)
    collector: tools/scorecard-run/collectors/issue_response_time.ts
    thresholds:
      - { lte: 24, score: 5 }
      - { lte: 72, score: 3 }
      - { lte: 168, score: 1 }
      - { gte: 0, score: 0 }
```

## pr-tpl  `[community:pr-tpl]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.pr_tpl.has_template
    source: github_repo
    query: .github/PULL_REQUEST_TEMPLATE.md exists and includes checklist
    collector: tools/scorecard-run/collectors/pr_template.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: community.pr_tpl.merge_lead_time_hours_p50
    source: github_repo
    query: 最近 90d merged PR 从 opened→merged wallclock p50 (小时)
    collector: tools/scorecard-run/collectors/pr_lead_time.ts
    thresholds:
      - { lte: 48, score: 5 }
      - { lte: 168, score: 3 }
      - { lte: 720, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.pr_tpl.first_time_contributor_share
    source: github_repo
    query: 最近 90d merged PR 中首次贡献者占比
    collector: tools/scorecard-run/collectors/pr_first_timer.ts
    thresholds:
      - { gte: 0.20, score: 5 }
      - { gte: 0.10, score: 3 }
      - { gte: 0.03, score: 1 }
      - { gte: 0, score: 0 }
```

## discussions  `[community:discussions]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.discussions.enabled
    source: github_repo
    query: GitHub Discussions enabled OR external forum (discourse/zulip) linked from README
    collector: tools/scorecard-run/collectors/discussions_enabled.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: community.discussions.weekly_active_threads
    source: github_repo
    query: 最近 7d 新建或新增评论的 discussion 线程数
    collector: tools/scorecard-run/collectors/discussions_activity.ts
    thresholds:
      - { gte: 30, score: 5 }
      - { gte: 10, score: 3 }
      - { gte: 3, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.discussions.answer_rate_30d
    source: github_repo
    query: 最近 30d question 类 discussion 中被标记 answered 的比例
    collector: tools/scorecard-run/collectors/discussions_answer_rate.ts
    thresholds:
      - { gte: 0.60, score: 5 }
      - { gte: 0.40, score: 3 }
      - { gte: 0.15, score: 1 }
      - { gte: 0, score: 0 }
```

## funnel  `[community:funnel]`

```yaml
subitem_aggregation: weighted
weights:
  star_to_first_pr: 0.4
  pr_to_repeat_contributor: 0.4
  repeat_to_core: 0.2
signals:
  - signal_id: community.funnel.star_to_first_pr_rate_90d
    source: github_repo
    query: 最近 90d stargazers 中提交至少 1 个 merged PR 的比例
    collector: tools/scorecard-run/collectors/funnel_star_to_pr.ts
    thresholds:
      - { gte: 0.005, score: 5 }
      - { gte: 0.001, score: 3 }
      - { gte: 0.0001, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.funnel.pr_to_repeat_contributor_rate
    source: github_repo
    query: 首次 merged PR 贡献者中 90d 内再次提 PR 的比例
    collector: tools/scorecard-run/collectors/funnel_repeat_pr.ts
    thresholds:
      - { gte: 0.30, score: 5 }
      - { gte: 0.15, score: 3 }
      - { gte: 0.05, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.funnel.repeat_to_core_rate
    source: github_repo
    query: repeat contributor 中 180d 内进入 CODEOWNERS 或 ≥10 PR 的比例
    collector: tools/scorecard-run/collectors/funnel_to_core.ts
    thresholds:
      - { gte: 0.05, score: 5 }
      - { gte: 0.02, score: 3 }
      - { gte: 0.005, score: 1 }
      - { gte: 0, score: 0 }
```

## release  `[community:release]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.release.cadence_stddev_days
    source: github_repo
    query: 最近 12 个 release 间隔（天）标准差
    collector: tools/scorecard-run/collectors/release_cadence.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 21, score: 3 }
      - { lte: 60, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.release.notes_quality
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — release 无 notes 或仅自动 changelog 占位
      1 — 列变更但无分类（features/fixes/breaking）
      3 — 分类清晰 + 重点项有上下文（why / migration）
      5 — 分类 + migration guide + acknowledgements + binary/asset 列表
  - signal_id: community.release.notes_read_rate
    source: github_repo
    query: 最新 5 个 release notes 的 view count / 仓库 stars 比例（GitHub release page traffic）
    collector: tools/scorecard-run/collectors/release_notes_views.ts
    thresholds:
      - { gte: 0.05, score: 5 }
      - { gte: 0.01, score: 3 }
      - { gte: 0.001, score: 1 }
      - { gte: 0, score: 0 }
```

> 与 `[playbook:release]` 的关系：本子项是 release 节奏与 notes 内容侧；CI/SemVer 在 `[quality:ci-cd]` / `[quality:semver]`；自动化机器人在 `[tooling:release-bot]`。三者由 `playbooks/release.md` 的 `covers[]` 串联。

## launch  `[community:launch]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.launch.day0_star_delta
    source: github_repo
    query: launch 锚定日（HN/PH/官方公告）当日 star Δ
    collector: tools/scorecard-run/collectors/launch_day_stars.ts
    thresholds:
      - { gte: 1000, score: 5 }
      - { gte: 300, score: 3 }
      - { gte: 50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.launch.day30_retention
    source: github_repo
    query: launch 后 30d star 增量 / day0 star Δ
    collector: tools/scorecard-run/collectors/launch_retention.ts
    thresholds:
      - { gte: 2.0, score: 5 }
      - { gte: 1.0, score: 3 }
      - { gte: 0.3, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.launch.narrative_quality
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 没有 launch 帖 / 公告
      1 — 仅一条社媒，无 demo / 数据
      3 — 有 launch post + demo 链接 + 1-2 个核心案例
      5 — 多渠道 launch（HN + PH + 博客 + 视频）+ 数据支撑 + 与现有方案对比
```

> Day0 / Day30 锚定日的解析依赖 `metrics/launch-anchors.yaml`（每个被评估项目显式声明），缺失时 hard-fail，禁止自动用 repo 创建日兜底。

## seo  `[community:seo]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.seo.brand_keyword_rank
    source: url_fetch
    query: 品牌关键词在主流搜索（Google/Bing）首页排名位置
    collector: tools/scorecard-run/collectors/seo_rank.ts
    thresholds:
      - { lte: 1, score: 5 }
      - { lte: 3, score: 3 }
      - { lte: 10, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.seo.long_tail_coverage
    source: url_fetch
    query: 长尾问题关键词（"how to <feature>"）首页命中数（最多 20 个抽样）
    collector: tools/scorecard-run/collectors/seo_long_tail.ts
    thresholds:
      - { gte: 12, score: 5 }
      - { gte: 6, score: 3 }
      - { gte: 2, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.seo.canonical_url_health
    source: url_fetch
    query: 文档站 canonical / og:title / og:description / sitemap.xml 完整性
    collector: tools/scorecard-run/collectors/seo_meta.ts
    thresholds:
      - { gte: 4, score: 5 }
      - { gte: 3, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
```

> 与 `[tooling:lighthouse]` 边界：lighthouse 评分自动化属 tooling；这里关心 SEO 内容产出与排名结果。

## social  `[community:social]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: community.social.channel_count
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 无任何社媒账号
      1 — 仅 1 个渠道（Twitter/X 或 Mastodon）
      3 — 2-3 个活跃渠道（X + Bluesky/LinkedIn）
      5 — ≥3 个活跃渠道 + 至少 1 个长内容渠道（YouTube/Podcast/Blog）
  - signal_id: community.social.follower_growth_30d
    source: url_fetch
    query: 主渠道（README 首位社媒链接）30d 粉丝增量百分比
    collector: tools/scorecard-run/collectors/social_growth.ts
    thresholds:
      - { gte: 0.05, score: 5 }
      - { gte: 0.02, score: 3 }
      - { gte: 0.005, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: community.social.engagement_rate
    source: url_fetch
    query: 主渠道最近 20 条帖子平均 (likes+reposts) / followers
    collector: tools/scorecard-run/collectors/social_engagement.ts
    thresholds:
      - { gte: 0.03, score: 5 }
      - { gte: 0.01, score: 3 }
      - { gte: 0.002, score: 1 }
      - { gte: 0, score: 0 }
```

## skip 规则
- 仅 maintainer 个人项目可显式 `skip: community.social`，并提供 `reason: solo maintainer, no brand channel`，否则按 0 计入。
- 内部 / 私有项目（无公开 launch）可显式 `skip: community.launch`，理由必填。
- `discussions` 子项允许用外部论坛（Discourse/Zulip/Slack 公开搜索版）替代 GitHub Discussions，但 `discussions_enabled` collector 必须有显式适配；不允许 fallback 到「无 discussions 即记 0」之外的兜底逻辑。

## Hard-fail 边界（与 `_schema.md` §5 对齐）
- `metrics/launch-anchors.yaml` 缺失 → community.launch.* 不写分，不兜底
- collector 抓取失败 → 当次 run 退出码非 0，不沿用上次值
- `weight` 与 02-scorecard §2.4 不一致 → fm-indexer hard-fail（本文件 weight=0.20 必须与 plans 同步）
