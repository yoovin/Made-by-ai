#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
source "$ROOT_DIR/scripts/common.sh"

ensure_env
mkdir -p "$ROOT_DIR/ops/logs" "$ROOT_DIR/ops/runtime" "$ROOT_DIR/ops/approvals/pending" "$ROOT_DIR/ops/approvals/approved" "$ROOT_DIR/ops/approvals/rejected"

INTERVAL="${AUTOLOOP_INTERVAL_SECONDS:-1800}"
LOCKFILE="$ROOT_DIR/ops/runtime/autoloop.lock"
PROMPT_FILE="$ROOT_DIR/ops/runtime/current_prompt.md"
LOGFILE="$ROOT_DIR/ops/logs/autoloop.log"

acquire_lock "$LOCKFILE"
trap 'release_lock "$LOCKFILE"' EXIT

while true; do
  CYCLE_ID="$(date +%Y%m%d-%H%M%S)"
  telegram_info "[사이클 시작] ${CYCLE_ID}
허브형 구조 유지, 안전한 작업 우선, 위험 변경은 승인 대기 큐로 분리합니다."

  cat > "$PROMPT_FILE" <<EOF
$(cat "$ROOT_DIR/prompts/omo-autoloop.md")

추가 런타임 정보:
- cycleId: ${CYCLE_ID}
- appName: ${APP_NAME:-Made by AI}
- localPush: ${LOCAL_GIT_PUSH:-false}
- autoDeploy: ${AUTO_DEPLOY:-true}
EOF

  {
    echo "===== ${CYCLE_ID} ====="
    echo "[RUN] opencode run 시작"
    opencode run "$(cat "$PROMPT_FILE")"
  } >> "$LOGFILE" 2>&1 || true

  if [[ "${AUTO_DEPLOY:-true}" == "true" ]]; then
    bash "$ROOT_DIR/scripts/deploy-local.sh" >> "$LOGFILE" 2>&1 || true
    bash "$ROOT_DIR/scripts/smoke-test.sh" >> "$LOGFILE" 2>&1 || true
  fi

  SUMMARY_FILE="$ROOT_DIR/ops/last-summary.md"
  if [[ -f "$SUMMARY_FILE" ]]; then
    python3 "$ROOT_DIR/scripts/telegram_send_document.py" "$SUMMARY_FILE" "[사이클 요약] ${CYCLE_ID}" || true
  else
    telegram_info "[사이클 종료] ${CYCLE_ID}
요약 파일이 없어 간단 종료 보고만 남깁니다."
  fi

  sleep "$INTERVAL"
done
