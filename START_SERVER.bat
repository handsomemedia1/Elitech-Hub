@echo off
title Elitech Hub - Website Server
color 0A

echo.
echo ========================================
echo    ELITECH HUB WEBSITE SERVER
echo    Starting local development server...
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

echo [OK] Python is installed
echo.
echo Starting server...
echo.

REM Run the Python server script
python serve_website.py

pause
