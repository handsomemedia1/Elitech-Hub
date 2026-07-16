$file = "index.html"
$content = Get-Content $file -Raw

# 1. Beyond Training Section Background
$content = $content -replace 'background:\s*linear-gradient\(180deg,\s*#F8FAFC\s*0%,\s*#ffffff\s*100%\);?', 'background: linear-gradient(180deg, #0f172a 0%, #070d1a 100%);'
$content = $content -replace 'background:\s*linear-gradient\(180deg,\s*#ffffff\s*0%,\s*#F8FAFC\s*100%\);?', 'background: linear-gradient(180deg, #070d1a 0%, #0f172a 100%);'

# 2. Fix list text colors in pricing cards (currently #475569, #64748b)
$content = $content -replace 'color:\s*#475569;?', 'color: #cbd5e1;'
$content = $content -replace 'color:\s*#64748b;?', 'color: #94a3b8;'

# 3. Fix dark blue checkmarks and buttons
$content = $content -replace 'color:\s*#12346b;?', 'color: #38bdf8;'
$content = $content -replace 'border:\s*2px solid #12346b;?', 'border: 2px solid #38bdf8;'
$content = $content -replace 'background:\s*#12346b;?', 'background: #0284c7;'

# 4. Fix other dark text inside index.html
$content = $content -replace 'color:\s*#374151;?', 'color: #cbd5e1;'
$content = $content -replace 'color:\s*#1f2937;?', 'color: #f8fafc;'
$content = $content -replace 'color:\s*#111827;?', 'color: #f8fafc;'
$content = $content -replace 'color:\s*#0A0A0A;?', 'color: #f8fafc;'
$content = $content -replace 'color:\s*#0f172a;?', 'color: #f8fafc;'

# 5. Any remaining solid white backgrounds
$content = $content -replace 'background:\s*white;?', 'background: #0f172a;'
$content = $content -replace 'background:\s*#ffffff;?', 'background: #0f172a;'
$content = $content -replace 'background:\s*#f8fafc;?', 'background: #0f172a;'
$content = $content -replace 'background:\s*#f9fafb;?', 'background: #0f172a;'
$content = $content -replace 'background:\s*#F8FAFC;?', 'background: #0f172a;'

# 6. Some borders might still be light gray
$content = $content -replace 'border:\s*2px solid #E5E7EB;?', 'border: 2px solid rgba(255, 255, 255, 0.1);'
$content = $content -replace 'border-bottom:\s*1px solid #e2e8f0;?', 'border-bottom: 1px solid rgba(255, 255, 255, 0.1);'

Set-Content -Path $file -Value $content
