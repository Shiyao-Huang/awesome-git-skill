# Competitive Landscape

> Captured 2026-04-27 from live GitHub search. Focus: what already has distribution, what problem space is occupied, and where `oss-scorecard` is differentiated.

## 1. Executive conclusion

`oss-scorecard` is **not** entering an empty tooling market. It is entering a proven shape market — **skill / agent / workflow tooling** — but a still-open problem slot: **open-source growth scoring**.

The strongest adjacent markets already validated on GitHub are:

1. **Claude Code skills / harnesses / workflow bundles**
2. **General agent frameworks**
3. **Security-only OSS scorecards**

What is still missing is a product that answers:

> “Why is this GitHub repository not growing, and what should the maintainer fix first?”

That is the slot `oss-scorecard` intends to occupy.

## 2. Direct competitors

### 2.1 OSSF Scorecard
- Repo: `ossf/scorecard`
- Stars: ~5.4K
- Shape: CLI + GitHub Action
- Strength: trusted OSS health/security scoring brand
- Limitation: focuses on **security health**, not growth, docs, community, facade, case library, or tooling quality as a growth surface

### 2.2 OSS Insight
- Repo: `pingcap/ossinsight`
- Stars: ~2.3K
- Shape: analytics / dashboard / trend exploration
- Strength: strong visibility into repository and ecosystem metrics
- Limitation: explores data, but does **not** produce a practical 6-domain score + top-fix workflow for maintainers

## 3. Adjacent distribution models already validated

### 3.1 Skill / agent harness ecosystem

These projects prove that **skill-first distribution** is viable and explosive:

| Project | Approx. stars | Why it matters |
|---|---:|---|
| `affaan-m/everything-claude-code` | 168K | Skill/harness bundle can reach mass adoption |
| `anthropics/skills` | 124K | Official skill shape is mainstream |
| `forrestchang/andrej-karpathy-skills` | 91K | Even a narrow skill package can explode |
| `garrytan/gstack` | 84K | Multi-role workflow packaging has demand |
| `ComposioHQ/awesome-claude-skills` | 56K | Discovery/aggregation market is large |

**Implication:** users already know how to adopt skills, CLAUDE.md overlays, and workflow packs. `oss-scorecard` should use that muscle memory.

### 3.2 General agent / framework ecosystem

| Project | Approx. stars | Role |
|---|---:|---|
| `langchain-ai/langchain` | 135K | broad agent application framework |
| `anthropics/claude-code` | 118K | terminal-native coding agent |
| `microsoft/autogen` | 57K | multi-agent programming framework |
| `microsoft/agent-framework` | 9.8K | orchestration framework |

**Implication:** the broad agent market is crowded. Competing as “just another agent framework” would be weak. Competing as a **specialized OSS growth auditor** is sharper.

### 3.3 Distribution benchmark: builderbio.dev

`builderbio.dev` is not a direct competitor on the scoring/problem space, but it is an excellent benchmark for **skill packaging and install UX**. Its key product lesson is:

```bash
curl -sfL https://builderbio.dev/install.sh | bash
```

Why it matters:
- one-line install dramatically lowers first-use friction
- the site clearly tells users to paste the command into their coding agent
- the installer ships a **complete skill bundle** (skill file, scripts, references, metadata), not just a markdown prompt
- the output becomes a **shareable artifact**, which drives organic distribution

Implication for `oss-scorecard`:
- Skill distribution should target **curl | bash parity**
- install should feel zero-config for Claude Code / Codex / Cursor users
- `install.sh` should provision the full audit bundle: `SKILL.md`, scripts, references, agent metadata, and local linking
- getting-started docs should lead with one-command install, not internal repo structure

This is a **distribution benchmark**, not a functional competitor.


## 4. What no one is clearly owning

Across the repositories above, there is still no widely adopted product that combines:

1. a **6-domain** OSS evaluation model
2. **case-study-backed** growth reasoning
3. **playbook-linked** fixes
4. a **skill + CLI + team-template** distribution stack

This is the main whitespace.

## 5. Why `oss-scorecard` is differentiated

### 5.1 It scores growth surfaces, not just security
`oss-scorecard` covers:
- facade
- docs
- community
- quality
- caselib
- tooling

That is fundamentally broader than OSSF Scorecard.

### 5.2 It is grounded in real breakout samples
The current repo already contains:
- benchmark rubrics
- Tier-1 2–6 month breakout cohort
- 15 case studies
- playbooks tied to weak signals

This gives `oss-scorecard` a stronger bridge from **score → recommendation**.

### 5.3 It has multiple product surfaces
The intended stack is:
1. **Skill** — easiest distribution
2. **CLI** — stable automation and CI surface
3. **Legion / Agents** — reusable execution team on genome-hub

This makes it more than a script and more than a documentation pack.

### 5.4 It can become a public dataset
Because the case studies, cohort matrix, and benchmark rules already exist, the project can expose:
- structured benchmark rules
- comparable case-study metadata
- public score reports

That increases contribution surface and compounding value.

## 6. Product-shape recommendation

### Primary entry
**Skill first**

Reason:
- distribution pattern already validated by high-star skill projects
- lower user friction than a pure CLI-first launch
- fits the AI-native ecosystem from which the breakout cohort was drawn

### Secondary entry
**CLI**

Reason:
- CI / GitHub Action integration
- reproducible automation
- stable base for the skill runtime

### Long-term moat
**Legion + Agent genomes**

Reason:
- harder to copy than a thin skill wrapper
- already published to genome-hub
- turns the methodology into reusable organization capability

## 7. What this means for roadmap prioritization

Do **not** position `oss-scorecard` as:
- a generic agent framework
- a generic skill marketplace
- a pure research archive
- a security-only scorecard clone

Position it as:

> A practical OSS growth scorecard: analyze a repo, explain the gaps, and point to the highest-leverage next actions.

## 8. Working product thesis

The clearest user-facing promise today is:

```bash
oss-scorecard audit owner/repo
```

Expected result:
- domain scores
- evidence trail
- top 3 gaps
- top 3 actions
- links to relevant playbooks and comparison cases

That promise is legible, differentiated, and grounded in already-built assets.
