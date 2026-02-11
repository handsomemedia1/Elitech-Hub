# Sync Blog Enhancements to Deployment Folder
Write-Host "Syncing blog enhancements to dist_frontend..." -ForegroundColor Cyan

# Phase 2: Writer Editor
Write-Host "Copying writer.html..."
Copy-Item "writer.html" "dist_frontend\writer.html" -Force

# Phase 1: Admin Editor (ensure latest version)
Write-Host "Copying admin.html..."
Copy-Item "admin.html" "dist_frontend\admin.html" -Force

# Blog Listing Page
Write-Host "Copying blog.html..."
Copy-Item "blog.html" "dist_frontend\blog.html" -Force

# Phase 3: Article Page
Write-Host "Copying article.html..."
Copy-Item "article.html" "dist_frontend\article.html" -Force

Write-Host "Copying js\article.js..."
Copy-Item "js\article.js" "dist_frontend\js\article.js" -Force

# Git Operations
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Enhance blog ecosystem: writer editor upgrade + premium article reading experience"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ Deployment Sync Complete!" -ForegroundColor Green
