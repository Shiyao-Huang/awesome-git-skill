---
name: oss-scorecard
description: Deeply evaluate an open-source or private repository from real code, docs, project goals, target audience, and release stage—not just surface GitHub metadata. Use when the user wants a serious repo audit, launch-readiness review, architecture/readiness diagnosis, pre-release or private-repo evaluation, or a case-study-backed improvement plan; when they want a local worktree or unreleased branch assessed; or when they ask how far a project is from breakout open-source quality. Use the quick GitHub-only score only as a secondary baseline when local code is unavailable.
---

# OSS Scorecard Skill

## What this skill is for

Use this skill to turn the repo's knowledge base into a **real project diagnosis**.

Default stance:
- **code first**
- **goal / audience aware**
- **knowledge-base grounded**
- **surface metadata only as supplement**

This repo already contains the high-value assets:
- case studies = empirical examples
- benchmarks = evaluation language
- playbooks = improvement actions
- anchors/findings = quantitative and narrative baselines

The skill's job is to apply those assets to a real project, especially when the repo is:
- private
- unreleased
- on a local worktree / feature branch
- strong internally but weak on public packaging

## Execution modes

### Mode A — Deep audit (default)

Use when any of these are true:
- the user provides a local path
- the repo is private
- the target is an unreleased branch / worktree
- the user explicitly wants code-quality / architecture / audience / product-fit analysis

Evidence priority:
1. local code and file tree
2. docs content
3. tests / workflows / scripts
4. GitHub metadata only as a supplement

### Mode B — Quick baseline

Use only when:
- the user provides only a public GitHub repo or URL
- local code is unavailable
- they want a fast first-pass benchmark

Quick baseline is useful, but must be labeled clearly as:
- **surface-first**
- **not a substitute for code audit**

## Workflow

### 1. Normalize the target

Accept any of:
- local path
- `owner/repo`
- `owner/repo@ref`
- GitHub repo URL
- GitHub tree URL

If a local path is available, prefer it over GitHub-only analysis.

### 2. Infer the project's reality before scoring

Before giving any verdict, infer and state:
- project goal
- target audience
- current stage (`internal`, `pre-release`, `public beta`, `public OSS`)
- whether the main problem is **engineering maturity** or **open-source packaging/readiness**

Infer this from:
- README / docs
- package names / workspace layout
- scripts / workflows
- code entrypoints
- issue / release posture (if public)

If still ambiguous, state the hypothesis explicitly instead of pretending certainty.

### 3. Read the real project, not just filenames

At minimum inspect:
- root `README.*`
- root/package-level manifests (`package.json`, `pyproject.toml`, etc.)
- workspace / monorepo structure
- test files and test scripts
- CI / release workflows
- contribution / security docs
- docs / examples / tutorials
- public packaging / install paths

When the project is code-heavy, prioritize:
- architecture boundaries
- build/test/typecheck reality
- release and distribution mechanics
- onboarding path for a new contributor or user

### 4. Use automation honestly

If a real automated path exists, use it.

Quick GitHub baseline:
```bash
node ./bin/oss-scorecard.mjs audit <owner/repo[@ref]> --format json
```

Collector-only raw evidence:
```bash
node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo> --kind all
```

Index / repo hygiene:
```bash
node ./bin/oss-scorecard.mjs index --root .
```

But do **not** let automation define the whole answer. The skill's main value is the code-aware analysis around those signals.

### 5. Analyze through the six domains, grounded in reality

Always structure findings under:
- `facade`
- `docs`
- `community`
- `quality`
- `caselib`
- `tooling`

Load `skills/oss-scorecard/references/deep-analysis-dimensions.md` for serious audits. It defines, per domain:
- what files to read
- what deep questions to ask
- which case studies / benchmarks to compare against
- how to judge the repo in a stage-aware way

Do not treat these domains as checkbox buckets. Evaluate each domain through real usage questions:

- **facade** — Does the project clearly explain what it is, for whom, and why now?
- **docs** — Could a new user or contributor actually succeed from the docs that exist?
- **community** — Is the repo set up to absorb real users / contributors, or only to look open?
- **quality** — Do tests, CI, security, and maintenance signals reflect actual engineering discipline?
- **caselib** — Is there proof of adoption, use-case framing, migration guidance, or release history?
- **tooling** — Does the repo have real automation and developer ergonomics, not just scripts on paper?

### 6. Ground judgment in the knowledge base

For major claims and recommendations, anchor them to this repo's assets:
- `case-studies/` for comparable examples and boundary conditions
- `benchmarks/*.md` for evaluation language
- `benchmarks/case-anchors.yaml` for empirical anchor points
- `research/FINDINGS.md` for cross-project patterns
- `playbooks/` and `playbooks/quick-wins.md` for concrete fixes

The output should feel like:
- “this repo resembles X in these ways”
- “it falls short of Y pattern seen in Z projects”
- “the next action is A, because B case study shows why it matters”

### 7. Separate internal maturity from public OSS readiness

This distinction is mandatory.

Many repos are:
- strong codebases
- weak open-source products

Do not collapse that into one vague number.

Call out separately:
- **code / engineering maturity**
- **public open-source readiness**
- **fit between project goal, audience, and current packaging**

## Output contract

Every serious audit should include:

1. target and capture date
2. audit mode (`deep` or `quick`)
3. inferred goal / audience / stage
4. strongest evidence from code/docs/workflows
5. six-domain findings
6. explicit distinction between internal maturity vs OSS readiness
7. top 3-5 actions
8. citations to case studies / benchmarks / files / commands
9. explicit `UNVERIFIED` / manual boundaries

Preferred final sections:
1. Project reality snapshot
2. Goal / audience / stage hypothesis
3. Code & architecture assessment
4. Six-domain findings
5. Internal maturity vs public readiness
6. Case-study-backed recommendations
7. Evidence list

## Hard rules

1. **No fabricated depth** — reading a file list is not “deep analysis”.
2. **No fabricated scores** — if evidence is weak, say so.
3. **`UNVERIFIED` must stay visible** — never silently hide or zero-fill missing evidence.
4. **Local/private first** — if real code is available locally, do not settle for a public-surface answer.
5. **Knowledge base is the differentiator** — major recommendations should reference this repo's case studies, findings, anchors, or playbooks.
6. **Quick mode must be labeled** — public GitHub metadata alone is a baseline, not the product's highest value.

## Useful repo assets

- `skills/oss-scorecard/references/asset-map.md` — where to pull evidence and guidance
- `skills/oss-scorecard/references/deep-analysis-dimensions.md` — per-domain deep-analysis framework
- `benchmarks/` — domain evaluation language
- `benchmarks/case-anchors.yaml` — empirical cohort anchors
- `research/FINDINGS.md` — public top findings
- `playbooks/quick-wins.md` — high-ROI fixes
- `case-studies/` — concrete comparables and cautionary boundaries
- `docs/architecture.md` — product DNA and guardrails
