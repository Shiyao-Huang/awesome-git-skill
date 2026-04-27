---
id: case-oh-my-openagent
project: Oh My OpenAgent
repo_url: https://github.com/code-yeongyu/oh-my-openagent

star_count: 54335
star_count_at: "2026-04-27"
star_source: gh-api

forks_count: 4415
open_issues_count: 662
license_spdx: NOASSERTION
last_push_at: "2026-04-27T04:58:34Z"

category: dev-tool

dimensions_covered:
  - facade
  - docs
  - community
  - quality
  - caselib
  - tooling

status: draft
last_verified_at: "2026-04-27"

sources:
  - id: s1
    url: https://api.github.com/repos/code-yeongyu/oh-my-openagent
    captured_at: "2026-04-27"
    type: github
    note: 仓库 snapshot（stars/forks/issues/license/created_at/pushed_at/homepage/default_branch）
  - id: s2
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/README.md
    captured_at: "2026-04-27"
    type: github
    note: README hero、定位、badge、社区入口、reviews、installation、highlights
  - id: s3
    url: https://ohmyopenagent.com/
    captured_at: "2026-04-27"
    type: docs-site
    note: 官网 title / og / twitter metadata，验证对外定位与社交首图
  - id: s4
    url: https://api.github.com/repos/code-yeongyu/oh-my-openagent/releases?per_page=30
    captured_at: "2026-04-27"
    type: github
    note: stable release 数量与节奏（最近 30 个 release，中位间隔约 1 天）
  - id: s5
    url: https://api.github.com/repos/code-yeongyu/oh-my-openagent/contributors?per_page=100&anon=1
    captured_at: "2026-04-27"
    type: github
    note: contributors API（Link header last=3，合计约 300 个 login/bot/anonymous contributor）
  - id: s6
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/ci.yml
    captured_at: "2026-04-27"
    type: github
    note: CI：test/typecheck/build、PR 禁止直投 master、draft release on dev
  - id: s7
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/publish.yml
    captured_at: "2026-04-27"
    type: github
    note: semver 校验、双包 npm publish、release automation
  - id: s8
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/publish-platform.yml
    captured_at: "2026-04-27"
    type: github
    note: 多平台二进制发布矩阵（darwin/linux/windows）
  - id: s9
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/ISSUE_TEMPLATE/bug_report.yml
    captured_at: "2026-04-27"
    type: github
    note: bug 模板要求英文、去重、最新版本、doctor 输出
  - id: s10
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/pull_request_template.md
    captured_at: "2026-04-27"
    type: github
    note: PR 模板要求 summary/changes/testing/issues
  - id: s11
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/package.json
    captured_at: "2026-04-27"
    type: github
    note: package 名、版本、SUL-1.0、bin、依赖、build/test/typecheck scripts
  - id: s12
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/docs/guide/installation.md
    captured_at: "2026-04-27"
    type: github
    note: humans/LLM agents 双路径安装、provider flags、telemetry、curl 强约束
  - id: s13
    url: https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/LICENSE.md
    captured_at: "2026-04-27"
    type: github
    note: LICENSE.md 明示 Sustainable Use License 1.0
  - id: s14
    url: https://star-history.com/#code-yeongyu/oh-my-openagent&Date
    captured_at: "2026-04-27"
    type: star-history
    note: 历史增长曲线
---

# Oh My OpenAgent

## §1 一句话定位 + 目标用户
Oh My OpenAgent 是一个把 Claude Code、Codex、OpenCode 与多模型 orchestration 包进同一工作流的 agent harness，面向已经在用 AI coding、但不想被单一模型或单一编辑器锁死的开发者与小团队。[s2][s3]

## §2 关键数据表

| 字段 | 值 | 来源 |
|------|----|------|
| Stars | 54,335 @ 2026-04-27 | [s1] |
| Forks | 4,415 @ 2026-04-27 | [s1] |
| Open Issues | 662 @ 2026-04-27 | [s1] |
| License | NOASSERTION（repo API）；LICENSE.md 明示 Sustainable Use License 1.0 | [s1][s13] |
| Last Push | 2026-04-27T04:58:34Z | [s1] |
| Star History URL | https://star-history.com/#code-yeongyu/oh-my-openagent&Date | [s14] |
| First Commit（proxy） | 2025-12-03（repo created_at 代理） | [s1] |
| Contributors | 200-1k bucket（`anon=1`，Link header 显示 3 页，共约 300 个 contributor） | [s5] |
| Homepage | https://ohmyopenagent.com/ | [s1][s3] |
| Release Cadence | 最近 30 个 stable release，中位间隔约 1.0 天 | [s4] |

## §3 6 域评估

### 3.1 facade — 门面 / 第一印象
这个项目的门面做得极强，不是“一个插件 README”，而是完整的世界观包装。README 顶部先放“Building in Public”与 Discord 直播开发入口，再叠加 Sisyphus Labs 品牌图、Discord/X/GitHub Follow 三个社区入口、hero 图、preview 图，以及一整组 release / npm downloads / contributors / forks / stars / issues / license badges。[s2] 这让访客在进入细节前，先感受到“它在活着、有人在用、并且已经形成社群”。[s2]

第二层门面是明确的反锁定叙事。README 直接写“Claude Code's a nice prison, but it's still a prison”并强调“we ride every model”；官网 title 与 og/title 也统一成 “The Best Agent Harness”。[s2][s3] 这种强对抗式 tagline 对 AI-native wave 非常有效，因为目标用户天然已经在多个模型、多个 harness 间切换，项目不是在卖抽象“AI productivity”，而是在卖“从单一 provider 迁移出来”的身份认同。[s2][s3]

### 3.2 docs — 文档与上手
Oh My OpenAgent 的文档策略是把上手路径按人类与 agent 强行拆开。README 的 Installation 区明确分成 “For Humans” 和 “For LLM Agents”，前者让用户把安装指南贴给 agent，后者要求 agent 必须用 `curl` 拉原始文档、不能用会摘要丢信息的 fetch。[s2][s12] 这不是普通 quickstart，而是把“安装文档也给 agent 看”设计成默认路径。

安装指南进一步把 provider flags、订阅问答、OpenCode 前置、doctor 校验、认证流程全部写成执行步骤，甚至明确提醒当用户没有 Claude 订阅时某些 agent 会退化。[s12] 这类写法的价值在于：它不是把功能列成 marketing bullets，而是把复杂配置转成了 agent 可照做的脚本化说明，极其贴近真实使用场景。[s12]

此外，README 至少显式提供 English / 한국어 / 日本語 / 简体中文 版本入口，说明团队在 5 个月不到的窗口内已把多语言文档纳入核心面，而不是“增长后再翻译”。[s2] 对 2–6 月爆发项目来说，这种 i18n 提前铺开本身就是增长基础设施的一部分。[s2]

### 3.3 community — 社区与增长
社区面最醒目的点是它把“公开开发”做成了增长表面。README 顶部不只是丢一个 Discord 链接，而是明确告诉你所有 feature、fix、issue triage 都在 Discord 的 `#building-in-public` 里发生。[s2] 这把社区从“售后支持渠道”变成了“增长内容渠道”。

协作规范也做得很重。bug 模板要求英文、去重、最新版本、文档检索与 `bunx oh-my-opencode doctor` 完整输出；PR 模板要求 summary/changes/testing/related issues，并默认执行 `bun run typecheck` 与 `bun test`。[s9][s10] 这类模板直接把贡献者漏斗前几步标准化了，减少维护者在 triage 上的认知浪费。[s9][s10]

发布节奏则是社区活力的第二证据。最近 30 个 stable releases 的中位间隔约 1 天，说明项目几乎是日更 ship；再叠加 54K stars / 4.4K forks / 300 左右 contributors，可以把它视作“高频 ship + 高频围观 + 高频参与”同时存在的增长模型。[s1][s4][s5] 这正是 2–6 月爆发样本和旧时代“半年发一次大版本”项目的差异。[s1][s4]

### 3.4 quality — 代码与发布质量
质量层面，Oh My OpenAgent 的可见强项是把兼容性与发布链路工程化了。CI workflow 分 test / typecheck / build 三段，PR targeting `master` 会被直接挡回 `dev`，构建产物会校验 `dist/index.js` / `dist/index.d.ts` 是否存在，并在 `dev` push 时自动维护 draft release。[s6] 这意味着质量把关不是“靠 maintainer 记得做”，而是流程层强制执行。[s6]

发布链路也很完整。`publish.yml` 先验证 semver、检查 npm 上是否已发布、再分别发布 `oh-my-opencode` 与 `oh-my-openagent` 两个包名；`publish-platform.yml` 还覆盖 darwin/linux/windows 多平台二进制包，带输入校验、已发布检查与 11 平台并行构建。[s7][s8] 这对一个 agent harness 项目很关键，因为如果只会在 maintainer 的 macOS + Bun 环境里跑，它就不可能形成今天这种 star 增速。[s7][s8]

这一域的主要短板也很清楚：仓库根目录没有标准 `SECURITY.md` 公共披露入口（对应 raw path 404），所以公开安全响应路径不如其 release/CI 路径那样成熟。[s7][s13] 对一个强调多模型、多 provider 与本地执行的项目来说，这是后续可补的治理缺口，而不是无关痛痒的小问题。

### 3.5 caselib — 案例库与基准
这个项目没有传统 B2B 式的 customer wall，但它有另一类更适合 developer tooling 的公开背书：README 的 Reviews 区直接堆了来自 X、YouTube 与用户反馈的公开评价，包括“取消 Cursor 订阅”“一夜重构 45k 行应用”“一天解决 8000 个 eslint warnings”等使用结果叙述。[s2] 对 agent harness 这种开发者工具，真实用户叙述往往比企业 logo 更能触发转化。[s2]

此外，官网与 README 都把自己定位为 ecosystem 层，而不仅是单仓工具：官网写 “batteries-included agent that codes like you”，README 则把多模型 orchestration、discipline agents、LSP、AST-Grep、Tmux、MCP 组合成一整套“已经被测试过的工作方式”。[s2][s3] 这类公开 proof 更偏“使用效果”与“生态信号”，而不是“谁是付费客户”。

因此在 caselib 域，正确读法不是问“它有没有 customer wall”，而是问“它有没有足够多的公开使用结果和社群背书”。答案是有；但如果要求命名企业、生产部署规模、行业 logo 墙，则当前应记为 `UNVERIFIED: public repo/homepage emphasize public reviews and ecosystem proof, not named enterprise deployment cases`。[s2][s3]

### 3.6 tooling — 工程效率工具
Tooling 本身就是 Oh My OpenAgent 的核心卖点。README Highlights 把 `ultrawork`、Discipline Agents、IntentGate、Hash-Anchored Edit Tool、LSP + AST-Grep、Background Agents、Built-in MCPs、Todo Enforcer、Comment Checker、Tmux Integration 等能力直接列成产品面。[s2] 这不是附属工具列表，而是对“怎样让 agent 真能持续做完事”的整体工具栈包装。[s2]

`package.json` 也验证了这不是 PPT 能力：bin 同时暴露 `oh-my-opencode` 与 `oh-my-openagent`，脚本层有 build/build:all/build:schema/test/typecheck/prepublishOnly，依赖里有 MCP SDK、AST-Grep、PostHog 等，说明它确实把 agent runtime、重写工具、遥测与发布流程装进了一个可分发 package。[s11]

再加上 `publish-platform.yml` 的多平台二进制发布矩阵，可以看出团队把“让 agent harness 到处能装、到处能跑”当作 tooling 基线，而不是仅仅在 README 里喊多模型、多工具。[s8][s11] 这也是它能在 5 个月内冲到 54K+ stars 的现实原因之一：卖点不是抽象地说“更聪明”，而是把一整套 developer reality 打包成开箱可用工具面。[s2][s8][s11]

## §4 可复用经验
1. **把门面从“项目说明”升级成“公开开发 + 反锁定叙事 + badges 证明墙”** —— README 首屏同时承载 community、brand、trust 与 anti-lock-in 价值主张，明显提升了第一眼转化密度。[s2][s3] 映射 `[facade:hero]` `[facade:badges]` `[facade:tagline]`。
2. **文档按 Humans / LLM Agents 双轨设计** —— 不是只写 quickstart，而是把 agent 作为一等消费者来写安装文档，连 `curl` 与 provider flags 都显式约束。[s2][s12] 映射 `[docs:quickstart]` `[docs:tutorial]`。
3. **把社区协作入口做成可执行模板，而不是自由文本** —— issue 模板要求 doctor 输出，PR 模板要求 typecheck/test，公开协作从第一步就被标准化。[s9][s10] 映射 `[community:issue-tpl]` `[community:pr-tpl]`。
4. **高频发布 + 多平台分发要自动化到工作流层** —— 每日级 release cadence 与 11 平台发布矩阵一起，构成了开发者工具型项目的真实交付能力，而非纯 marketing 叙事。[s4][s7][s8] 映射 `[community:release]` `[quality:ci-cd]` `[tooling:release-bot]`。

## §5 边界条件
1. **这套增长叙事强依赖目标用户已经被 AI coding 改变工作流**。如果用户并没有同时使用 Claude/Codex/OpenCode/Gemini，反锁定叙事就不会像现在这样强烈有效。[s2][s3]
2. **“Building in Public” 要成立，前提是 maintainer 能持续直播式推进**。没有高频可见迭代，Discord 入口会变成空洞 badge，而不是增长飞轮。[s2][s4]
3. **SUL-1.0 与 NOASSERTION 的组合降低了通用开源复制性**。它依然能爆发增长，但对希望完全复刻其分发路径的项目来说，许可与品牌条件并不对等。[s1][s13]

## §6 引用清单
- [s1] GitHub API snapshot — https://api.github.com/repos/code-yeongyu/oh-my-openagent — captured 2026-04-27
- [s2] README on `dev` — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/README.md — captured 2026-04-27
- [s3] Homepage metadata — https://ohmyopenagent.com/ — captured 2026-04-27
- [s4] Releases API — https://api.github.com/repos/code-yeongyu/oh-my-openagent/releases?per_page=30 — captured 2026-04-27
- [s5] Contributors API — https://api.github.com/repos/code-yeongyu/oh-my-openagent/contributors?per_page=100&anon=1 — captured 2026-04-27
- [s6] CI workflow — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/ci.yml — captured 2026-04-27
- [s7] Publish workflow — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/publish.yml — captured 2026-04-27
- [s8] Publish-platform workflow — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/workflows/publish-platform.yml — captured 2026-04-27
- [s9] Bug issue template — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/ISSUE_TEMPLATE/bug_report.yml — captured 2026-04-27
- [s10] PR template — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/.github/pull_request_template.md — captured 2026-04-27
- [s11] Root package.json — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/package.json — captured 2026-04-27
- [s12] Installation guide — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/docs/guide/installation.md — captured 2026-04-27
- [s13] License file — https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/LICENSE.md — captured 2026-04-27
- [s14] Star history — https://star-history.com/#code-yeongyu/oh-my-openagent&Date — captured 2026-04-27
