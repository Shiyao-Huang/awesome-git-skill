#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'oss-scorecard install: %s\n' "$1" >&2
  exit 1
}

note() {
  printf 'oss-scorecard install: %s\n' "$1"
}

BASE_URL="${OSS_SCORECARD_BASE_URL:-https://raw.githubusercontent.com/Shiyao-Huang/awesome-git-skill/main}"
SCRIPT_SOURCE="${BASH_SOURCE[0]-}"
if [[ -n "$SCRIPT_SOURCE" && "$SCRIPT_SOURCE" != "bash" && -e "$SCRIPT_SOURCE" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SOURCE")" >/dev/null 2>&1 && pwd)"
else
  SCRIPT_DIR=""
fi
REPO_ROOT="${OSS_SCORECARD_REPO_ROOT:-$SCRIPT_DIR}"
if [[ -n "$REPO_ROOT" ]]; then
  SOURCE_SKILL_DIR="${REPO_ROOT}/skills/oss-scorecard"
  SOURCE_BIN_PATH="${REPO_ROOT}/bin/oss-scorecard.mjs"
else
  SOURCE_SKILL_DIR=""
  SOURCE_BIN_PATH=""
fi

INSTALL_HOME="${OSS_SCORECARD_HOME:-${HOME}/.oss-scorecard}"
STAGE_DIR="${INSTALL_HOME}/skills/oss-scorecard"
BIN_DIR="${OSS_SCORECARD_BIN_DIR:-${HOME}/.local/bin}"
BIN_SHIM_PATH="${BIN_DIR}/oss-scorecard"
LINK_TARGETS_RAW="${OSS_SCORECARD_LINK_TARGETS:-}"
REMOTE_BIN_SUPPORTED="0"
LOCAL_BIN_INSTALLED="0"

SKILL_FILES=(
  "SKILL.md"
  "README.md"
  "USAGE.md"
  "agents/openai.yaml"
  "references/asset-map.md"
  "references/deep-analysis-dimensions.md"
  "references/knowledge-to-guidance.md"
  "references/project-profile.md"
)

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

install_local_bin_shim() {
  [[ -f "$SOURCE_BIN_PATH" ]] || return 0

  mkdir -p "$BIN_DIR"
  cat > "$BIN_SHIM_PATH" <<SHIM
#!/usr/bin/env bash
set -euo pipefail
exec node "$SOURCE_BIN_PATH" "\$@"
SHIM
  chmod +x "$BIN_SHIM_PATH"
  LOCAL_BIN_INSTALLED="1"
  note "installed local CLI shim -> ${BIN_SHIM_PATH}"
}

if [[ -d "$SOURCE_SKILL_DIR" ]]; then
  stage_local_bundle
  install_local_bin_shim
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

if [[ "${#TARGETS[@]}" -eq 0 ]]; then
  note "no ~/.claude, ~/.codex, or ~/.cursor home detected; staged skill bundle without agent links"
else
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
fi

note "staged skill files in ${STAGE_DIR}"
printf '\n'
printf 'Next steps:\n'
if [[ "$LOCAL_BIN_INSTALLED" == "1" ]]; then
  printf '  1. Run: oss-scorecard --help\n'
  printf '  2. Audit a repo: oss-scorecard audit openclaw/openclaw\n'
else
  printf '  1. Skill staged locally; CLI shim was not installed in this mode\n'
  printf '  2. If you have a repo checkout, run: bash ./install.sh from that checkout for a local CLI shim\n'
fi
printf '  3. If GitHub auth is missing, run: gh auth login\n'
printf '  4. Public install: curl -sfL https://raw.githubusercontent.com/Shiyao-Huang/awesome-git-skill/main/install.sh | bash\n'

if [[ "$LOCAL_BIN_INSTALLED" == "1" ]]; then
  case ":${PATH}:" in
    *":${BIN_DIR}:"*) ;;
    *)
      printf '\n'
      printf 'Path note:\n'
      printf '  Add %s to PATH if `oss-scorecard` is not found.\n' "$BIN_DIR"
      ;;
  esac
fi
