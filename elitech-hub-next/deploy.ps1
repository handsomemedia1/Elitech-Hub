# ============================================================
# Elitech Hub - Push to GitHub + Deploy to Vercel Prod
# ============================================================

# Navigate to the exact project folder
Write-Host "Navigating to project directory..." -ForegroundColor Cyan
Set-Location -Path "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\elitech-hub-next"

Write-Host "Starting Git commit and Vercel deploy..." -ForegroundColor Cyan

# Stage all changes 
git add src/
git add scratch/migration_phase1.sql scratch/remediation_migration.sql
git add supabase/
git add deploy.ps1 

# Commit the changes
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "feat: Three-pillar remediation - security, scholar meta, researcher portal, unified categories, dynamic JSON-LD"

# Push to GitHub (This automatically triggers Vercel Prod deployment)
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "============================================================" -ForegroundColor Green
Write-Host "✅ Pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "🚀 Vercel is now automatically building and deploying to Production." -ForegroundColor Green
Write-Host "You can check the progress in your Vercel Dashboard." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
