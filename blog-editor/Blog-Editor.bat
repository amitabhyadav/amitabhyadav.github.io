@echo off
REM Blog Editor Launcher Script
REM Double-click this file to run the Blog Editor

cd /d "%~dp0"

echo Starting Blog Editor...
echo Please wait while the application loads...

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies for the first time...
    call npm install
)

REM Check if Electron is installed
if not exist "node_modules\electron" (
    echo Installing Electron...
    call npm install
)

REM Start the Electron app
call npm run electron

echo Blog Editor closed.
pause