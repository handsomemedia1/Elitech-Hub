$content = Get-Content 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\programs.html' -Raw

# Update Phase 1
$content = $content -replace 'Foundations: PowerShell Forensics</h5>', 'Foundations</h5>'
$content = $content -replace 'Tools: PowerShell 7\.3, KAPE, Velociraptor, Wireshark', 'Network Security, Linux, Python basics'

# Update Phase 2
$content = $content -replace 'Security Monitoring & Incident Response</h6>', 'Offensive Security</h6>'
$content = $content -replace 'Detect and respond to(\s*)incidents</div>', 'Penetration testing, web app hacking</div>'

# Update Phase 3
$content = $content -replace 'Offensive Security & Penetration Testing</h5>', 'Defensive Security</h5>'

# Update Phase 4
$content = $content -replace 'Specialization & Career Launch</h5>', 'The Internship</h5>'
$content = $content -replace '<div(\s*)style="color: rgba\(255, 255, 255, 0\.95\); font-size: 0\.875rem; font-weight: 600;">(\s*)Launch your cybersecurity career</div>', '<div$1style="color: rgba(255, 255, 255, 0.95); font-size: 0.875rem; font-weight: 600;">$2Real-world application at partner companies</div>'

Set-Content -Path 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\programs.html' -Value $content
Write-Host "Replaced timeline phases"
