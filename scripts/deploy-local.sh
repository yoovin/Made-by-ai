#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

LOG_FILE="$PROJECT_ROOT/ops/logs/deploy.log"

echo "[$(timestamp_kst)] deploy start" | tee -a "$LOG_FILE"

pnpm install 2>&1 | tee -a "$LOG_FILE"
pnpm build 2>&1 | tee -a "$LOG_FILE"

if systemctl --user list-unit-files | grep -q '^made-by-ai-web.service'; then
  systemctl --user restart made-by-ai-web.service
  echo "user service restart done" | tee -a "$LOG_FILE"
else
  echo "made-by-ai-web.service not found; build only completed" | tee -a "$LOG_FILE"
fi

python3 "$PROJECT_ROOT/scripts/telegram_send.py" "로컬 배포 완료: build 성공 및 웹 서비스 재시작 시도" || true
echo "[$(timestamp_kst)] deploy end" | tee -a "$LOG_FILE"
