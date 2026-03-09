$sourceDir = "c:\Users\lenovo\OneDrive\Desktop\elitech-hub"
$destDir = "$sourceDir\dist_frontend"

# Copy all HTML, XML, TXT, and Netlify config files from root to dist_frontend
Get-ChildItem -Path $sourceDir -File | Where-Object { 
    $_.Extension -match "\.(html|xml|txt)$" -or 
    $_.Name -eq "_headers" -or 
    $_.Name -eq "_redirects" 
} | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $destDir -Force
    Write-Host "Synced $($_.Name)"
}

$folders = @("css", "js", "assets", "components", "data", "images", "blog-posts")

foreach ($folder in $folders) {
    $folderSource = "$sourceDir\$folder"
    $folderDest = "$destDir\$folder"
    
    if (Test-Path $folderSource) {
        # Create destination directory if it doesn't exist to prevent errors
        if (-not (Test-Path $folderDest)) {
            New-Item -ItemType Directory -Force -Path $folderDest | Out-Null
        }
        
        Copy-Item -Path "$folderSource\*" -Destination $folderDest -Recurse -Force
        Write-Host "Synced $folder directory"
    }
    else {
        Write-Host "Skipped $folder (not found)" -ForegroundColor Yellow
    }
}

Write-Host "Sync complete! The dist_frontend folder is fully ready for Netlify." -ForegroundColor Green

Write-Host "Sync complete!"
