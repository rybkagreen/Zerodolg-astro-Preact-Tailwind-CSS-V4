# PowerShell script to start the Task Orchestrator
# Usage: .\start_orchestrator.ps1 [-Duration <minutes>]

param(
    [int]$Duration = 5
)

Write-Host "🎯 Starting Task Orchestrator..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray
Write-Host "Duration: $Duration minutes" -ForegroundColor Yellow
Write-Host ""

# Check if Python is available
$pythonCmd = Get-Command python3 -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
}

if (-not $pythonCmd) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Build command
$scriptPath = Join-Path $PSScriptRoot "orchestrator.py"

Write-Host "Starting orchestrator..." -ForegroundColor Green
Write-Host "The orchestrator will manage tasks for $Duration minutes" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop early" -ForegroundColor Gray
Write-Host ""

# Start the orchestrator
& $pythonCmd.Path $scriptPath --duration $Duration