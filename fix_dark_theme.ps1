# Dark Theme Migration Script
# Replaces hardcoded light-mode colors in all HTML files (except admin.html)

$root = "c:\Users\lenovo\OneDrive\Desktop\elitech-hub"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse | Where-Object {
    $_.Name -ne "admin.html" -and
    $_.FullName -notlike "*dist_frontend*" -and
    $_.FullName -notlike "*node_modules*" -and
    $_.FullName -notlike "*.bak"
}

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # --- NAVBAR / BODY BACKGROUNDS ---
    # White navbar backgrounds
    $content = $content -replace 'background:\s*rgba\(255,\s*255,\s*255,\s*0\.98\)', 'background: rgba(7, 13, 26, 0.9)'
    $content = $content -replace 'background:\s*rgba\(255,\s*255,\s*255,\s*0\.95\)', 'background: rgba(7, 13, 26, 0.9)'
    $content = $content -replace 'background:\s*rgba\(255,\s*255,\s*255,\s*0\.9\b', 'background: rgba(7, 13, 26, 0.9'
    
    # Body/section white backgrounds (careful not to hit button text "color: white")
    # Only replace "background: white" and "background-color: white"
    $content = $content -replace 'background:\s*white\s*;', 'background: #070d1a;'
    $content = $content -replace 'background-color:\s*white\s*;', 'background-color: #070d1a;'
    $content = $content -replace 'background:\s*#ffffff\s*;', 'background: #070d1a;'
    $content = $content -replace 'background-color:\s*#ffffff\s*;', 'background-color: #070d1a;'
    $content = $content -replace 'background:\s*#fff\s*;', 'background: #070d1a;'
    $content = $content -replace 'background-color:\s*#fff\s*;', 'background-color: #070d1a;'
    
    # Light gray section backgrounds
    $content = $content -replace 'background:\s*#F9FAFB\s*;', 'background: #0f172a;'
    $content = $content -replace 'background-color:\s*#F9FAFB\s*;', 'background-color: #0f172a;'
    $content = $content -replace 'background:\s*#f9fafb\s*;', 'background: #0f172a;'
    $content = $content -replace 'background-color:\s*#f9fafb\s*;', 'background-color: #0f172a;'
    $content = $content -replace 'background:\s*#F3F4F6\s*;', 'background: #1e293b;'
    $content = $content -replace 'background-color:\s*#F3F4F6\s*;', 'background-color: #1e293b;'
    $content = $content -replace 'background:\s*#f3f4f6\s*;', 'background: #1e293b;'
    $content = $content -replace 'background:\s*#f8f9fa\s*;', 'background: #0f172a;'
    $content = $content -replace 'background-color:\s*#f8f9fa\s*;', 'background-color: #0f172a;'
    $content = $content -replace 'background:\s*#f5f5f5\s*;', 'background: #0f172a;'

    # --- TEXT COLORS (dark text on now-dark backgrounds) ---
    $content = $content -replace 'color:\s*#374151\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#1a1a1a\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#242424\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#1f2937\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#111827\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#0f172a\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#333\s*;', 'color: #f8fafc;'
    $content = $content -replace 'color:\s*#555\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#666\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#777\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#4B5563\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#4b5563\s*;', 'color: #94a3b8;'
    $content = $content -replace 'color:\s*#6B7280\s*;', 'color: #64748b;'
    $content = $content -replace 'color:\s*#6b7280\s*;', 'color: #64748b;'
    
    # --- BORDER COLORS ---
    $content = $content -replace 'border-bottom:\s*1px\s+solid\s+#e5e7eb', 'border-bottom: 1px solid rgba(255, 255, 255, 0.05)'
    $content = $content -replace 'border:\s*1px\s+solid\s+#e5e7eb', 'border: 1px solid rgba(255, 255, 255, 0.1)'
    $content = $content -replace 'border:\s*1px\s+solid\s+#e2e8f0', 'border: 1px solid rgba(255, 255, 255, 0.1)'
    $content = $content -replace 'border:\s*1px\s+solid\s+#E5E7EB', 'border: 1px solid rgba(255, 255, 255, 0.1)'
    $content = $content -replace 'border-color:\s*#e5e7eb', 'border-color: rgba(255, 255, 255, 0.1)'
    $content = $content -replace 'border-color:\s*#e2e8f0', 'border-color: rgba(255, 255, 255, 0.1)'
    $content = $content -replace 'border-bottom-color:\s*#e5e7eb', 'border-bottom-color: rgba(255, 255, 255, 0.05)'
    
    # --- DROPDOWN MENUS ---
    $content = $content -replace 'background:\s*white\s*;\s*\n\s*border-radius:\s*12px;\s*\n\s*box-shadow:\s*0\s+12px\s+40px\s+rgba\(0,\s*0,\s*0,\s*0\.12\)', 'background: #0f172a; border-radius: 12px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5)'
    
    # --- BOX SHADOWS (light shadows to dark shadows) ---
    $content = $content -replace 'box-shadow:\s*0\s+4px\s+6px\s+-1px\s+rgb\(0\s+0\s+0\s*/\s*0\.1\)', 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5)'
    
    # --- DC2626 red to brand c3151c ---
    $content = $content -replace '#DC2626', '#c3151c'
    $content = $content -replace '#dc2626', '#c3151c'
    $content = $content -replace '#B91C1C', '#9e1115'
    $content = $content -replace '#b91c1c', '#9e1115'
    
    # --- HOVER BACKGROUNDS (light hover to dark hover) ---
    $content = $content -replace 'background:\s*#fef2f2\s*;', 'background: rgba(6, 182, 212, 0.05);'
    $content = $content -replace 'background:\s*#f9fafb\s*;', 'background: rgba(255, 255, 255, 0.02);'
    
    # --- MOBILE DRAWER ---
    $content = $content -replace 'background:\s*white\s*;\s*\n\s*z-index:\s*9999', 'background: #070d1a; z-index: 9999'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalChanges++
        Write-Host "Fixed: $($file.Name)"
    }
}

Write-Host "`nTotal files modified: $totalChanges"
