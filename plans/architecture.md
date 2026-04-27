# Architecture Overview

> Status: v0 · Owner: solution-architect · Date: 2026-04-27
> 这是顶层架构索引；详细决策分散在 `plans/0X-*.md`。

## 数据流

```
GitHub/URL/NPM/...   ──► tools/scorecard-run (collectors)
                           │  signal-level facts
                           ▼
                    benchmarks/<dim>.md (rubric + thresholds)
                           │  subitem score 0–5
                           ▼
                    plans/02-scorecard.md (weights)
                           │  dimension 0–100, overall
                           ▼
                    metrics/scorecard/<date>.json
                           │
                           ▼
                    case-studies/<project>.md (人读叙事)
                    + tools/dashboards (人读仪表盘)
```

## 模块职责

| 模块                    | 职责                                       | 关键规则                                                   |
|-------------------------|--------------------------------------------|----------------------------------------------------------|
| `plans/01-taxonomy.md`  | 定义"做什么"                                | 6 域 × 36 叶子，标签清单                                   |
| `plans/02-scorecard.md` | 定义"做到什么程度"                          | 三层评分 + 权重 + 输出契约                                  |
| `benchmarks/_schema.md` | 评分 rubric 与 signal 强 schema             | 单一事实源；hard-fail 边界                                 |
| `benchmarks/<dim>.md`   | 各域 0–5 等级与 signal 列表                  | front-matter weight 必须与 02-scorecard 一致               |
| `playbooks/<dim>/...`   | 改进剧本：如何把分从 N 抬到 N+1             | 引用 signal_id 闭环                                       |
| `case-studies/<proj>`   | 头部项目实证                                | 必须能复算 scorecard，不允许凭印象打分                      |
| `research/`             | 原始调研、访谈、抓取证据                     | 带来源 + 时间戳                                           |
| `metrics/`              | 数据快照（时间序列）                          | 仅 dated 写入，禁止覆盖                                    |
| `tools/`                | 自动化（fm-indexer / scorecard-run / metrics-fetch / social-gen / lighthouse / release-bot） | 配置驱动；缺信号 hard-fail |

## 演进顺序（路线图）

1. **v0 已落**：仓库骨架 (00) + taxonomy (01) + scorecard 设计 (02) + benchmarks schema
2. **v0.1 进行中**：6 个 `benchmarks/<dim>.md` 骨架；fm-indexer (tools)；2–3 个 facade/docs playbook 骨架
3. **v0.2**：scorecard-run MVP（facade + docs 跑通真实项目）+ 1 个 case-study 端到端
4. **v0.3**：扩展到全部 6 域 collectors；3 个 case-study；首次权重回测
5. **v1.0**：≥10 个 case-study；权重数据驱动校准；社区试用

## 与团队规则的对齐

- **禁止 fallback**：collector 故障、信号缺失、source 越界、权重漂移 → 全部 hard-fail，不写 metrics
- **可观测日志**：scorecard-run 在 collector 边界打 INFO；DEBUG 默认关；ERROR 必须含 signal_id
- **配置驱动**：weights 在 02-scorecard §2.4；source 白名单在 02-scorecard §3.1；标签清单在 01-taxonomy §3
- **不优先文档**：本仓库当前不维护对外 README；用户文档闭合后再产出
