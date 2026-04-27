---
id: bench-facade
dimension: facade
version: 0.1.0
status: draft
weight: 0.15
last_verified_at: 2026-04-27
---

# Facade & First Impression Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3 · 对应 playbook：[`../playbooks/facade.md`](../playbooks/facade.md)
> 5 个子项；facade 域评估“访客进入仓库/官网后的前 30 秒第一印象”，权重 0.15。
> source 白名单仅限 `github_repo` / `url_fetch` / `manual_review`。与 `[docs:quickstart]` / `[community:seo]` / `[tooling:social-gen]` / `[tooling:lighthouse]` 的边界见各子项注释。

## hero  `[facade:hero]`

```yaml
subitem_aggregation: weighted
weights:
  demo_asset: 0.40
  tagline_length: 0.35
  primary_cta: 0.25
signals:
  - signal_id: facade.hero.has_demo_asset
    source: github_repo
    query: README 前 60 行是否出现 <img|<video|gif|asciinema|<picture 等首屏 demo 资产
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: facade.hero.tagline_length_words
    source: github_repo
    query: README 首个 H1 + 首段价值主张的词数（英文 token 近似，中文按分词后近似）
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds:
      - { gte: 8, lte: 25, score: 5 }
      - { gte: 5, lte: 40, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: facade.hero.has_primary_cta
    source: github_repo
    query: README 前 60 行是否存在唯一主 CTA（docs|quickstart|playground|try now）
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds:
      - { gte: 1, lte: 1, score: 5 }
      - { gte: 2, score: 2 }
      - { gte: 0, score: 0 }
```

> 边界：这里只看“首屏是否把人带去下一步”；真正的 runnable onboarding 归 `[docs:quickstart]`。

## badges  `[facade:badges]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: facade.badges.count_valid
    source: github_repo
    query: README 徽章中 HTTP 200/3xx 且非死链的 badge 数量
    collector: tools/scorecard-run/collectors/readme_badges.ts
    thresholds:
      - { gte: 2, lte: 4, score: 5 }
      - { gte: 1, lte: 6, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: facade.badges.core_badge_coverage
    source: github_repo
    query: 徽章是否覆盖 release / CI / license / community or perf 中至少 2 类核心信号
    collector: tools/scorecard-run/collectors/readme_badges.ts
    thresholds:
      - { gte: 3, score: 5 }
      - { gte: 2, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: facade.badges.dead_link_rate
    source: github_repo
    query: README 徽章链接 4xx/5xx/timeout 比例
    collector: tools/scorecard-run/collectors/readme_badges.ts
    thresholds:
      - { lte: 0.00, score: 5 }
      - { lte: 0.10, score: 3 }
      - { lte: 0.30, score: 1 }
      - { gte: 0, score: 0 }
```

## demo  `[facade:demo]`

```yaml
subitem_aggregation: max
signals:
  - signal_id: facade.demo.has_playground_url
    source: github_repo
    query: README/about 是否出现 stackblitz|codesandbox|playground|try now|demo.<domain> 等实时体验入口
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: facade.demo.asset_size_kb
    source: github_repo
    query: 首屏 GIF / MP4 / asciinema poster 体积（KB）；兼顾可读性与加载成本
    collector: tools/scorecard-run/collectors/asset_inspect.ts
    thresholds:
      - { gte: 200, lte: 4000, score: 5 }
      - { gte: 50, lte: 8000, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: facade.demo.has_embed_or_capture
    source: github_repo
    query: README 前 80 行是否嵌入 demo 截图 / 录屏 / asciinema / gif 任一可视化资产
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds:
      - { gte: 1, score: 4 }
      - { gte: 0, score: 0 }
```

> 边界：demo 子项只评“是否能在首屏看见结果”；完整教程与深度示例分别归 `[docs:tutorial]` / `[docs:examples]`。

## social  `[facade:social]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: facade.social.og_image_present
    source: url_fetch
    query: docs / 官网根路径存在 `og:image`
    collector: tools/scorecard-run/collectors/og_meta.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: facade.social.twitter_card_present
    source: url_fetch
    query: 存在 `twitter:card=summary_large_image`
    collector: tools/scorecard-run/collectors/og_meta.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: facade.social.copy_consistency
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — README / OG / 社交卡标题各说各话，无法识别同一产品
      1 — 有同一名称，但价值主张明显不一致
      3 — 名称、tagline、主价值主张大体一致
      5 — README / OG / 社交卡在对象、收益、语气上高度一致，可形成稳定记忆点
```

> 边界：SEO 关键词与 sitemap/robots 归 `[community:seo]`；自动生成社交卡工具可用性归 `[tooling:social-gen]`。

## tagline  `[facade:tagline]`

```yaml
subitem_aggregation: weighted
weights:
  manual: 0.7
  hero_length: 0.3
signals:
  - signal_id: facade.tagline.manual_rubric
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 没有 tagline，或与项目实际价值无关
      1 — 只说“是什么”，不说“给谁 / 为什么值得用”
      3 — 说清对象 + 价值，能区分大类但差异化仍弱
      5 — 一句话同时完成对象识别、收益承诺、差异化定位，且可被复用于 README / OG / 发布帖
  - signal_id: facade.tagline.hero_length_score
    source: github_repo
    query: alias to `facade.hero.tagline_length_words`
    collector: tools/scorecard-run/collectors/readme_first_n.ts
    thresholds: []
```

## skip 规则
- 默认不允许 skip `hero` / `badges` / `tagline`；它们是任何公开 OSS 项目的最小门面信号。
- 允许显式 `skip: facade.social`，仅当项目无公开 docs/site 且 acquisition surface 明确限定为 GitHub repo 页面；必须写 `reason: no public web surface by design`。
- `facade.demo` 不允许因为“项目太底层”直接 skip；没有 demo / playground 就按 0 计分，由 case-study 或 playbook 解释其合理性。

## Hard-fail 边界（与 `_schema.md` §5 对齐）
- README 读取失败、badge HTTP 校验超时/异常、或 demo 资产探测抛错 → collector error，scorecard-run 退出码非 0，禁止当 0 分吞掉。
- `facade.social` 若既无法从配置拿到 site root，也无法从 README/docs 链接推断目标 URL → strict 模式 hard-fail，不允许静默跳过。
- `facade.tagline.manual_rubric` 在要求人工审查的运行模式下未填写 → scorecard-run 返回 `insufficient_data`，strict 模式退出码非 0。

## 已知缺口
- 视频化 demo（YouTube embed / Loom）暂未拆成独立 signal；待头部项目回测后再决定是否从 `facade.demo` 中拆分。
- 多语言 hero 仍归 `[docs:i18n]`，本文件不重复计分，避免 facade/docs 双算。
