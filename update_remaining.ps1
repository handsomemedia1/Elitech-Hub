# Fix remaining 85% references in footer sections and other missed locations  
$srcDir = $PSScriptRoot

# All source HTML files (excluding dist_frontend and blog-posts)
$htmlFiles = Get-ChildItem -Path $srcDir -Filter '*.html' -File | Where-Object { 
    $_.Name -ne 'yandex_6d910a5f997cec90.html'
}

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $before = $content
    
    # Fix "85% job" in footer text (common pattern across all pages)
    $content = $content -replace '85% job\r?\n\s*placement', '100% internship placement'
    $content = $content -replace '85% job placement', '100% internship placement'
    
    # Fix standalone 85% stat divs in footer (various patterns)
    # Pattern: >85%</div> in stat contexts
    $content = $content -replace '>85%</div>', '>100%</div>'
    
    # Fix "85% Job Placement Rate" heading
    $content = $content -replace '85% Job Placement Rate', '100% Internship Placement Rate'
    
    # Fix "85% of our interns"
    $content = $content -replace '85% of our interns', '100% of our interns'
    
    # Fix label text "Job Placement" -> "Internship Rate" only in footer stat contexts
    # This pattern: >Job Placement</div> or >Placement</div>
    # Be cautious - only change these in stat label divs
    
    if ($content -ne $before) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.Name)"
    }
    else {
        Write-Host "OK: $($file.Name)"
    }
}
Write-Host "`nRemaining 85% fix complete!"
