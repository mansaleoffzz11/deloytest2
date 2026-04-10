@echo off
cd /d "%~dp0"

echo ========================================
echo   Refresh bundles (minify, no obfuscate)
echo   Same as: npm run build:minify
echo ========================================
echo.

if not exist package.json (
  echo [ERROR] Run this from the 6.0 project folder.
  pause
  exit /b 1
)

call npm install
node build.js --minify
echo.
pause
