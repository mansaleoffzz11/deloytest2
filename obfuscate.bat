@echo off
cd /d "%~dp0"

echo ========================================
echo   Production build (obfuscate dist + refresh public bundles)
echo   Same as: npm run build
echo ========================================
echo.

if not exist package.json (
  echo [ERROR] Run this from the 6.0 project folder.
  pause
  exit /b 1
)

call npm install
node build.js --obfuscate
echo.
pause
