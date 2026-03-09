#!/usr/bin/env python3
import json
import os
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PENDING_DIR = PROJECT_ROOT / "ops" / "approvals" / "pending"
APPROVED_DIR = PROJECT_ROOT / "ops" / "approvals" / "approved"
REJECTED_DIR = PROJECT_ROOT / "ops" / "approvals" / "rejected"
RUNTIME_DIR = PROJECT_ROOT / "ops" / "runtime"
OFFSET_FILE = RUNTIME_DIR / "telegram-offset.txt"
LOG_FILE = PROJECT_ROOT / "ops" / "logs" / "telegram-bot.log"

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
APPROVER_USER_ID = os.getenv("TELEGRAM_APPROVER_USER_ID", "")

BASE = f"https://api.telegram.org/bot{BOT_TOKEN}" if BOT_TOKEN else ""


def log(message: str) -> None:
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    LOG_FILE.write_text(
        (LOG_FILE.read_text(encoding="utf-8") if LOG_FILE.exists() else "") + f"[{timestamp}] {message}\n",
        encoding="utf-8",
    )


def api_post(method: str, payload: dict[str, Any]) -> dict[str, Any]:
    req = urllib.request.Request(
        f"{BASE}/{method}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=35) as resp:
        return json.load(resp)


def api_get(method: str, params: dict[str, Any]) -> dict[str, Any]:
    query = urllib.parse.urlencode(params)
    with urllib.request.urlopen(f"{BASE}/{method}?{query}", timeout=40) as resp:
        return json.load(resp)


def send_message(text: str, reply_markup: dict | None = None) -> int | None:
    if not BOT_TOKEN or not CHAT_ID:
        return None

    payload: dict[str, Any] = {
        "chat_id": CHAT_ID,
        "text": text,
        "disable_web_page_preview": True,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup

    data = api_post("sendMessage", payload)
    if not data.get("ok"):
        log(f"sendMessage failed: {data}")
        return None
    return data.get("result", {}).get("message_id")


def answer_callback(callback_query_id: str, text: str) -> None:
    try:
        api_post("answerCallbackQuery", {
            "callback_query_id": callback_query_id,
            "text": text
        })
    except Exception as exc:
        log(f"answerCallbackQuery failed: {exc}")


def get_offset() -> int:
    try:
      return int(OFFSET_FILE.read_text(encoding="utf-8").strip())
    except Exception:
      return 0


def set_offset(value: int) -> None:
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    OFFSET_FILE.write_text(str(value), encoding="utf-8")


def get_updates(offset: int) -> list[dict[str, Any]]:
    data = api_get("getUpdates", {
        "offset": offset,
        "timeout": 20,
        "allowed_updates": json.dumps(["message", "callback_query"])
    })
    if not data.get("ok"):
        log(f"getUpdates failed: {data}")
        return []
    return data.get("result", [])


def list_pending_files() -> list[Path]:
    return sorted(PENDING_DIR.glob("*.json"))


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def approval_text(data: dict[str, Any]) -> str:
    impact = "\n".join(f"- {item}" for item in data.get("impact", [])) or "- 없음"
    risks = "\n".join(f"- {item}" for item in data.get("risks", [])) or "- 없음"
    approval_id = data.get("id", "")
    return (
        "[위험 변경 승인 요청]\n"
        f"ID: {approval_id}\n"
        f"제목: {data.get('title', '')}\n"
        f"요약: {data.get('summary', '')}\n"
        f"이유: {data.get('reason', '')}\n"
        f"영향:\n{impact}\n"
        f"리스크:\n{risks}\n\n"
        f"응답:\n"
        f"- 승인 {approval_id}\n"
        f"- 폐기 {approval_id}"
    )


def notify_pending_items() -> None:
    for path in list_pending_files():
        data = load_json(path)
        if data.get("notifiedAt"):
            continue

        message_id = send_message(
            approval_text(data),
            reply_markup={
                "inline_keyboard": [[
                    {"text": "승인", "callback_data": f"approve:{data['id']}"},
                    {"text": "폐기", "callback_data": f"reject:{data['id']}"}
                ]]
            }
        )
        data["notifiedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        data["telegramMessageId"] = message_id
        save_json(path, data)
        log(f"notified pending approval {data['id']}")


def find_pending_by_id(approval_id: str) -> Path | None:
    path = PENDING_DIR / f"{approval_id}.json"
    if path.exists():
        return path

    for candidate in list_pending_files():
        try:
            if load_json(candidate).get("id") == approval_id:
                return candidate
        except Exception:
            continue
    return None


def move_approval(approval_id: str, target_dir: Path, target_status: str) -> str:
    source = find_pending_by_id(approval_id)
    if not source:
        return f"대기 중인 승인 ID를 찾지 못했습니다: {approval_id}"

    data = load_json(source)
    data["status"] = target_status
    data["handledAt"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    target = target_dir / source.name
    save_json(target, data)
    source.unlink(missing_ok=True)
    return f"{approval_id} -> {target_status} 처리 완료"


def parse_text_command(text: str) -> tuple[str | None, str | None]:
    text = text.strip()
    patterns = [
        (r"^(승인|재개|approve|resume)\s+(.+)$", "approve"),
        (r"^(폐기|거절|reject|discard)\s+(.+)$", "reject"),
        (r"^(상태|/status)$", "status"),
        (r"^(도움말|/help)$", "help"),
    ]
    for pattern, kind in patterns:
        match = re.match(pattern, text, re.IGNORECASE)
        if match:
            return kind, (match.group(2).strip() if match.lastindex and match.lastindex >= 2 else None)
    return None, None


def status_text() -> str:
    return (
        "[현재 상태]\n"
        f"- pending: {len(list(PENDING_DIR.glob('*.json')))}\n"
        f"- approved: {len(list(APPROVED_DIR.glob('*.json')))}\n"
        f"- rejected: {len(list(REJECTED_DIR.glob('*.json')))}\n"
    )


def authorized(update_user_id: str) -> bool:
    if not APPROVER_USER_ID:
        return True
    return str(update_user_id) == str(APPROVER_USER_ID)


def handle_action(kind: str, approval_id: str | None) -> str:
    if kind == "approve":
        if not approval_id:
            return "승인할 ID를 함께 보내주세요."
        return move_approval(approval_id, APPROVED_DIR, "approved")
    if kind == "reject":
        if not approval_id:
            return "폐기할 ID를 함께 보내주세요."
        return move_approval(approval_id, REJECTED_DIR, "rejected")
    if kind == "status":
        return status_text()
    if kind == "help":
        return (
            "사용 가능한 명령\n"
            "- 상태\n"
            "- 승인 <id>\n"
            "- 재개 <id>\n"
            "- 폐기 <id>\n"
            "- 거절 <id>"
        )
    return "알 수 없는 명령입니다."


def handle_update(update: dict[str, Any]) -> None:
    callback_query = update.get("callback_query")
    if callback_query:
        user_id = str(callback_query.get("from", {}).get("id", ""))
        if not authorized(user_id):
            answer_callback(callback_query["id"], "권한이 없습니다.")
            return

        data = callback_query.get("data", "")
        if data.startswith("approve:"):
            approval_id = data.split(":", 1)[1]
            message = handle_action("approve", approval_id)
            send_message(message)
            answer_callback(callback_query["id"], "승인 처리했습니다.")
            log(message)
            return
        if data.startswith("reject:"):
            approval_id = data.split(":", 1)[1]
            message = handle_action("reject", approval_id)
            send_message(message)
            answer_callback(callback_query["id"], "폐기 처리했습니다.")
            log(message)
            return

    message = update.get("message")
    if not message:
        return

    user_id = str(message.get("from", {}).get("id", ""))
    if not authorized(user_id):
        send_message("권한이 없는 사용자입니다.")
        return

    text = (message.get("text") or "").strip()
    kind, approval_id = parse_text_command(text)
    if not kind:
        return
    result = handle_action(kind, approval_id)
    send_message(result)
    log(result)


def main() -> int:
    if not BOT_TOKEN or not CHAT_ID:
        print("Telegram env not configured. Fill .env.local first.", file=sys.stderr)
        return 1

    PENDING_DIR.mkdir(parents=True, exist_ok=True)
    APPROVED_DIR.mkdir(parents=True, exist_ok=True)
    REJECTED_DIR.mkdir(parents=True, exist_ok=True)
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)

    log("approval bot started")
    offset = get_offset()
    send_message("승인 봇이 시작되었습니다. 위험 변경 요청과 상태 명령을 처리할 수 있습니다.")

    while True:
        try:
            notify_pending_items()
            updates = get_updates(offset)
            for update in updates:
                offset = max(offset, int(update["update_id"]) + 1)
                handle_update(update)
                set_offset(offset)
        except KeyboardInterrupt:
            raise
        except Exception as exc:
            log(f"loop error: {exc}")
            time.sleep(5)


if __name__ == "__main__":
    import sys
    raise SystemExit(main())
