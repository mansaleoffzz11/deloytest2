#!/bin/bash

echo "========================================"
echo "  Deploy dist/ folder to Vercel"
echo "========================================"
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "[ERROR] dist folder not found!"
    echo "Please run build.sh first."
    exit 1
fi

echo "[INFO] Deploying dist/ folder to Vercel..."
echo ""

cd dist

echo "Running: vercel --prod"
vercel --prod

cd ..

echo ""
echo "========================================"
echo "  Deploy Complete!"
echo "========================================"
echo ""
echo "Your site is live at Vercel!"
echo ""

