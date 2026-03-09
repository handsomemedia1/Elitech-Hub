# Bulk content update script for Elitech Hub

$srcDir = $PSScriptRoot
$htmlFiles = Get-ChildItem -Path $srcDir -Filter '*.html' -File | Where-Object { $_.Name -ne 'yandex_6d910a5f997cec90.html' }

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    # 1. Copyright year: 2025 -> 2026
    if ($content -match '&copy; 2025') {
        $content = $content -replace '&copy; 2025', '&copy; 2026'
        $changed = $true
        Write-Host "  [copyright] Updated in $($file.Name)"
    }
    
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Saved: $($file.Name)"
    }
}
Write-Host "`nCopyright update complete!"
