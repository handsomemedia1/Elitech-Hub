$htmlPath = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\services.html"
$content = Get-Content $htmlPath

$securedBadgesHTML = @"
                <!-- Secured by Elitech Badges -->
                <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 3rem; border-radius: 1rem; margin-top: 3rem; position: relative; overflow: hidden; display: flex; align-items: center; gap: 3rem; flex-wrap: wrap;">
                    <!-- Decor -->
                    <div style="position: absolute; right: -50px; bottom: -50px; width: 200px; height: 200px; background: #06B6D4; filter: blur(100px); opacity: 0.2; pointer-events: none;"></div>
                    
                    <div style="flex: 1; min-width: 300px; position: relative; z-index: 1;">
                        <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.75rem; font-weight: 800; color: white; margin-bottom: 1rem;">
                            The "Secured by Elitech" Guarantee
                        </h4>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
                            Trust is your most valuable currency. When your organization passes our rigorous security audit, you earn the right to display the <strong>Secured by Elitech Hub</strong> digital badge on your website and applications. 
                        </p>
                        <ul style="list-style: none; padding: 0; margin: 0; color: rgba(255, 255, 255, 0.9);">
                            <li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #06B6D4;"></i> Builds instant credibility with your customers
                            </li>
                            <li style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #06B6D4;"></i> Differentiates you from unverified competitors
                            </li>
                            <li style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #06B6D4;"></i> Proves compliance to stakeholders
                            </li>
                        </ul>
                    </div>

                    <div style="width: 200px; display: flex; flex-direction: column; gap: 1rem; position: relative; z-index: 1;">
                        <!-- Gold Badge -->
                        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 0.75rem; text-align: center; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <i class="fas fa-shield-check" style="color: #FBBF24; font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
                            <div style="font-weight: 800; color: white; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Secured by</div>
                            <div style="font-weight: 900; color: #FBBF24; font-size: 1.1rem;">ELITECH HUB</div>
                            <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.5); margin-top: 0.25rem;">2026 AUDITED</div>
                        </div>
                    </div>
                </div>
"@

# We need to insert this right after the Security Consulting section ends.
# This corresponds to inserting it before the `<!-- Web Development Pricing Section -->`
# Let's find the exact line.
$index = 0
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($content[$i] -match "<!-- Web Development Pricing Section -->") {
        $index = $i - 1 # Insert right before the closing section tag for Security Consulting
        break
    }
}

$newContent = @()
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($i -eq $index) {
        $newContent += $securedBadgesHTML
    }
    $newContent += $content[$i]
}

Set-Content -Path $htmlPath -Value ($newContent -join "`r`n")
Write-Host "Injection of Secured by Elitech Badges completed."
