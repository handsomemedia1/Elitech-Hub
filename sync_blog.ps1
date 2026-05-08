# ============================================================
# Elitech Hub - Full Site Deployment Sync Script
# Includes: SEO files, sitemap auto-generation, and all pages
# ============================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Elitech Hub Deployment Sync" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# ===== STEP 1: Auto-regenerate Sitemap =====
Write-Host "`n[1/5] Generating fresh sitemap.xml..." -ForegroundColor Yellow
node generate-sitemap.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Sitemap generation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "     sitemap.xml updated!" -ForegroundColor Green

# ===== STEP 2: Copy SEO Foundation Files =====
Write-Host "`n[2/5] Syncing SEO foundation files..." -ForegroundColor Yellow
Copy-Item "robots.txt" "dist_frontend\robots.txt" -Force
Write-Host "     robots.txt copied"
Copy-Item "sitemap.xml" "dist_frontend\sitemap.xml" -Force
Write-Host "     sitemap.xml copied"

# ===== STEP 3: Copy Updated HTML Pages =====
Write-Host "`n[3/5] Syncing HTML pages..." -ForegroundColor Yellow

$pages = @(
    "index.html", "blog.html", "article.html", "programs.html",
    "about.html", "contact.html", "services.html", "portfolio.html",
    "research.html", "get-involved.html", "security.html",
    "apply.html", "lab.html", "payment.html", "writer.html", "admin.html"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        Copy-Item $page "dist_frontend\$page" -Force
        Write-Host "     $page copied"
    }
}

# ===== STEP 4: Copy JS Files =====
Write-Host "`n[4/5] Syncing JavaScript files..." -ForegroundColor Yellow
Copy-Item "js\article.js" "dist_frontend\js\article.js" -Force
Write-Host "     js\article.js copied"
Copy-Item "js\blog.js" "dist_frontend\js\blog.js" -Force -ErrorAction SilentlyContinue
Write-Host "     js\blog.js copied"

# ===== STEP 4.5: Copy CSS Files =====
Write-Host "`n[4.5/5] Syncing CSS files..." -ForegroundColor Yellow
Copy-Item "css\*" "dist_frontend\css\" -Recurse -Force
Write-Host "     css directory copied"

# ===== STEP 5: Git Operations =====
Write-Host "`n[5/5] Deploying to GitHub..." -ForegroundColor Yellow
$commitMsg = "SEO: Auto-sitemap, hreflang, schema.org, Google AI signals - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git add .
git commit -m $commitMsg
git push

Write-Host "`n============================================" -ForegroundColor Green
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host " Sitemap: https://elitechub.com/sitemap.xml" -ForegroundColor Green
Write-Host " Robots:  https://elitechub.com/robots.txt" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
