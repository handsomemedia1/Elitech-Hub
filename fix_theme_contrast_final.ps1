# Fix blog-modern.css
$file = "css\blog-modern.css"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content -replace "background-color:\s*#f8fafc;?", "background-color: #070d1a;"
    $content = $content -replace "color:\s*var\(--dark\);?", "color: #f8fafc;"
    $content = $content -replace "background:\s*#ffffff;?", "background: #070d1a;"
    $content = $content -replace "linear-gradient\(180deg, #ffffff 0%, #f8fafc 100%\)", "linear-gradient(180deg, #070d1a 0%, #0f172a 100%)"
    $content = $content -replace "linear-gradient\(180deg, #f8fafc 0%, #ffffff 100%\)", "linear-gradient(180deg, #0f172a 0%, #070d1a 100%)"
    $content = $content -replace "background:\s*var\(--light\);?", "background: #0f172a;"
    $content = $content -replace "color:\s*var\(--dark\);?", "color: #f8fafc;"
    $content = $content -replace "color:\s*var\(--dark-lighter\);?", "color: #cbd5e1;"
    $content = $content -replace "color:\s*var\(--gray\);?", "color: #94a3b8;"
    $content = $content -replace "background:\s*#fff;?", "background: #0f172a;"
    Set-Content -Path $file -Value $content
}

# Fix popup.css
$file = "css\popup.css"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content -replace "background:\s*white;?", "background: #0f172a;"
    $content = $content -replace "color:\s*#0f172a;?", "color: #f8fafc;"
    $content = $content -replace "background:\s*#f1f5f9;?", "background: #1e293b;"
    $content = $content -replace "color:\s*#64748b;?", "color: #94a3b8;"
    $content = $content -replace "background:\s*#e2e8f0;?", "background: #334155;"
    $content = $content -replace "background:\s*#f8fafc;?", "background: #1e293b;"
    $content = $content -replace "border:\s*2px solid #e2e8f0;?", "border: 2px solid rgba(255, 255, 255, 0.1);"
    $content = $content -replace "border-top:\s*1px solid #f1f5f9;?", "border-top: 1px solid rgba(255, 255, 255, 0.1);"
    Set-Content -Path $file -Value $content
}

# Fix programs-enhanced.css
$file = "css\programs-enhanced.css"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content -replace "color:\s*#0A0A0A;?", "color: #f8fafc;"
    $content = $content -replace "color:\s*#6B7280;?", "color: #94a3b8;"
    $content = $content -replace "color:\s*#374151;?", "color: #cbd5e1;"
    $content = $content -replace "border:\s*2px solid #E5E7EB;?", "border: 2px solid rgba(255, 255, 255, 0.1);"
    $content = $content -replace "border-bottom:\s*1px solid #E5E7EB;?", "border-bottom: 1px solid rgba(255, 255, 255, 0.1);"
    $content = $content -replace "background:\s*var\(--bg-primary\);?", "background: #070d1a;"
    $content = $content -replace "background:\s*var\(--bg-secondary\);?", "background: #0f172a;"
    Set-Content -Path $file -Value $content
}

# Fix lab.css
$file = "css\lab.css"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    $content = $content -replace "background:\s*white;?", "background: #0f172a;"
    $content = $content -replace "background:\s*#fff;?", "background: #0f172a;"
    $content = $content -replace "background-color:\s*white;?", "background-color: #0f172a;"
    $content = $content -replace "background-color:\s*#fff;?", "background-color: #0f172a;"
    $content = $content -replace "color:\s*#111;?", "color: #f8fafc;"
    $content = $content -replace "color:\s*#333;?", "color: #cbd5e1;"
    $content = $content -replace "color:\s*#0A0A0A;?", "color: #f8fafc;"
    $content = $content -replace "border:\s*1px solid #eee;?", "border: 1px solid rgba(255, 255, 255, 0.1);"
    Set-Content -Path $file -Value $content
}

# Global HTML inline styles fix
Get-ChildItem -Path '.' -Filter '*.html' -Recurse | Where-Object { $_.FullName -notmatch 'dist_frontend' } | ForEach-Object {
    $htmlContent = Get-Content $_.FullName -Raw
    
    # Text colors
    $htmlContent = $htmlContent -replace 'color:\s*#0A0A0A;?', 'color: #f8fafc;'
    $htmlContent = $htmlContent -replace 'color:\s*#111111;?', 'color: #f8fafc;'
    $htmlContent = $htmlContent -replace 'color:\s*#374151;?', 'color: #cbd5e1;'
    $htmlContent = $htmlContent -replace 'color:\s*#6B7280;?', 'color: #94a3b8;'
    
    # Backgrounds
    $htmlContent = $htmlContent -replace 'background:\s*#f9fafb;?', 'background: #0f172a;'
    $htmlContent = $htmlContent -replace 'background:\s*#f1f5f9;?', 'background: #0f172a;'
    $htmlContent = $htmlContent -replace 'background:\s*#ffffff;?', 'background: #0f172a;'
    $htmlContent = $htmlContent -replace 'background:\s*#fff;?', 'background: #0f172a;'
    $htmlContent = $htmlContent -replace 'background:\s*white;?', 'background: #0f172a;'
    
    # Tools section pastel backgrounds in programs.html
    $htmlContent = $htmlContent -replace 'background:\s*rgba\(220,\s*38,\s*38,\s*0\.1\);?', 'background: rgba(220, 38, 38, 0.2);'
    $htmlContent = $htmlContent -replace 'background:\s*rgba\(6,\s*182,\s*212,\s*0\.1\);?', 'background: rgba(6, 182, 212, 0.2);'
    $htmlContent = $htmlContent -replace 'background:\s*rgba\(16,\s*185,\s*129,\s*0\.1\);?', 'background: rgba(16, 185, 129, 0.2);'
    $htmlContent = $htmlContent -replace 'background:\s*rgba\(139,\s*92,\s*246,\s*0\.1\);?', 'background: rgba(139, 92, 246, 0.2);'
    $htmlContent = $htmlContent -replace 'color:\s*#DC2626;?', 'color: #fca5a5;'
    $htmlContent = $htmlContent -replace 'color:\s*#06B6D4;?', 'color: #67e8f9;'
    $htmlContent = $htmlContent -replace 'color:\s*#10B981;?', 'color: #6ee7b7;'
    
    Set-Content -Path $_.FullName -Value $htmlContent
}
