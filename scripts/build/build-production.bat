@echo off
REM ZeroDolg Astro Production Build Script
REM This script runs the complete production build process

title ZeroDolg Astro - Production Build

echo 🚀 ZeroDolg Astro - Production Build
echo ======================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check Node.js version
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js not found. Please install Node.js >= 18.x
    pause
    exit /b 1
)

echo 🔧 Node.js version:
node -v

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found. Running environment setup...
    npm run env:setup
)

REM Validate environment
echo 🔍 Validating environment...
npm run env:validate
if errorlevel 1 (
    echo ❌ Environment validation failed!
    pause
    exit /b 1
)

REM Run pre-build validation
echo ✅ Running pre-build validation...
node scripts/build-production.js
if errorlevel 1 (
    echo ❌ Production build failed!
    pause
    exit /b 1
)

echo 🎉 Production build completed successfully!
echo 📂 Build output is located in the 'dist' directory
echo 👀 To preview locally: npm run preview

pause