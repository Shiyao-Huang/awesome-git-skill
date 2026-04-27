---
id: quick-wins-playbook-001
dimension: caselib
covers:
  - facade:tagline
  - facade:demo
  - docs:quickstart
  - docs:i18n
  - community:issue-tpl
  - community:pr-tpl
  - community:discussions
  - community:release
  - community:launch
  - quality:ci-cd
  - quality:dx
  - caselib:adoption
  - tooling:metrics-fetch
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# quick wins playbook

## 1. 维度定义
`quick-wins` 不是第 7 个新维度，而是把 Tier-1 爆发项目里“本周就能改、且最可能提升理解率/试用率/协作效率”的动作压缩成一张清单，帮助维护者先拿到高 ROI 增长收益，再决定要不要做更重的系统建设。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库只能靠口头解释项目价值；README 首屏没有清晰定位、没有 demo、没有 quickstart、没有 issue/PR 模板，访客 star 之后无下一步动作。 |
| 1 | 项目已做零散优化（如加了截图或徽章），但入口仍混乱：价值主张抽象、安装路径分叉、支持/bug/功能请求混在一起，维护者靠人工解释兜底。 |
| 2 | 至少补齐了首屏定位、1 个 demo 资产或 1 条 quickstart 路径中的两项；同时开始收口 issue/PR 模板或发布节奏，但还没有把这些动作串成稳定默认流程。 |
| 3 | 已完成 ≥5 条本剧本动作：首屏定位可读、quickstart 收敛、issue/PR intake 成型、至少 1 个社区承接入口明确、发布或指标观测开始留痕；用户首次试用和维护者首次 triage 明显更顺。 |
| 4 | 已完成 ≥8 条本剧本动作，并且每条都能找到仓库内或 API 层面的证据：README/官网/模板/工作流/metrics 互相一致；外部访客不需要 DM maintainer 也能完成试用、提问、提 PR 或验证项目活跃度。 |
| 5 | Quick wins 已被产品化成默认系统：hero/quickstart/demo/模板/release/metrics/showcase 全部结构化、可复查、可复制；维护者每次发版只需填充少量新信息，不再靠临场补洞。 |

## 3. 头部项目实践占位
- [ ] openclaw: 待 case-study 填充
- [ ] everything-claude-code: 待 case-study 填充
- [ ] andrej-karpathy-skills: 待 case-study 填充
- [ ] mirofish: 待 case-study 填充
- [ ] oh-my-openagent: 待 case-study 填充
- [ ] worldmonitor: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 把 README 首屏改成“用户结果 + 对标对象/旧做法”的一句话定位，优先写用户马上能得到什么，而不是内部架构名词。`[facade:tagline]`
  *为什么：OpenClaw 的“现实动作型 assistant”、WorldMonitor 的“开源 Palantir”、Oh My OpenAgent 的“反锁定 harness”都先卖结果与身份，再卖实现细节。*
  *参考案例：[`openclaw.md`](../case-studies/openclaw.md)、[`worldmonitor.md`](../case-studies/worldmonitor.md)、[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)*
- [ ] 把 live demo、30 秒 GIF、截图或公开视频提前到 README 半屏之内；先让用户看见结果，再讲架构。`[facade:demo]`
  *为什么：对抽象或新奇产品，先讲技术栈会损失理解率；MiroFish 与 OpenClaw 都是先演示“能做到什么”，再展开系统细节。*
  *参考案例：[`mirofish.md`](../case-studies/mirofish.md)、[`openclaw.md`](../case-studies/openclaw.md)、[`worldmonitor.md`](../case-studies/worldmonitor.md)*
- [ ] 在 README 首屏只保留 1 条主 quickstart 路径，并把更深的 guide / matrix / docs 下沉到次级入口。`[docs:quickstart]`
  *为什么：Everything Claude Code 与 andrej-karpathy-skills 都把“先装起来”放到最短路径，深方法论另行承接，从而降低首次试用摩擦。*
  *参考案例：[`everything-claude-code.md`](../case-studies/everything-claude-code.md)、[`andrej-karpathy-skills.md`](../case-studies/andrej-karpathy-skills.md)*
- [ ] 如果项目天然会被 agent 或脚本调用，把安装文档显式拆成 Humans / Agents 两条路径，并写死运行时版本、provider flags、必需环境变量。`[docs:quickstart]` `[quality:dx]`
  *为什么：Oh My OpenAgent 与 MiroFish 都证明了，复杂依赖项目的最快改进不是“文案更好”，而是把环境契约写死，让人和 agent 都能少踩坑。*
  *参考案例：[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)、[`mirofish.md`](../case-studies/mirofish.md)*
- [ ] 只要目标市场跨语言，就立即补第二语言 README 或关键 quickstart 镜像，不要等“成熟后再翻译”。`[docs:i18n]` `[community:seo]`
  *为什么：MiroFish、andrej-karpathy-skills、Everything Claude Code 都在高增长窗口提前铺双语/多语入口，直接扩大分发面与搜索面。*
  *参考案例：[`mirofish.md`](../case-studies/mirofish.md)、[`andrej-karpathy-skills.md`](../case-studies/andrej-karpathy-skills.md)、[`everything-claude-code.md`](../case-studies/everything-claude-code.md)*
- [ ] 为 bug / feature / usage 拆分 issue 模板，并要求最小证据集（版本、复现步骤、doctor 输出、影响描述）；高噪声支持问题要路由到更合适的社区入口。`[community:issue-tpl]` `[community:discussions]`
  *为什么：OpenClaw、Oh My OpenAgent、Everything Claude Code 都把 issue intake 做成结构化协议，高增长期靠模板而不是 maintainer 记忆力保住信噪比。*
  *参考案例：[`openclaw.md`](../case-studies/openclaw.md)、[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)、[`everything-claude-code.md`](../case-studies/everything-claude-code.md)*
- [ ] 给 PR 加固定模板，强制收集 testing、impact、rollback/verification、docs 变更与 related issue，不要接受“自由文本 PR”。`[community:pr-tpl]` `[quality:dx]`
  *为什么：这一步对维护者 ROI 很高——它马上减少 review 往返、提升首贡献者成功率，也让后续自动化校验更容易接入。*
  *参考案例：[`openclaw.md`](../case-studies/openclaw.md)、[`everything-claude-code.md`](../case-studies/everything-claude-code.md)、[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)*
- [ ] 在没有正式 customer wall 之前，先补一层“社会证明墙”：showcase、shoutouts、reviews、demo gallery、社区作品或 sponsor/partner 列表。`[caselib:adoption]`
  *为什么：OpenClaw 的 shoutouts/showcase、Everything Claude Code 的 badge/download 证明墙、MiroFish 的视频与机构背书都在正式案例库之前就建立了可信度。*
  *参考案例：[`openclaw.md`](../case-studies/openclaw.md)、[`everything-claude-code.md`](../case-studies/everything-claude-code.md)、[`mirofish.md`](../case-studies/mirofish.md)*
- [ ] 把 release cadence 产品化：至少让 changelog、tag-driven release、平台发布矩阵或 draft release workflow 之一可见。`[community:release]` `[quality:ci-cd]`
  *为什么：Everything Claude Code 与 Oh My OpenAgent 的高频发布让“项目还活着”成为可观察事实；没有 cadence 证据，增长往往停在首波热度。*
  *参考案例：[`everything-claude-code.md`](../case-studies/everything-claude-code.md)、[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)、[`openclaw.md`](../case-studies/openclaw.md)*
- [ ] 至少自动化一份公开 metrics 快照：stars、releases、contributors、issues/PR 活跃度中的 3 项；抓不到就显式标 `UNVERIFIED`。`[tooling:metrics-fetch]`
  *为什么：ECC 的 monthly metrics、Tier-1 全部 case study 的 evidence trail 证明了，增长认知要靠可复查信号，不要靠“最近感觉挺热”。*
  *参考案例：[`everything-claude-code.md`](../case-studies/everything-claude-code.md)、[`openclaw.md`](../case-studies/openclaw.md)、[`worldmonitor.md`](../case-studies/worldmonitor.md)*
- [ ] 明确一个支持/公开开发主渠道，并写清“什么问题去哪里”：support、showcase、RFC、roadmap、bug intake 分开。`[community:discussions]` `[community:launch]`
  *为什么：Oh My OpenAgent 的 building-in-public Discord、OpenClaw 的 Discord 承接、MiroFish 的 Discord/QQ 双入口都不是“多放几个 badge”，而是有分工的承接面。*
  *参考案例：[`oh-my-openagent.md`](../case-studies/oh-my-openagent.md)、[`openclaw.md`](../case-studies/openclaw.md)、[`mirofish.md`](../case-studies/mirofish.md)*
- [ ] 把“同一内容，多运行时封装”当成增长放大器：优先让核心规则/指南从一个母本派生成 skill、plugin、rule、模板，而不是维护多套互相漂移的文档。`[tooling:release-bot]` `[docs:examples]`
  *为什么：andrej-karpathy-skills 与 Everything Claude Code 都通过单源内容多运行时分发放大了触达面，同时降低长期维护成本。*
  *参考案例：[`andrej-karpathy-skills.md`](../case-studies/andrej-karpathy-skills.md)、[`everything-claude-code.md`](../case-studies/everything-claude-code.md)*

## 5. 反模式（≥3 条）
- ❌ 先做复杂重构、半年后再补 README/模板/quickstart。
  典型后果：最便宜的转化杠杆长期缺位，导致项目“技术上更强了，但外部看起来还是不会用”。
- ❌ 只抄头部项目的 slogan，不补 demo、quickstart、release、模板和支持路由。
  典型后果：门面过度承诺，真正试用时立刻穿帮，信任反而下降。
- ❌ 把 support、bug、feature request、community showcase 全塞进一个入口。
  典型后果：高速增长期的 triage 被噪声淹没，维护者花时间搬运上下文而不是解决问题。
- ❌ 看到 star 涨了就默认“增长策略有效”，却没有 metrics 快照、外部帖链接或前后对照窗口。
  典型后果：团队会记住漂亮故事，忘掉真正起作用的动作，下一次无法复现。
- ❌ 多语言、多运行时、多平台一起开，但没有单一母本与同步纪律。
  典型后果：文档和包装面迅速漂移，越增长越难维护。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 首屏转化要素完备率 | `gh api repos/{owner}/{repo}/readme --jq '.content' | base64 -d | sed -n '1,80p'` 检查是否同时出现 tagline、demo/截图、主 CTA、社区/社交证明 | 4 项中 ≥3 项存在，且主 CTA 仅 1 条 |
| 社区入口结构化程度 | `gh api repos/{owner}/{repo}/community/profile` + `.github/ISSUE_TEMPLATE` / `pull_request_template` 文件存在性检查 | issue 模板、PR 模板、CONTRIBUTING/入口说明中 ≥3 项存在 |
| 发布节奏可观测性 | `gh api repos/{owner}/{repo}/releases?per_page=20` + changelog/release workflow 文件检查 | 最近 90 天内有 ≥2 个可见 release，且 release 说明或 workflow 至少存在 1 项 |
| 证据化增长快照覆盖率 | `history/`、`metrics/`、或自动化 issue 中是否存在 stars/releases/contributors/issue activity 结构化记录 | 关键增长信号至少 3 项被定期留痕；缺失项显式标 `UNVERIFIED` |
| 双语/多运行时分发表面 | README 根目录镜像文件、skill/plugin/rule 入口文件存在性检查 | 若面向跨语言/跨运行时受众，至少 2 个表面保持同步可见 |

## 7. 工具与模板
- `tools/quick-wins/audit.*`：扫描 README 首屏、模板、release、metrics 是否满足本剧本最小完备度，缺项直接列出而不是给模糊建议。
- `tools/quick-wins/metrics-snapshot.*`：按仓库定时抓取 stars / releases / contributors / issue activity，抓不到就 hard-fail 或显式 `UNVERIFIED`。
- `templates/quick-wins/hero.md`：一句话定位 + 主 CTA + demo caption 的最小 hero 模板。
- `templates/quick-wins/issue-routing/`：bug / feature / usage 三类表单与 community 路由说明模板。
- `templates/quick-wins/release-checklist.md`：发版前最小检查清单，覆盖 changelog、tag、artifact、announcement、metrics snapshot。
- `templates/quick-wins/showcase.md`：在正式客户案例不足时，用 community projects / shoutouts / reviews / demos 组织 adoption 证明。
- `templates/quick-wins/i18n-sync.md`：README/quickstart/skill 描述的多语言同步清单，避免只翻译宣传页不翻 quickstart。
