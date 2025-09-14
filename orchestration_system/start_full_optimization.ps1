# PowerShell script to start full optimization system
# Includes optimization workers and documentation worker

Write-Host ""
Write-Host "🚀 STARTING FULL OPTIMIZATION SYSTEM FOR ZERODOLG-ASTRO" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Gray
Write-Host ""

# Check Python
$pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
}

if (-not $pythonCmd) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Clean up old worker registrations
Write-Host "🧹 Cleaning up old worker registrations..." -ForegroundColor Gray
Remove-Item workers/*.json -Force -ErrorAction SilentlyContinue

# Start Documentation Worker
Write-Host ""
Write-Host "📚 Starting Documentation Worker..." -ForegroundColor Yellow
$docWorkerScript = Join-Path $PSScriptRoot "documentation_worker.py"
Start-Process -FilePath $pythonCmd.Path -ArgumentList $docWorkerScript, "--project-root", "../" -WindowStyle Normal
Start-Sleep -Milliseconds 1500

# Start Optimization Workers
Write-Host "🔧 Starting 2 Optimization Workers with edit rights..." -ForegroundColor Yellow
$enhancedScript = Join-Path $PSScriptRoot "enhanced_worker.py"

for ($i = 1; $i -le 2; $i++) {
    $workerName = "Optimizer-$i"
    Start-Process -FilePath $pythonCmd.Path -ArgumentList $enhancedScript, "--name", $workerName, "--project-root", "../" -WindowStyle Normal
    Start-Sleep -Milliseconds 1000
}

Write-Host ""
Write-Host "⏳ Waiting for workers to register..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Check registered workers
Write-Host ""
Write-Host "📋 Registered Workers:" -ForegroundColor Cyan
Get-ChildItem workers/*.json -ErrorAction SilentlyContinue | ForEach-Object {
    $worker = Get-Content $_ | ConvertFrom-Json
    Write-Host "   ✅ $($worker.name) (ID: $($worker.id.Substring(0,8)))" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Gray
Write-Host "🎯 SYSTEM READY FOR OPTIMIZATION" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Gray
Write-Host ""
Write-Host "Workers are running with:" -ForegroundColor Yellow
Write-Host "  • Full project access" -ForegroundColor Gray
Write-Host "  • File editing permissions" -ForegroundColor Gray
Write-Host "  • Documentation capabilities" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step:" -ForegroundColor Cyan
Write-Host "  Run: python start_production_optimization.py" -ForegroundColor White
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Analyze the entire project" -ForegroundColor Gray
Write-Host "  2. Optimize configurations" -ForegroundColor Gray
Write-Host "  3. Clean up unused code" -ForegroundColor Gray
Write-Host "  4. Document all changes" -ForegroundColor Gray
Write-Host "  5. Create production build" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Monitor worker windows for activity" -ForegroundColor Yellow
Write-Host "📝 Check docs/OPTIMIZATION_CHANGES.md for change log" -ForegroundColor Cyan