#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="/Users/sid/Desktop/ian-codex-upload"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

rsync -a \
  --exclude ".git" \
  --exclude "node_modules" \
  --exclude "dist" \
  --exclude ".DS_Store" \
  --exclude ".playwright-cli" \
  --exclude ".shots" \
  --exclude ".tmp-thumbs" \
  --exclude "output" \
  --exclude "test-results" \
  "$ROOT_DIR"/ "$TARGET_DIR"/

echo "Clean package created at: $TARGET_DIR"
