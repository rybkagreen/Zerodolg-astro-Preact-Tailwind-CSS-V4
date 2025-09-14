@echo off

echo Starting full production optimization process...

REM 1. Test configuration
echo 1. Testing configuration...
call scripts\test-config.bat
if %errorlevel% neq 0 (
    echo Configuration test failed!
    exit /b 1
)

REM 2. Build production site
echo 2. Building production site...
call scripts\build-prod.bat
if %errorlevel% neq 0 (
    echo Production build failed!
    exit /b 1
)

echo Production optimization process completed successfully!
echo Site is ready for deployment in the 'dist' directory.