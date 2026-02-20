# BizBrain OS - Startup Hook (PowerShell)
# Runs when Claude Code starts in the Brain folder

$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ConfigPath = Join-Path $BrainDir "config.json"

# Check if setup has been completed
if (-not (Test-Path $ConfigPath)) {
    Write-Host "[BizBrain] First run detected. Run /setup to begin."
    exit 0
}

# Read business name from config
try {
    $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
    $businessName = if ($config.profile.businessName) { $config.profile.businessName } else { "BizBrain" }
    Write-Host "[BizBrain] Welcome back! Brain: $businessName"
} catch {
    Write-Host "[BizBrain] Welcome back!"
}

# Check for updates
# (compare local VERSION.json with what git knows)
