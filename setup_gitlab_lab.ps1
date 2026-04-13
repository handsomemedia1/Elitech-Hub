$repoUrl = "https://gitlab.com/elitech-hub/Lab.git"
$localFolder = "Lab-Repo"

Write-Host "Cloning GitLab repository..." -ForegroundColor Cyan
git clone $repoUrl $localFolder

if (-Not (Test-Path $localFolder)) {
    Write-Host "Failed to clone repository. Do you have access?" -ForegroundColor Red
    exit
}

cd $localFolder

Write-Host "Setting up directory structure..." -ForegroundColor Cyan
$folders = @("detection", "threat", "infrastructure", "devsecops")

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
    
    $readmeContent = @"
# $($folder.ToUpper())
Add your $($folder) artifacts here.
"@
    Set-Content -Path ".\$folder\README.md" -Value $readmeContent
}

Write-Host "Creating main README and CONTRIBUTING files..." -ForegroundColor Cyan

$mainReadme = @"
# Elitech Hub Lab

Welcome to the Elitech Hub Lab repository. This repository stores dynamic artifacts displayed on our website's Lab page.

## Structure
- \`detection/\`: Detection Engineering artifacts
- \`threat/\`: Threat Analysis artifacts
- \`infrastructure/\`: Defensive Infrastructure artifacts
- \`devsecops/\`: DevSecOps artifacts
"@
Set-Content -Path ".\README.md" -Value $mainReadme

$contributing = @"
# Contributing to Elitech Hub Lab

To add a new lab artifact, simply commit your files into the appropriate folder (\`detection\`, \`threat\`, \`infrastructure\`, or \`devsecops\`).

The frontend website will automatically pick them up!
"@
Set-Content -Path ".\CONTRIBUTING.md" -Value $contributing

Write-Host "Committing and pushing to GitLab..." -ForegroundColor Cyan
git add .
git commit -m "Initialize Elitech Hub Lab repository structure"
git push origin main

Write-Host "Done! The repository structure has been pushed." -ForegroundColor Green
cd ..
