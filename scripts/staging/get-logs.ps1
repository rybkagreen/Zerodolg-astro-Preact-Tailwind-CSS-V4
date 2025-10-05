# Script to get logs from staging Docker containers
# Update PATH for current session with Docker paths
$dockerPaths = @(
    "D:\Program Files\Docker\resources\bin",
    "C:\Program Files\Docker\Docker\resources\bin",
    "$env:ProgramFiles\Docker\Docker\resources\bin",
    "$env:LOCALAPPDATA\Programs\Docker\Docker\resources\bin"
)

foreach ($path in $dockerPaths) {
    if (Test-Path $path) {
        $env:PATH = "$path;$env:PATH"
        Write-Host "Added Docker path: $path" -ForegroundColor Green
        break
    }
}

# Check if docker is available
try {
    $dockerVersion = docker version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker found and available" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: Docker not found. Make sure Docker Desktop is running and restart PowerShell." -ForegroundColor Red
    Write-Host "You can also try adding Docker to PATH manually via: Settings -> Resources -> WSL Integration" -ForegroundColor Yellow
    exit 1
}

# Get logs from the staging container
Write-Host "Getting logs from staging container..." -ForegroundColor Cyan
try {
    docker compose logs -f zerodolg-web
} catch {
    Write-Host "Error getting logs: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}