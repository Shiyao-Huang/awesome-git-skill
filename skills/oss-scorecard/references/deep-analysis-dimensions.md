# Deep Analysis Dimensions

This file turns the repo's knowledge base into **usable analysis dimensions** for the `oss-scorecard` skill.

Use it when running a **serious audit** on:
- a local worktree
- a private repository
- an unreleased branch
- a public repo where code-level judgment matters more than surface GitHub metadata

## How to use this file

For each domain:
1. read the listed file types in the target repo
2. ask the listed deep questions
3. compare against the referenced case-study / benchmark patterns
4. judge the repo in a **stage-aware** way
5. output evidence-backed conclusions and next actions

Do **not** reduce these dimensions to "file exists / file missing". The point is to judge quality, fitness, and readiness.

## Stage-gating rule

Before using these dimensions, infer the project stage:
- `private`
- `prelaunch`
- `public`
- `growth`
- `mature`

Then gate conclusions accordingly:
- for `private` / `prelaunch`, public-growth signals may be `N/A`
- for `public` / `growth`, missing external readiness is a real gap
- never zero-fill missing evidence; use `UNVERIFIED`, `partial`, or `N/A`

---

## 1. Facade

### F1. Problem and positioning clarity
- **Read**: `README*`, docs home/landing copy, package descriptions, workspace names
- **Ask**:
  - Can a target user understand the problem solved in the first 30 seconds?
  - Is the repo symptom-first, or just feature-listing?
  - Does the positioning match what the code actually delivers?
- **Compare against**:
  - `case-studies/andrej-karpathy-skills.md`
  - `case-studies/everything-claude-code.md`
  - `benchmarks/facade.md`
- **Judge**:
  - strong if the repo states who it is for, what first success looks like, and the claim matches the actual implementation surface

### F2. Audience and first-success path
- **Read**: install steps, quickstart, examples, top-level scripts, entrypoints
- **Ask**:
  - Is there an obvious first-success path for the intended audience?
  - Would a new user know what to run first?
  - Are there multiple audiences mixed together without a clear primary path?
- **Compare against**:
  - `case-studies/everything-claude-code.md`
  - `case-studies/mirofish.md`
  - `playbooks/facade.md`
- **Judge**:
  - strong if one primary audience can get to value without reverse-engineering the repo structure

### F3. Demo / proof-of-reality quality
- **Read**: screenshots, videos, docs walkthroughs, runnable demos, example commands
- **Ask**:
  - Is the demo real, current, and consistent with the codebase?
  - Does the repo show an actual workflow, or just present aesthetics?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `case-studies/worldmonitor.md`
  - `benchmarks/facade.md`
- **Judge**:
  - strong if proof-of-reality lowers cognitive load and maps to a real first run

### F4. Packaging coherence
- **Read**: repo name, package names, command names, README wording, install docs
- **Ask**:
  - Do naming, commands, and file layout tell the same story?
  - Is the project packaged as the thing it claims to be?
- **Compare against**:
  - `case-studies/oh-my-openagent.md`
  - `playbooks/facade.md`
- **Judge**:
  - strong if names, install path, and code boundaries reinforce one coherent mental model

---

## 2. Docs

### D1. First-run viability
- **Read**: `README*`, `docs/getting-started*`, examples, install scripts, setup scripts
- **Ask**:
  - Can a realistic user follow the docs and reach first success?
  - Do commands, paths, and prerequisites still match the codebase?
- **Compare against**:
  - `case-studies/everything-claude-code.md`
  - `benchmarks/docs.md`
  - `playbooks/docs.md`
- **Judge**:
  - strong if the docs are executable, current, and audience-specific

### D2. Architecture and mental-model transfer
- **Read**: `docs/architecture*`, plans, package boundaries, code comments, module layout
- **Ask**:
  - Can a contributor understand how the system is composed?
  - Do docs explain why the system is structured this way, not just what files exist?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `research/FINDINGS.md`
- **Judge**:
  - strong if the docs compress real complexity into a learnable model without lying

### D3. Troubleshooting and operational guidance
- **Read**: failure modes, config docs, environment docs, deploy docs, scripts, comments in CI
- **Ask**:
  - When something fails, does the repo help the user recover?
  - Are operational constraints documented, or only discoverable by reading code?
- **Compare against**:
  - `playbooks/docs.md`
  - `playbooks/release.md`
- **Judge**:
  - strong if likely failure modes are acknowledged and made actionable

### D4. Docs freshness against code reality
- **Read**: docs pages, package manifests, CLI help output, workflow names, actual file paths
- **Ask**:
  - Are the docs stale relative to code and scripts?
  - Are examples/tutorials still valid after recent architecture changes?
- **Compare against**:
  - `benchmarks/docs.md`
  - `playbooks/quick-wins.md`
- **Judge**:
  - strong if docs and code tell the same story today, not six months ago

---

## 3. Community

### C1. Maintainer absorption design
- **Read**: issue templates, PR template, Discussions, CONTRIBUTING, support channels
- **Ask**:
  - Is the project set up to absorb real users and contributors?
  - Does the contribution/support surface scale, or is everything routed to one maintainer?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `case-studies/everything-claude-code.md`
  - `benchmarks/community.md`
- **Judge**:
  - strong if the repo is designed for load, not just public appearance

### C2. Collaboration safety and boundaries
- **Read**: contributing rules, CLA/license boundaries, code review workflow, issue labels, templates
- **Ask**:
  - Are contributors told how to contribute safely?
  - Are legal/process boundaries clear enough to avoid chaos?
- **Compare against**:
  - `case-studies/oh-my-openagent.md`
  - `playbooks/community.md`
- **Judge**:
  - strong if collaboration is enabled without hidden social/process traps

### C3. Release communication loop
- **Read**: releases, changelog, release notes, roadmap, announcements, docs history
- **Ask**:
  - Does the project communicate change in a way users can follow?
  - Can users tell what is stable, changing, or risky?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `case-studies/oh-my-openagent.md`
  - `playbooks/release.md`
- **Judge**:
  - strong if a real user can track the project's evolution without reading commit history

### C4. Contribution funnel realism
- **Read**: dev setup, first issue path, tests, examples, labeling, workflow depth
- **Ask**:
  - Could an outsider realistically contribute?
  - Is the repo welcoming in theory only, or also in operational reality?
- **Compare against**:
  - `benchmarks/community.md`
  - `playbooks/community.md`
- **Judge**:
  - strong if contribution is not blocked by hidden setup or tribal knowledge

---

## 4. Quality

### Q1. Change safety
- **Read**: tests, typecheck, CI, linting, preflight scripts, release preflight
- **Ask**:
  - Can maintainers change code with confidence?
  - Are quality gates real, relevant, and exercised?
- **Compare against**:
  - `benchmarks/quality.md`
  - `case-studies/openclaw.md`
  - `playbooks/quality.md`
- **Judge**:
  - strong if safety mechanisms match the repo's risk surface and actually gate change

### Q2. Architecture modularity and blast radius
- **Read**: workspace layout, package boundaries, dependency graph, core entrypoints, coupling hot spots
- **Ask**:
  - Are responsibilities separated clearly enough to keep changes local?
  - Where is the blast radius too large?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `case-studies/worldmonitor.md`
  - `research/FINDINGS.md`
- **Judge**:
  - strong if architecture supports iteration without constant whole-system fear

### Q3. Operational correctness
- **Read**: deploy scripts, env handling, migrations, persistence boundaries, retry/preflight logic
- **Ask**:
  - Does the repo make production/ops assumptions explicit?
  - Are failure modes handled honestly, or hidden behind fallback behavior?
- **Compare against**:
  - `docs/architecture.md`
  - `playbooks/quality.md`
- **Judge**:
  - strong if the repo's operational path is legible and trustworthy

### Q4. Maintenance discipline
- **Read**: SECURITY, release notes, CI history, stale dependency posture, task hygiene/docs hygiene
- **Ask**:
  - Does the project behave like something people can depend on long-term?
  - Is there evidence of regular maintenance, not just a burst of coding?
- **Compare against**:
  - `benchmarks/quality.md`
  - `case-studies/everything-claude-code.md`
  - `playbooks/release.md`
- **Judge**:
  - strong if maintenance is institutionalized rather than personality-dependent

---

## 5. Case Library

### K1. Proof of use
- **Read**: use cases, examples, screenshots, references, testimonials, references in docs/README
- **Ask**:
  - Is there credible proof the project is used for real work?
  - If private/prelaunch, is there at least internal proof-of-use?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `case-studies/mirofish.md`
  - `playbooks/case-library.md`
- **Judge**:
  - strong if the project can show where it creates value in reality

### K2. Use-case framing quality
- **Read**: README scenarios, example folders, docs guides, quickstart narratives
- **Ask**:
  - Are use cases concrete and audience-specific?
  - Does the project explain when to use it and when not to?
- **Compare against**:
  - `case-studies/worldmonitor.md`
  - `playbooks/case-library.md`
- **Judge**:
  - strong if scenarios help a user self-qualify quickly

### K3. Migration / adoption path
- **Read**: migration guides, compatibility docs, upgrade notes, architecture docs
- **Ask**:
  - If a team wanted to adopt this, is there a realistic path?
  - Is there guidance for replacing current workflows or integrating incrementally?
- **Compare against**:
  - `case-studies/oh-my-openagent.md`
  - `playbooks/release.md`
- **Judge**:
  - strong if adoption friction is acknowledged and reduced

### K4. Change explainability
- **Read**: release history, changelog, docs updates, versioned examples
- **Ask**:
  - Can users understand what changed and why?
  - Does the repo help them trust change over time?
- **Compare against**:
  - `case-studies/openclaw.md`
  - `benchmarks/caselib.md`
- **Judge**:
  - strong if release/change history helps users keep up without reverse-engineering commits

---

## 6. Tooling

### T1. Local developer ergonomics
- **Read**: setup scripts, package managers, devcontainer, `make`/`just`/task runners, bootstrap docs
- **Ask**:
  - Can a contributor get a working local environment without heroics?
  - Is the development loop optimized for iteration?
- **Compare against**:
  - `case-studies/everything-claude-code.md`
  - `case-studies/oh-my-openagent.md`
  - `playbooks/quick-wins.md`
- **Judge**:
  - strong if local development is fast, legible, and reproducible

### T2. Automation depth
- **Read**: workflows, CI matrix, release workflow, checks, generators, bots, preflight scripts
- **Ask**:
  - Which repetitive tasks are truly automated?
  - Is automation protecting quality, or just creating ceremony?
- **Compare against**:
  - `benchmarks/tooling.md`
  - `case-studies/openclaw.md`
  - `playbooks/scorecard.md`
- **Judge**:
  - strong if automation reduces cognitive load and risk for the team

### T3. Distribution and release mechanics
- **Read**: install path, publish scripts, package metadata, release artifacts, versioning strategy
- **Ask**:
  - Can the thing actually be installed, upgraded, and distributed reliably?
  - Is the distribution path coherent with the product claim?
- **Compare against**:
  - `case-studies/everything-claude-code.md`
  - `docs/competitive-landscape.md`
  - `playbooks/release.md`
- **Judge**:
  - strong if distribution is real, repeatable, and easy to understand

### T4. Observability and self-checking
- **Read**: preflight scripts, smoke tests, audit outputs, metrics, release checks, debug docs
- **Ask**:
  - Does the project know when it is broken?
  - Are failures surfaced clearly rather than masked by fallback behavior?
- **Compare against**:
  - `docs/architecture.md`
  - `playbooks/scorecard.md`
  - `playbooks/quick-wins.md`
- **Judge**:
  - strong if the system exposes its gaps honestly and helps operators recover quickly

---

## Output pattern

For each domain, prefer this shape:
1. **reality statement** — what the repo is actually doing now
2. **evidence** — files / commands / code paths / docs observed
3. **comparison** — what similar case-study-backed projects do better / differently
4. **judgment** — internal maturity / OSS readiness / stage-fit
5. **next action** — a specific improvement, ideally mapped to a playbook

## Non-negotiables

- Do not score private/prelaunch repos as if they were public-growth repos.
- Do not call file existence "quality" without reading content.
- Do not recommend a playbook step unless the underlying repo evidence supports it.
- Do not claim deep analysis without citing code/docs/config evidence.
