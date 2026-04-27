# Project Profile Inference Template

Before judging a repo deeply, infer this profile.

## Required fields

- `name`
- `target`
  - local path / repo / ref
- `goal`
  - what problem does the project exist to solve?
- `audience`
  - who is it for?
- `stage`
  - `private` | `prelaunch` | `public` | `growth` | `mature`
- `delivery_mode`
  - `library` | `cli` | `app` | `agent-system` | `service` | `internal-platform` | other

## Helpful optional fields

- `first_success_path`
  - what would count as first success for the target user?
- `core_loop`
  - what is the repeatable usage loop?
- `operational_constraints`
  - auth? local runtime? infra? multi-service complexity?
- `external_readiness_needed`
  - yes/no/partial

## Inference sources

Infer from, in order:
1. README / docs hero
2. package manifests and scripts
3. directory structure
4. workflows / deploy configs
5. examples / demos / screenshots
6. issue labels / release process (if public)

## Output rule

If a field cannot be inferred confidently, mark it as `UNVERIFIED` rather than inventing it.
