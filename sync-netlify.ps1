# Sync dist_frontend for Netlify Deployment
# Run: .\sync-netlify.ps1 or double-click "Sync Netlify.bat"

param(
    [switch]$GenerateSitemap,
    [switch]$OpenNetlify
)

$ErrorActionPreference = "Stop"

# Configuration
$SiteRoot = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub"
$DistPath = "$SiteRoot\dist_frontend"
$AgentPath = "C:\Users\lenovo\.gemini\antigravity\scratch\cyberoutreach-agent"

Write-Host ""
Write-Host "[NETLIFY DEPLOYMENT SYNC]" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Ensure directories exist
Write-Host "[1] Creating directories..." -ForegroundColor Yellow
$null = New-Item -ItemType Directory -Force -Path "$DistPath\data"
$null = New-Item -ItemType Directory -Force -Path "$DistPath\blog-posts"
$null = New-Item -ItemType Directory -Force -Path "$DistPath\images\blog"
Write-Host "    OK - Directories ready" -ForegroundColor Green

# Step 2: Copy data files
Write-Host ""
Write-Host "[2] Copying data files..." -ForegroundColor Yellow

$DataFiles = @("blog_index.json", "blog-posts.json")
foreach ($file in $DataFiles) {
    $src = "$SiteRoot\data\$file"
    $dst = "$DistPath\data\$file"
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "    OK - $file" -ForegroundColor Green
    }
}

# Step 3: Copy sitemap
Write-Host ""
Write-Host "[3] Copying sitemap..." -ForegroundColor Yellow
$sitemapSrc = "$SiteRoot\sitemap.xml"
if (Test-Path $sitemapSrc) {
    Copy-Item $sitemapSrc "$DistPath\sitemap.xml" -Force
    Write-Host "    OK - sitemap.xml" -ForegroundColor Green
}

# Step 4: Copy blog posts (HTML only)
Write-Host ""
Write-Host "[4] Copying blog posts..." -ForegroundColor Yellow
$blogDir = "$SiteRoot\blog-posts"
if (Test-Path $blogDir) {
    $htmlFiles = Get-ChildItem $blogDir -Filter "*.html"
    foreach ($file in $htmlFiles) {
        Copy-Item $file.FullName "$DistPath\blog-posts\$($file.Name)" -Force
    }
    Write-Host "    OK - $($htmlFiles.Count) HTML blog posts copied" -ForegroundColor Green
}

# Step 5: Copy blog images
Write-Host ""
Write-Host "[5] Copying blog images..." -ForegroundColor Yellow
$imgDir = "$SiteRoot\images\blog"
if (Test-Path $imgDir) {
    $images = Get-ChildItem $imgDir -File -ErrorAction SilentlyContinue
    if ($images) {
        foreach ($img in $images) {
            Copy-Item $img.FullName "$DistPath\images\blog\$($img.Name)" -Force
        }
        Write-Host "    OK - $($images.Count) images copied" -ForegroundColor Green
    }
    else {
        Write-Host "    SKIP - No images found" -ForegroundColor Gray
    }
}
else {
    Write-Host "    SKIP - Images folder not found" -ForegroundColor Gray
}

# Step 6: Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[SYNC COMPLETE]" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

$blogPostCount = (Get-ChildItem "$DistPath\blog-posts" -Filter "*.html" -ErrorAction SilentlyContinue).Count
$dataFiles = (Get-ChildItem "$DistPath\data" -ErrorAction SilentlyContinue).Count

Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  Blog posts: $blogPostCount HTML files" -ForegroundColor White
Write-Host "  Data files: $dataFiles files" -ForegroundColor White
Write-Host "  Location:   $DistPath" -ForegroundColor White
Write-Host ""

if ($OpenNetlify) {
    Write-Host "Opening Netlify..." -ForegroundColor Yellow
    Start-Process "https://app.netlify.com"
}

Write-Host "NEXT: Drag dist_frontend folder to Netlify" -ForegroundColor Cyan
Write-Host ""
