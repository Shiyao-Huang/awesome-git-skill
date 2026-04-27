---
id: docs-site-stack
dimension: docs
subitem: docs:site-stack
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources:
  - https://code.visualstudio.com/docs
  - https://docs.n8n.io/
  - https://docs.dify.ai/en/use-dify/getting-started/introduction
  - https://nextjs.org/docs
  - https://docs.langchain.com/
  - https://docs.openwebui.com/
  - https://ui.shadcn.com/docs
  - https://docs.comfy.org/
  - https://nextra.site/docs
  - https://starlight.astro.build/
  - https://vitepress.dev/
  - https://ollama.com/
  - https://excalidraw.com/
---

# docs-site-stack playbook

## 1. 维度定义
`docs:site-stack` 维度衡量一个项目是否为自己的文档面选择了**与内容密度、维护能力、SEO 目标和产品形态相匹配**的站点技术栈：不是“哪家最流行”，而是“哪种栈最适合当前阶段、能否被团队长期维护、能否支撑 quickstart / tutorial / API reference / 社区分流 / 搜索发现”。在当前 `opensourceStar` 仓库里，这个决策文档的目标不是立即上线新站，而是为后续 docs surface 留下**可复算、可审计、可迁移**的选型依据。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 没有独立 docs 选型记录；README、landing page、案例页混在一起；团队无法回答“为什么选这套栈”或“换栈代价是什么”。 |
| 1 | 已经用了某套 docs 栈，但只因为跟风或沿用脚手架；没有记录候选项、拒绝理由、SEO/构建/作者体验约束，也没有任何真实项目对照。 |
| 2 | 能列出候选栈与优缺点，但比较停留在抽象印象（如“好看/快/社区大”）；没有把候选栈与真实头部项目、当前内容类型、团队维护能力绑定。 |
| 3 | 已建立“维度 × 栈”的配置驱动对比表，且每个候选栈至少引用 1 个真实项目用例；能明确区分默认推荐、条件性推荐与 `UNVERIFIED` 候选。 |
| 4 | 在 3 分基础上，还能给出迁移门槛、SEO/OG/搜索/版本化/自托管等关键约束，并明确说明“当前先不建站、何时再切换”的阶段策略。 |
| 5 | 除了 4 分要求外，团队还有可执行的试点路径（pilot）、回滚条件、build/Lighthouse/作者效率等可观测指标，且后续迁移不会造成 front-matter、case-study、playbook 双源漂移。 |

## 3. 头部项目实践占位
- [ ] vscode: 待 case-study 回填（当前 docs surface 为独立自建面，具体底层框架 `UNVERIFIED`）
- [ ] n8n: 待 case-study 回填（已验证为 MkDocs Material）
- [ ] ollama: 待 case-study 回填（当前 docs stack 形态 `UNVERIFIED`，更接近 landing/README hybrid）
- [ ] dify: 待 case-study 回填（已验证为 Mintlify）
- [ ] next.js: 待 case-study 回填（已验证为自建 Next.js docs 面）
- [ ] langchain: 待 case-study 回填（已验证为 Mintlify + reference 分层）
- [ ] open-webui: 待 case-study 回填（已验证为 Docusaurus）
- [ ] excalidraw: 待 case-study 回填（当前 docs stack 形态 `UNVERIFIED`，更接近 landing/README hybrid）
- [ ] shadcn-ui: 待 case-study 回填（已验证为自建 Next.js docs 面）
- [ ] comfyui: 待 case-study 回填（已验证为 Mintlify）

## 4. 可执行 checklist（≥10 条）
- [ ] 先把“谁会写、谁会维护、谁会改主题”写成约束，再讨论框架。
  *原因：docs 栈是长期维护成本，不是一次性选型；没有维护人，任何“最佳框架”都会退化成坏决策。*
- [ ] 把内容类型拆成 quickstart / tutorial / API reference / benchmark / case-study / decision doc 六类，再看是否需要单站或分层站。
  *原因：信息架构先于框架；内容类型不清，选型只会凭直觉。*
- [ ] 优先验证当前 10 个头部样本真实在用什么，而不是先写“推荐答案”。
  *原因：本仓方法论必须用实证支撑，不能把框架偏好伪装成结论。*
- [ ] 对每个候选栈至少补 1 个真实用例；没有真实用例就标 `UNVERIFIED`，不拿“听说适合”过审。
  *原因：本任务是 decision doc，不是生态综述；没有项目用例就没有可迁移证据。*
- [ ] 把“是否必须自托管”单独作为二选一门槛，而不是混在泛泛的 pros/cons 里。
  *原因：Mintlify / 自建 / Docusaurus 的第一分叉通常不是 UI，而是 hosting/control 的制度约束。*
- [ ] 把“是否需要多层 reference/tutorial/enterprise 导航”单列为信息架构门槛。
  *原因：Open WebUI 这类平台型项目和 shadcn/ui 这类 design-system 项目，对导航深度要求完全不同。*
- [ ] 把 SEO/OG/sitemap/robots 作为 docs 栈对比项，而不是等站建完再补。
  *原因：Dify / LangChain / ComfyUI 这类项目已经证明 docs 栈本身就是获客面，不只是说明书。*
- [ ] 把“是否需要产品级品牌控制与自定义交互”单独量化。
  *原因：Next.js / shadcn/ui 这类自建 docs 面的价值主要在 brand/product integration，而不是 markdown 渲染。*
- [ ] 在推荐矩阵里显式区分“默认推荐”“条件性推荐”“当前样本池无实证”。
  *原因：Nextra / Starlight / VitePress 可以是候选，但当前 canonical 头部样本池没有验证到，不能硬推。*
- [ ] 先保留 repo-native Markdown 主线，等 playbooks / case-studies 稳定到可迁移状态再做 docs-site pilot。
  *原因：用户明确要求核心方法论先闭合，站点化不应反客为主。*
- [ ] 若要试点，只允许选 1 套候选栈做最小切片（如 docs landing + 1 case-study + 1 playbook），并定义回滚条件。
  *原因：避免同时试 2-3 套框架造成内容碎片化与 front-matter 漂移。*
- [ ] 选型文档里必须写清“当前不推荐”的栈及理由，不允许只列 winner 不列 trade-off。
  *原因：未来团队更替时，拒绝理由比偏好结论更有复用价值。*

### 配置驱动选型矩阵（维度 × 栈）

> 说明：下表只做**当前阶段的决策输入**，不是一锤子定终局。`当前样本池实证` 只认已验证项目；样本池外的官方 dogfood 只作为补充，不自动升级为默认推荐。

| 栈 | 作者效率 | 信息架构深度 | SEO / 分享原语 | 品牌/交互自定义 | 维护与控制面 | 当前样本池实证 | 当前结论 |
|---|---|---|---|---|---|---|---|
| **Mintlify** | 强 | 中-强 | 强 | 中 | 中（托管/供应商依赖更强） | Dify / LangChain / ComfyUI [s3][s5][s8] | **当前默认推荐候选**：适合 `opensourceStar` 这种内容密集、前端人手有限、又需要较强搜索/分享面的文档中心。 |
| **Docusaurus** | 中 | 强 | 中-强 | 中 | 强（自托管/版本化/多导航成熟） | Open WebUI [s6] | **条件性推荐**：当教程/参考/企业/社区内容需要长期共存，且希望 self-host / versioning 更强时优先。 |
| **MkDocs Material** | 强 | 中 | 中 | 弱 | 强（简单、稳、低心智负担） | n8n [s2] | **条件性推荐**：偏运维/流程/手册型文档很稳，但对产品化 landing、动态组件、品牌面较弱。 |
| **自建 Next.js / MDX** | 中-弱 | 强 | 强 | 强 | 弱（前端维护成本最高） | Next.js / shadcn-ui / VSCode custom surface [s1][s4][s7] | **仅在品牌/交互要求极高时推荐**：适合 docs 本身就是产品体验一部分的项目，不适合当前无额外前端带宽的团队默认采用。 |
| **Nextra** | 中-强 | 中 | 中 | 中 | 中 | 当前 10 项目样本池**无验证命中**；官方 dogfood = Nextra docs [s9] | `UNVERIFIED`（样本池内）—— 可列为 Next.js 团队的低成本候选，但当前仓不应直接默认。 |
| **Starlight** | 中 | 中-强 | 中-强 | 中 | 中 | 当前 10 项目样本池**无验证命中**；官方 dogfood = Starlight docs [s10] | `UNVERIFIED`（样本池内）—— 适合偏内容站、静态优先、Astro 生态团队；当前仓无实证，不直接推荐。 |
| **VitePress** | 强（对 Vue/Vite 团队） | 中 | 中 | 弱-中 | 强（静态站简单） | 当前 10 项目样本池**无验证命中**；官方 dogfood = VitePress docs [s11] | `UNVERIFIED`（样本池内）—— 如果未来出现 Vue/Vite-first 子线再进入 shortlist。 |

### 当前阶段决策（不是最终建站指令）
1. **Phase 0（现在）**：继续以 repo-native Markdown 为唯一主线，不启动大规模 docs-site 迁移。
2. **Phase 1（最小 pilot）**：若主线闭合后需要站点化，优先试 **Mintlify**，切片只放 1 个 playbook + 1 个 case-study + 1 个 landing。
3. **Phase 1 的替代条件**：若明确要求自托管、版本化、社区/企业/教程多层导航，则把 pilot 候选切到 **Docusaurus**。
4. **明确不默认**：当前不把 Nextra / Starlight / VitePress 作为第一候选，因为 canonical 头部样本池没有实证命中；如要推进，必须先补 pilot 或外部对照样本。

## 5. 反模式（≥3 条）
- ❌ **看见头部项目用某个框架，就把它当成“唯一正确答案”**
  典型后果：把 Dify / LangChain 的 Mintlify 经验直接照搬到所有项目，忽略了它们背后有更强内容运营与产品营销面。
- ❌ **把“自建可做任何事”误解成“自建一定最优”**
  典型后果：Next.js / shadcn/ui 的自建模式带来极高的主题与交互自由度，但也把维护成本、前端依赖和信息架构债务一起带进来。
- ❌ **没有真实项目用例也照样给栈打结论分**
  典型后果：对 Nextra / Starlight / VitePress 这类当前样本池未命中的候选做过度推荐，违反 hard-fail / no-fallback 规则。
- ❌ **把 landing page SEO 结构信号当成 docs 栈本身的全部结论**
  典型后果：误把 open-webui / shadcn-ui 的强 OG/meta 视作“框架天然更强”，忽略文案、运营与模板层的贡献。
- ❌ **在核心方法论尚未稳定时就大规模迁站**
  典型后果：playbooks / case-studies / benchmarks 仍在快速变动，提前建站会制造双源真相和迁移返工。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| `docs.site_stack.choice_documented` | ADR / decision doc 手工核验（参照 `benchmarks/docs.md`） | 至少达到 3：写清候选、拒绝理由、推荐与回滚条件 |
| `docs.site_stack.build_seconds` | 目标 docs 栈 CI build wallclock（冷启动） | pilot 阶段 ≤ 180s；长期目标 ≤ 60s |
| `docs.site_stack.lighthouse_perf` | docs landing page mobile Lighthouse | ≥ 0.85；低于 0.60 视为不健康 |
| `docs.site_stack.authoring_pr_days` | `gh api` + docs repo PR 合并时长（future） | `UNVERIFIED: 当前仓未起 docs-site pilot` |
| `docs.site_stack.search_surface_complete` | `curl` / HTML 检查 `title` / `description` / `og:*` / `twitter:card` / `sitemap` / `robots` | 6 项里 ≥ 5 项齐全 |

## 7. 工具与模板
- `tools/index.ts`：持续校验 `playbooks/docs-site-stack.md` front-matter，不允许出现旧 8-dim 值或缺字段。
- `tools/scorecard-run.ts`：后续若补 `docs.site_stack.*` collectors，可直接把 build time / Lighthouse / search-surface 指标接入自动跑分。
- `templates/case-study.md`：后续各头部项目 case-study 回填时，把 `[docs:site-stack]` 观察项统一挂到正文 §4，而不是再发明第二套字段。
- `plans/03-canonical-mapping.md`：是 `dimension + subitem` 的唯一 machine-canonical 参考，迁站时不得发明别名。
- `pilot checklist`（建议后续单独落模板）:
  - 选 1 个 docs landing
  - 选 1 个 playbook
  - 选 1 个 case-study
  - 跑 build + Lighthouse + OG 检查
  - 记录 rollback 条件

### 引用清单
- [s1] `https://code.visualstudio.com/docs` — Visual Studio Code docs 首页，captured 2026-04-27；独立 docs surface，可见 title，但具体底层框架未暴露，故只作为 custom surface 证据。
- [s2] `https://docs.n8n.io/` — n8n docs，captured 2026-04-27；HTML `meta[name="generator"] = mkdocs-1.6.1, mkdocs-material-9.6.16+insiders-4.53.16`。
- [s3] `https://docs.dify.ai/en/use-dify/getting-started/introduction` — Dify docs，captured 2026-04-27；HTML `meta[name="generator"] = Mintlify`，并含 `/mintlify-assets/_next/`。
- [s4] `https://nextjs.org/docs` — Next.js docs，captured 2026-04-27；页面资源路径含 `/_next/static/`，作为自建 Next.js docs surface 证据。
- [s5] `https://docs.langchain.com/` — LangChain docs，captured 2026-04-27；HTML `meta[name="generator"] = Mintlify`。
- [s6] `https://docs.openwebui.com/` — Open WebUI docs，captured 2026-04-27；HTML `meta[name="generator"] = Docusaurus v3.9.2`，并含 `__docusaurus` 标记。
- [s7] `https://ui.shadcn.com/docs` — shadcn/ui docs，captured 2026-04-27；页面资源路径含 `/_next/static/`，作为自建 Next.js docs surface 证据。
- [s8] `https://docs.comfy.org/` — ComfyUI docs，captured 2026-04-27；HTML `meta[name="generator"] = Mintlify`。
- [s9] `https://nextra.site/docs` — Nextra 官方 docs，captured 2026-04-27；官方 dogfood，用于补充 Nextra 候选，但不计入当前 10 项目样本池实证。
- [s10] `https://starlight.astro.build/` — Starlight 官方 docs，captured 2026-04-27；页面可见 `Starlight` / `Astro` 标识，用作官方 dogfood。
- [s11] `https://vitepress.dev/` — VitePress 官方 docs，captured 2026-04-27；HTML `meta[name="generator"] = VitePress v2.0.0-alpha.17`。
- [s12] `https://ollama.com/` — Ollama 站点，captured 2026-04-27；当前未验证到独立 docs stack，故仅作为“landing/README hybrid 候选”的反例提示。
- [s13] `https://excalidraw.com/` — Excalidraw 站点，captured 2026-04-27；当前未验证到独立 docs stack，故仅作为“不要把 landing 当 docs 栈”的反例提示。
