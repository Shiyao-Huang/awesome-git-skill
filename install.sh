#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'oss-scorecard install: %s\n' "$1" >&2
  exit 1
}

note() {
  printf 'oss-scorecard install: %s\n' "$1"
}

BASE_URL="${OSS_SCORECARD_BASE_URL:-https://oss-scorecard.dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
REPO_ROOT="${OSS_SCORECARD_REPO_ROOT:-$SCRIPT_DIR}"
SOURCE_SKILL_DIR="${REPO_ROOT}/skills/oss-scorecard"
LOCAL_BIN_ENTRY="${REPO_ROOT}/bin/oss-scorecard.mjs"

INSTALL_HOME="${OSS_SCORECARD_HOME:-${HOME}/.oss-scorecard}"
STAGE_DIR="${INSTALL_HOME}/skills/oss-scorecard"
BIN_HOME="${OSS_SCORECARD_BIN_HOME:-${HOME}/.local/bin}"
WRAPPER_PATH="${BIN_HOME}/oss-scorecard"
LINK_TARGETS_RAW="${OSS_SCORECARD_LINK_TARGETS:-}"

SKILL_FILES=(
  "SKILL.md"
  "README.md"
  "USAGE.md"
  "agents/openai.yaml"
  "references/asset-map.md"
)

REMOTE_CLI_SUPPORTED=0

stage_local_bundle() {
  note "using local repo skill sources from ${SOURCE_SKILL_DIR}"
  rm -rf "$STAGE_DIR"
  mkdir -p "$STAGE_DIR"
  cp -R "${SOURCE_SKILL_DIR}/." "$STAGE_DIR/"
}

download_remote_bundle() {
  command -v curl >/dev/null 2>&1 || fail "curl is required for remote install mode"
  note "local skill source not found; downloading skill bundle from ${BASE_URL}"
  rm -rf "$STAGE_DIR"
  mkdir -p "$STAGE_DIR/agents" "$STAGE_DIR/references"

  for relative in "${SKILL_FILES[@]}"; do
    local target="${STAGE_DIR}/${relative}"
    mkdir -p "$(dirname "$target")"
    if ! curl -sfL "${BASE_URL}/skills/oss-scorecard/${relative}" -o "$target"; then
      fail "failed to download ${relative} from ${BASE_URL}. If the public host is not live yet, run from a repo checkout with: bash ./install.sh"
    fi
  done
}

install_local_wrapper() {
  command -v node >/dev/null 2>&1 || fail "node is required to install the local CLI wrapper"
  [[ -f "$LOCAL_BIN_ENTRY" ]] || fail "missing local CLI entrypoint: ${LOCAL_BIN_ENTRY}"
  mkdir -p "$BIN_HOME"
  cat > "$WRAPPER_PATH" <<WRAPPER
#!/usr/bin/env bash
set -euo pipefail
exec node "${LOCAL_BIN_ENTRY}" "\$@"
WRAPPER
  chmod +x "$WRAPPER_PATH"
  note "installed CLI wrapper -> ${WRAPPER_PATH}"
}

if [[ -d "$SOURCE_SKILL_DIR" ]]; then
  stage_local_bundle
  install_local_wrapper
else
  download_remote_bundle
fi

declare -a TARGETS=()
if [[ -n "$LINK_TARGETS_RAW" ]]; then
  IFS=',' read -r -a TARGETS <<<"$LINK_TARGETS_RAW"
else
  [[ -d "${HOME}/.claude" ]] && TARGETS+=("claude")
  [[ -d "${HOME}/.codex" ]] && TARGETS+=("codex")
  [[ -d "${HOME}/.cursor" ]] && TARGETS+=("cursor")
fi

if [[ "${#TARGETS[@]}" -eq 0 ]]; then
  fail "no supported client homes detected under ~/.claude, ~/.codex, or ~/.cursor. Create one first or set OSS_SCORECARD_LINK_TARGETS=claude,codex,cursor explicitly."
fi

link_into_claude() {
  local target_dir="${HOME}/.claude/skills"
  local link_path="${target_dir}/oss-scorecard"
  mkdir -p "$target_dir"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    fail "refusing to overwrite non-symlink path: ${link_path}"
  fi

  ln -sfn "$STAGE_DIR" "$link_path"
  note "linked Claude skill -> ${link_path}"
}

link_into_codex() {
  local target_dir="${HOME}/.codex/skills"
  local link_path="${target_dir}/oss-scorecard"
  mkdir -p "$target_dir"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    fail "refusing to overwrite non-symlink path: ${link_path}"
  fi

  ln -sfn "$STAGE_DIR" "$link_path"
  note "linked Codex skill -> ${link_path}"
}

link_into_cursor() {
  local target_dir="${HOME}/.cursor/rules"
  local link_path="${target_dir}/oss-scorecard.md"
  mkdir -p "$target_dir"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    fail "refusing to overwrite non-symlink path: ${link_path}"
  fi

  ln -sfn "${STAGE_DIR}/SKILL.md" "$link_path"
  note "linked Cursor rule -> ${link_path}"
}

for target in "${TARGETS[@]}"; do
  case "$target" in
    claude)
      link_into_claude
      ;;
    codex)
      link_into_codex
      ;;
    cursor)
      link_into_cursor
      ;;
    *)
      fail "unknown install target: ${target}"
      ;;
  esac
done

note "staged skill files in ${STAGE_DIR}"
printf '\n'
printf 'Next steps:\n'
if [[ -x "$WRAPPER_PATH" ]]; then
  printf '  1. Run: %s help\n' "$WRAPPER_PATH"
  printf '  2. Audit a repo: %s audit openclaw/openclaw\n' "$WRAPPER_PATH"
  if [[ ":$PATH:" != *":$BIN_HOME:"* ]]; then
    printf '  3. Add %s to PATH to call `oss-scorecard` directly\n' "$BIN_HOME"
    printf '     export PATH="%s:$PATH"\n' "$BIN_HOME"
    printf '  4. If GitHub auth is missing, run: gh auth login\n'
    printf '  5. Public install target (once hosted): curl -sfL %s/install.sh | bash\n' "$BASE_URL"
  else
    printf '  3. If GitHub auth is missing, run: gh auth login\n'
    printf '  4. Public install target (once hosted): curl -sfL %s/install.sh | bash\n' "$BASE_URL"
  fi
else
  printf '  1. Skill bundle installed for Claude/Codex/Cursor\n'
  printf '  2. Public CLI wrapper is not bundled in remote mode yet; use the skill inside your agent client\n'
  printf '  3. Once hosted, public install target will stay: curl -sfL %s/install.sh | bash\n' "$BASE_URL"
fi
