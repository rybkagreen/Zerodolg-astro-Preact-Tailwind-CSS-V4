@echo off
REM Batch script to optimize pattern images using ImageMagick if available

echo Optimizing pattern images...

REM Check if ImageMagick is installed
magick -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ImageMagick not found. Please install ImageMagick to optimize images.
    exit /b 1
)

REM Navigate to patterns directory
cd /d "D:\\develop\\zerodolg.ru\\zerodolg-astro\\public\\patterns"

REM Optimize all PNG pattern images
for %%f in (*.png) do (
    echo Optimizing %%f...
    magick convert "%%f" -resize 800x600 -quality 70 "%%~nf-opt.webp"
)

echo Pattern image optimization complete!

REM Optimize team images
cd /d "D:\\develop\\zerodolg.ru\\zerodolg-astro\\public\\images\\team"

for %%f in (*.webp) do (
    echo Optimizing %%f...
    magick convert "%%f" -resize 200x200 -quality 80 "%%~nf-sm.webp"
)

echo Team image optimization complete!