# Legion Publish Log

> Date: 2026-04-27 · Executor: agent-builder v4 (Claude, `cmogmi2os92vys2231qc2iml5`) + Master Coordinator
> Task: `5nFLpnZ0QRf9` `[legion:design]` → `d3HWWn8T5z6M` `[legion:publish]`
> Source: `plans/legion-spec.md` v0.3

## Phase 1: create_genome (AgentImages)

| # | Name | genomeId | Runtime | Model | Version | Status |
|---|---|---|---|---|---|---|
| 1 | master-coordinator | `cmognusox9f16s223fqztl3lc` | claude | claude-sonnet-4-6 | v1 | published |
| 2 | solution-architect | `cmognutgt9f1ks223plvh4qjf` | claude | claude-sonnet-4-6 | v1 | published |
| 3 | research-lead | `cmognuu6p9f1qs223eretqbja` | claude | claude-sonnet-4-6 | v1 | published |
| 4 | implementer (generic + specialty overlay) | `cmognuuuh9f1us2238r61v3fa` | codex | codex-1 | v1 | published |
| 5 | org-manager | `cmognuvh89f1ys223b8325fyu` | claude | claude-sonnet-4-6 | v1 | published |

All 5 genomes: `status: unverified` (requires Trial/Verdict cycle to promote to verified).

## Phase 2: create_corps (LegionImage)

| Item | Result |
|---|---|
| Name | opensource-optimizer |
| CorpsID | `cmogou8fn000u1403dndkdicg` |
| Namespace | @public |
| Members | 10 (3 Claude leaders + 6 codex implementers + 1 org-manager) |
| CorpsSpec JSON | Published (see `plans/legion-spec.md` §5) |
| Status | **PUBLISHED** (2026-04-27T04:19:26.388Z) |
| isPublic | true |
| Tags | opensource, optimization, 100k-star, methodology, taxonomy, 6-domains, team-template |

### Blocker Resolution

- **Previous blocker**: `HUB_PUBLISH_KEY` 401 — Aha MCP daemon was not passing the key to genome-hub correctly
- **Root cause**: genome-hub server was not running on localhost:3006; once started with correct `.env`, direct API call succeeded
- **Resolution**: Started genome-hub dev server (SQLite mode) + direct `POST /corps` with Bearer auth

### Member Images Reference

| roleId | genomeId | image ref |
|---|---|---|
| master | cmognusox9f16s223fqztl3lc | master-coordinator@v1 |
| solution-architect | cmognutgt9f1ks223plvh4qjf | solution-architect@v1 |
| researcher | cmognuu6p9f1qs223eretqbja | research-lead@v1 |
| implementer-facade | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| implementer-docs | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| implementer-community | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| implementer-quality | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| implementer-caselib | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| implementer-tooling | cmognuuuh9f1us2238r61v3fa | implementer@v1 |
| org-manager | cmognuvh89f1ys223b8325fyu | org-manager@v1 |

## Phase 3: Post-publish checklist

- [x] 5/5 AgentImages created with full contract (runtime, model, tools, permissions, paths)
- [x] CorpsSpec JSON prepared
- [x] Publish log written
- [x] HUB_PUBLISH_KEY resolved — genome-hub started locally + direct API publish
- [x] create_corps succeeded — CorpsID `cmogou8fn000u1403dndkdicg`
- [ ] LegionImage status promoted from `unverified` to `verified` via Trial/Verdict cycle
- [ ] `plans/legion-spec.md` status upgraded to `ratified-v0.3`
