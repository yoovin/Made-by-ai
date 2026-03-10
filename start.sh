#!/usr/bin/env bash
set -u

SESSION_ID="ses_32c84169affewna31hmtJ0Lp7A"
LOCK_FILE="/tmp/made-by-ai.lock"

exec 9>"$LOCK_FILE"
flock -n 9 || { echo "이미 실행 중입니다."; exit 1; }

while true; do
  opencode run -s "$SESSION_ID" "AGENTS.md를 엄격히 따르고, 허브형 웹서비스를 지속적으로 개선해. 유지보수만 하지 말고 신규 기능과 신규 서비스도 계속 발굴하고 추가해. 텔레그램으로 한국어 진행 보고를 보내되, 텔레그램 토큰과 관련 설정은 .env.local을 확인해서 사용해. 위험한 작업도 승인 대기 없이 진행하되 영향 범위, 검증 계획, 롤백 방법을 먼저 정리하고 가능한 한 작은 단위로 적용해. 변경 후에는 반드시 검증하고 결과를 보고해. 문제가 생기면 즉시 롤백 또는 우회 조치를 먼저 수행해. 한 작업이 끝나면 멈추지 말고 다음 작업을 계속 이어가. ulw"
  sleep 3
done
