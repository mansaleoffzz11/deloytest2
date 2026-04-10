@echo off
echo ========================================
echo   Deploy dist/ folder to Vercel
echo ========================================
echo.

REM Check if dist exists
if not exist dist (
    echo [ERROR] dist folder not found!
    echo Please run build.bat first.
    pause
    exit /b 1
)

echo [INFO] Deploying dist/ folder to Vercel...
echo.

cd dist

echo Running: vercel --prod
call vercel --prod

cd ..

echo.
echo ========================================
echo   Deploy Complete!
echo ========================================
echo.
echo Your site is live at Vercel!
echo.
pause

