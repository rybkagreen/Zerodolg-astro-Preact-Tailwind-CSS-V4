# PowerShell script to clean up orchestration system files
# Usage: .\cleanup.ps1 [-KeepLogs]

param(
    [switch]$KeepLogs
)

Write-Host "🧹 Cleaning up orchestration system..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

$baseDir = $PSScriptRoot

# Directories to clean
$dirsToClean = @(
    "tasks",
    "results",
    "workers"
)

if (-not $KeepLogs) {
    $dirsToClean += "logs"
}

foreach ($dir in $dirsToClean) {
    $dirPath = Join-Path $baseDir $dir
    
    if (Test-Path $dirPath) {
        $files = Get-ChildItem -Path $dirPath -File -Recurse
        $count = $files.Count
        
        if ($count -gt 0) {
            Write-Host "Cleaning $dir/ ($count files)..." -ForegroundColor Yellow
            Remove-Item -Path "$dirPath\*" -Recurse -Force
        } else {
            Write-Host "$dir/ is already clean" -ForegroundColor Green
        }
    }
}

if ($KeepLogs) {
    Write-Host ""
    Write-Host "📁 Logs were preserved" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host "The system is ready for a fresh start" -ForegroundColor Gray