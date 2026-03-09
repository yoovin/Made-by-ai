#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

LOG_FILE="$PROJECT_ROOT/ops/logs/smoke-test.log"

echo "[$(timestamp_kst)] smoke test start" | tee -a "$LOG_FILE"

curl -fsS "http://127.0.0.1:${APP_PORT}/api/health" | tee -a "$LOG_FILE"
curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null
python3 "$PROJECT_ROOT/scripts/telegram_send.py" "스모크 테스트 통과: / 와 /api/health 확인" || true
echo "[$(timestamp_kst)] smoke test end" | tee -a "$LOG_FILE"
