# Start C++ Development System
# This script initializes and runs the complete C++ development workflow

Write-Host "🚀 Starting C++ Development System..." -ForegroundColor Green
Write-Host "=" * 60

# Check if Python is available
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if required services are running
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Qdrant
$qdrantRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:6333/collections" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $qdrantRunning = $true
        Write-Host "✅ Qdrant is running" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Qdrant is not running. Starting without vector database support." -ForegroundColor Yellow
    Write-Host "   To enable Qdrant: docker run -p 6333:6333 qdrant/qdrant" -ForegroundColor Gray
}

# Check Ollama
$ollamaRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $ollamaRunning = $true
        Write-Host "✅ Ollama is running" -ForegroundColor Green
        
        # Check if nomic-embed-text model is available
        $tags = $response.Content | ConvertFrom-Json
        $hasEmbedModel = $tags.models | Where-Object { $_.name -like "*nomic-embed-text*" }
        if (-not $hasEmbedModel) {
            Write-Host "   ⚠️ nomic-embed-text model not found. Pull it with: ollama pull nomic-embed-text" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️ Ollama is not running. Starting without embedding support." -ForegroundColor Yellow
    Write-Host "   To enable Ollama: ollama serve" -ForegroundColor Gray
}

# Create necessary directories
Write-Host "`n📁 Creating project directories..." -ForegroundColor Yellow
$directories = @("src", "tests", "docs", "docs/adr", "config", "reports", "logs")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created: $dir" -ForegroundColor Gray
    }
}

# Create default configuration if not exists
$configFile = "config/cpp_development.json"
if (-not (Test-Path $configFile)) {
    Write-Host "`n📝 Creating default configuration..." -ForegroundColor Yellow
    $defaultConfig = @{
        qdrant = @{
            host = "localhost"
            port = 6333
            collection = "cpp_knowledge"
        }
        ollama = @{
            model = "nomic-embed-text"
            host = "http://localhost:11434"
        }
        workers = @{
            architecture = 2
            code_generator = 3
            testing = 2
            code_review = 2
            build_system = 1
            documentation = 1
            performance = 1
        }
        project = @{
            name = "CPP_Orchestration_System"
            version = "1.0.0"
            language = "C++20"
            build_system = "CMake"
        }
    } | ConvertTo-Json -Depth 3
    
    $defaultConfig | Out-File -FilePath $configFile -Encoding UTF8
    Write-Host "   Configuration saved to: $configFile" -ForegroundColor Gray
}

# Parse command line arguments
$initOnly = $false
$cycles = 1
$projectPath = "."

for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "--init-only" { $initOnly = $true }
        "--cycles" { 
            if ($i + 1 -lt $args.Count) {
                $cycles = [int]$args[$i + 1]
                $i++
            }
        }
        "--project" {
            if ($i + 1 -lt $args.Count) {
                $projectPath = $args[$i + 1]
                $i++
            }
        }
    }
}

# Build command
$command = "python cpp_development_system.py"
$command += " --project `"$projectPath`""
$command += " --cycles $cycles"
if ($initOnly) {
    $command += " --init-only"
}

# Display system status
Write-Host "`n📊 System Configuration:" -ForegroundColor Cyan
Write-Host "   Project Path: $projectPath"
Write-Host "   Development Cycles: $cycles"
Write-Host "   Qdrant: $(if ($qdrantRunning) { 'Available' } else { 'Not Available' })"
Write-Host "   Ollama: $(if ($ollamaRunning) { 'Available' } else { 'Not Available' })"
Write-Host "   Init Only: $initOnly"

Write-Host "`n🎬 Starting C++ Development System..." -ForegroundColor Green
Write-Host "=" * 60
Write-Host ""

# Run the system
try {
    Invoke-Expression $command
    
    Write-Host "`n✅ C++ Development System completed successfully!" -ForegroundColor Green
    
    # Show generated files
    Write-Host "`n📄 Generated Files:" -ForegroundColor Cyan
    if (Test-Path "src") {
        $srcFiles = Get-ChildItem -Path "src" -File
        if ($srcFiles.Count -gt 0) {
            Write-Host "   Source Files:"
            $srcFiles | ForEach-Object { Write-Host "      - $_" -ForegroundColor Gray }
        }
    }
    
    if (Test-Path "tests") {
        $testFiles = Get-ChildItem -Path "tests" -File
        if ($testFiles.Count -gt 0) {
            Write-Host "   Test Files:"
            $testFiles | ForEach-Object { Write-Host "      - $_" -ForegroundColor Gray }
        }
    }
    
    if (Test-Path "docs") {
        $docFiles = Get-ChildItem -Path "docs" -File -Recurse
        if ($docFiles.Count -gt 0) {
            Write-Host "   Documentation:"
            $docFiles | ForEach-Object { 
                $relativePath = $_.FullName.Replace("$PWD\docs\", "")
                Write-Host "      - $relativePath" -ForegroundColor Gray 
            }
        }
    }
    
    # Show latest report
    if (Test-Path "reports") {
        $latestReport = Get-ChildItem -Path "reports" -Filter "*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latestReport) {
            Write-Host "`n📊 Latest Report: $($latestReport.Name)" -ForegroundColor Cyan
            $report = Get-Content $latestReport.FullName | ConvertFrom-Json
            Write-Host "   Total Tasks: $($report.statistics.total_tasks)"
            Write-Host "   Completed: $($report.statistics.completed_tasks)"
            Write-Host "   Failed: $($report.statistics.failed_tasks)"
        }
    }
    
} catch {
    Write-Host "`n❌ Error running C++ Development System:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Done!" -ForegroundColor Green