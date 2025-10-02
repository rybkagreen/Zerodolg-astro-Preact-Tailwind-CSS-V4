# PowerShell Script для запуска тестов staging сервера
# Run Staging Tests

param(
    [string]$StagingUrl = "http://localhost:3000",
    [switch]$StartServer,
    [switch]$StopAfter,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Staging Server Testing Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker ps > $null 2>&1
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if staging server is running
function Test-ServerRunning {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 5 -UseBasicParsing
        return $true
    }
    catch {
        return $false
    }
}

# Function to start staging server
function Start-StagingServer {
    Write-Host "Starting staging server..." -ForegroundColor Yellow
    
    if (-not (Test-DockerRunning)) {
        Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
        Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Building and starting Docker containers..." -ForegroundColor Yellow
    docker compose up -d --build
    
    Write-Host "Waiting for server to be ready..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $attempt++
        Start-Sleep -Seconds 2
        
        if (Test-ServerRunning -Url $StagingUrl) {
            Write-Host "✓ Server is ready!" -ForegroundColor Green
            return $true
        }
        
        Write-Host "  Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    }
    
    Write-Host "ERROR: Server failed to start within timeout" -ForegroundColor Red
    return $false
}

# Function to stop staging server
function Stop-StagingServer {
    Write-Host "`nStopping staging server..." -ForegroundColor Yellow
    docker compose down
    Write-Host "✓ Server stopped" -ForegroundColor Green
}

# Main execution
try {
    # Check if Docker is installed
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Docker is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }
    
    # Check if Node.js is installed
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }
    
    # Start server if requested
    if ($StartServer) {
        if (-not (Start-StagingServer)) {
            exit 1
        }
    }
    else {
        # Check if server is already running
        Write-Host "Checking if server is running at $StagingUrl..." -ForegroundColor Yellow
        if (-not (Test-ServerRunning -Url $StagingUrl)) {
            Write-Host "WARNING: Server is not accessible at $StagingUrl" -ForegroundColor Yellow
            Write-Host "You can start it with: npm run staging:up" -ForegroundColor Yellow
            Write-Host "Or run this script with -StartServer flag`n" -ForegroundColor Yellow
            
            $response = Read-Host "Do you want to start the server now? (y/n)"
            if ($response -eq 'y' -or $response -eq 'Y') {
                if (-not (Start-StagingServer)) {
                    exit 1
                }
            }
            else {
                Write-Host "Exiting without running tests." -ForegroundColor Yellow
                exit 1
            }
        }
        else {
            Write-Host "✓ Server is accessible" -ForegroundColor Green
        }
    }
    
    # Run the automated tests
    Write-Host "`nRunning automated tests...`n" -ForegroundColor Cyan
    
    $env:STAGING_URL = $StagingUrl
    
    if ($Verbose) {
        node scripts/test/staging-automated-test.js
    }
    else {
        node scripts/test/staging-automated-test.js 2>&1
    }
    
    $testExitCode = $LASTEXITCODE
    
    # Stop server if requested
    if ($StopAfter) {
        Stop-StagingServer
    }
    
    # Exit with test result code
    exit $testExitCode
}
catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($StopAfter) {
        Stop-StagingServer
    }
    
    exit 1
}
