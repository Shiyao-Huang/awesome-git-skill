---
id: community-playbook-001
dimension: community
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# community playbook

## 1. 维度定义
`community` 维度衡量项目能否把 star/访客稳定转化为 issue、PR、Discussions 参与者与长期贡献者，并让首次贡献路径在 7 天内可见、可进、可回流。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库没有 CONTRIBUTING、CODE_OF_CONDUCT、Issue/PR 模板或任何社区入口；新访客只能自行猜测如何提问、报告 bug 或开始贡献。 |
| 1 | 有零散社区文件，但入口分散、模板缺字段、good-first-issue 不维护；提问主要靠 README 尾部一行“有问题提 issue”，首贡献者路径仍需人工解释。 |
| 2 | Issue/PR 模板存在，且 README 或文档给出至少 1 个社区入口，但 Discussions/论坛/聊天群职责不清，提问、缺陷、需求、贡献意向混在同一个渠道里。 |
| 3 | 项目明确区分 bug / feature / question / showcase 入口，长期维护 ≥3 个 good-first-issue，并在 CONTRIBUTING 中写清 doc→code→review 的贡献阶梯，但首次贡献后的 welcome / follow-up 仍较弱。 |
| 4 | 社区入口与模板完整：Issue/PR 表单、Discussions/聊天入口、行为准则、贡献路径、自动欢迎或自动分类策略齐备；首响应时间稳定，首次贡献者能在一周内完成至少一次有效互动。 |
| 5 | 社区体系形成可复用漏斗：模板齐全、Discussions 活跃、good-first-issue 持续新鲜、首贡献路径低摩擦、行为规范明确、自动化分流稳定，且月新增贡献者、提问解决率、重复 issue 率等指标持续可观测并被用于迭代。 |

## 3. 头部项目实践占位
- [ ] n8n: 待 case-study 填充
- [ ] next.js: 待 case-study 填充
- [ ] langchain: 待 case-study 填充
- [ ] dify: 待 case-study 填充
- [ ] open-webui: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 在 `.github/ISSUE_TEMPLATE/` 下拆分 bug、feature request、question/usage 三类入口，并为每类表单设置必填字段。
  *为什么：不同请求需要不同上下文，分流越早，维护者越不需要二次追问。*
- [ ] 为 PR 建立固定模板，至少收集变更摘要、测试证据、影响面、迁移说明与 reviewer handoff 字段。
  *为什么：PR 模板是社区协作的最小协议，缺字段会直接拉长 review 周期。*
- [ ] 在 README 或 docs 首页显式区分“提问去哪里、报 bug 去哪里、展示作品去哪里、讨论 roadmap 去哪里”。
  *为什么：入口职责不清会把所有流量挤进 issue 列表，造成噪音和响应延迟。*
- [ ] 建立 `good first issue` 与 `help wanted` 标签策略，并保证至少 3 个任务长期保持可认领且最近 30 天内被维护。
  *为什么：没有持续新鲜的低门槛任务，首次贡献者即使有意愿也找不到落脚点。*
- [ ] 在 CONTRIBUTING 中写出贡献梯度：docs typo → small fix → feature PR → triage/review → maintainer。
  *为什么：贡献者需要看到成长路径，才会从一次性参与转成长期投入。*
- [ ] 在 CODE_OF_CONDUCT、SECURITY、SUPPORT/社区说明之间建立明确跳转，避免行为问题、漏洞问题与普通使用问题混线。
  *为什么：社区入口不仅是吸纳流量，也是在高压场景下保护维护者与用户。*
- [ ] 为 Discussions/论坛/Discord 设计分类与置顶帖，至少覆盖 Q&A、showcase、RFC/ideas、announcements。
  *为什么：没有分类的社区入口会迅速退化成无法搜索的聊天流。*
- [ ] 给首次 issue/PR 提交者配置欢迎语或自动回复模板，但把机器人文案控制在“下一步动作 + 资源链接”两段内。
  *为什么：欢迎消息应该降低摩擦，而不是制造模板噪音。*
- [ ] 为 triage 建立 24h/72h 响应 SLA 分层：24h 内确认、72h 内路由、长期挂起需注明等待条件。
  *为什么：首响应不是立刻解决问题，但它决定贡献者是否愿意继续留下。*
- [ ] 把重复问题沉淀回 issue template、troubleshooting、FAQ 或 Discussions 置顶，而不是只在单条回复里解释。
  *为什么：社区工作的复利来自把一次回答变成以后都能复用的入口。*
- [ ] 每月手动回看一次“新增贡献者 → 二次贡献者 → triage/helper”链路，并记录在哪一环大量流失。
  *为什么：没有漏斗回顾，社区优化会停留在感觉层面而无法校正。*
- [ ] 为社区入口设置最少量的可观测日志/统计面：新 issue 类型分布、Discussion 活跃分类、good-first-issue 认领情况。
  *为什么：社区维度同样需要可观测性，否则无法判断分流设计是否真的生效。*

## 5. 反模式（≥3 条）
- ❌ 把 bug、功能请求、使用问题、招聘、showcase 全都塞进一个 issue 模板或一个聊天群。
  典型后果：维护者需要在入口处做大量人工 triage，响应时间和情绪成本同时恶化。
- ❌ `good first issue` 标签长期挂在陈旧、上下文不完整或实际需要核心上下文的任务上。
  典型后果：首次贡献者被“欢迎入口”反向劝退，社区可信度下降。
- ❌ PR 模板只要求“描述你的改动”，不收测试证据、影响面或回滚说明。
  典型后果：review 往返次数上升，首贡献者在流程里迷路。
- ❌ 只靠 Discord/群聊承接所有问题，不把高频答案沉淀回仓库可搜索入口。
  典型后果：知识被聊天流吞没，新的用户重复问、老的维护者重复答。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 社区入口覆盖率 | `gh api repos/{owner}/{repo}/contents/.github`、`gh api repos/{owner}/{repo}/contents/CONTRIBUTING.md`、`gh api repos/{owner}/{repo}/community/profile` | Issue 模板、PR 模板、CONTRIBUTING、CODE_OF_CONDUCT、社区入口 5 项中 ≥4 项存在 |
| `good first issue` 新鲜度 | `gh issue list --repo {owner}/{repo} --label "good first issue" --state open --limit 50 --json updatedAt,title,url` | 开放中的 `good first issue` ≥3，且至少 3 个在最近 30 天内更新 |
| 首响应中位时间 | `gh api graphql -f query='query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ issues(first:50,states:OPEN,orderBy:{field:CREATED_AT,direction:DESC}){ nodes{ createdAt comments(first:1){ nodes{ createdAt author{ login } } } } } } }' -F owner={owner} -F name={repo}` | 维护者首条回复中位时间 ≤ 72h |
| Discussions 活跃度 | `gh api graphql -f query='query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ discussions(first:50,orderBy:{field:UPDATED_AT,direction:DESC}){ nodes{ category{ name } updatedAt answerChosenAt } } } }' -F owner={owner} -F name={repo}` | 最近 30 天有更新的 Discussions ≥10，且 Q&A 类 answer-chosen 比例 ≥50% |
| 首贡献者转化量 | `gh api repos/{owner}/{repo}/contributors?per_page=100` + `gh search prs --repo {owner}/{repo} --author-date ">=$(date -v-30d +%F)" --json author` | 最近 30 天首次贡献者 PR ≥5（成熟项目）或环比不下降 |

## 7. 工具与模板
- `tools/community/funnel.*`：把 star→issue→PR→repeat contributor 的社区漏斗汇总成低噪音周报。
- `tools/community/triage-bot.config.*`：Issue 自动分类规则，按 bug/feature/question/duplicate 路由而非硬编码分支。
- `tools/community/welcome-bot.config.*`：首次 issue/PR 欢迎语配置文件，支持按事件类型选择模板并保留开关。
- `tools/community/gfi-audit.*`：扫描 `good first issue` 的数量、更新时间与标签漂移，缺口直接报错或告警。
- `templates/community/issue-form-bug.yml`：Bug 报告模板，固定环境、复现步骤、预期结果、最小复现字段。
- `templates/community/issue-form-feature.yml`：需求模板，固定用户场景、替代方案、验收信号字段。
- `templates/community/pr-template.md`：PR 模板，统一收集测试证据、影响面、迁移说明、review handoff。
- `templates/community/discussions-routing.md`：Discussions/Discord/论坛分类与入口说明模板，避免不同渠道职责漂移。
