# Launch Claude Code in the conversations folder (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ConvDir = Join-Path (Split-Path -Parent $BrainDir) "BizBrain-Conversations"
$ConfigPath = Join-Path $BrainDir "config.json"

if (-not (Test-Path $ConvDir)) {
    New-Item -ItemType Directory -Path $ConvDir -Force | Out-Null

    # Generate minimal CLAUDE.md for conversations folder
    try {
        $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
        $businessName = if ($config.profile.businessName) { $config.profile.businessName } else { "BizBrain" }
    } catch {
        $businessName = "BizBrain"
    }

    $claudeMd = @"
# $businessName - Conversations

> Lightweight entry point for Brain conversations.
> Full Brain location: $BrainDir

## Quick Commands
- /help - See available commands
- /status - Brain status
- /knowledge <topic> - Load specific knowledge
- /dashboard - Open the dashboard
"@
    $claudeMd | Set-Content -Path (Join-Path $ConvDir "CLAUDE.md")
}

# Open Windows Terminal with claude
if (Get-Command wt -ErrorAction SilentlyContinue) {
    wt -d $ConvDir -- claude
} else {
    Write-Host "Open a terminal in $ConvDir and run: claude"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ConvDir'; claude"
}
