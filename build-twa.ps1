$ErrorActionPreference = "Stop"

Write-Host "Creating Android Trusted Web Activity (TWA) with Bubblewrap..." -ForegroundColor Cyan

# Ensure bubblewrap is installed
if (!(Get-Command bubblewrap -ErrorAction SilentlyContinue)) {
    Write-Host "Installing @bubblewrap/cli..."
    npm install -g @bubblewrap/cli
}

# Create a directory for the TWA build
if (-not (Test-Path twa-build)) {
    New-Item -ItemType Directory twa-build | Out-Null
}
Set-Location twa-build

Write-Host "Initializing Bubblewrap project from web manifest..." -ForegroundColor Cyan
Write-Host "NOTE: Bubblewrap may prompt you to specify paths to the Java JDK and Android SDK."
Write-Host "If you don't have them, it can automatically download and configure them for you."

# Init bubblewrap (Using the deployed manifest)
# We use the live URL or local URL depending on where it's hosted. Assuming https://autovaly.com
bubblewrap init --manifest=https://autovaly.com/manifest.webmanifest

Write-Host "Building the Android App Bundle (.aab)..." -ForegroundColor Cyan
bubblewrap build

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Build Complete! Your .aab file is ready in the twa-build folder." -ForegroundColor Green
Write-Host "Upload this .aab file to the Google Play Console." -ForegroundColor Green
Write-Host "NOTE: Remember to copy the SHA-256 fingerprint generated during this process" -ForegroundColor Yellow
Write-Host "and update your public/.well-known/assetlinks.json file with it!" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

Set-Location ..
