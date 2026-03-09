#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$HOME/.config/systemd/user"
for template in made-by-ai-autoloop.service.template made-by-ai-opencode-serve.service.template; do
  sed "s#__PROJECT_ROOT__#$ROOT#g" "$ROOT/systemd/$template" > "$HOME/.config/systemd/user/${template%.template}"
done
echo 'systemctl --user daemon-reload'
echo 'systemctl --user enable --now made-by-ai-opencode-serve.service'
echo 'systemctl --user enable --now made-by-ai-autoloop.service'
echo 'loginctl enable-linger "$USER"'
