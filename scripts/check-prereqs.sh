#!/usr/bin/env bash
set -Eeuo pipefail

required=(git curl python3 jq nginx)
missing=()

for bin in "${required[@]}"; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    missing+=("$bin")
  fi
done

if [[ "${#missing[@]}" -gt 0 ]]; then
  echo "missing: ${missing[*]}"
  exit 1
fi

echo "basic prerequisites look okay"

if command -v node >/dev/null 2>&1; then
  echo "node: $(node -v)"
else
  echo "node not found"
fi

if command -v pnpm >/dev/null 2>&1; then
  echo "pnpm: $(pnpm -v)"
else
  echo "pnpm not found"
fi

if command -v opencode >/dev/null 2>&1; then
  echo "opencode: $(opencode --version)"
else
  echo "opencode not found"
fi
