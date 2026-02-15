# BizBrain OS - Quick Setup (PowerShell)
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  BizBrain OS - Quick Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "X Node.js is required. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "OK Node.js $nodeVersion" -ForegroundColor Green

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "X Git is required. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}
$gitVersion = (git --version) -replace 'git version ', ''
Write-Host "OK Git $gitVersion" -ForegroundColor Green

if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    Write-Host "X Claude Code is required. Install with: npm install -g @anthropic-ai/claude-code" -ForegroundColor Red
    exit 1
}
Write-Host "OK Claude Code found" -ForegroundColor Green

Write-Host ""
Write-Host "All prerequisites met!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Claude Code for setup..."
Write-Host "Type /setup when Claude Code starts."
Write-Host ""

claude
