---
name: oss-scorecard
description: Audit a GitHub repository across six open-source growth domains and turn the result into concrete fixes. Use when the user wants to score, audit, benchmark, compare, or improve a repo's facade, docs, community, quality, case-library, or tooling posture; when they ask for an OSS scorecard, repo health review, repo growth audit, or case-study-backed improvement plan; or when they want a GitHub repo assessed against the benchmarks and playbooks in this workspace.
---

# OSS Scorecard Skill

## What this skill does

This skill turns the assets in this repo into a usable repo-audit workflow:

1. collect public repo evidence
2. map evidence to the 6 domains
3. identify the top gaps
4. map each gap to a playbook or template-backed fix

## Current execution model

Treat `oss-scorecard` as **skill-first with partial automation**.

- Use `packages/collectors/` for machine-collected GitHub signals
- Use `benchmarks/` for scoring logic
- Use `playbooks/` for fix recommendations
- Use `case-studies/` for comparison anchors

If a subscore cannot yet be computed mechanically, **do not invent a number**. Mark it as manual / not yet automated and keep the evidence trail visible.

## Workflow

### 1. Normalize the target

Accept either:
- `owner/repo`
- full GitHub repo URL

Normalize to `owner/repo` before doing anything else.

### 2. Collect the GitHub baseline

Run the collector first:

```bash
node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo>
```

If you need an artifact on disk:

```bash
node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo> --out metrics/<slug>.repo-profile.json
```

This is the baseline for:
- repo snapshot
- contributors bucket
- release cadence

### 3. Check what is already automated

For repository-wide metadata integrity:

```bash
node ./bin/oss-scorecard.mjs index --root .
```

For scorecard MVP behavior already available in this repo:

```bash
node ./bin/oss-scorecard.mjs score --help
```

Only use automated scoring paths that actually exist. If the requested repo audit goes beyond implemented scoring coverage, explicitly say which parts are automated vs manual.

### 4. Score against the 6 domains

Always organize findings under these six domains:
- `facade`
- `docs`
- `community`
- `quality`
- `caselib`
- `tooling`

Primary references:
- `benchmarks/facade.md`
- `benchmarks/docs.md`
- `benchmarks/community.md`
- `benchmarks/quality.md`
- `benchmarks/caselib.md`
- `benchmarks/tooling.md`

### 5. Turn gaps into actions

For every major gap, map to a concrete next step using:
- `playbooks/`
- `templates/`
- comparable patterns in `case-studies/`

Preferred output shape:
1. strongest domains
2. weakest domains
3. top 3 gaps
4. top 3 fixes
5. evidence list

## Output contract

When producing a repo audit, include:

- target repo
- capture date
- evidence collected
- per-domain findings
- explicit automated vs manual boundary
- top fixes

If you write repo-facing markdown in this workspace:
- prose: Chinese
- machine fields / ids / enum values: English canonical

## Hard rules

1. **No fabricated scores** — if a score is not mechanically or evidentially supported, say so.
2. **Evidence first** — every non-trivial claim should point to a URL, file, or collector artifact.
3. **No fallback masking** — missing collector coverage is a product gap, not a reason to guess.
4. **Config-driven evolution** — prefer updating collectors / rules / templates over ad-hoc one-off logic.

## Useful repo assets

- `packages/collectors/` — GitHub baseline data collection
- `tools/scorecard-run.ts` — current scorecard MVP path
- `benchmarks/` — scoring rules
- `playbooks/` — fix library
- `case-studies/` — comparison anchors
- `history/` — curated public project history
