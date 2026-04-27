---
id: case-everything-claude-code
project: Everything Claude Code
repo_url: https://github.com/affaan-m/everything-claude-code

star_count: 167783
star_count_at: 2026-04-27
star_source: gh-api

forks_count: 26002
open_issues_count: 170
license_spdx: MIT
last_push_at: 2026-04-26T04:53:53Z

category: dev-tool

dimensions_covered:
  - facade
  - docs
  - community
  - quality
  - caselib
  - tooling

status: draft
last_verified_at: 2026-04-27

sources:
  - id: s1
    url: https://api.github.com/repos/affaan-m/everything-claude-code
    captured_at: 2026-04-27
    type: github
    note: repo snapshot with stars, forks, issues, homepage, topics, created_at, pushed_at, license
  - id: s2
    url: https://star-history.com/#affaan-m/everything-claude-code&Date
    captured_at: 2026-04-27
    type: star-history
    note: star history URL for longitudinal verification
  - id: s3
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/README.md
    captured_at: 2026-04-27
    type: github
    note: README hero, badges, quickstart, guide matrix, release notes excerpt, positioning
  - id: s4
    url: https://ecc.tools
    captured_at: 2026-04-27
    type: docs-site
    note: homepage title, meta description, og tags, install surface positioning
  - id: s5
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/CHANGELOG.md
    captured_at: 2026-04-27
    type: github
    note: release notes and surface evolution history
  - id: s6
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/SECURITY.md
    captured_at: 2026-04-27
    type: github
    note: security disclosure path, SLA expectations, scope
  - id: s7
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/CONTRIBUTING.md
    captured_at: 2026-04-27
    type: github
    note: contributor pathways across agents, skills, hooks, commands
  - id: s8
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/ISSUE_TEMPLATE/copilot-task.md
    captured_at: 2026-04-27
    type: github
    note: issue template routes coding tasks to GitHub Copilot agent with acceptance criteria
  - id: s9
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/PULL_REQUEST_TEMPLATE.md
    captured_at: 2026-04-27
    type: github
    note: PR checklist for testing, security, docs, commit hygiene
  - id: s10
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/ci.yml
    captured_at: 2026-04-27
    type: github
    note: CI matrix across Ubuntu/Windows/macOS, Node 18/20/22, npm/pnpm/yarn/bun
  - id: s11
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/release.yml
    captured_at: 2026-04-27
    type: github
    note: tag-driven release, npm publish, release-note generation, version sync checks
  - id: s12
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/monthly-metrics.yml
    captured_at: 2026-04-27
    type: github
    note: monthly metrics snapshot issue automation with npm, stars, forks, views, clones, releases
  - id: s13
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/package.json
    captured_at: 2026-04-27
    type: github
    note: package surface, scripts for audit, orchestration, test suite, dashboard
  - id: s14
    url: https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/README.zh-CN.md
    captured_at: 2026-04-27
    type: github
    note: Chinese README mirror proves multilingual distribution rather than English-only docs
  - id: s15
    url: https://api.github.com/repos/affaan-m/everything-claude-code/contributors?per_page=100
    captured_at: 2026-04-27
    type: github
    note: contributors counted via paginated GitHub API query (159 contributors)
  - id: s16
    url: https://api.github.com/repos/affaan-m/everything-claude-code/releases?per_page=20
    captured_at: 2026-04-27
    type: github
    note: recent release cadence sample; 12 releases from 2026-01-22 to 2026-04-05, median interval ~5.0 days
  - id: s17
    url: https://api.github.com/repos/affaan-m/everything-claude-code/contents/
    captured_at: 2026-04-27
    type: github
    note: root contents listing shows parallel surfaces for .claude, .codex, .cursor, .opencode, docs, rules, skills, plugins, tests
---

# Everything Claude Code — Case Study

## §1 一句话定位 + 目标用户
Everything Claude Code 把 Claude Code / Codex / Cursor / OpenCode 等 AI agent harness 的规则、skills、hooks、命令、插件与安全层打包成一个统一的“性能优化系统”，目标用户是想把 AI coding 从个人提示词升级到可复用团队工作流的开发者与小团队。[s3][s4]

## §2 关键数据表

| 字段 | 值 | 来源 |
|------|----|------|
| Stars | 167,783 @ 2026-04-27 | [s1] |
| Forks | 26,002 @ 2026-04-27 | [s1] |
| Open Issues | 170 @ 2026-04-27 | [s1] |
| License | MIT | [s1] |
| Last Push | 2026-04-26T04:53:53Z | [s1] |
| Repo Created（proxy for first public commit） | 2026-01-18T00:51:51Z | [s1] |
| Star History URL | https://star-history.com/#affaan-m/everything-claude-code&Date | [s2] |
| Contributors | 50-200 bucket（实测 159） | [s15] |
| Homepage | https://ecc.tools | [s1][s4] |
| Release Cadence | 12 tagged releases in ~74 days; median interval ~5.0 days | [s16] |

## §3 6 域评估

### 3.1 facade — 门面 / 第一印象
ECC 的门面不是“一个插件”而是“一个开放的 agent harness 系统”。README 首屏同时放了 hero 图、Stars/Forks/Contributors、两个 npm weekly downloads badge、GitHub App install badge，以及 Shell/TypeScript/Python/Go/Java/Perl/Markdown 语言标记，把它包装成跨生态的系统入口，而非单一仓库。[s3] 首屏定位句也非常直接：`The performance optimization system for AI agent harnesses`，再补一句“Works across Claude Code, Codex, Cursor, OpenCode, Gemini”，让访客第一眼就知道这是“多 harness 的基础设施层”。[s3]

官网 `ecc.tools` 则把同一叙事外翻成更面向外部分发的产品页：title/description/OG 都写成 `Open Agent Harness System for GitHub App Automation and Security`，说明团队已经把 GitHub 仓库、GitHub App、AgentShield、安全与 rollout 层串成一个统一品牌，而不是只靠 README 自我介绍。[s4] 这类双 surface（GitHub README + 独立官网）对爆发增长项目尤其关键，因为仓库首屏负责转化开发者，官网首屏负责承接更广义的外部注意力与安装/市场入口。[s3][s4]

### 3.2 docs — 文档与上手
ECC 的文档策略非常“分层”：README 明确写 `This repo is the raw code only. The guides explain everything.`，然后把 Shorthand Guide、Longform Guide、Security Guide 三个导览入口放在靠前位置；README 本身只保留 quickstart、命名迁移说明、安装分流（plugin path vs manual install path）这些最关键的 onboarding 信息。[s3] 这意味着它没有把所有认知负担塞进一个超长 README，而是把“最短安装路径”和“深度方法论文档”分开管理。[s3]

另一个明显信号是多语言分发。README 首行直接暴露 English / Português / 简体中文 / 繁體中文 / 日本語 / 한국어 / Türkçe，且仓库同时存在 `README.zh-CN.md` 与多语言 docs 子目录；中文 README 不是空壳翻译，而是同步保留快速开始、插件安装、multi-* 命令说明等核心信息。[s3][s14] 对一个 3.3 月龄爆发项目来说，这种早期就做多语面向，说明它的增长并不只靠单一英语社区，而是主动把发现入口铺向多市场。[s3][s14]

### 3.3 community — 社区与增长
ECC 的社区增长模式不是传统的 issue/PR 被动维护，而是把“社区入口 + 代理协作入口 + 品牌叙事”一起做成增长面。README 公开写出 `Anthropic Hackathon Winner`、`140K+ stars`、`170+ contributors`、`12+ language ecosystems`，并把 X 上的 guides 作为文档入口的一部分，说明外部分发与仓内文档是联动的。[s3] GitHub API topics 里也直接包含 `claude-code`、`ai-agents`、`developer-tools`、`mcp` 等高发现性关键词，表明团队把 GitHub topic 本身视作 acquisition surface。[s1]

在协作入口上，`.github/ISSUE_TEMPLATE/copilot-task.md` 很有代表性：它不是泛化 bug/feature 模板，而是直接让用户给 GitHub Copilot agent 派编码任务，并要求写 Task Description / Acceptance Criteria / Context。[s8] 这不是普通仓库的支持模板，而是把“让 agent 接活”本身做成公开可用流程。再叠加 CONTRIBUTING 对 agents、skills、hooks、commands 的细分贡献说明，仓库把社区参与拆成多个清晰 lane，而不是只接受代码 PR。[s7][s8]

发布节奏上，12 个 release 在约 74 天里滚动发布，中位间隔约 5 天，属于高频 ship 模式。[s16] 对这种“配置/规则/skills 持续生长”的仓库来说，高频 release 会持续制造可传播节点，也能不断让社区回流验证新 surfaces。[s5][s16]

### 3.4 quality — 代码与发布质量
ECC 的质量面最强信号来自它把“跨平台兼容性 + 多包管理器兼容性 + 组件验证”直接写进 CI。`ci.yml` 的测试矩阵覆盖 Ubuntu/Windows/macOS、Node 18/20/22、npm/pnpm/yarn/bun，并额外跑 `validate` job 校验组件有效性；这说明它不是只在作者自己的 Claude Code 环境能跑，而是刻意把多运行面兼容当成核心质量目标。[s10]

PR 模板进一步把 testing / security / docs 质量前置成强制 checklist：本地 tests、JSON 验证、shellcheck、无 secrets、conventional commits、必要的 README/文档更新都被显式列出。[s9] 安全政策则写明公开 issue 不受理漏洞、48 小时确认、7 天状态更新、30 天内修 critical，并把 AgentShield 和 Security Guide 纳入 scope。[s6] 这类可见 SLA 对一个增长期项目很重要，因为它把“可信”从口头承诺变成可审阅资产。[s6][s9]

需要注意的一个边界是：安全策略的 supported versions 表当前仍列 1.9.x / 1.8.x，而 README/CHANGELOG 已经到了 1.10.0；这更像文档更新存在小滞后，而不是没有安全流程。[s5][s6] 对外观感上，它提醒我们高频 ship 体系很容易出现“主面更新快，某些治理文档跟进稍慢”的同步成本。[s5][s6]

### 3.5 caselib — 案例库与基准
ECC 在 `caselib` 域最有代表性的不是传统客户案例，而是公开 adoption 信号的堆叠方式。README 把 GitHub App 150 installs badge、两个 npm weekly download badge、Stars/Forks/Contributors 都放在首屏，这些都属于“可公开展示、且跟安装或使用相关”的背书资产。[s3] 官网 meta description 也直接把自己描述成 “behind a 140K+ stars OSS ecosystem”，说明团队把自身当作一个生态层，而不是单仓工具。[s4]

与此同时，仓库里有 `SPONSORING.md`、`SPONSORS.md`、Marketplace GitHub App、跨 harness 插件与安装面，说明其 public proof 更偏“生态面覆盖”和“安装入口密度”。[s3][s17] 但如果按传统 case-library 标准去找 logo wall、命名企业客户、公开生产部署故事，这一仓库并没有像 B2B AI 平台那样给出系统化客户清单，因此这部分应视为 `UNVERIFIED: public repo/homepage emphasize installs/ecosystem rather than named customer case studies`。[s3][s4]

这给增长研究一个很重要的区分：**面向开发者基础设施的爆发项目，可以用安装入口密度、生态面广度与贡献者规模替代 customer wall。** 但前提是它真的把这些安装/生态信号做成了公开资产。[s3][s4][s15][s17]

### 3.6 tooling — 工程效率工具
Tooling 几乎就是 ECC 的主体产品。根目录 contents API 直接暴露 `.claude`、`.codex`、`.cursor`、`.opencode`、`.gemini`、`agents`、`skills`、`plugins`、`rules`、`mcp-configs`、`schemas`、`tests` 等并列表面，说明它不是一个单运行时插件，而是一个跨 harness 的内容/配置分发工厂。[s17] `package.json` 里的脚本也明显围绕维护这座工厂设计：`catalog:check` / `catalog:sync`、`harness:audit`、多种 orchestration 状态脚本、完整 test 与 coverage 流程、`dashboard` GUI。[s13]

`release.yml` 和 `monthly-metrics.yml` 则把 ship 与观测闭环补上：前者做 tag/version/package sync、npm publish、release note 生成；后者定期写 Monthly Metrics Snapshot issue，自动抓 npm downloads、stars、forks、contributors、views、clones、releases。[s11][s12] 这意味着团队没有把“增长结果”留在口头层，而是把可观测指标做成了自动化产物。对于“接入现实”的方向，这类 tooling 比再写一层方法论文档更接近真实闭环。[s11][s12]

## §4 可复用经验
1. **把仓库首屏当成多重 adoption 证明墙，而不是单一 logo wall** —— Stars/Forks/Contributors、npm downloads、GitHub App installs、语言生态标签一起出现，能在没有企业客户墙的情况下快速建立“这个东西真的被用”的信号。[s3] 映射 `[facade:badges]` + `[caselib:social-proof]`。
2. **README 只保留最短安装路径，深方法论拆成 guide matrix** —— Quick Start 解决 2 分钟上手，Shorthand/Longform/Security Guides 承接深认知，比把所有理念塞进一个 README 更利于扩张。[s3] 映射 `[docs:quickstart]` + `[docs:tutorial]` + `[facade:demo]`。
3. **把社区协作流程产品化成 agent task surface** —— issue template 直接为 Copilot agent 派任务，PR 模板强制测试/安全/文档 checklist，社区不只是围观，而是进入标准化执行链路。[s8][s9] 映射 `[community:issue-tpl]` + `[quality:dx]`。
4. **把发布与指标观测写成自动化，而不是靠人工汇报** —— tag-driven release workflow + monthly metrics snapshot issue，让增长信号与发布链路都可观察、可追踪、可复盘。[s11][s12] 映射 `[community:release]` + `[tooling:metrics-fetch]` + `[tooling:release-bot]`。

## §5 边界条件
1. **这种“多 harness 全覆盖”的门面高度依赖内容供给能力**。如果团队无法持续维护 `.claude/.codex/.cursor/.opencode` 等并列表面，只复制首屏叙事会迅速露馅。[s3][s17]
2. **安装入口密度可以替代 customer wall，但只适用于开发者基础设施型产品**。如果项目不是安装型/工作流型工具，而是面向终端业务用户，仍然需要真实客户故事或部署案例补强信任。[s3][s4]
3. **高频 release + 多矩阵 CI 的代价是真实维护负担**。5 天中位 release 间隔、跨 OS/Node/包管理器矩阵与 metrics automation 对小团队是重运营成本，不适合没有自动化基础的项目照搬。[s10][s11][s12][s16]

## §6 引用清单
- [s1] GitHub API snapshot — https://api.github.com/repos/affaan-m/everything-claude-code — captured 2026-04-27
- [s2] Star history — https://star-history.com/#affaan-m/everything-claude-code&Date — captured 2026-04-27
- [s3] README on default branch — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/README.md — captured 2026-04-27
- [s4] Homepage — https://ecc.tools — captured 2026-04-27
- [s5] Changelog — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/CHANGELOG.md — captured 2026-04-27
- [s6] Security policy — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/SECURITY.md — captured 2026-04-27
- [s7] Contributing guide — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/CONTRIBUTING.md — captured 2026-04-27
- [s8] Copilot task issue template — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/ISSUE_TEMPLATE/copilot-task.md — captured 2026-04-27
- [s9] Pull request template — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/PULL_REQUEST_TEMPLATE.md — captured 2026-04-27
- [s10] CI workflow — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/ci.yml — captured 2026-04-27
- [s11] Release workflow — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/release.yml — captured 2026-04-27
- [s12] Monthly metrics workflow — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/.github/workflows/monthly-metrics.yml — captured 2026-04-27
- [s13] Root package.json — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/package.json — captured 2026-04-27
- [s14] Chinese README — https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/README.zh-CN.md — captured 2026-04-27
- [s15] Contributors API endpoint — https://api.github.com/repos/affaan-m/everything-claude-code/contributors?per_page=100 — captured 2026-04-27
- [s16] Releases API endpoint — https://api.github.com/repos/affaan-m/everything-claude-code/releases?per_page=20 — captured 2026-04-27
- [s17] Root contents API endpoint — https://api.github.com/repos/affaan-m/everything-claude-code/contents/ — captured 2026-04-27
