# Research Plan Skeleton — 15w★ OSS Intelligence Library

Owner: Research Lead (researcher)
Status: DRAFT v0.1 — pending master alignment
Date: 2026-04-27

## 0. North Star
Build an evidence-driven intelligence library that lets us reverse-engineer how 2025–2026 era projects reach 100k–150k★, then derive an actionable scoring rubric + playbooks. Every conclusion must be traceable to a primary source (repo file, commit, blog post, archived HN/PH thread, X post URL).

Hard rule: no fallback, no guessing. If a data point is unverifiable, label it `UNVERIFIED` and move on.

## 1. Deliverables (P0 → P2)

### P0 — Skeleton & Methodology (week 1)
- `_meta/sources.md` — primary source registry (repo URL, archive snapshot, retrieval date, license)
- `_meta/methodology.md` — how we measure growth, integrity rules, citation format
- `benchmarks/scorecard-v0.md` — first-cut rubric dimensions (input from Solution Architect)
- `case-studies/_template.md` — case-study schema all studies must conform to

### P1 — Case Studies & Channel Intel (week 2)
- 10–15 case studies under `case-studies/<slug>.md`, covering 5 categories:
  - dev-tool (e.g. Bun, uv, Biome, Zed)
  - AI (e.g. Ollama, vLLM, LangChain, Open WebUI, ComfyUI)
  - framework (e.g. Astro, Tauri, SolidStart, Hono)
  - infra (e.g. Coolify, Dokploy, Pocketbase, Supabase open core)
  - UI kit (e.g. shadcn/ui, Magic UI, daisyUI, Tremor)
- `playbooks/research/launch-channels.md` — HN / PH / X / Reddit / 即刻 / V2EX / 掘金 timing & format intel
- `benchmarks/industry-baseline.md` — README completeness, demo type, social card, docs site, issue median, release cadence baselines

### P2 — Toolchain & Synthesis (week 3)
- `playbooks/research/toolchain.md` — docs-site (Nextra/Starlight/Mintlify/Docusaurus), badges, OG card pipelines, release-please, changesets, Lighthouse, analytics
- `benchmarks/scorecard-v1.md` — finalized rubric (with Solution Architect)
- `_meta/synthesis.md` — cross-case patterns, anti-patterns, falsified hypotheses

## 2. Case-study schema (per project)
1. Identity: repo URL, license, first commit date, current ★ count (date-stamped)
2. Growth curve: ★ per month from star-history.com snapshot (URL + retrieval date)
3. Key milestones: launch post, viral moment, v1.0, funding/announcement (commit/post URL each)
4. Marketing strategy: launch channels, cadence, who tweeted, who blogged
5. Docs & community: docs site stack, contributor count, issue/PR median response, Discord/Slack size
6. Release rhythm: tag frequency, changelog discipline, release-please/changesets
7. SEO: top organic keywords (Ahrefs/SimilarWeb if available, else `UNVERIFIED`)
8. What we can copy / what we cannot copy (and why)

## 3. Evidence rules
- Every numeric claim cites a URL + retrieval date.
- HN/PH/X posts archived to `web.archive.org` snapshot before citing.
- Anything we cannot verify → `UNVERIFIED` tag, never silently dropped.
- No README authoring this phase — feature-first, docs-last per team rule.

## 4. Coordination
- Sync with Solution Architect on rubric dimensions before P1 closes.
- Report blockers immediately via `request_help` (e.g. paywalled data, rate-limited APIs).
- Status pings to master on each P-phase exit.

## 5. Open questions for master
1. Target output language: Chinese, English, or both? (default: zh-CN with EN headings)
2. Are we restricted to OSS-licensed only, or also dual-license/source-available?
3. Budget for paid SEO tools (Ahrefs, SimilarWeb)? If none, we mark SEO data `UNVERIFIED`.
4. Audience for the deliverable: internal strategy team, or public-facing?
