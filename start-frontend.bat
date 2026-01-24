@echo off
title Elitech Hub Frontend Server
echo ========================================
echo   Elitech Hub - Starting Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo Checking for Live Server...
echo.
echo OPTION 1: VS Code Live Server (Recommended)
echo -------------------------------------------
echo 1. Open VS Code
echo 2. Open the file: index.html
echo 3. Right-click and select "Open with Live Server"
echo 4. Website opens at http://localhost:5500
echo.
echo.
echo OPTION 2: Python HTTP Server
echo -------------------------------------------
echo Starting Python server on port 5500...
echo.

python -m http.server 5500

pause
