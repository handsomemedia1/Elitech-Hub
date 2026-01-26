$source = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub"
$dest = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\dist_frontend"

# Clean previous build
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null

# Copy HTML files
Get-ChildItem -Path $source -Filter "*.html" | Copy-Item -Destination $dest

# Copy Static Directories
$folders = @("css", "js", "assets", "components")
foreach ($folder in $folders) {
    if (Test-Path "$source\$folder") {
        Copy-Item -Path "$source\$folder" -Destination "$dest\$folder" -Recurse
    }
}

# Copy _redirects file for Netlify API proxying
if (Test-Path "$source\_redirects") {
    Copy-Item -Path "$source\_redirects" -Destination "$dest\_redirects"
    Write-Host "✅ Copied _redirects for Netlify"
}

Write-Host "Frontend build ready at: $dest"
