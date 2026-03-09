$content = Get-Content 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Raw

$ourPromise = @"
    <!-- Our Promise Section -->
    <section style="padding: 4rem 2rem; background: #ffffff; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
            <p style="font-size: 0.875rem; font-weight: 700; color: #c3151c; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">
                Our Promise
            </p>
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 800; color: #0f172a; line-height: 1.2; margin-bottom: 1.5rem;">
                We don't just teach cybersecurity;<br>
                <span style="color: #c3151c;">we build careers.</span>
            </h2>
            <p style="font-size: 1.15rem; color: #475569; line-height: 1.8; margin-bottom: 0;">
                Our commitment is to take you from a curious beginner to a job-ready professional in 16 weeks—or your money back. Your success isn't just a metric; it's our mission.
            </p>
        </div>
    </section>

"@

$content = $content -replace '(?s)(</video>.*?</section>)\s*(<!-- Research & Innovation Statement - Compact -->)', "`$1`n`n$ourPromise`n`n`$2"

Set-Content -Path 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Value $content
Write-Host "Injected 'Our Promise' successfully"
