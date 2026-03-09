$content = Get-Content 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Raw

$founderSection = @"
    <!-- Meet Your Instructor/Founder -->
    <section style="padding: 5rem 2rem; background: #ffffff;">
        <div class="container" style="max-width: 1000px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center;">
                
                <!-- If layout should be side-by-side on desktop -->
                <style>
                    @media (min-width: 768px) {
                        .founder-grid { grid-template-columns: 1fr 1fr !important; }
                    }
                </style>
                
                <div class="founder-grid" style="display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;">
                    <!-- Image Placeholder -->
                    <div style="position: relative; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                        <div style="aspect-ratio: 4/5; background: #f1f5f9; display: flex; align-items: center; justify-content: center; position: relative;">
                            <!-- Placeholder Icon -->
                            <i class="fas fa-user-circle" style="font-size: 8rem; color: #cbd5e1;"></i>
                            <div style="position: absolute; inset: 0; border: 2px dashed #94a3b8; margin: 1rem; border-radius: 0.5rem; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2rem;">
                                <span style="font-size: 0.875rem; color: #64748b; font-weight: 600; background: white; padding: 0.25rem 0.75rem; border-radius: 1rem;">[Image Placeholder]</span>
                            </div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div>
                        <p style="font-size: 0.875rem; font-weight: 700; color: #c3151c; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">
                            Meet Your Instructor
                        </p>
                        <h2 style="font-family: 'Montserrat', sans-serif; font-size: 2.25rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 1.5rem;">
                            Learned in the trenches, <span style="color: #c3151c;">taught in the real world.</span>
                        </h2>
                        
                        <div style="position: relative; padding-left: 2rem; margin-bottom: 2rem;">
                            <i class="fas fa-quote-left" style="position: absolute; left: 0; top: 0; color: #f1f5f9; font-size: 3rem; z-index: -1;"></i>
                            <p style="font-size: 1.125rem; color: #475569; line-height: 1.8; font-style: italic; position: relative; z-index: 1; margin: 0;">
                                "I built Elitechub because I was tired of seeing talented people waste money on courses that didn't get them hired. I didn't learn cybersecurity in a comfortable classroom; I learned it in the trenches. And that's exactly how I'm going to teach you."
                            </p>
                        </div>
                        
                        <div>
                            <div style="font-weight: 700; color: #0f172a; font-size: 1.125rem;">[Your Name]</div>
                            <div style="color: #64748b; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Founder, Elitech Hub</div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>

"@

$content = $content -replace '(?s)(\s*)(<!-- Testimonials Section - Auto-Scrolling -->)', "`$1$founderSection`n`$1`$2"

Set-Content -Path 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Value $content
Write-Host "Injected 'Meet Your Instructor' section successfully"
