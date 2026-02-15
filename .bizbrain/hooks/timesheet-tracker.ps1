# Auto-tracks time when Claude Code is active (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$LogDir = Join-Path $BrainDir ".bizbrain\logs\timesheet"
$Date = Get-Date -Format "yyyy-MM-dd"
$LogFile = Join-Path $LogDir "$Date.jsonl"

# Ensure directory exists
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Log session activity
$IsoTimestamp = Get-Date -Format "o"
$ProjectName = Split-Path -Leaf $BrainDir
$Entry = @{
    timestamp = $IsoTimestamp
    event = "prompt"
    project = $ProjectName
} | ConvertTo-Json -Compress

$Entry | Add-Content -Path $LogFile
