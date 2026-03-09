#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/ops/state"
mkdir -p "$STATE_DIR"
PROMPT_FILE="${AUTORUN_PROMPT_FILE:-$ROOT/ops/inbox/AUTORUN_PROMPT.md}"
INTERVAL="${AUTORUN_INTERVAL_SECONDS:-600}"
notify() { python3 "$ROOT/scripts/telegram_send.py" "$1" >/dev/null 2>&1 || true; }
send_summary() { [ -f "$ROOT/ops/last-summary.md" ] && python3 "$ROOT/scripts/telegram_send_document.py" "$ROOT/ops/last-summary.md" >/dev/null 2>&1 || true; }
run_cycle() {
  local cycle_id="$(TZ=Asia/Seoul date +%Y%m%d-%H%M%S)"
  local prompt='이 저장소에서 AGENTS.md와 README.ko.md를 따르고, 현재 상태를 점검한 뒤 가장 안전하고 가치 있는 작은 작업 1개만 진행하세요. 위험 변경이 필요하면 approval queue에 기록하고 해당 작업은 보류한 뒤 다른 안전 작업을 진행하세요. 결과는 ops/last-summary.md에 한국어로 남기고, 텔레그램 진행 알림을 유지하세요.'
  [ -f "$PROMPT_FILE" ] && prompt="$(cat "$PROMPT_FILE")"
  notify "[자동 개발 시작]\n- 사이클: $cycle_id"
  if opencode run "$prompt"; then
    notify "[자동 개발 완료]\n- 사이클: $cycle_id\n- 결과: 성공"
  else
    notify "[자동 개발 실패]\n- 사이클: $cycle_id\n- 결과: 실패"
  fi
  send_summary
}
notify "[자동 루프 시작]\n- 간격: ${INTERVAL}초"
while true; do run_cycle; sleep "$INTERVAL"; done
