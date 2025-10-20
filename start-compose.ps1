# PowerShell script to build and start docker compose
Set-Location -Path $PSScriptRoot
if (-Not (Test-Path -Path '.env')) { Write-Warning '.env not found. Copy .env.example and set values.' }
docker compose build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
docker compose up -d
