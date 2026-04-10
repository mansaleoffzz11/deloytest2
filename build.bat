@echo off
cd /d "%~dp0"

echo ========================================
echo   Building Production (obfuscate)
echo   Delegates to: node build.js --obfuscate
echo ========================================
echo.

if not exist package.json (
  echo [ERROR] Run this from the 6.0 project folder (package.json missing).
  pause
  exit /b 1
)

call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

node build.js --obfuscate
if errorlevel 1 (
  echo [ERROR] build.js failed.
  pause
  exit /b 1
)

echo.
pause
