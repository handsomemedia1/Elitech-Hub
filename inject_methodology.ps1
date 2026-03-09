$htmlPath = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\services.html"
$content = Get-Content $htmlPath -Raw

$methodologyHTML = @"
                <!-- Interactive Methodology Map -->
                <div style="background: white; padding: 2.5rem; border-radius: 1rem; border: 2px solid #E5E7EB; margin-bottom: 3rem; overflow: hidden; position: relative;">
                    <!-- Background Decoration -->
                    <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0, 135, 81, 0.05) 0%, transparent 70%); border-radius: 50%;"></div>
                    
                    <h4 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; color: #008751; display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-project-diagram"></i> Attack Simulation Methodology
                    </h4>
                    <p style="color: #6B7280; margin-bottom: 2.5rem;">How we systematically uncover and exploit your vulnerabilities before the bad guys do.</p>
                    
                    <div style="position: relative; padding-left: 2rem;">
                        <!-- The Track -->
                        <div style="position: absolute; left: 8px; top: 10px; bottom: 30px; width: 4px; background: #F3F4F6; border-radius: 2px;">
                            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, #008751, transparent); animation: fillTrack 6s infinite;"></div>
                        </div>

                        <style>
                            @keyframes fillTrack {
                                0% { height: 0%; opacity: 1; }
                                80% { height: 100%; opacity: 1; }
                                100% { height: 100%; opacity: 0; }
                            }
                            .method-step {
                                position: relative;
                                margin-bottom: 2.5rem;
                                padding-left: 2rem;
                                transition: transform 0.3s;
                            }
                            .method-step:hover {
                                transform: translateX(10px);
                            }
                            .method-dot {
                                position: absolute;
                                left: -2.25rem;
                                top: 0.25rem;
                                width: 20px;
                                height: 20px;
                                background: white;
                                border: 4px solid #008751;
                                border-radius: 50%;
                                z-index: 2;
                                box-shadow: 0 0 10px rgba(0, 135, 81, 0.3);
                            }
                        </style>

                        <!-- Step 1 -->
                        <div class="method-step">
                            <div class="method-dot"></div>
                            <h5 style="font-weight: 800; color: #111827; font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: #008751; font-family: monospace;">[01]</span> Reconnaissance & OSINT
                            </h5>
                            <p style="color: #4B5563; font-size: 0.95rem; line-height: 1.6; margin: 0;">We map your entire digital footprint using open-source intelligence. We look for exposed credentials, misconfigured public assets, and forgotten subdomains.</p>
                        </div>

                        <!-- Step 2 -->
                        <div class="method-step">
                            <div class="method-dot"></div>
                            <h5 style="font-weight: 800; color: #111827; font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: #008751; font-family: monospace;">[02]</span> Vulnerability Mapping
                            </h5>
                            <p style="color: #4B5563; font-size: 0.95rem; line-height: 1.6; margin: 0;">Automated and manual probing of target systems. We identify outdated software, logic flaws in applications, and missing security headers.</p>
                        </div>

                        <!-- Step 3 -->
                        <div class="method-step">
                            <div class="method-dot"></div>
                            <h5 style="font-weight: 800; color: #111827; font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: #008751; font-family: monospace;">[03]</span> Active Exploitation
                            </h5>
                            <div style="background: rgba(220, 38, 38, 0.05); border-left: 3px solid #DC2626; padding: 0.75rem 1rem; margin-bottom: 0.75rem; border-radius: 0 0.5rem 0.5rem 0;">
                                <p style="color: #DC2626; font-size: 0.85rem; font-weight: 700; margin: 0;"><i class="fas fa-exclamation-triangle"></i> Safe-Mode Execution</p>
                            </div>
                            <p style="color: #4B5563; font-size: 0.95rem; line-height: 1.6; margin: 0;">We safely detonate exploits to prove risk. We extract dummy data, escalate privileges, and attempt to persist in the environment—just like an APT group.</p>
                        </div>

                        <!-- Step 4 -->
                        <div class="method-step" style="margin-bottom: 0;">
                            <div class="method-dot"></div>
                            <h5 style="font-weight: 800; color: #111827; font-size: 1.1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="color: #008751; font-family: monospace;">[04]</span> Remediation & Reporting
                            </h5>
                            <p style="color: #4B5563; font-size: 0.95rem; line-height: 1.6; margin: 0;">You receive an executive summary and a deeply technical breakdown. Every vulnerability includes a CVSS score, PoC screenshot, and the exact code or config needed to fix it.</p>
                        </div>

                    </div>
                </div>
"@

# Regex matching the old 'Our Testing Methodology' div block
$pattern = '(?s)<div[^>]*>\s*<h4[^>]*>Our Testing Methodology:</h4>.*?</div>\s*</div>'

$content = $content -replace $pattern, $methodologyHTML

Set-Content -Path $htmlPath -Value $content
Write-Host "Injection of Interactive Methodology Map completed."
