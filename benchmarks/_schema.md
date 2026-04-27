# Scorecard Schema (benchmarks/_schema.md)

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3（37 叶子，machine-canonical） · 旧 8-dim ↔ 6 域映射：[`../plans/03-canonical-mapping.md`](../plans/03-canonical-mapping.md)
> 本文件定义 `benchmarks/<dim>.md` 与 signal 配置的强约束 schema。`tools/fm-indexer` 与 `tools/scorecard-run` 都以本文件为单一事实源；标签校验回 `01-taxonomy.md` §3，**禁止** 接受 8-dim 旧名（`release`/`growth`/`seo`/`case-library`）。

## 1. `benchmarks/<dim>.md` Front-Matter

```yaml
---
id: bench-<dim>                # 例：bench-facade
dimension: facade              # 必须命中 taxonomy 标签清单
version: 0.1.0
status: draft|ratified|deprecated
weight: 0.15                   # 必须等于 plans/02-scorecard.md §2.4 中的对应权重
last_verified_at: 2026-04-27
---
```

`weight` 与 `02-scorecard.md` 不一致 → fm-indexer hard-fail。

## 2. 子项块（在文档正文按子项分节）

每个子项 (`subitem`) 必须包含一段 ```yaml signals``` 代码块，列出该子项下的所有信号：

````markdown
## hero  `[facade:hero]`

```yaml signals
- signal_id: facade.hero.has_demo_asset
  source: github_repo
  query: README first 50 lines contains <img|<video|gif|asciinema|<picture
  collector: tools/scorecard-run/collectors/readme_first_n.ts
  thresholds:
    - { gte: 1, score: 5 }
    - { gte: 0, score: 0 }
- signal_id: facade.hero.tagline_length
  source: github_repo
  query: README first heading + 1 paragraph word count
  thresholds:
    - { lte: 25, gte: 8, score: 5 }
    - { lte: 40, gte: 5, score: 3 }
    - { gte: 0, score: 1 }
```

**Score Aggregation (subitem)**: max-over-signals OR weighted-mean, 见各子项 `aggregation:` 字段；缺该字段默认 `mean`。
````

## 3. 必填字段（每个 signal）

| 字段             | 必填 | 校验                                                                  |
|------------------|------|---------------------------------------------------------------------|
| `signal_id`      | yes  | 全局唯一；命名空间 `<dim>.<subitem>.<short>`                          |
| `source`         | yes  | ∈ source 白名单（02-scorecard §3.1）                                 |
| `query`          | yes  | 自由文本 + collector 可解析的描述                                     |
| `collector`      | yes  | 文件存在；`source: manual_review` 时填 `manual`                       |
| `thresholds[]` 或 `manual_rubric` | yes (二选一) | 详见 02-scorecard §3                                |
| `update_cadence` | no   | 默认 `per_run`                                                       |
| `last_verified_at` | no | ISO date；超过 180d 触发 `stale` 告警（不影响打分）                    |

## 4. 子项 aggregation

```yaml
subitem_aggregation:
  hero: max          # 任一 signal 给 5 即得 5
  badges: mean       # 多 signal 取均值
  tagline: weighted  # 必须显式列 weights map
```

未声明 → fall back 到 `mean`。这是少数允许的默认值，因为 `mean` 是无偏；其它行为差异（max/weighted）必须显式声明。

## 5. Hard-fail 边界（与"禁止 fallback"规则对齐）

scorecard-run 在以下情况退出码非 0、不写 metrics：
1. `dimension` 或 `subitem` 不在 taxonomy 标签清单
2. `signal_id` 重复
3. `source` 不在白名单
4. collector 文件不存在或 throw
5. signal 既无 `thresholds` 也无 `manual_rubric`
6. `weight` 与 02-scorecard §2.4 不一致

不允许"信号缺失自动判 0"或"collector 失败回退到上一次结果"。
