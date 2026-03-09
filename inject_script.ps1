# Inject site-settings.js into all frontend HTML files
$srcDir = $PSScriptRoot

# Get all frontend HTML files, excluding admin.html where it's not needed
$htmlFiles = Get-ChildItem -Path $srcDir -Filter '*.html' -File | Where-Object { 
    $_.Name -ne 'admin.html' -and $_.Name -ne 'yandex_6d910a5f997cec90.html'
}

$scriptTag = '    <script src="js/site-settings.js"></script>'

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Don't inject multiple times
    if (-not $content.Contains('src="js/site-settings.js"')) {
        # Inject right before </body> or at the end if no </body>
        if ($content -match '</body>') {
            $content = $content -replace '</body>', "$scriptTag`n</body>"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Injected: $($file.Name)"
        }
    }
    else {
        Write-Host "Skip (already injected): $($file.Name)"
    }
}
Write-Host "`nInjection complete!"
