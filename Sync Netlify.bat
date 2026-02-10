@echo off
REM ========================================
REM  Sync Netlify - Elitech Hub
REM  Double-click to sync dist_frontend
REM ========================================

echo.
echo ========================================
echo   SYNCING DIST_FRONTEND FOR NETLIFY
echo ========================================
echo.

cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "sync-netlify.ps1"

echo.
echo Press any key to exit...
pause > nul
