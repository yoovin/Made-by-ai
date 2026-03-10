#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [[ -f "$PROJECT_ROOT/.env.local" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$PROJECT_ROOT/.env.local"
  set +a
fi

export PROJECT_ROOT
export APP_PORT="${APP_PORT:-3000}"
export PUBLIC_PORT="${PUBLIC_PORT:-80}"
export PRODUCTION_URL="${PRODUCTION_URL:-http://127.0.0.1}"
export GIT_REMOTE="${GIT_REMOTE:-origin}"
export MAIN_BRANCH="${MAIN_BRANCH:-main}"

mkdir -p   "$PROJECT_ROOT/ops/runtime"   "$PROJECT_ROOT/ops/logs"   "$PROJECT_ROOT/ops/approvals/pending"   "$PROJECT_ROOT/ops/approvals/approved"   "$PROJECT_ROOT/ops/approvals/rejected"

timestamp_kst() {
  TZ=Asia/Seoul date +"%Y-%m-%d %H:%M:%S %Z"
}

ensure_env() {
  if [[ ! -f "$PROJECT_ROOT/.env.local" ]]; then
    echo ".env.local 파일이 없습니다. .env.local.example을 복사해 만드세요."
    exit 1
  fi
}

telegram_info() {
  local msg="$1"
  python3 "$PROJECT_ROOT/scripts/telegram_send.py" "$msg" || true
}

acquire_lock() {
  local lockfile="$1"
  if [[ -f "$lockfile" ]]; then
    local pid
    pid="$(cat "$lockfile" 2>/dev/null || true)"
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
      echo "이미 실행 중입니다. pid=$pid"
      exit 1
    fi
  fi
  echo "$$" > "$lockfile"
}

release_lock() {
  local lockfile="$1"
  rm -f "$lockfile"
}
