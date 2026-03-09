$htmlPath = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\services.html"
$content = Get-Content $htmlPath

$costOfInactionHTML = @"
    <!-- The Cost of Inaction Section (Added) -->
    <section style="background: #0A0A0A; padding: 6rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;">
        <!-- Background Effects -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #DC2626, transparent);"></div>
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: #DC2626; filter: blur(120px); opacity: 0.15; pointer-events: none;"></div>
        
        <div class="container" style="position: relative; z-index: 1;">
            <div style="max-width: 800px; margin: 0 auto 4rem auto; text-align: center;">
                <span style="display: inline-block; padding: 0.4rem 1rem; background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #ef4444; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 1rem;">THE HARD TRUTH</span>
                <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: white; margin-bottom: 1rem;">
                    Cybersecurity is Not an Expense.<br/>
                    <span style="background: linear-gradient(90deg, #ef4444, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">It's the Cost of Doing Business.</span>
                </h2>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 1.15rem; line-height: 1.7;">
                    Most organizations wait until they are breached to take security seriously. By then, the damage is catastrophic. Let's look at the real numbers for a typical mid-sized African enterprise.
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
                
                <!-- The Cost of a Breach -->
                <div style="background: rgba(220, 38, 38, 0.05); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 1rem; padding: 2.5rem; transition: transform 0.3s; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-5px)';" onmouseout="this.style.transform='translateY(0)';">
                    <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #DC2626;"></div>
                    <h3 style="color: white; font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-skull-crossbones" style="color: #ef4444;"></i> The Cost of Inaction
                    </h3>
                    
                    <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Average Ransomware Demand</span>
                            <span style="color: #ef4444; font-family: monospace; font-weight: 700; font-size: 1.1rem;">$1.5M+</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">System Downtime (Days)</span>
                            <span style="color: #ef4444; font-family: monospace; font-weight: 700; font-size: 1.1rem;">21 Days</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Regulatory Fines (NDPR/GDPR)</span>
                            <span style="color: #ef4444; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Up to 2% Revenue</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Reputation Damage</span>
                            <span style="color: #ef4444; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Immeasurable</span>
                        </li>
                    </ul>
                    
                    <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <span style="color: white; font-weight: 700;">Total Risk: Substantial</span>
                    </div>
                </div>

                <!-- The Investment -->
                <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 1rem; padding: 2.5rem; transition: transform 0.3s; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-5px)';" onmouseout="this.style.transform='translateY(0)';">
                    <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #10B981;"></div>
                    <h3 style="color: white; font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-shield-check" style="color: #10B981;"></i> The Investment
                    </h3>
                    
                    <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Corporate Awareness Training</span>
                            <span style="color: #34d399; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Fractional</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Annual Penetration Testing</span>
                            <span style="color: #34d399; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Predictable</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Continuous Monitoring (vCISO)</span>
                            <span style="color: #34d399; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Budgeted</span>
                        </li>
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
                            <span style="color: rgba(255,255,255,0.7); font-size: 0.95rem;">Client Trust & Compliance</span>
                            <span style="color: #34d399; font-family: monospace; font-weight: 700; font-size: 1.1rem;">Verified</span>
                        </li>
                    </ul>

                    <div style="background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 0.5rem; text-align: center;">
                        <a href="contact.html" style="color: white; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                            Secure Your Assets <i class="fas fa-arrow-right" style="color: #10B981;"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>

"@

# Insert before line 199 (0-indexed 198 for <section style="padding: 6rem 2rem; background: white;">)
$index = 198

$newContent = @()
for ($i = 0; $i -lt $content.Length; $i++) {
    if ($i -eq $index) {
        $newContent += $costOfInactionHTML
    }
    $newContent += $content[$i]
}

Set-Content -Path $htmlPath -Value ($newContent -join "`r`n")
Write-Host "Injection of Cost of Inaction by line number completed."
