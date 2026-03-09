#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v opencode >/dev/null 2>&1; then
  echo "opencode가 설치되어 있지 않습니다."
  exit 1
fi

cat <<'MSG'
OpenCode를 oh-my-opencode 프로젝트 설정과 함께 시작합니다.

추천 첫 입력:
/start-work
이 저장소의 AGENTS.md와 service-registry 구조를 읽고,
허브형 구조를 유지하면서 가장 작은 안전한 개선 1개를 진행해.
진행 흐름은 한국어로 텔레그램에 보고해.
MSG

exec opencode "$@"
