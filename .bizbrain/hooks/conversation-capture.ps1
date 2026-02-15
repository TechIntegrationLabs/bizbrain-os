# Captures conversation content in real-time (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$LiveDir = Join-Path $BrainDir "_intake-dump\conversations\_live"
$Timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
$SessionFile = Join-Path $LiveDir "session-$Timestamp.md"

# Ensure directory exists
if (-not (Test-Path $LiveDir)) {
    New-Item -ItemType Directory -Path $LiveDir -Force | Out-Null
}

# Append prompt content
$IsoTimestamp = Get-Date -Format "o"
@"
---
timestamp: $IsoTimestamp
---

"@ | Add-Content -Path $SessionFile
