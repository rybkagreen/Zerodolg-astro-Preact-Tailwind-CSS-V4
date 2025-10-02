# Clean staging environment - remove all containers, volumes and images
Write-Host "Cleaning staging environment..." -ForegroundColor Yellow

$env:PATH = "D:\Program Files\Docker\resources\bin;" + $env:PATH

# Stop and remove containers, volumes and images
docker compose down -v --rmi all

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nStaging environment cleaned successfully!" -ForegroundColor Green
    Write-Host "All containers, volumes and images removed." -ForegroundColor Cyan
} else {
    Write-Host "`nError cleaning staging environment" -ForegroundColor Red
    exit 1
}
