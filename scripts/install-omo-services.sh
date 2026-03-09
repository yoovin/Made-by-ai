#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYSTEMD_DIR="$HOME/.config/systemd/user"
mkdir -p "$SYSTEMD_DIR"

export ROOT_DIR
for name in made-by-ai-telegram.service made-by-ai-omo-autoloop.service made-by-ai-web.service; do
  template="$ROOT_DIR/systemd/${name}.template"
  target="$SYSTEMD_DIR/${name}"
  envsubst < "$template" > "$target"
  echo "installed: $target"
done

echo "다음 명령을 실행하세요:"
echo "systemctl --user daemon-reload"
echo "systemctl --user enable --now made-by-ai-telegram.service"
echo "systemctl --user enable --now made-by-ai-omo-autoloop.service"
