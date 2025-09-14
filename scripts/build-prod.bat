@echo off

REM Build the production site
echo Building production site...
npm run build:prod

REM Check if build was successful
if %errorlevel% == 0 (
    echo Production build completed successfully!
    echo Files are located in the 'dist' directory.
    echo You can now deploy these files to your production server.
) else (
    echo Production build failed!
    exit /b 1
)