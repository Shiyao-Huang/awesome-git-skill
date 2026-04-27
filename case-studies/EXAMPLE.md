---
id: case-shadcn-ui
project: shadcn/ui
repo_url: https://github.com/shadcn-ui/ui

star_count: 113048
star_count_at: 2026-04-27
star_source: gh-api

forks_count: 8651
open_issues_count: 1853
license_spdx: MIT
last_push_at: 2026-04-27

category: ui-kit

dimensions_covered:
  - facade
  - docs
  - community

status: draft
last_verified_at: 2026-04-27

sources:
  - id: s1
    url: https://api.github.com/repos/shadcn-ui/ui
    captured_at: 2026-04-27
    type: github
    note: 仓库当下快照（stars/forks/issues/license/pushed_at/created_at）
  - id: s2
    url: https://star-history.com/#shadcn-ui/ui&Date
    captured_at: 2026-04-27
    type: star-history
    note: 历史增长曲线；本 EXAMPLE 仅引用 URL，未截图
  - id: s3
    url: https://github.com/shadcn-ui/ui/blob/main/README.md
    captured_at: 2026-04-27
    type: github
    note: README hero + tagline + CLI 指引来源
---

# shadcn/ui — Case Study (EXAMPLE，最小可信样例)

> ⚠️ 本文件是 `templates/case-study.md` 的最小化样例，用于演示 front-matter 契约与 6 章节骨架。
> 部分章节使用 `UNVERIFIED: <reason>` 表明尚未在本样例中完成深挖；P1 阶段会由独立 case-study 文件覆盖。

## §1 一句话定位 + 目标用户
"复制粘贴而非依赖安装" 的 React 组件库，面向需要可定制 Tailwind + Radix 组件、希望源码进仓而非锁版本的前端开发者 [s3]。

## §2 关键数据表

| 字段 | 值 | 来源 |
|------|----|------|
| Stars | 113,048 @ 2026-04-27 | [s1] |
| Forks | 8,651 @ 2026-04-27 | [s1] |
| Open Issues | 1,853 @ 2026-04-27 | [s1] |
| License | MIT | [s1] |
| Last Push | 2026-04-27 | [s1] |
| First Commit (repo created) | 2023-01-04 | [s1] |
| Star History URL | https://star-history.com/#shadcn-ui/ui&Date | [s2] |
| Contributors | UNVERIFIED: 本样例未跑 `gh api .../contributors --paginate` | — |

## §3 6 域评估

### 3.1 facade — 门面 / 第一印象
README 顶部直接给 **CLI 一行命令** + 跳转到文档站的 CTA，定位句"Beautifully designed components that you can copy and paste into your apps"是其反 npm 包叙事的核心 [s3]。徽章 / OG image / 视频 demo 等子项的细节验证留待独立 case-study。

### 3.2 docs — 文档与上手
仓库根 README 仅作入口，主要文档托管在外部站点（ui.shadcn.com）。文档站技术栈（[docs:site-stack]）—— **UNVERIFIED: 本样例未抓取 footer / package.json 验证**。

### 3.3 community — 社区与增长
fork:star ≈ 1:13、issue:star ≈ 1.6%（基于 [s1] 计算），表明用户消化文档+源码而非仅 stargazing。release 节奏 / launch 渠道 / SEO — **UNVERIFIED: 本样例未拉 `gh api releases` 与 HN 历史帖**。

### 3.4 quality
未在本样例中评估。**UNVERIFIED: 需读 `.github/workflows/` 与 CHANGELOG**。

### 3.5 caselib
未在本样例中评估。**UNVERIFIED: 需抓 GitHub dependents 与 landing 用户墙**。

### 3.6 tooling
未在本样例中评估。**UNVERIFIED: 需读 package.json / changesets 配置**。

## §4 3 条可复用经验（仅 1 条已验证，其余留空示意）

1. **README CTA = 单行 CLI 命令** — 把"运行一行就能用"作为门面而非"npm install + 配置链路"，把 onboarding 摩擦降到最低 [s3]。映射 `[facade:hero]` + `[docs:quickstart]`。
2. _（待补，需 launch 渠道证据）_ — **UNVERIFIED: 本样例未引用具体 HN/X 帖**
3. _（待补，需 release 节奏证据）_ — **UNVERIFIED: 本样例未跑 release 中位间隔**

## §5 2 条边界条件

1. **"复制粘贴库" 模式依赖目标受众已是 Tailwind + Radix 用户** — 在没有这两个生态前置的语言/框架里，本模式不可直接照搬。无引用，结论性观察，留待 P1 独立 case-study 用 issue 抽样验证。**UNVERIFIED: 缺 issue 主题分布抽样**。
2. _（待补）_ — **UNVERIFIED**

## §6 引用清单

- `[s1]` GitHub API snapshot — https://api.github.com/repos/shadcn-ui/ui — captured 2026-04-27
- `[s2]` Star history — https://star-history.com/#shadcn-ui/ui&Date — captured 2026-04-27（仅 URL，未存截图）
- `[s3]` README on default branch — https://github.com/shadcn-ui/ui/blob/main/README.md — captured 2026-04-27

---

> **本文件性质**：模板使用样例。`status: draft` 且多个域显式 `UNVERIFIED`，由 P1 阶段的正式 case-study（如 `case-studies/shadcn-ui.md`）覆盖完整 6 域。
> **fm-indexer 自检**：front-matter 通过 hard-fail 规则（id 前缀 / *_at 齐全 / dimensions 子集 / category 枚举 / sources ≥ 3），但 `dimensions_covered` 中超出本样例覆盖的域（quality/caselib/tooling）已显式标注 UNVERIFIED——P1 文件需把它们替换为实证内容。
