# Bulk 85% -> 100% and related updates across remaining HTML files
$srcDir = $PSScriptRoot

# Files to update (index.html already done)
$files = @(
    'about.html', 'programs.html', 'services.html', 
    'research.html', 'volunteer.html', 'get-involved.html'
)

foreach ($fileName in $files) {
    $filePath = Join-Path $srcDir $fileName
    if (-not (Test-Path $filePath)) {
        Write-Host "SKIP: $fileName not found"
        continue
    }
    $content = Get-Content $filePath -Raw
    $changed = $false
    
    # Replace "85% job" patterns in meta and text content
    $before = $content
    
    # Footer stats: "85%" with "Placement" or "Job Placement" label
    $content = $content -replace '(>)85%(<\/div>\s*<div[^>]*>\s*(?:Job\s*)?Placement)', '${1}100%${2}'
    # Replace "Job Placement" label with "Internship Rate" 
    $content = $content -replace '(>)Job\s*Placement(<)', '${1}Internship Rate${2}'
    # "85% job placement rate" text 
    $content = $content -replace '85% job\s*placement rate', '100% internship placement rate'
    $content = $content -replace '85% Job Placement Rate', '100% Internship Placement Rate'
    # "85% job" in meta descriptions
    $content = $content -replace '85% job placement', '100% internship placement'
    # "85% of our interns"
    $content = $content -replace '85% of our interns', '100% of our interns'
    # Standalone "85%" in stat contexts (be careful to only target stat numbers)
    $content = $content -replace '(font-weight:\s*\d+[^>]*>)\s*85%\s*(<\/div>)', '${1}100%${2}'
    # In text like "Guaranteed internship. 85% job placement rate"
    $content = $content -replace 'Guaranteed internship\. 85% job placement rate', 'Guaranteed internship. 100% internship placement rate'
    
    if ($content -ne $before) {
        $changed = $true
        Write-Host "  [85%->100%] Updated in $fileName"
    }
    
    # Replace 50+ Partner Companies with 10+
    $before2 = $content
    $content = $content -replace '(>)\s*50\+\s*(<\/div>\s*<div[^>]*>\s*Partner\s*Companies)', '${1}10+${2}'
    if ($content -ne $before2) {
        $changed = $true
        Write-Host "  [50+->10+] Updated in $fileName"
    }
    
    if ($changed) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "Saved: $fileName"
    }
    else {
        Write-Host "No changes needed: $fileName"
    }
}
Write-Host "`nStats update complete!"
