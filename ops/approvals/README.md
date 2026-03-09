# approvals queue

- `pending/` : 승인 대기 중
- `approved/` : 승인되어 다음 자동 루프에서 재개할 것
- `rejected/` : 폐기/거절된 것

`approval_bot.py`가 이 디렉터리를 감시하면서 텔레그램으로 승인 요청을 보냅니다.
