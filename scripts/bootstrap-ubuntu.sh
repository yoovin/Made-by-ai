#!/usr/bin/env bash
set -Eeuo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

CURRENT_USER="$(id -un)"
CURRENT_GROUP="$(id -gn)"
PROJECT_DIR="$PROJECT_ROOT"

echo "[1/5] prerequisite check"
bash "$PROJECT_ROOT/scripts/check-prereqs.sh" || true

echo "[2/5] create runtime directories"
mkdir -p \
  "$PROJECT_ROOT/.ops/runtime" \
  "$PROJECT_ROOT/.ops/logs" \
  "$PROJECT_ROOT/ops/approvals/pending" \
  "$PROJECT_ROOT/ops/approvals/approved" \
  "$PROJECT_ROOT/ops/approvals/rejected"

echo "[3/5] install systemd units"
for template in \
  "$PROJECT_ROOT/systemd/made-by-ai-telegram.service.template" \
  "$PROJECT_ROOT/systemd/made-by-ai-web.service.template"; do

  target_name="$(basename "${template%.template}")"
  sed \
    -e "s#__PROJECT_DIR__#$PROJECT_DIR#g" \
    -e "s#__USER__#$CURRENT_USER#g" \
    -e "s#__GROUP__#$CURRENT_GROUP#g" \
    "$template" | sudo tee "/etc/systemd/system/$target_name" >/dev/null
done

echo "[4/5] install nginx config"
sudo sed \
  -e "s#__PROJECT_DIR__#$PROJECT_DIR#g" \
  -e "s#__INTERNAL_APP_PORT__#$INTERNAL_APP_PORT#g" \
  "$PROJECT_ROOT/nginx/made-by-ai.conf.template" | sudo tee /etc/nginx/sites-available/made-by-ai >/dev/null

sudo ln -sf /etc/nginx/sites-available/made-by-ai /etc/nginx/sites-enabled/made-by-ai
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "[5/5] install dependencies and reload"
if command -v pnpm >/dev/null 2>&1; then
  pnpm install
fi

sudo systemctl daemon-reload

echo
echo "bootstrap complete"
echo "next commands:"
echo "  sudo systemctl enable --now made-by-ai-web"
echo "  sudo systemctl enable --now made-by-ai-telegram"
echo "  bash scripts/opencode.sh"
