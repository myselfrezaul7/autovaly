$ErrorActionPreference = "Continue"
$urls = @{
    "tesla-model-y-refresh.jpg" = "https://picsum.photos/seed/tesla-model-y/1200/800"
    "bmw-m5-touring-review.jpg" = "https://picsum.photos/seed/bmw-m5/1200/800"
    "byd-europe-ev-market.jpg" = "https://picsum.photos/seed/byd-seal/1200/800"
    "porsche-taycan-vs-audi-etron-gt.jpg" = "https://picsum.photos/seed/taycan/1200/800"
    "xiaomi-su7-ultra-review.jpg" = "https://picsum.photos/seed/xiaomi/1200/800"
    "ford-maverick-hybrid-review.jpg" = "https://picsum.photos/seed/ford/1200/800"
    "hyundai-ioniq-9-review.jpg" = "https://picsum.photos/seed/hyundai/1200/800"
    "rivian-r2-pre-orders.jpg" = "https://picsum.photos/seed/rivian/1200/800"
    "solid-state-batteries-explained.jpg" = "https://picsum.photos/seed/battery/1200/800"
    "best-evs-under-40k.jpg" = "https://picsum.photos/seed/ev/1200/800"
    "porsche-911-hybrid-deep-dive.jpg" = "https://picsum.photos/seed/porsche911/1200/800"
    "lucid-gravity-first-look.jpg" = "https://picsum.photos/seed/lucid/1200/800"
    "manual-transmission-sales-rebound.jpg" = "https://picsum.photos/seed/manual/1200/800"
    "tesla-fsd-v13-review.jpg" = "https://picsum.photos/seed/fsd/1200/800"
    "europe-tariffs-chinese-evs.jpg" = "https://picsum.photos/seed/tariffs/1200/800"
}

$outPath = "public/images/articles"
if (-not (Test-Path $outPath)) {
    New-Item -ItemType Directory $outPath | Out-Null
}

foreach ($key in $urls.Keys) {
    $url = $urls[$key]
    $dest = "$outPath/$key"
    Write-Host "Downloading $key..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent "Mozilla/5.0"
    } catch {
        Write-Host "Failed to download $key"
    }
}
