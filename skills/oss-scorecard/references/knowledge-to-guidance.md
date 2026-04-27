# Knowledge Base → Skill Guidance

This file explains how to turn the repo's knowledge assets into **usable audit guidance**.

## Principle

The knowledge base is not decoration. It is the audit baseline.

A good `oss-scorecard` audit should be able to answer:
- what kind of project is this really?
- who is it for?
- what stage is it in?
- what has to be true for this project to succeed?
- which lessons from our case studies actually apply here?

## Asset conversion map

### 1. `case-studies/` → pattern library
Use case studies as examples of:
- launch patterns
- docs patterns
- community structure
- release discipline
- evidence of what worked in real projects

Do not copy them mechanically. Use them as comparable references:
- “this repo is similar to X in audience / delivery mode / launch shape”
- “this repo is missing what X did well in onboarding / release / showcase”

### 2. `benchmarks/*.md` → evaluation lenses
Benchmarks define what to inspect under each domain.

Translate them into real questions, e.g.:
- facade → can the intended user understand the value quickly?
- docs → can a new contributor or target user reach first success?
- quality → is there evidence the code can be changed safely?
- tooling → is the engineering workflow repeatable and scalable?

### 3. `playbooks/` → action generators
Playbooks should be used after analysis, not before.

For each high-confidence weakness, map to:
- a concrete fix
- an example artifact
- a recommended order of operations

### 4. `research/` + `case-anchors.yaml` → context and stage sensitivity
Use research assets to understand:
- what is normal for breakout public projects
- which comparisons are fair
- when a public-growth metric should be treated as `N/A` for a private/prelaunch project

## Default audit stack

### For private / local / unreleased repos
Prioritize:
1. code structure
2. tests / CI / release readiness
3. docs quality and audience fit
4. operational readiness
5. external-growth readiness only where relevant

### For public repos
Use both:
- local/code-level analysis when checkout exists
- public-surface signals as supplementary context

## Good output qualities

A good deep audit is:
- code-aware
- audience-aware
- stage-aware
- evidence-backed
- actionable

A bad audit is:
- a list of missing files
- a star-count reaction
- a fake precise score without evidence
- a report that ignores the repo's actual purpose
