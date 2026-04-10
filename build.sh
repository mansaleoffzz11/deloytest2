#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "========================================"
echo "  Building Production (obfuscate)"
echo "  Delegates to: node build.js --obfuscate"
echo "========================================"
echo ""

if [ ! -f package.json ]; then
  echo "[ERROR] Run this from the 6.0 project directory (package.json missing)."
  exit 1
fi

npm install
node build.js --obfuscate

echo ""
echo "Done. Output: dist/"
