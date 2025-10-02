# Start staging environment with Docker Compose
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

# Start docker compose
Write-Host "`nStarting staging environment..." -ForegroundColor Cyan
docker compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nStaging environment started successfully!" -ForegroundColor Green
    Write-Host "Available at: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "`nError starting staging environment" -ForegroundColor Red
    exit 1
}
