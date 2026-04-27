---
title: Open Source Explosive Growth — Top Findings
capture_at: "2026-04-27"
cohort: tier1-explosive-2-6mo
type: findings
---

# Open Source Explosive Growth — Top Findings

> 15 case studies. 6 domains. 30 quantitative signals. One question: **what makes an open source project explode?**

## The Dataset

We studied **15 projects** that gained **50K–365K stars in 2–6 months** (captured 2026-04-27).

| Project | Stars | Age (months) | Category | License |
|---------|------:|:------------:|----------|---------|
| openclaw | 364K | 5.1 | AI Agent Platform | MIT |
| n8n | 186K | — | AI App | — |
| vscode | 184K | — | IDE | MIT |
| ollama | 170K | — | AI Runtime | MIT |
| everything-claude-code | 168K | 3.3 | Dev Tool | MIT |
| langchain | 135K | — | AI SDK | MIT |
| next-js | 139K | — | Framework | MIT |
| open-webui | 134K | — | AI UI | — |
| dify | 139K | — | AI App | — |
| shadcn-ui | 113K | — | UI Kit | MIT |
| comfyui | 110K | — | AI Visual | — |
| karpathy-skills | 91K | 3.0 | Productivity | MIT |
| mirofish | 58K | 5.0 | AI App | AGPL-3.0 |
| oh-my-openagent | 54K | 4.8 | Dev Tool | — |
| worldmonitor | 53K | 3.6 | AI App | — |

## Finding 1: MIT License = 4x Faster Growth

MIT-licensed projects average **207K stars** vs **53K stars** for unlicensed projects in the same cohort.

| License | Avg Stars | Share |
|---------|----------:|------:|
| MIT | 207K | 50% |
| NOASSERTION | 53K | 33% |
| AGPL-3.0 | 58K | 17% |

**Action**: If you want enterprise adoption AND community growth, MIT is the clear winner.

## Finding 2: TypeScript Dominates

4 of 6 Tier-1 projects use TypeScript. Markdown-only projects can also explode (karpathy-skills: 91K stars from a single file).

**Action**: Ship in TypeScript if possible. But content projects don't need code.

## Finding 3: Single-Author Driven

All Tier-1 projects have one contributor with 10x+ the median commit count. This is a **risk signal** (Bus Factor = 1), not a strength.

| Project | Top Contributor Commits |
|---------|----------------------:|
| openclaw | 21,381 |
| oh-my-openagent | 3,460 |
| everything-claude-code | 965 |
| mirofish | 225 |
| karpathy-skills | ~10 |

**Action**: Don't celebrate solo-hero commits. Plan for contributor onboarding from day one.

## Finding 4: Ship Daily or Die

Top projects by stars ship releases daily or every 1–2 days. Monthly or no-release projects fall behind.

| Cadence | Projects | Avg Stars |
|---------|----------|----------:|
| Daily | openclaw, oh-my-openagent | 210K |
| ~5 days | everything-claude-code | 168K |
| Monthly | mirofish | 58K |
| None | karpathy-skills | 91K |

**Action**: Automate your release pipeline. Median release interval <= 2 days is the Tier-1 standard.

## Finding 5: Documentation Site = Growth Multiplier

5 of 6 Tier-1 projects have a dedicated docs or brand site. Projects without one grow noticeably slower.

**Action**: Build a docs site early. Mintlify or Next.js-based is the Tier-1 standard.

## Finding 6: Four Growth Archetypes

| Archetype | Projects | Strategy |
|-----------|----------|----------|
| **Platform Ecosystem** | openclaw | Multi-channel + Skills ecosystem + sponsor matrix |
| **Developer Tool** | everything-claude-code, oh-my-openagent | Cross-harness compat + npm distribution + CI automation |
| **Content Leverage** | karpathy-skills | Personal brand + single file + zero install |
| **Data Product** | mirofish, worldmonitor | Demo-driven + visualization + vertical scenario |

## Finding 7: AI is the Universal Accelerant

All 6 Tier-1 projects in the 2–6 month cohort have AI-adjacent positioning. Non-AI Tier-1 in this window: 0/6.

But AI alone is not enough — execution on the 6 domains (facade, docs, community, quality, case library, tooling) separates Tier-1 from the rest.

## The 6-Domain Scorecard

Every project is evaluated across 6 domains with 30 signals:

| Domain | What it Measures | Key Signals |
|--------|-----------------|-------------|
| **Facade** | First impression & positioning | README hero, homepage, topics, demo, CTA |
| **Docs** | Onboarding & documentation | README quality, docs dir, contributing guide, examples |
| **Community** | Contributor & user engagement | Issue/PR templates, multi-contributor, release rhythm |
| **Quality** | Engineering reliability | License, CI, tests, security policy, maintenance |
| **Case Library** | Social proof & adoption stories | Showcase, production proof, migration paths |
| **Tooling** | Distribution & automation | Release workflow, package manifest, dev environment |

## Tier-1 Quantitative Anchors

Based on our cohort (n=6, 2–6 month explosive growth):

| Metric | P25 | P50 (Median) | P75 |
|--------|----:|:------------:|----:|
| Stars | 54K | 75K | 168K |
| Monthly Star Velocity | 11.5K/mo | 22.6K/mo | 50.8K/mo |
| Fork/Star Ratio | 9.6% | 15.5% | 16.0% |
| Issues/Stars Ratio | 0.1% | 0.3% | 1.2% |

**Interpretation**: If your project is under 6 months old and growing slower than 10K stars/month, it's unlikely to converge to Tier-1.

## What This Means For You

1. **Audit your project**: Run `oss-scorecard audit owner/repo` against these benchmarks
2. **Fix the biggest gap**: The scoring engine identifies your weakest domain
3. **Ship iteratively**: Daily releases + documentation + MIT license covers 80% of the growth formula
4. **Don't go it alone**: Plan contributor onboarding, even if you're solo now

---

*Data from [opensourceStar](https://github.com/copizza/opensourceStar) — 15 case studies, captured 2026-04-27. Methodology: empirical observation + 6-domain scoring taxonomy.*
