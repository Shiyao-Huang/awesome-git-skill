---
id: bench-seo-signals
dimension: community              # 与 [community:seo]/[facade:social] 共用底层信号
subitem: seo                      # 子项归属
version: 0.1.0
status: draft
captured_at: 2026-04-27
source: landing-page-html
methodology_caveat: "本表只取 landing page 的 <title>/<meta description>/og:*/twitter:card/keywords，**不**测排名、流量、外链。任何'排名/转化/搜索量'结论必须由 P1 阶段独立外部数据源（Ahrefs/SEMrush/wayback diff）补全；本表只覆盖 D13 的'结构信号'部分。"
---

# Benchmark: D13 — SEO Signals (cross-project landing-page meta snapshot)

> 上游：`case-studies/00-target-list.md` §3 D13（"SEO 关键词信号"，P0 标 UNVERIFIED，本文件即 P1 结构信号补全）
> 取数：`curl -sL -A "Mozilla/5.0" --max-time 15 <landing_url>` → 正则抽取 `<title>` / `<meta name="description">` / `og:title` / `og:description` / `og:image` / `twitter:card` / `<meta name="keywords">`
> 抓取日期：2026-04-27 · 抓取账户：`Shiyao-Huang`
> **限定边界**：本文件仅覆盖结构性 SEO 信号（meta + OG + Twitter Card 完整度），**不** 包含排名/外链/流量。

---

## 1. 数据表（10 个 100K+★ 主标的）

| Repo | Landing | Title 长度 | Description 长度 | OG 三件套 | Twitter Card | Keywords | 综合 |
|------|---------|---:|---:|:---:|:---:|:---:|:---:|
| microsoft/vscode        | code.visualstudio.com  | 99 | 247 | ✅ all 3 | summary_large_image | ❌ | full [s1] |
| n8n-io/n8n              | n8n.io                 | 38 | 195 | ✅ all 3 | summary             | empty | full [s2] |
| ollama/ollama           | ollama.com             |  6 |  85 | ✅ all 3 | ❌                   | ❌ | partial [s3] |
| langgenius/dify         | dify.ai                | 38 | 134 | ✅ all 3 | summary             | ❌ | full [s4] |
| vercel/next.js          | nextjs.org             | 41 |  62 | ✅ all 3 | summary_large_image | ❌ | full [s5] |
| langchain-ai/langchain  | www.langchain.com      | 56 | 132 | ❌ none  | ❌                   | ❌ | minimal [s6] |
| open-webui/open-webui   | openwebui.com          | 32 |  93 | ✅ all 3 | summary_large_image | ✅ rich | full+keywords [s7] |
| excalidraw/excalidraw   | excalidraw.com         | 22 | 116 | ✅ all 3 | ❌                   | ❌ | partial [s8] |
| shadcn-ui/ui            | ui.shadcn.com          | 49 | 142 | ✅ all 3 (动态生成 og) | summary_large_image | ✅ short | full+keywords [s9] |
| Comfy-Org/ComfyUI       | www.comfy.org          | 39 |  61 | ✅ all 3 | summary_large_image | ❌ | full [s10] |

> **OG 三件套** = `og:title` + `og:description` + `og:image` 全齐 ✅；缺一项即记 partial 或具体缺失项。
> **Title 长度**: 字符数（Google SERP 约在 50-60 字符截断；vscode 99 字符明显超界，被截风险高）。
> **Description 长度**: 字符数（Google 约 155-160 字符截断；vscode 247 / n8n 195 / dify 134 等存在 SERP 截断）。

---

## 2. Title / Tagline 全文（用于"目标用户语料库"溯源）

| Repo | Title (原文) |
|------|------|
| microsoft/vscode        | "Visual Studio Code - The open source AI code editor \| Your home for multi-agent development" |
| n8n-io/n8n              | "AI Workflow Automation Platform - n8n" |
| ollama/ollama           | "Ollama" |
| langgenius/dify         | "Dify: Leading Agentic Workflow Builder" |
| vercel/next.js          | "Next.js by Vercel - The React Framework" |
| langchain-ai/langchain  | "LangChain: Observe, Evaluate, and Deploy Reliable AI Agents" |
| open-webui/open-webui   | "Open WebUI: Self-Hosted AI Platform" |
| excalidraw/excalidraw   | "Excalidraw Whiteboard" |
| shadcn-ui/ui            | "The Foundation for your Design System - shadcn/ui" |
| Comfy-Org/ComfyUI       | "Comfy — Professional Control of Visual AI" |

| Repo | Description (原文) |
|------|------|
| microsoft/vscode | "Visual Studio Code redefines AI-powered coding with GitHub Copilot for building and debugging modern web and cloud applications. ..." |
| n8n-io/n8n | "n8n is a workflow automation platform that uniquely combines AI capabilities with business process automation, giving technical teams the flexibility of code with the speed of no-code." |
| ollama/ollama | "Ollama is the easiest way to automate your work using open models, while keeping your data safe." |
| langgenius/dify | "Unlock agentic workflow with Dify. Develop, deploy, and manage autonomous agents, RAG pipelines, and more for teams at any scale, effortlessly." |
| vercel/next.js | "Next.js by Vercel is the full-stack React framework for the web." |
| langchain-ai/langchain | "LangChain provides the engineering platform and open source frameworks developers use to build, test, and deploy reliable AI agents." |
| open-webui/open-webui | "Run AI on your own terms. Connect any model, extend with code, protect what matters—without compromise." |
| excalidraw/excalidraw | "Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them." |
| shadcn-ui/ui | "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code." |
| Comfy-Org/ComfyUI | "Comfy is the AI creation engine for visual professionals who demand control." |

---

## 3. Keywords meta（仅 2/10 命中；多数项目已放弃此信号）

只有 2 个项目仍保留 `<meta name="keywords">`：

- **open-webui** [s7]: `Open WebUI, Ollama UI, Ollama web interface, local LLM, run LLM locally, AI prompts, AI tools, LLM interface, self-hosted AI, open source LLM, AI functions, AI pipelines, ChatGPT alternative, Claude alternative, private AI, local AI chat, LLM web UI, AI community, prompt library, AI workflow` — 含 4 个 **alternative-to** 长尾词（Ollama UI / ChatGPT alternative / Claude alternative / Ollama web interface）
- **shadcn-ui** [s9]: `Next.js, React, Tailwind CSS, Components, shadcn` — 极简，纯生态绑定关键词

> 8/10 项目把 keywords 留空或不发：与 Google 在 2009 年明确声明不再用 keywords meta 排名一致；这是**结构信号正常**，不是缺陷。`langchain-ai` 是唯一连 OG 三件套都不发的项目，结构信号最弱（疑落地页是营销公司框架默认产物）[s6]。

---

## 4. 关键观察（候选 playbook 素材，待 case-study 单独验证）

1. **"alternative-to" 长尾词只有 open-webui 显式打**：把"Ollama UI / ChatGPT alternative / Claude alternative"写进 keywords，对应 `[community:seo]` 子项的"对标头部产品引流"打法 [s7]。
2. **动态 OG image 只 shadcn 一家**：`og:image` URL 是 `?title=...&description=...` 模板（Vercel OG），可单 demo 关联 `[tooling:social-gen]` 与 `[facade:social]` [s9]。
3. **vscode 标题超界**：99 字符明显违反 Google SERP 50-60 字符建议 → 巨头资源型项目"标题塞关键词矩阵"是反常打法，**不可** 复制到中小项目（受众已知品牌时可豁免）[s1]。
4. **ollama / excalidraw 走极简路线**：title=`Ollama` / `Excalidraw Whiteboard` 完全不堆关键词，依赖品牌已建立 → 反例：`[facade:tagline]` 子项的"品牌期 vs 增长期"分层 [s3][s8]。
5. **langchain landing 缺 OG 三件套**：100K+ ★ 项目里唯一一个 → P1 case-study 应抓 wayback 看是否最近回退 [s6]。

---

## 5. 引用（10 条 landing-page 抓取，原始 HTML 已通过 curl 取得，未存全文）

- `[s1]` `https://code.visualstudio.com` — captured 2026-04-27
- `[s2]` `https://n8n.io` — captured 2026-04-27
- `[s3]` `https://ollama.com` — captured 2026-04-27
- `[s4]` `https://dify.ai` — captured 2026-04-27
- `[s5]` `https://nextjs.org` — captured 2026-04-27
- `[s6]` `https://www.langchain.com` — captured 2026-04-27
- `[s7]` `https://openwebui.com` — captured 2026-04-27
- `[s8]` `https://excalidraw.com` — captured 2026-04-27
- `[s9]` `https://ui.shadcn.com` — captured 2026-04-27
- `[s10]` `https://www.comfy.org` — captured 2026-04-27

---

## 6. 已知缺口（hard-fail 标注）

- D13.ranking: 排名/搜索量/外链 → **未取**，需 Ahrefs/SEMrush 等付费源；本表 **拒绝** 用第三方猜测填充。
- D13.history: title/description 演变历史 → 需 wayback diff，单次抓取不可推断；P1 case-study 阶段补。
- D13.docs-vs-landing: 本表只抓 landing page，未抓文档站根（如 `docs.ollama.com` 之类不存在或重定向）；与 `[docs:site-stack]` 子项的"docs 站 SEO"分开度量。
- D13.h1: 未抓取 `<h1>` 与 hero 文案对齐性，只取了 `<title>`；P1 阶段补 hero/H1 三件套对齐度量。

> 不允许"信号缺失自动判 0"或"用第三方排名工具的免费档口数据 fallback"。

## 7. 变更日志
- 2026-04-27 v0.1.0 — Research Lead 初版（10 项目 × landing meta 结构信号 + 全文标题/描述 + keywords 命中分析）
