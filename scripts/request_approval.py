#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
from pathlib import Path

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
PROJECT_ROOT = Path(__file__).resolve().parent.parent


def send_telegram(text: str, reply_markup: dict | None = None) -> tuple[bool, int | None]:
    if not BOT_TOKEN or not CHAT_ID:
        print("Telegram env not configured; skipping approval notification.", file=sys.stderr)
        return True, None

    payload: dict = {
        "chat_id": CHAT_ID,
        "text": text,
        "disable_web_page_preview": True,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.load(resp)

    if not data.get("ok"):
        print(json.dumps(data, ensure_ascii=False), file=sys.stderr)
        return False, None

    result = data.get("result") or {}
    return True, result.get("message_id")


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: request_approval.py <pending-json-file>", file=sys.stderr)
        return 1

    target = Path(sys.argv[1]).resolve()
    data = json.loads(target.read_text(encoding="utf-8"))

    approval_id = data["id"]
    impact = "\n".join(f"- {item}" for item in data.get("impact", []))
    risks = "\n".join(f"- {item}" for item in data.get("risks", []))

    text = (
        "[승인 필요]\n"
        f"ID: {approval_id}\n"
        f"제목: {data.get('title', '')}\n"
        f"요약: {data.get('summary', '')}\n"
        f"이유: {data.get('reason', '')}\n"
        f"영향:\n{impact or '- 없음'}\n"
        f"리스크:\n{risks or '- 없음'}\n\n"
        f"답장 방법:\n"
        f"- 승인 {approval_id}\n"
        f"- 폐기 {approval_id}"
    )

    ok, message_id = send_telegram(
        text,
        reply_markup={
            "inline_keyboard": [[
                {"text": "승인", "callback_data": f"approve:{approval_id}"},
                {"text": "폐기", "callback_data": f"reject:{approval_id}"}
            ]]
        }
    )
    if not ok:
        return 1

    data["notifiedAt"] = os.popen("TZ=Asia/Seoul date -Iseconds").read().strip()
    data["telegramMessageId"] = message_id
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
