#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

LOG_FILE="$PROJECT_ROOT/.ops/logs/git.log"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "[$(timestamp_kst)] no git changes" | tee -a "$LOG_FILE"
  exit 0
fi

MESSAGE="${1:-chore(ai): automated local cycle $(date +%Y-%m-%dT%H:%M:%S)}"

git add -A
git commit -m "$MESSAGE" 2>&1 | tee -a "$LOG_FILE"
git push "$GIT_REMOTE" HEAD 2>&1 | tee -a "$LOG_FILE"

python3 "$PROJECT_ROOT/scripts/telegram_send.py" "Git 푸시 완료: $MESSAGE" || true
