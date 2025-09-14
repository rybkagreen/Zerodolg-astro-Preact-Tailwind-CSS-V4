@echo off

echo Testing Astro configuration...

REM Check if required files exist
if not exist "astro.config.mjs" (
    echo Error: astro.config.mjs not found
    exit /b 1
)

if not exist "astro.config.prod.mjs" (
    echo Error: astro.config.prod.mjs not found
    exit /b 1
)

REM Check if required dependencies are in package.json
findstr /C:"terser" package.json >nul
if %errorlevel% neq 0 (
    echo Error: terser not found in package.json dependencies
    exit /b 1
)

findstr /C:"lightningcss" package.json >nul
if %errorlevel% neq 0 (
    echo Error: lightningcss not found in package.json dependencies
    exit /b 1
)

REM Check if build scripts exist
findstr /C:"build:prod" package.json >nul
if %errorlevel% neq 0 (
    echo Error: build:prod script not found in package.json
    exit /b 1
)

echo All tests passed! Configuration is ready for production.