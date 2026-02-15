# Runs after git pull to handle migrations (PowerShell)
$BrainDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$BizBrain = Join-Path $BrainDir ".bizbrain"
$ConfigPath = Join-Path $BrainDir "config.json"
$VersionPath = Join-Path $BizBrain "VERSION.json"

# Read current and new versions
try {
    $config = Get-Content $ConfigPath -Raw | ConvertFrom-Json
    $OldVersion = if ($config.version) { $config.version } else { "0.0.0" }
} catch {
    $OldVersion = "0.0.0"
}

$versionInfo = Get-Content $VersionPath -Raw | ConvertFrom-Json
$NewVersion = $versionInfo.version

if ($OldVersion -eq $NewVersion) {
    Write-Host "[BizBrain] Already up to date (v$NewVersion)"
    exit 0
}

Write-Host "[BizBrain] Updating from v$OldVersion to v$NewVersion..."

# Run migrations
$MigrationsDir = Join-Path $BizBrain "migrations"
if (Test-Path $MigrationsDir) {
    Get-ChildItem -Path $MigrationsDir -Filter "*.js" | Sort-Object Name | ForEach-Object {
        $MigrationVer = $_.BaseName
        if ($MigrationVer -gt $OldVersion) {
            Write-Host "  Running migration: $MigrationVer"
            node $_.FullName
        }
    }
}

# Update version in config
$config.version = $NewVersion
$config | ConvertTo-Json -Depth 10 | Set-Content -Path $ConfigPath

Write-Host "[BizBrain] Updated to v$NewVersion"
