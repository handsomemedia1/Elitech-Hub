$content = Get-Content 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Raw

$newQuoteSection = @"
    <!-- Standalone Quote Block -->
    <section class="founder-quote-section" style="padding: 5rem 2rem; background: #0f172a; text-align: center; position: relative; overflow: hidden;">
        <!-- Background accents to make it look premium -->
        <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: rgba(195, 21, 28, 0.1); border-radius: 50%; blur(40px);"></div>
        <div style="position: absolute; bottom: -50px; right: -50px; width: 200px; height: 200px; background: rgba(18, 52, 107, 0.2); border-radius: 50%; blur(40px);"></div>
        
        <div class="container" style="max-width: 900px; margin: 0 auto; position: relative; z-index: 1;">
            <i class="fas fa-quote-left" style="color: #c3151c; font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.8;"></i>
            
            <h2 style="font-family: 'Montserrat', sans-serif; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; color: #ffffff; line-height: 1.6; margin-bottom: 2rem; font-style: italic;">
                "I built Elitechub because I was tired of seeing talented people waste money on courses that didn't get them hired. I didn't learn cybersecurity in a comfortable classroom; I learned it in the trenches. And that's exactly how I'm going to teach you."
            </h2>
            
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 40px; height: 4px; background: #c3151c; margin-bottom: 1rem; border-radius: 2px;"></div>
                <div style="font-weight: 700; color: #e2e8f0; font-size: 1.125rem; letter-spacing: 0.05em; text-transform: uppercase;">Founder, Elitech Hub</div>
            </div>
        </div>
    </section>
"@

# The regex replaces everything between <!-- Meet Your Instructor/Founder --> and exactly before <!-- Testimonials Section - Auto-Scrolling -->
$content = $content -replace '(?s)<!-- Meet Your Instructor/Founder -->.*?<!-- Testimonials Section - Auto-Scrolling -->', "$newQuoteSection`n`n    <!-- Testimonials Section - Auto-Scrolling -->"

Set-Content -Path 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Value $content
Write-Host "Replaced Founder section with pure quote block successfully"
