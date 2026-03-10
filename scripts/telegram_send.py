#!/usr/bin/env python3
import json
import os
import sys
import urllib.request

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


def normalize_text(text: str) -> str:
    return text.replace("\\n", "\n")


def send_message(text: str) -> int:
    if not BOT_TOKEN or not CHAT_ID:
        print("Telegram env not configured; skipping message.", file=sys.stderr)
        return 0

    payload = {
        "chat_id": CHAT_ID,
        "text": normalize_text(text),
        "disable_web_page_preview": True,
    }
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
        return 1

    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: telegram_send.py 'message'", file=sys.stderr)
        return 1
    return send_message(sys.argv[1])


if __name__ == "__main__":
    raise SystemExit(main())
