---
id: case-library-playbook-001
dimension: caselib
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
covers:
  - caselib:head
  - caselib:scorecard
  - caselib:h2h
  - caselib:metrics
  - caselib:adoption
---

# case-library playbook

## 1. 维度定义
`case-library` 维度衡量项目能否把“有人在真实环境里持续使用它”变成**可公开核验、可分层复用、可持续更新**的证据库：不仅有 logo 和故事，还要能证明部署场景、迁移背景、采用规模、来源可信度与后续复算能力。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库没有任何公开案例、用户名单、迁移故事或部署证据；访客只能从 star 数和 README 自述猜测是否真的有人在生产使用。 |
| 1 | 有零散“谁在用我们”描述或 logo，但缺公开来源、缺时间锚点、缺案例分层；很多证据来自私人聊天、演讲口头提及或无法回溯的截图。 |
| 2 | 项目开始维护公开案例页或 blog 汇总，并能列出若干已知用户/部署故事，但案例格式不统一，迁移背景、使用规模、证据可信度与更新时间大多缺失。 |
| 3 | 项目拥有统一的案例模板，至少能区分 head case、adoption evidence、h2h 对比与指标快照；每条公开案例都附来源 URL 或明确 `UNVERIFIED` 标识，但更新节奏、覆盖广度与横向复算仍不稳定。 |
| 4 | 项目持续维护公开案例库：既有 named adopters、生产部署/迁移故事，也有横向对比、采用证据分级、指标快照与 freshness 规则；案例能被 playbook、benchmark、scorecard 直接复用，证据失效会被显式暴露。 |
| 5 | 项目把案例库做成“证据系统”而非“宣传页”：≥20 个具名采用证据、≥5 个深入 case-study、≥2 个迁移/替代故事、清晰的 adoption/source credibility 分层、可复算 metrics 与 h2h 决策文档齐备，且所有事实都能追溯到公开来源或审计级 `UNVERIFIED` 标记。 |

## 3. 头部项目实践占位
- [ ] n8n: 待 case-study 填充
- [ ] next.js: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] langchain: 待 case-study 填充
- [ ] open-webui: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 为案例库定义统一 front-matter 与章节模板，要求项目名、repo URL、stars 快照、license、6 域覆盖、来源清单全部显式填写。
  *为什么：案例一旦没有统一 schema，就无法被 benchmark、scorecard 和后续工具稳定消费。*
- [ ] 把案例来源按证据等级分层：官方自述、第三方报道、用户公开部署、私人渠道线索，并规定只有前 3 类可默认上线。
  *为什么：case-library 的核心不是“多”，而是“可审计”；来源等级不分层就会把传闻混成事实。*
- [ ] 为每个 named adopter 或 logo 增加公开来源 URL 与抓取日期，禁止只贴 logo 而没有出处。
  *为什么：logo 墙最容易沦为不可核验的宣传素材，必须让每个 logo 都能回链到公开证据。*
- [ ] 为迁移故事单独记录“从什么迁出、为什么迁、迁移成本/收益、证据时间点”，不要把迁移故事混在一般用户故事里。
  *为什么：迁移案例是高意图用户最关心的决策证据，粒度必须独立。*
- [ ] 在案例正文中显式区分“部署规模/业务结果/采用人数”三类量化信息，并要求每一类都绑定 `[s?]` 或 `UNVERIFIED`。
  *为什么：很多案例会把概念性好评包装成规模证据，拆分字段才能避免误读。*
- [ ] 为 head case、adoption evidence、h2h、metrics 建立最小 freshness 规则（如 30/90/180 天），过期即标 stale 或待复核。
  *为什么：案例库不是一次性收集，时间失效会直接侵蚀说服力。*
- [ ] 为每个项目维护“不可公开写”的证据边界：私人访谈、Sales 口径、内部合同、未公开截图，一律记为 `UNVERIFIED` 或留在私有笔记。
  *为什么：案例库最容易越过合规边界，提前写清禁止区比事后删稿更安全。*
- [ ] 为 adoption 证据建立最少字段：采用方名称、采用场景、证据链接、首次观察时间、最近复核时间、证据类型。
  *为什么：只有字段固定，后续才能做 named adopter 计数与来源可信度审计。*
- [ ] 把横向对比（h2h）与单项目案例分开存放，并要求 h2h 文档明确“什么条件下选 A / 选 B / 两者都不该选”。
  *为什么：单项目案例解决“谁在用”，h2h 解决“我该怎么选”，两者用途不同。*
- [ ] 为 metrics 快照建立 dated 输出规范，禁止覆盖历史 JSON，确保 case-study 中引用的数字都能回放到对应时间点。
  *为什么：没有时间序列，案例库就无法解释指标变化，也无法支持 replay drift 检查。*
- [ ] 为案例库建立失效巡检清单：坏链、归档文章、404 logo、证据内容改版、项目重命名，都要有定期检查路径。
  *为什么：案例库衰败往往不是因为没有新案例，而是旧证据默默失效。*
- [ ] 为“公开证据不足但价值很高”的项目准备 `UNVERIFIED` 上线模板，允许保留线索但不把它包装成已证实案例。
  *为什么：hard-fail 不代表信息要消失，而是要以诚实的方式保留下来等待复核。*

## 5. 反模式（≥3 条）
- ❌ 只做 logo 墙，不给任何公开来源、时间锚点或案例深链。
  典型后果：看起来热闹，但一旦被追问“证据在哪”，整个案例库可信度立刻坍塌。
- ❌ 把私人聊天、售前口径、演讲截图直接写成“某公司已生产使用”。
  典型后果：违反 hard-fail 与合规边界，后续无法审计也无法对外复述。
- ❌ 用 star 数、GitHub trending、社交讨论量替代真实采用证据。
  典型后果：把“关注度”误当“生产采用”，导致 playbook 建议偏向营销而非证据。
- ❌ 让单项目 case-study、横向对比、metrics 快照和 marketing 口号写在同一篇文档里。
  典型后果：后续既不能稳定索引，也无法判断哪部分能被 benchmark 或 scorecard 复用。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 具名案例数量 | `rg -n '^project:' case-studies/*.md` + front-matter `status=ratified` 过滤；后续可由 `tools/scorecard-run.ts` 读取 `benchmarks/caselib.md` 中 `caselib.head.case_count` | ratified case-study ≥ 8 |
| 采用证据来源可信度 | `benchmarks/caselib.md` 中 `caselib.adoption.source_credibility` manual rubric + 公开来源抽样复核 | 至少达到 3 分（≥一半为第三方或可量化公开证据） |
| metrics 快照新鲜度 | `find metrics -type f -name '*.json' -print` 配合 mtime / dated 路径，或后续 `tools/scorecard-run.ts` 读取 `caselib.metrics.snapshot_age_days` | 最大快照年龄 ≤ 30 天 |
| 具名采用方数量 | `tools/scorecard-run.ts --config ...` 读取 `caselib.adoption.named_user_count`，或临时 `rg -o '^[^-].*\[s[0-9]+\]' case-studies/*.md` 抽样人工统计 | named adopters ≥ 10 |
| 复算漂移 | `tools/scorecard-run.ts` 同一 commit 连跑两次，读取 `caselib.scorecard.replay_dimension_drift` | drift ≤ 2.0，否则 hard-fail |

## 7. 工具与模板
- `templates/case-study.md`：单项目案例统一模板，作为 head/adoption 证据的唯一结构契约。
- `case-studies/EXAMPLE.md`：最小可信样例，用于校验字段、章节与 `UNVERIFIED` 纪律，而不是长期宣传材料。
- `tools/index.ts`：front-matter 索引器；应把 case-library playbook 与 case-study 文件作为双向契约一起校验。
- `tools/scorecard-run.ts`：消费 `benchmarks/caselib.md` 中的 head/scorecard/h2h/metrics/adoption 信号，避免案例库自我漂白。
- `tools/case-library/logo-wall.*`：根据公开证据清单拼装 logo 墙，输出时强制保留 source manifest。
- `tools/case-library/source-audit.*`：定期检查案例链接、证据日期、404 与 stale 标记，发现失效即低噪音报错。
- `templates/case-library/consent-and-evidence.md`：记录“可公开 / 不可公开 / 待复核”边界，避免私人渠道信息误上线。
