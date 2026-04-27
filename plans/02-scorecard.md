# 02 — Open Source Scorecard 设计

> Status: ratified-v0 · Owner: solution-architect · Date: 2026-04-27
> 上游：[`01-taxonomy.md`](./01-taxonomy.md) · 下游：`benchmarks/<dim>.md`、`tools/scorecard-run`

## 1. 设计目标

把"15W★ 级别项目应该长什么样"翻译成一组**可复算、可比较、可改进**的分数。Scorecard 必须满足：

1. **与 taxonomy 1:1 锚定**：6 顶层域 → 6 评分模块；每个叶子 (subitem) 至少贡献 1 个观测信号，避免域内空洞。
2. **复算稳定**：同一项目在两次跑分之间，差值仅来自项目变化，不来自打分人主观漂移 → 信号必须给出**采集口径**而非"看起来挺好"。
3. **机器优先**：能自动采集的信号绝不交给人工；人工审查只在"判断质感"的子项里出现，且必须给 rubric 锚点。
4. **配置驱动**：每条信号在 `benchmarks/<dim>.md` 中以 YAML 块声明 (`signal_id, source, query, threshold[]`)；`tools/scorecard-run` 缺信号或越界 → **hard-fail**，禁止 fallback 成 0。
5. **Feature-flag 化**：项目可声明"暂不参与某子项"，在配置里显式 `skip: true` + 写明理由；scorecard 把它从分母中剔除而不是当 0 分。

## 2. 评分模型

### 2.1 三层结构

```
Project
└── Dimension (×6)        每域 0–100，6 域加权得到 Overall
    └── Subitem (×4–8)    每子项 0–5（rubric 等级）
        └── Signal (≥1)   原子可采集事实
```

### 2.2 子项 0–5 等级（统一 rubric 模板）

| 等级 | 含义               | 通用锚点                                            |
|------|------------------|----------------------------------------------------|
| 0    | Absent             | 完全没做                                            |
| 1    | Stub               | 占位/默认模板，无定制                               |
| 2    | Working            | 能用，但缺关键信息或未维护（>180d 未更新）           |
| 3    | Solid              | 内容完整，符合社区惯例                              |
| 4    | Excellent          | 超出基线，有数据/案例/指标支撑                       |
| 5    | Reference-grade    | 头部项目水准，可作为 case-study 反向引用             |

每条子项在 `benchmarks/<dim>.md` 必须把 0–5 各自映射到**可观测信号阈值**或**人工 rubric 描述**，不能只写空泛形容词。

### 2.3 域分计算

```
dim_score = round( (Σ subitem_score / Σ max) × 100, 1 )
            其中 skip:true 的子项不进入 max
```

### 2.4 Overall 加权

| 域         | 权重 | 理由                                                  |
|------------|------|------------------------------------------------------|
| facade     | 0.15 | 决定首屏转化但天花板低                                 |
| docs       | 0.20 | 决定留存与首次成功                                     |
| community  | 0.20 | 决定增长曲线与外部贡献者动能                            |
| quality    | 0.20 | 决定头部用户敢不敢生产使用                              |
| caselib    | 0.15 | 决定可信度与对比叙事                                    |
| tooling    | 0.10 | 内部杠杆，间接影响其他 5 域                             |

权重会随 v1 数据回测调整；当前 v0 是设计意图。变更必须在本节附 `change-log` 记录。

## 3. 信号采集口径（统一）

所有 `signal_id` 在 `benchmarks/<dim>.md` 中按下表声明：

```yaml
signal_id: facade.hero.has_demo_asset
dimension: facade
subitem: hero
source: github_repo            # github_repo | url_fetch | npm | crates | pypi | manual_review
query: README first 50 lines contains <img|<video|gif|asciinema
collector: tools/scorecard-run/collectors/readme_first_n.ts
update_cadence: per_run
thresholds:                    # 用于 0–5 映射
  - { gte: 1, score: 5 }
  - { gte: 0, score: 0 }
manual_rubric: null            # 人工审查时填，否则 null
last_verified_at: 2026-04-27
```

**规则**：
- `source` 必须是枚举值；新源需先在本文件 §3.1 声明并加白名单。
- `manual_rubric` 与 `thresholds` 至少一个有值（信号要么自动评，要么人工评，没有中间态）。
- collector 失败 → scorecard 整次跑分 hard-fail；不允许把缺数据当 0 分混进总分。

### 3.1 source 白名单

| source           | 抓取层                                          | 频率   |
|------------------|------------------------------------------------|--------|
| `github_repo`    | GitHub REST/GraphQL API                          | per_run|
| `url_fetch`      | 直连 URL，HTML/JSON                              | per_run|
| `npm`/`crates`/`pypi` | 包注册表 API                                | per_run|
| `lighthouse`     | Lighthouse CI 报告 JSON                          | per_run|
| `manual_review`  | reviewer 在 PR 中填表（带 rubric 引用）          | weekly |

新增 source 必须在本节加行 + 写 collector，否则 fm-indexer 拒绝。

## 4. 6 域骨架（详细 0–5 信号见 `benchmarks/<dim>.md`）

| 域          | 子项数 | 关键自动化信号示例                                          | 人工审查子项                |
|-------------|--------|-----------------------------------------------------------|----------------------------|
| facade      | 5      | hero 字数、demo 资源、社交卡 OG/Twitter 校验                | tagline 价值主张质量        |
| docs        | 6      | quickstart 命令可执行性、API ref 漂移率、broken link        | tutorial 端到端流畅度       |
| community   | 8      | 模板使用率、首响应时间、release cadence stddev、SEO 排名     | launch 文案质量             |
| quality     | 6      | CI 矩阵覆盖、SemVer 合规、CVE 响应中位时间、覆盖率            | DX 体感（人工锚点）          |
| caselib     | 5      | scorecard 自身复算稳定性、metrics 时效                       | adoption 故事可信度          |
| tooling     | 6      | scorecard 跑分耗时、fm-indexer 违规检出率、release-bot 通过率| —                          |

## 5. 输出契约

`tools/scorecard-run` 标准输出：

```json
{
  "project": "owner/repo",
  "ran_at": "2026-04-27T09:30:00Z",
  "scorecard_version": "0.1.0",
  "overall": 67.4,
  "dimensions": {
    "facade":   { "score": 78.0, "subitems": { "hero": 4, "badges": 3, ... } },
    "docs":     { "score": 64.0, "subitems": { ... } },
    "community":{ "score": 71.0, "subitems": { ... } },
    "quality":  { "score": 60.0, "subitems": { ... } },
    "caselib":  { "score": 50.0, "subitems": { ... } },
    "tooling":  { "score": 70.0, "subitems": { ... } }
  },
  "skipped":  [{ "subitem": "docs.i18n", "reason": "single-locale by design" }],
  "failures": []   // 信号 collector 失败列表；非空 → exit code 非 0
}
```

`failures` 非空时**整次跑分作废**，不写入 `metrics/scorecard/<date>.json`，并要求 reviewer 处理；这是用户规则中「禁止 fallback 掩盖 bug」的落地点。

## 6. 可观测日志（关键路径）

`tools/scorecard-run` 必须输出：
- 每个 collector 的开始/结束 + 耗时（INFO）
- 缺信号、阈值越界、source unauthorized → ERROR + 退出码
- skip 项与原因 → INFO（不是 WARN，避免噪音）

不打印逐 PR / 逐 issue 抓取细节，避免无意义噪音 —— 走 DEBUG 级别且默认关闭。

## 7. Feature flags / 配置项

`scorecard.config.yaml` 控制单项目跑分行为：

```yaml
project: vercel/next.js
scorecard_version: 0.1.0
dimension_overrides: {}        # 不允许调权重；只能 skip 子项
skipped:
  - subitem: docs.i18n
    reason: single-locale (en) is intentional
```

权重在 §2.4 集中定义，不允许 per-project 覆盖（防止 cherry-picking 抬分）。

## 8. 验收信号

- [x] 6 域加权和 = 1.0
- [x] 三层模型 + 子项 0–5 rubric 模板锁定
- [x] 信号声明 schema 与 source 白名单定义
- [x] hard-fail 规则覆盖 collector 故障与未声明 source
- [ ] 每个域单独 `benchmarks/<dim>.md` 落地（v0 提供 facade 与 docs 完整骨架，其余先占位）—— 见下游任务
- [ ] `tools/scorecard-run` 实施（implementer 任务）

## 9. 已知缺口（v0 不解）

- 时间序列趋势分（"上升" vs "停滞"）：v0 只算瞬时分；v1 引入 6 周滑窗回归。
- 跨域耦合（如 `community.launch` 提升 `caselib.adoption`）：v0 不建模；先靠 case-study 经验观察。
- 商业化分数：见 taxonomy §6 已知缺口，统一推迟。
