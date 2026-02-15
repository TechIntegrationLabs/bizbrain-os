# Launch BizBrain Dashboard (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$ServerPath = Join-Path $BrainDir ".bizbrain\dashboard\server.js"

Write-Host "Starting BizBrain Dashboard..."

# Start dashboard in background
$process = Start-Process -FilePath "node" -ArgumentList $ServerPath -PassThru -NoNewWindow
Start-Sleep -Seconds 1

# Open in browser
Start-Process "http://localhost:5555"

Write-Host "Dashboard running at http://localhost:5555 (PID: $($process.Id))"
Write-Host "Press Ctrl+C to stop."

# Wait for process
try {
    $process | Wait-Process
} catch {
    $process | Stop-Process -Force -ErrorAction SilentlyContinue
}
