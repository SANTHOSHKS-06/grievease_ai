@echo off
title GrievEase - AI-Powered College Grievance Platform
color 0B

echo ================================================================
echo       GrievEase - AI-Powered College Grievance Platform         
echo ================================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please install Node.js from https://nodejs.org and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if dependencies are installed
if not exist "node_modules\" (
    echo [INFO] First time launch detected. Installing project dependencies...
    echo Running 'npm install', please wait...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] 'npm install' failed. Please check the logs above.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully!
    echo.
)

:: 3. Launch the Vite Development Server and open browser
echo [INFO] Starting GrievEase web application...
echo [INFO] Opening your default browser at http://localhost:5173
echo.
echo Press Ctrl+C in this terminal window anytime to stop the server.
echo ================================================================
echo.

call npx vite --open

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to start dev server.
    pause
)
