# BizBrain OS - Session End Hook (PowerShell)
# Captures conversation summary when Claude Code session ends

$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ConvDir = Join-Path $BrainDir "_intake-dump\conversations"
$Date = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HHmmss"

# Ensure directory exists
$LiveDir = Join-Path $ConvDir "_live"
if (-not (Test-Path $LiveDir)) {
    New-Item -ItemType Directory -Path $LiveDir -Force | Out-Null
}

# Create conversation capture file
# (The actual content comes from Claude Code's session data)
$SessionFile = Join-Path $LiveDir "session-$Date-$Time.md"
"Session ended at $(Get-Date -Format 'o')" | Add-Content -Path $SessionFile
