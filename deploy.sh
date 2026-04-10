#!/bin/bash

echo "========================================"
echo "  Quick Deploy to Vercel"
echo "========================================"
echo ""

echo "[1/3] Cleaning old build..."
rm -rf dist

echo "[2/3] Building production..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Build failed!"
    exit 1
fi

echo ""
echo "[3/3] Deploying to Vercel..."
vercel --prod

echo ""
echo "========================================"
echo "  Deploy Complete!"
echo "========================================"
echo ""
echo "Your site is live at Vercel!"
echo ""

