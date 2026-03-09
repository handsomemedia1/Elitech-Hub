$htmlPath = "C:\Users\lenovo\OneDrive\Desktop\elitech-hub\programs.html"

# Read the file content
$content = Get-Content $htmlPath -Raw

# 1. Inject "A Day in the Life" right before the Learning Journey Timeline
$dayInTheLifeHTML = @"
                <!-- A Day in the Life Section (Added) -->
                <div style="margin-bottom: 6rem; background: #0A0A0A; border-radius: 1.5rem; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
                    <div style="padding: 3rem 2rem; position: relative;">
                        <!-- Background Effects -->
                        <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, #DC2626, transparent);"></div>
                        <div style="position: absolute; top: -50px; left: 50%; width: 200px; height: 100px; background: #DC2626; filter: blur(80px); opacity: 0.3; transform: translateX(-50%); pointer-events: none;"></div>
                        
                        <div style="text-align: center; margin-bottom: 3rem; position: relative; z-index: 1;">
                            <span style="display: inline-block; padding: 0.4rem 1rem; background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); color: #ef4444; border-radius: 2rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 1rem;">IMMERSIVE EXPERIENCE</span>
                            <h3 style="font-family: 'Montserrat', sans-serif; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: white; margin-bottom: 1rem;">
                                A Day in the <span style="background: linear-gradient(90deg, #ef4444, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Trenches</span>
                            </h3>
                            <p style="color: rgba(255, 255, 255, 0.7); max-width: 600px; margin: 0 auto; font-size: 1.1rem;">This isn't a passive lecture. Experience what a typical day looks like during the intensive phases of the 16-Week Professional Program.</p>
                        </div>

                        <div style="position: relative; z-index: 1;">
                            <!-- Vertical Line -->
                            <div style="position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: rgba(255, 255, 255, 0.1);">
                                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to bottom, transparent, #DC2626, transparent); animation: scanline 4s linear infinite;"></div>
                            </div>
                            
                            <style>
                                @keyframes scanline {
                                    0% { transform: translateY(-100%); opacity: 0; }
                                    50% { opacity: 1; }
                                    100% { transform: translateY(200%); opacity: 0; }
                                }
                            </style>

                            <!-- Timeline Events -->
                            <div style="display: flex; flex-direction: column; gap: 2rem;">
                                <!-- Event 1 -->
                                <div style="display: flex; gap: 1.5rem; position: relative;">
                                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1A1A1A; border: 2px solid #DC2626; display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0; box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);">
                                        <i class="fas fa-satellite-dish" style="color: #ef4444; font-size: 1.2rem;"></i>
                                    </div>
                                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 1.5rem; flex-grow: 1; transition: transform 0.3s, background 0.3s;" onmouseover="this.style.transform='translateX(5px)'; this.style.background='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.transform='translateX(0)'; this.style.background='rgba(255, 255, 255, 0.03)';">
                                        <div style="color: #ef4444; font-family: monospace; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">[09:00 AM]</div>
                                        <h4 style="color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                            Threat Intel Briefing
                                        </h4>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 0.95rem; line-height: 1.6;">Review the latest overnight CVEs and zero-days. Discuss real-world attacks happening right now and how to defend against them.</p>
                                    </div>
                                </div>

                                <!-- Event 2 -->
                                <div style="display: flex; gap: 1.5rem; position: relative;">
                                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1A1A1A; border: 2px solid #06B6D4; display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0; box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);">
                                        <i class="fas fa-network-wired" style="color: #22d3ee; font-size: 1.2rem;"></i>
                                    </div>
                                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 1.5rem; flex-grow: 1; transition: transform 0.3s, background 0.3s;" onmouseover="this.style.transform='translateX(5px)'; this.style.background='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.transform='translateX(0)'; this.style.background='rgba(255, 255, 255, 0.03)';">
                                        <div style="color: #22d3ee; font-family: monospace; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">[11:00 AM]</div>
                                        <h4 style="color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Live Attack Simulation</h4>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 0.95rem; line-height: 1.6;">Connect to the Elitech Hypervisor. We launch an active Ransomware simulation on a dummy network. Your job? Detect it, isolate the infected nodes, and stop the spread.</p>
                                    </div>
                                </div>

                                <!-- Event 3 -->
                                <div style="display: flex; gap: 1.5rem; position: relative;">
                                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1A1A1A; border: 2px solid #10B981; display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0; box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);">
                                        <i class="fas fa-terminal" style="color: #34d399; font-size: 1.2rem;"></i>
                                    </div>
                                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 1.5rem; flex-grow: 1; transition: transform 0.3s, background 0.3s;" onmouseover="this.style.transform='translateX(5px)'; this.style.background='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.transform='translateX(0)'; this.style.background='rgba(255, 255, 255, 0.03)';">
                                        <div style="color: #34d399; font-family: monospace; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">[14:00 PM]</div>
                                        <h4 style="color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Defensive Coding & Scripting</h4>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 0.95rem; line-height: 1.6;">Build custom Python scripts to parse massive log files in seconds. Write YARA rules to detect the malware signature you saw in the morning session.</p>
                                    </div>
                                </div>
                                
                                <!-- Event 4 -->
                                <div style="display: flex; gap: 1.5rem; position: relative;">
                                    <div style="width: 50px; height: 50px; border-radius: 50%; background: #1A1A1A; border: 2px solid #8B5CF6; display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);">
                                        <i class="fas fa-users" style="color: #a78bfa; font-size: 1.2rem;"></i>
                                    </div>
                                    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 1rem; padding: 1.5rem; flex-grow: 1; transition: transform 0.3s, background 0.3s;" onmouseover="this.style.transform='translateX(5px)'; this.style.background='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.transform='translateX(0)'; this.style.background='rgba(255, 255, 255, 0.03)';">
                                        <div style="color: #a78bfa; font-family: monospace; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.9rem;">[16:00 PM]</div>
                                        <h4 style="color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">Code Review & Hot Seat</h4>
                                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 0.95rem; line-height: 1.6;">Present your findings to the instructor and peers. Defend your incident response decisions. This is where real confidence is built before job interviews.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Learning Journey Timeline -->
"@

$content = $content -replace '<!-- Learning Journey Timeline -->', $dayInTheLifeHTML

# 2. Inject "Not For Everyone" right before the CTAs / Call to Action section at the bottom
# Locate the bottom CTA section, typically around line 1850.
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

    <!-- Ready to Secure Your Future? CTA -->
"@

$content = $content -replace '    <!-- Ready to Secure Your Future\? CTA -->', $notForEveryoneHTML

# Save the updated content
Set-Content -Path $htmlPath -Value $content
Write-Host "Injected 'A Day in the Life' and 'Not For Everyone' sections successfully."
