$htmlPath = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\programs.html"
$content = Get-Content $htmlPath

$notForEveryoneHTML = @"
    <!-- Not For Everyone Section (Added) -->
    <div class="container" style="margin-top: 6rem; margin-bottom: -2rem; position: relative; z-index: 10;">
        <div style="background: white; border: 3px solid #1A1A1A; border-radius: 1rem; padding: 3rem; text-align: center; box-shadow: 20px 20px 0px rgba(220, 38, 38, 0.1); position: relative; overflow: hidden;">
            <!-- Corner Tape Effect -->
            <div style="position: absolute; top: -15px; right: -30px; background: #DC2626; color: white; font-weight: 900; font-size: 0.75rem; padding: 0.5rem 3rem; transform: rotate(45deg); letter-spacing: 2px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">WARNING</div>
            
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #DC2626; margin-bottom: 1.5rem;"></i>
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; color: #1A1A1A; margin-bottom: 1rem; text-transform: uppercase;">
                This Bootcamp is <span style="color: #DC2626;">Not For Everyone</span>
            </h2>
            
            <p style="font-size: 1.15rem; color: #4B5563; max-width: 800px; margin: 0 auto 2rem auto; line-height: 1.8; font-weight: 500;">
                We have a <strong>100% internship placement rate</strong>. We protect that statistic fiercely. 
                If you are looking for easy videos to watch passively while you scroll social media, <strong style="color: #DC2626;">do not apply.</strong>
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; text-align: left; margin-bottom: 2.5rem;">
                <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #DC2626;">
                    <h4 style="font-weight: 800; color: #1A1A1A; margin-bottom: 0.5rem;">We demand grit.</h4>
                    <p style="color: #4B5563; font-size: 0.95rem; margin: 0;">You will get stuck. Servers will crash. Scripts will fail. You must be willing to troubleshoot and fight through the frustration.</p>
                </div>
                <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #1A1A1A;">
                    <h4 style="font-weight: 800; color: #1A1A1A; margin-bottom: 0.5rem;">We demand time.</h4>
                    <p style="color: #4B5563; font-size: 0.95rem; margin: 0;">This requires intensive focus. You must commit to the schedule and the demanding hands-on labs.</p>
                </div>
            </div>
            
            <p style="font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; font-weight: 700; color: #1A1A1A; margin-bottom: 0;">
                But if you are ready to do the work, <span style="background: #DC2626; color: white; padding: 0 0.5rem;">we guarantee to get you hired.</span>
            </p>
        </div>
    </div>
    
"@

# Insert before line 1720 (0-indexed 1719 for <!-- Footer - Clean Modern Design -->)
$index = 1720

$newContent = @()
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($i -eq $index) {
        $newContent += $notForEveryoneHTML
    }
    $newContent += $content[$i]
}

Set-Content -Path $htmlPath -Value ($newContent -join "`r`n")
Write-Host "Injection by line number completed."
