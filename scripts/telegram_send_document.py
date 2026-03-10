#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
import uuid

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")


def main() -> int:
    if len(sys.argv) not in {2, 3}:
        return 1

    path = sys.argv[1]
    caption = sys.argv[2] if len(sys.argv) == 3 else ""

    if not BOT_TOKEN or not CHAT_ID or not os.path.exists(path):
        return 0

    boundary = "----" + uuid.uuid4().hex
    with open(path, "rb") as file:
        data = file.read()

    name = os.path.basename(path)
    body = (
        f'--{boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n{CHAT_ID}\r\n'.encode()
        + (
            f'--{boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n{caption}\r\n'.encode()
            if caption
            else b""
        )
        + f'--{boundary}\r\nContent-Disposition: form-data; name="document"; filename="{name}"\r\nContent-Type: text/markdown\r\n\r\n'.encode()
        + data
        + b"\r\n"
        + f"--{boundary}--\r\n".encode()
    )
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{BOT_TOKEN}/sendDocument",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        result = json.load(response)

    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
