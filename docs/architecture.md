# oss-scorecard — Architecture

> Status: v0.1 (bootstrap). Captured 2026-04-27. Owned by architect role.
> Companion docs: [methodology.md](./methodology.md) (rubric), [changelog.md](./changelog.md) (history).

## 0. Design Principles (Product DNA)

These two principles are non-negotiable constraints on all features and layers. They originate from the user and are not subject to override by individual implementers.

### 0.1 Automation over configuration

> "用户需要判断决策操作的越少、系统的自动化程度越高"

- `oss-scorecard audit owner/repo` must produce a complete report with zero flags, zero interactive prompts, and zero manual domain selection.
- All scoring parameters use evidence-backed defaults derived from `benchmarks/case-anchors.yaml` percentiles, not hardcoded magic numbers.
- Missing evidence in a domain must be surfaced as `insufficient_evidence` / `UNVERIFIED` in the report — **never silently hidden or zero-filled**. Silent degradation violates trust and makes reports unactionable.
- The system only hard-fails the whole audit when a global prerequisite is missing (e.g. collector cannot initialize). Domain-level gaps degrade gracefully with explicit marking.

### 0.2 Reflexivity = intelligence ceiling

> "如果基于自反性则是智能程度越高"

- The scoring rubric must be evaluable by the same scoring rubric (meta-audit). oss-scorecard's own repo should be a valid `oss-scorecard audit` target.
- Consecutive audits should be diffable: did the user act on prior recommendations? Did scores change?
- Rubric thresholds must converge toward data-driven values over time (v0.1 manual → v0.2 case-anchors percentile → v0.3 feedback loop from audit outcomes).
- The feedback loop is: audit result → append/modify sample in case-anchors → recompute percentile → next audit uses updated thresholds. This loop must remain architecturally open even if not yet implemented.

### Evolution roadmap

| Version | Scoring mode | Threshold source | Reflexivity |
|---------|-------------|-----------------|-------------|
| v0.1 (current) | Boolean signals, averaged per domain | Manual (bootstrap-rules.ts) | None |
| v0.2 | Weighted/threshold signals | case-anchors.yaml percentiles (P50) | Thresholds auto-update when anchors refresh |
| v0.3 | Full signal model with domain weights | Audit outcome feedback loop | Meta-audit + self-calibrating weights |

## 1. Why this doc exists

`oss-scorecard` has three growing surface areas — a **runtime audit CLI** that scores any GitHub repo, a **case-study indexer** that validates curated research, and a **public history layer** that exposes how the team itself works. Implementers need a single place that says which layer owns what, where new code goes, and which boundaries must not be crossed.

This doc is descriptive of what exists today and prescriptive about where new work lands.

## 2. Layered model

```
┌──────────────────────────────────────────────────────────────────┐
│  bin/oss-scorecard.mjs                  (dispatcher, ~150 LoC)   │
│  audit │ index │ score │ history                                 │
└──────────────────────────────────────────────────────────────────┘
              │            │            │              │
              ▼            ▼            ▼              ▼
┌─────────────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐
│ packages/cli        │ │ tools/     │ │ tools/     │ │ history/ │
│ (audit pipeline)    │ │ index.ts   │ │ scorecard- │ │ public   │
│                     │ │ (fm-       │ │ run.ts     │ │ ledgers  │
│                     │ │  indexer)  │ │ (legacy)   │ │          │
└─────────┬───────────┘ └────────────┘ └────────────┘ └──────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│ packages/core                                                    │
│   github.ts          → RepoSnapshot     (audit collector)        │
│   bootstrap-rules.ts → DomainRule[]     (6-domain rubric)        │
│   score.ts           → ScoreReport      (pure scorer)            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ packages/collectors                                              │
│   github-repo.ts → GitHubRepoProfile  (research collector)       │
│   used by case-study research, NOT by the audit pipeline         │
└─────────────────────────────────────────────────────────────────┘
```

There are intentionally **two collectors**. They are not duplicates; they answer different questions:

| Collector | Output | Consumer | Stability |
|-----------|--------|----------|-----------|
| `packages/core/src/github.ts` | `RepoSnapshot` (everything the rubric needs in one shot) | `score.ts` | Stable, locked to rubric inputs |
| `packages/collectors/src/github-repo.ts` | `GitHubRepoProfile` (snapshot + contributors bucket + release cadence) | Research workflows, case-study evidence | Evolving, additive |

A future v0.2 may merge them, but only after the rubric stops growing. Until then, **do not import core from collectors or vice versa.**

## 3. The 4 dispatcher commands

`bin/oss-scorecard.mjs` is a thin router. Each command has a single owning module:

| Command | Owns | Entry | Output |
|---------|------|-------|--------|
| `audit <owner/repo>` | Live rubric scoring of a real GitHub repo | `packages/cli/src/index.ts` → `core` | terminal / JSON / Markdown report |
| `index` | Front-matter & schema validation across `playbooks/` and `case-studies/` | `tools/index.ts` | exit code + warnings list |
| `score <owner/repo>` | Machine-readable live repo scoring | `packages/cli/src/index.ts` → `core` (forced JSON mode) | `ScoreReport` JSON + evidence trail |
| `score --legacy --config ...` | Legacy case-study scorecard (pre-rubric MVP) | `tools/scorecard-run.ts` | per-case scores against `tools/scorecard-run.config.json` |
| `history` | Enumerate curated public history surfaces | inline in `bin/` | text or JSON listing |

**Rule:** new commands must be added to the dispatcher and pointed at exactly one owning module. No multi-target commands.

## 4. The audit pipeline (collector → core → cli)

This is the only data path that powers `oss-scorecard audit`:

```
parseRepoTarget(string)                 → GitHubRepoTarget
  └─ collectRepoSnapshot(target)        → RepoSnapshot   (network I/O)
       └─ scoreRepoSnapshot(snapshot)   → ScoreReport    (pure)
            └─ render{Terminal,Markdown}Report(report)   (pure)
```

Invariants:
- `score.ts` is **pure**: same `RepoSnapshot` in → same `ScoreReport` out. No I/O, no `Date.now()`, no env reads.
- `github.ts` is the **only** module that calls the GitHub API in the audit path.
- `format.ts` may not import `github.ts`. It consumes `ScoreReport` only.
- The CLI may not skip `score.ts` and emit raw snapshots — every public output passes through scoring.

These invariants are what let the rubric evolve safely: if the score function is pure, we can replay historical snapshots against a new rubric without re-fetching.

## 5. The 6-domain rubric layer

`packages/core/src/bootstrap-rules.ts` defines `DomainRule[]`, one per domain in the canonical taxonomy:

```
facade · docs · community · quality · caselib · tooling
```

Each `DomainRule` carries a list of `SignalRule`s, where each signal is:
```
{ id, label, description, recommendation,
  evaluate: (snapshot) => boolean,
  evidence: (snapshot) => string }
```

This shape is deliberately **boolean per signal, then averaged per domain** in v0.1. A weighted/threshold mode is planned but must not be added until at least 10 real-world repos have been scored end-to-end and the failure modes are visible.

**Where to add a new signal:**
1. Add fields to `RepoSnapshot` only if the API call is cheap and reusable.
2. Add the `SignalRule` to the relevant `DomainRule` in `bootstrap-rules.ts`.
3. Add a unit test in `score.test.ts` that exercises both pass and fail.
4. Do **not** change `score.ts` — the scoring engine is rubric-agnostic.

## 6. The case-study / research path (separate)

`case-studies/*.md` and `playbooks/*.md` are governed by `templates/case-study.md` (v1 schema) and validated by `tools/index.ts` (the front-matter indexer). This path:

- Is **not** scored by `packages/core`. The rubric scores live repos; case studies are curated narratives with citation requirements.
- Uses `packages/collectors/src/github-repo.ts` for evidence collection during research.
- Hard-fails on missing required front-matter fields (`id: case-*`, `star_count_at`, `category`, `dimensions_covered`, `sources[]` ≥ 3 with `captured_at`).
- Allows `UNVERIFIED: <reason>` as the **only** acceptable fallback when a fact cannot be sourced.

The two paths converge only in the dispatcher and in the shared 6-domain taxonomy. They do not share collectors, schemas, or scoring.

## 7. Public history layer

`history/` and a small set of in-repo ledgers (listed in `bin/oss-scorecard.mjs` under `PUBLIC_HISTORY_FILES`) are the **only** sanctioned export of how the team operates. Policy:

- Curated ledgers (`task-ledger.jsonl`, `decision-log.md`, milestone JSONs) — yes, ship publicly.
- Raw chat streams, runtime logs, MCP traces — no, never ship publicly. They are high-noise and may carry secrets.
- Adding a new file to `PUBLIC_HISTORY_FILES` requires it to be reviewed for redaction first.

## 8. Boundaries that must not be crossed

| ❌ Don't | ✅ Do |
|---------|-------|
| Import `packages/cli` from `packages/core` | Import core types from cli |
| Call GitHub API outside `github.ts` (audit path) or `github-repo.ts` (research path) | Add a new method to the right collector |
| Embed rubric thresholds inside `score.ts` | Put them in `bootstrap-rules.ts` |
| Read `process.env` inside `score.ts` | Read it at the dispatcher or CLI layer and pass values down |
| Add a 4th collector | Extend one of the existing two |
| Mutate `RepoSnapshot`/`ScoreReport` objects in place | Return new objects (immutability is enforced by convention) |
| Add a `bin/` subcommand without a dedicated owning module | Create the module first, then wire it |

## 9. Versioning

- `ScoreReport.version = "0.1.0-bootstrap"` — bumps only when rubric semantics change.
- `ScoreReport.mode = "bootstrap-v0"` — will become `"weighted-v1"` when thresholds replace booleans.
- Front-matter schema version lives in `templates/case-study.md` and is enforced by `tools/index.ts`.

Reports across versions are not directly comparable. Cross-version comparison must go through a documented migration in `docs/changelog.md`.

## 10. Open questions (for next architecture review)

1. **Collector unification**: when does the audit `RepoSnapshot` absorb contributor bucket + release cadence from the research collector? Trigger: a rubric signal that needs them.
2. **Weighted scoring**: at what point do we replace boolean signals with a thresholds[]/manual_rubric YAML loader (already drafted in `benchmarks/`)?
3. **Persistent snapshot store**: should `audit` snapshots be written to `history/` for replayable scoring? Likely yes once v1 rubric stabilizes.
4. **Skill/Legion/Agents packaging**: how does the genome-hub bundle relate to this repo's CLI? Currently independent — genome-hub publishes runtime templates, this repo publishes CLI + rubric. Decide if/when they merge.
5. **Install UX — `curl | bash` parity** (user-mandated 2026-04-27): `oss-scorecard` must match builderbio.dev's one-liner install (`curl -sfL …/install.sh | bash`) for virality and zero-friction adoption. Implications:
   - Need an `install.sh` or equivalent single-command entry point.
   - `packages/core/github.ts` API key acquisition must gracefully cascade: `gh auth token` → env var → interactive prompt on first run.
   - Getting-started docs must lead with the one-liner, not multi-step instructions.
   - Skill packaging must be `curl | bash`-installable, not manual file copy.

---

Maintainer: architect (role-genome). Update this doc whenever you change a layer boundary, add a top-level `bin/` command, or introduce a new collector.
