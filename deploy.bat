@echo off
echo ========================================
echo   Quick Deploy to Vercel
echo ========================================
echo.

echo [1/3] Cleaning old build...
if exist dist (
    rmdir /s /q dist
)

echo [2/3] Building production...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Deploying to Vercel...
call vercel --prod

echo.
echo ========================================
echo   Deploy Complete!
echo ========================================
echo.
echo Your site is live at Vercel!
echo.
pause

