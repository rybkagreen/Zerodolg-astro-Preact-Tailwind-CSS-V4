# PowerShell script to restart stalled workers
# Safely stops hung workers and restarts the system

Write-Host ""
Write-Host "🔍 Checking for stalled workers..." -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Gray

# Find stalled workers (no heartbeat for > 5 minutes)
$stalledWorkers = @()
$currentTime = Get-Date

Get-ChildItem workers/*.json | ForEach-Object {
    $worker = Get-Content $_ | ConvertFrom-Json
    $lastHeartbeat = [DateTime]::Parse($worker.last_heartbeat)
    $timeSinceHeartbeat = ($currentTime - $lastHeartbeat).TotalSeconds
    
    if ($timeSinceHeartbeat -gt 300) {  # 5 minutes
        $stalledWorkers += @{
            File = $_
            Id = $worker.id
            Name = $worker.name
            Task = $worker.current_task
            StallTime = [math]::Round($timeSinceHeartbeat / 60, 1)
        }
        
        Write-Host "❌ Stalled: $($worker.name) (ID: $($worker.id.Substring(0,8)))" -ForegroundColor Red
        Write-Host "   Task: $($worker.current_task)" -ForegroundColor Gray
        Write-Host "   Stalled for: $([math]::Round($timeSinceHeartbeat / 60, 1)) minutes" -ForegroundColor Gray
    }
}

if ($stalledWorkers.Count -eq 0) {
    Write-Host "✅ No stalled workers found!" -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "⚠️  Found $($stalledWorkers.Count) stalled worker(s)" -ForegroundColor Yellow
Write-Host ""

# Stop all Python processes (workers)
Write-Host "🛑 Stopping all Python processes..." -ForegroundColor Red
$pythonProcesses = Get-Process python*, pwsh -ErrorAction SilentlyContinue | 
    Where-Object { $_.MainWindowTitle -like "*worker*" -or $_.MainWindowTitle -like "*orchestrator*" }

if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "   Stopped $($pythonProcesses.Count) processes" -ForegroundColor Gray
}

# Clean up stalled worker files
Write-Host ""
Write-Host "🧹 Cleaning up stalled worker registrations..." -ForegroundColor Yellow
foreach ($worker in $stalledWorkers) {
    Remove-Item $worker.File -Force
    Write-Host "   Removed: $($worker.Name)" -ForegroundColor Gray
}

# Move incomplete tasks back to queue
Write-Host ""
Write-Host "♻️  Recovering incomplete tasks..." -ForegroundColor Cyan
$recoveredCount = 0
Get-ChildItem tasks/task_*.json -ErrorAction SilentlyContinue | ForEach-Object {
    $taskContent = Get-Content $_ | ConvertFrom-Json
    
    # Save to state for recovery
    $recoveryFile = "state/recovered_task_$($taskContent.id).json"
    $taskContent | ConvertTo-Json -Depth 10 | Out-File $recoveryFile
    $recoveredCount++
    
    # Remove original task file
    Remove-Item $_ -Force
    
    Write-Host "   Recovered: $($taskContent.id) ($($taskContent.type))" -ForegroundColor Gray
}

if ($recoveredCount -gt 0) {
    Write-Host "   Total recovered: $recoveredCount tasks" -ForegroundColor Green
}

Write-Host ""
Write-Host "=================================================" -ForegroundColor Gray
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review and fix the timeout issue in enhanced_worker.py" -ForegroundColor Gray
Write-Host "2. Consider removing --all-files flag for large projects" -ForegroundColor Gray
Write-Host "3. Restart the system with: .\start_full_optimization.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Recommendation: Reduce qwen timeout or remove --all-files" -ForegroundColor Yellow