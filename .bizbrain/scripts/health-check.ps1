# Brain health check (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ConfigPath = Join-Path $BrainDir "config.json"

Write-Host "BizBrain Health Check"
Write-Host "===================="

# Check Claude Code
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Write-Host "OK Claude Code installed" -ForegroundColor Green
} else {
    Write-Host "X  Claude Code not found" -ForegroundColor Red
}

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "OK Node.js $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "X  Node.js not found" -ForegroundColor Red
}

# Check Git
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = (git --version) -replace 'git version ', ''
    Write-Host "OK Git $gitVersion" -ForegroundColor Green
} else {
    Write-Host "X  Git not found" -ForegroundColor Red
}

# Check config
if (Test-Path $ConfigPath) {
    Write-Host "OK Config exists" -ForegroundColor Green
} else {
    Write-Host "X  config.json missing (run /setup)" -ForegroundColor Red
}

# Check dashboard
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5555/api/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK Dashboard running" -ForegroundColor Green
} catch {
    Write-Host "-- Dashboard not running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Brain: $BrainDir"
