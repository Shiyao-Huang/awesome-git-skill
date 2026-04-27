---
id: growth-playbook-001
dimension: community
covers:
  - community:launch
  - community:funnel
  - caselib:adoption
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# growth playbook

## 1. 维度定义
`growth` 维度衡量项目能否把一次性发布变成可复用的增长系统：用可验证的渠道组合、发布时间窗、社交资产、响应动作和留存信号，把“被看到”稳定转成“被试用、被讨论、被持续贡献”。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 项目从未做过可识别的公开 launch，或只有零散转发；没有渠道清单、没有发布时间记录、没有任何发布后数据回看。 |
| 1 | 偶尔在单一渠道发帖，但文案直接复制粘贴到所有平台；没有针对 HN / PH / X / Reddit / 中文社区的格式适配，也没有 launch 后响应负责人。 |
| 2 | 至少尝试过 1-2 个公开渠道，并保存了部分链接或截图，但发布时间凭感觉决定，社交资产不成套，发完就结束，没有对 star、issue、PR 或讨论活跃度做回看。 |
| 3 | 能围绕一次版本或里程碑组织 ≥2 个渠道的发布动作，具备基本的 copy 模板、素材包和复盘表；会记录 launch 当日星标变化或讨论反馈，但后续留存、转化和衍生内容节奏仍不稳定。 |
| 4 | 重要发布默认覆盖 ≥3 个主渠道，且每个渠道有定制标题/首评/素材/发布时间窗；launch 后有 24h/72h/7d 跟进动作，并用可验证信号回看 star 增量、讨论活跃度、活跃 issuer/PRer 或 demo 访问。 |
| 5 | 项目拥有可重复调用的发布系统：渠道矩阵、时区窗口、素材模板、KOL/社区触达清单、响应 SLA、复盘模板与留存指标全部成文并持续迭代；每次 launch 都能留下可审计证据，且发布后活跃度与贡献信号能被数据证明而非凭印象叙述。 |

## 3. 头部项目实践占位
- [ ] ollama: 待 case-study 填充
- [ ] n8n: 待 case-study 填充
- [ ] dify: 待 case-study 填充
- [ ] open-webui: 待 case-study 填充
- [ ] shadcn-ui: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 为每次重要发布建立一张渠道矩阵，至少列出 HN、Product Hunt、X、Reddit、即刻、V2EX、掘金中的适用渠道、受众、内容形态、负责人和归档位置。
  *为什么：增长动作一旦不结构化，就会退化成“想起来就发”，无法复制也无法复盘。*
- [ ] 为每个渠道分别写标题/正文/首评模板，不允许把同一段 copy 原样贴到所有平台。
  *为什么：HN、PH、X、Reddit 与中文社区的阅读习惯、标题容忍度和互动方式都不同，硬复制会显著拉低命中率。*
- [ ] 维护一份按 UTC 与目标市场本地时区表达的发布时间窗矩阵，并在每次发布后记录“实际发帖时间 + 选择原因 + 结果”。
  *为什么：时间窗如果不记录，就无法区分内容问题与发布时间问题。*
- [ ] 在 launch 前准备完整素材包：OG 图、截图、GIF/短视频、1 句 tagline、1 段价值主张、1 个主 CTA、FAQ 短答。
  *为什么：增长不是只靠一条帖子，素材复用能力决定你能否覆盖多个分发面。*
- [ ] 让 try-it/demo/quickstart 链接在 launch 前做一次手工验证，并把每个链接的目标页面和限制条件写进发布清单。
  *为什么：发布当天最常见的增长自伤不是“没人看见”，而是“看见后点进去不能用”。*
- [ ] 为首波评论和常见质疑准备 responder notes：支持的平台、部署门槛、许可证、与替代方案差异、当前限制。
  *为什么：首批评论经常决定围观者是否继续停留，响应质量会直接影响帖子的二次分发。*
- [ ] 给 launch 日设置明确响应班表，覆盖至少前 6 小时与 24 小时窗口，并指定谁负责 HN/PH/X/Reddit/中文社区回帖。
  *为什么：发布后的回复延迟会快速吞掉本来能够放大的讨论势能。*
- [ ] 把“发布完成”的定义从发帖改成归档：每个外部帖子的 URL、截图、发布时间、主要评论与结果都进入 `research/` 或 `metrics/` 记录。
  *为什么：没有证据沉淀的 launch 经验无法进入团队方法论，只会在聊天记录里蒸发。*
- [ ] 为 launch 后的 24h / 72h / 7d 设计固定跟进动作，例如总结贴、FAQ 更新、README 补强、demo 修正、二次分发版本。
  *为什么：大多数增长不是单日爆发，而是首波讨论后的连续放大与修正。*
- [ ] 对中文社区单独维护本地化表达，不直接搬运英文标题、emoji 密度和社区黑话。
  *为什么：中文社区用户对“翻译腔”和过度营销的容忍度更低，不做本地化往往直接损失转化。*
- [ ] 为 KOL / 维护者 / 友好项目准备一份可验证的触达名单，只保留真正与场景相关的人和社区。
  *为什么：冷启动触达如果没有选择标准，会迅速变成低质量群发并损伤长期关系。*
- [ ] 定义 launch 后至少 3 个留存信号，并固定采集窗口，例如 72h star delta、7d active issuer、7d 新 PR 作者数。
  *为什么：只看帖子曝光或点赞会高估“热闹”，而忽略真正进入社区与贡献漏斗的人。*
- [ ] 当任何渠道数据、榜单结果或截图无法复核时，在复盘里显式标记 `UNVERIFIED`，不要补写“应该当时表现不错”。
  *为什么：增长团队最容易被幸存者叙事污染，诚实标注比漂亮故事更有复用价值。*

## 5. 反模式（≥3 条）
- ❌ 把“发帖”当成 launch 的全部工作，发完就结束。
  典型后果：首波流量没有被接住，仓库访问、试用与讨论无法沉淀成后续贡献者。
- ❌ 不分渠道地复制同一标题、同一正文、同一素材。
  典型后果：每个平台都像外来广告，既拿不到算法扩散，也拿不到社区信任。
- ❌ 只晒 star 截图，不记录帖子 URL、发布时间、评论与后续活跃度。
  典型后果：团队只能记住“那次好像爆了”，却无法知道究竟是题材、渠道、时间还是响应动作起作用。
- ❌ 在 try-it/demo 还不稳定时强推 launch。
  典型后果：短期曝光换来长尾负反馈，后续再次发布时信任成本更高。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| Launch 渠道覆盖数 | `grep -c '^channel:' research/launch/<project>-<date>.md` 或同等结构化发布记录 | 每次重要 launch 覆盖 ≥3 个主渠道，且每条都有可复核 URL/截图 |
| HN / Reddit 可检索线程存在率 | `curl -s 'https://hn.algolia.com/api/v1/search?query=<project>&tags=story'` + `curl -A 'Mozilla/5.0' -s 'https://www.reddit.com/search.json?q=<project>'` | 目标 launch 至少在一个外部社区留下可检索公开线程 |
| 72h star delta | `gh api repos/{owner}/{repo}` 在 launch 前后快照落盘到 `metrics/launch/<date>.json` 后做差 | 重要 launch 的 72h star 增量 > 发布前 72h 基线 |
| 7d 活跃 issuer / PR 作者数 | `gh search issues 'repo:<owner>/<repo> is:issue created:>=<launch_date>' --json author` 与 `gh search prs 'repo:<owner>/<repo> created:>=<launch_date>' --json author` | launch 后 7d 活跃 issue/PR 作者数 ≥ 发布前对照窗口 |
| 社交预览就绪率 | `curl -sL <project-site-or-docs-root> | grep -Ei 'og:image|twitter:card'` | 每次对外 launch 前 `og:image` 与 `twitter:card` 双齐备 |

## 7. 工具与模板
- `tools/launch/checklist.*`：按渠道矩阵生成 launch 前检查清单，输入渠道、时区、素材、CTA 与负责人，输出可复用 checklist。
- `tools/launch/copy-pack.*`：为 HN / PH / X / Reddit / 中文社区生成平台差异化文案模板，保留配置项而非硬编码单一语气。
- `tools/launch/window-matrix.*`：维护发布时间窗矩阵与复盘结果，支持按渠道、时区、地区市场更新，不把“最佳时间”写死在文档里。
- `tools/launch/archive.*`：抓取并归档外部发帖 URL、截图与发布时间；抓不到就显式返回 `UNVERIFIED`。
- `tools/launch/retention-diff.*`：对比 launch 前后 72h/7d 的 star、issue、PR 活跃度，输出低噪音摘要。
- `templates/launch/runbook.md`：发布 runbook 模板，预置主叙事、渠道矩阵、负责人、响应班表与复盘字段。
- `templates/launch/faq.md`：常见评论与质疑答复模板，统一项目定位、许可、限制与替代方案对比的表达。
