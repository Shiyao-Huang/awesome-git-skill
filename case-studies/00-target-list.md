# 00 — 100K+★ 头部开源项目 Case-Study 标的清单

- **as-of**: 2026-04-27
- **数据来源**: GitHub REST API `GET /repos/{owner}/{name}` (字段：`stargazers_count`, `forks_count`, `open_issues_count`, `pushed_at`, `license.spdx_id`)，调用账户 `Shiyao-Huang`
- **抓取脚本**: `gh api repos/<owner>/<name> --jq ...`（见 task 评论）
- **诚实标注**: 任何无法 API 校验的字段一律标 `UNVERIFIED`，不编造
- **owner**: Research Lead | **联合签字**: Master + Solution Architect

> ⚠️ Star 数为本次抓取快照，会持续变化。所有引用本表的 playbook 必须显式带 `as-of` 日期。

---

## 1. 候选池（22 个，按 stars 降序）

| # | Repo | ★ | Forks | Open Issues | License | Last Push | 品类 | 拆解价值 |
|---|------|--:|------:|------------:|--------|-----------|------|----------|
| 1 | n8n-io/n8n | 185,701 | 57,153 | 1,581 | NOASSERTION (fair-code) | 2026-04-27 | infra/workflow | 自部署 + SaaS 双轨；fair-code 商业化范本；issue 漏斗 |
| 2 | microsoft/vscode | 184,300 | 39,459 | 16,686 | MIT | 2026-04-27 | IDE/dev-tool | 巨头驱动 OSS 的极限案例；扩展生态、首发节奏 |
| 3 | ollama/ollama | 170,075 | 15,818 | 3,070 | MIT | 2026-04-26 | AI/runtime | 18 个月级 0→170k 增速；CLI 极简 onboarding |
| 4 | langgenius/dify | 139,240 | 21,826 | 854 | NOASSERTION | 2026-04-27 | AI/app-platform | 中国团队海外 OSS 增长样板；docs 站 + 模板生态 |
| 5 | vercel/next.js | 139,180 | 30,978 | 3,851 | MIT | 2026-04-27 | framework | 公司战略与 OSS 一体化；release-please/changesets 标杆 |
| 6 | langchain-ai/langchain | 135,019 | 22,329 | 551 | MIT | 2026-04-26 | AI/SDK | 早期叙事红利；docs 重构、生态扩张 |
| 7 | open-webui/open-webui | 134,298 | 19,086 | 278 | NOASSERTION | 2026-04-24 | AI/UI | 寄生 ollama 流量；单仓库前后端整体打包 |
| 8 | excalidraw/excalidraw | 122,004 | 13,436 | 3,014 | MIT | 2026-04-26 | UI/visual | "live demo = product" 范本；社交资产复用 |
| 9 | shadcn-ui/ui | 113,047 | 8,651 | 1,853 | MIT | 2026-04-27 | UI kit | "复制粘贴库" 反范式；CLI + 文档 + Twitter 三位一体 |
| 10 | Comfy-Org/ComfyUI | 110,209 | 12,855 | 3,986 | GPL-3.0 | 2026-04-26 | AI/visual | 节点式 UI；社区驱动节点市场 |
| 11 | tauri-apps/tauri | 105,892 | 3,554 | 1,419 | Apache-2.0 | 2026-04-24 | framework/desktop | 对 Electron 的差异化叙事 |
| 12 | supabase/supabase | 101,464 | 12,189 | 962 | Apache-2.0 | 2026-04-26 | infra/BaaS | "open Firebase" 定位；DevRel 强 |
| 13 | oven-sh/bun | 89,358 | 4,366 | 6,624 | NOASSERTION (MIT-like) | 2026-04-27 | dev-tool/runtime | 性能叙事 + 首发 HN 爆款；issue 体量警示 |
| 14 | zed-industries/zed | 79,826 | 8,009 | 2,865 | NOASSERTION | 2026-04-26 | IDE | Rust 实现 + 团队协作叙事；闭源到开源转换 |
| 15 | hoppscotch/hoppscotch | 79,039 | 5,831 | 797 | MIT | 2026-04-26 | dev-tool | "Postman 替代"定位；SaaS 双轨 |
| 16 | AppFlowy-IO/AppFlowy | 70,035 | 5,158 | 964 | AGPL-3.0 | 2026-04-24 | productivity | "Notion 替代"叙事；AGPL 选择 |
| 17 | withastro/astro | 58,792 | 3,390 | 335 | NOASSERTION | 2026-04-26 | framework | 内容站 SSR 细分赛道；docs 站标杆 |
| 18 | pocketbase/pocketbase | 57,991 | 3,334 | 18 | MIT | 2026-04-24 | infra/BaaS | 单 binary 极简部署；个人维护者样板 |
| 19 | coollabsio/coolify | 54,231 | 4,267 | 725 | Apache-2.0 | 2026-04-26 | infra/PaaS | "self-host Heroku" 叙事 |
| 20 | tldraw/tldraw | 46,560 | 3,162 | 328 | NOASSERTION | 2026-04-27 | UI/visual | "make real" 病毒 demo 案例 |
| 21 | honojs/hono | 30,152 | 1,044 | 348 | MIT | 2026-04-25 | framework/edge | edge-runtime 细分；非 100K 但增速参考 |
| 22 | sveltejs/kit | 20,463 | 2,247 | 1,022 | MIT | 2026-04-26 | framework | Svelte 生态；非 100K，仅参考 |

---

## 2. 最终选定 10 个

按硬指标 **★ ≥ 100K**、**最近推送 ≤ 90 天**、**4+ 品类多样性** 共同筛选；同品类内择优保留。

| # | Repo | ★ | 品类 | 入选理由 |
|---|------|--:|------|----------|
| 1 | microsoft/vscode | 184,300 | IDE | 唯一巨头主导的超大 OSS；衡量"组织资源型增长"的天花板 |
| 2 | n8n-io/n8n | 185,701 | infra/workflow | 当前 ★ #1；fair-code 商业化与社区平衡的范本 |
| 3 | ollama/ollama | 170,075 | AI runtime | 2024-2026 年增长曲线最陡；CLI-first onboarding 样本 |
| 4 | vercel/next.js | 139,180 | framework | 公司-OSS 飞轮范本；release/canary 流程教科书 |
| 5 | langgenius/dify | 139,240 | AI/app-platform | 中国团队海外 OSS 增长代表；模板/marketplace 生态 |
| 6 | langchain-ai/langchain | 135,019 | AI/SDK | 早期 AI 叙事红利 + docs 重构对照实验 |
| 7 | open-webui/open-webui | 134,298 | AI UI | "寄生头部生态"打法；前后端单仓库打包 |
| 8 | excalidraw/excalidraw | 122,004 | UI/visual | live-demo-as-marketing 的最纯样本 |
| 9 | shadcn-ui/ui | 113,047 | UI kit | "反 npm 包"的复制粘贴库；CLI + Twitter 驱动 |
| 10 | Comfy-Org/ComfyUI | 110,209 | AI/visual | 社区节点市场 + 视觉化工作流；GPL 选择 |

**品类覆盖核查**：IDE / infra / AI-runtime / framework / AI-app / AI-SDK / AI-UI / UI-visual / UI-kit / AI-visual → **覆盖 ≥ 4** ✅

### 2.1 排除理由（重要替补）

| Repo | ★ | 排除理由 |
|------|--:|---------|
| tauri-apps/tauri | 105,892 | 和 next.js 同属 framework，叙事密度较低；保留为 framework 替补 |
| supabase/supabase | 101,464 | infra 已由 n8n 代表；保留为 BaaS 单独研究替补 |
| oven-sh/bun | 89,358 | <100K 硬线；但 issue 体量与首发节奏值得单独追踪 |
| zed-industries/zed | 79,826 | <100K；闭源转开源叙事独特，列入"扩展研究池" |
| AppFlowy-IO/AppFlowy | 70,035 | <100K；AGPL 选型可作 license 章节单点引用 |
| pocketbase/pocketbase | 57,991 | 个人维护者样板，规模差距大；放入 single-maintainer 子研究 |

> 替补池将作为 P1 阶段交叉验证组：当某主标的的某维度数据缺失时，从替补池中提取同品类对照。

---

## 3. 横向对比维度（14 项 ≥ 10）

每项均为可在 P1 case-study 中针对每个项目独立填表的离散字段，且**playbook 可直接引用**。

| # | 维度 | 字段示例 / 取值范围 | 取数方法 |
|---|------|--------------------|----------|
| D1 | README 范式 | hero-image / GIF-demo / asciinema / no-image / video-embed | 仓库 README.md 头部 100 行 |
| D2 | Social preview & OG | 自定义 OG / 默认 / 动态生成 | `https://opengraph.githubassets.com/...` + 落地页 `og:image` |
| D3 | 文档站方案 | Mintlify / Nextra / Starlight / Docusaurus / VitePress / Astro Starlight / 自研 | 文档站源码或 footer 标识 |
| D4 | Quickstart 步数 | "0→hello world"步数：≤1 / 2-3 / 4-5 / 6+ | README + 文档站 quickstart 页面 |
| D5 | Demo 形式 | online-playground / GIF / video / docker-one-liner / install-cli | 仓库根 + landing page |
| D6 | Release 节奏 | weekly / biweekly / monthly / irregular | `gh api repos/.../releases?per_page=30` 计算中位间隔 |
| D7 | Changelog 工具 | release-please / changesets / 手写 / git-cliff | `.github/workflows` + `CHANGELOG.md` 头部 |
| D8 | Issue 中位响应 | hours / 1-3d / >7d / UNVERIFIED | `gh search issues` + 时间戳分析（P1 阶段补） |
| D9 | Launch 渠道组合 | HN / PH / X / Reddit / 中文 / blog / podcast | 公开记录 + 团队 X 时间线 |
| D10 | 商业化模型 | OSS-only / open-core / fair-code / 双 license / SaaS | LICENSE + 官网定价页 |
| D11 | 社区入口 | Discord / Slack / Discussions / forum / 无 | README 链接区 |
| D12 | 贡献者数 | <50 / 50-200 / 200-1k / 1k+ | `gh api repos/.../contributors --paginate` |
| D13 | SEO 关键词信号 | 主关键词 + alternative-to 长尾 | landing page `<title>` + meta；可用 wayback 快照对比演变 |
| D14 | 社交资产复用 | OG / 视频 / 模板 / asciinema / interactive embed | 落地页 + `<head>` 抓取 |

> D8 / D13 在 P0 阶段允许标记 `UNVERIFIED`，由 P1 case-study 阶段补全（避免 P0 引入网络抓取重型依赖）。

---

## 4. 已知缺口与 hard-fail 标注

- D8 (Issue 中位响应) 与 D13 (SEO) 在本 P0 文件**未填充**，留待 P1。
- 历史 ★ 增长曲线需要 `star-history.com` 截图（外部依赖）。本表只给当下快照；P1 阶段每个 case-study 必须附 star-history URL + 抓取日期。
- 任何 `NOASSERTION` license 由 P1 阶段二次核查实际 LICENSE 文件后定级，本表不擅自归一化。

---

## 5. 与 scorecard 任务的接口

本文件 §3 的 14 维度将作为 scorecard 任务 `mUT5mmeZjWhN` 的输入候选。**Solution Architect** 在选定 6-10 个评分维度时，建议优先从 D1-D14 中映射，避免脱离实证。

## 6. 变更日志
- 2026-04-27 v1.0 — Research Lead 初版（22 候选 → 10 主 + 6 替补 + 14 维度）
