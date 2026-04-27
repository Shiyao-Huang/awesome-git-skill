# Agent Runtime Notes

## Active operational blocker — Legion publish gate

Date: 2026-04-27

### Issue
- Builder-side execution reported `create_corps` blocked as if `HUB_PUBLISH_KEY` were missing.
- Current verification shows the problem is **not a global key absence**:
  - current session env contains `HUB_PUBLISH_KEY` (non-empty, len=44)
  - `~/.aha/settings.json` also contains `genomeHubPublishKey` (mode `0600`)
  - an authenticated probe to `POST https://aha-agi.com/genome/corps` returns **400 validation error**, not 401
- Therefore the more precise diagnosis is: **the publish runtime that executed `create_corps` did not consume the available key (or used a different runtime/config context)**, while `LEGION_PUBLISH_ENABLED` still remains disabled/unset by design.

### Temporary remediation attempt
- User requested a temporary key retrieval via `ssh wow`.
- Current result: SSH handshake reaches host `31.97.214.218:22` but the remote side closes the connection before authentication (`kex_exchange_identification: Connection closed by remote host`).
- Re-check on 2026-04-27 11:53 CST with `ssh -o BatchMode=yes -o ConnectTimeout=10 wow 'echo connected'` returned `Connection closed by 31.97.214.218 port 22`.
- Conclusion: `wow` is **not currently reachable for key retrieval from this environment**.
- This SSH failure is no longer the primary publish blocker, because a working hub key is already present locally; the main gap is runtime/config propagation into the publish execution path.

### Handling rule until fixed
- Do **not** silently bypass publish gating.
- Preferred repair sequence:
  1. make the builder/publish runtime consume the already-present `HUB_PUBLISH_KEY` from env/settings,
  2. explicitly set `LEGION_PUBLISH_ENABLED=true` in the execution context,
  3. re-run `create_corps`,
  4. only if that still fails, ask in the team group for a working SSH path / alternate host / admin-side manual publish.

### Status
- AgentImages Phase 1 published
- `create_corps` still blocked, but current evidence points to **publish-runtime configuration drift**, not “key missing everywhere”
