$content = Get-Content 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Raw

# 1. Main Heading
$content = $content -replace 'Others teach <span[^>]*>tools</span>.<br>\s*We teach <span[^>]*>thinking</span>.', 'We Build <span style="color: #c3151c;">Experts</span>,<br>
                        Not Just Passers.'

# 2. Main Paragraph
$content = $content -replace 'Understanding how attackers think is more important than memorizing commands. Our approach\s*combines psychology, research methodology, and hands-on experience.', 'Most cybersecurity schools focus on certificates. We focus on competence. Our hands-on approach ensures you can actually do the job from day one.'

# 3. Label: Partner Companies -> Hiring Partners
$content = $content -replace 'Partner\s*Companies</div>', 'Hiring Partners</div>'

# 4. Feature 1 Icon + Heading + Text
$content = $content -replace '<i class="fas fa-brain"([^>]*)>', '<i class="fas fa-laptop-code"$1>'
$content = $content -replace 'Psychology First\s*</h3>\s*<p([^>]*)>\s*Learn the attacker mindset, not just the toolkit. We teach you to think critically and\s*anticipate threats.\s*</p>', 'Learn By Doing
                        </h3>
                        <p$1>
                            No boring lectures. 80% practical labs where you hack, defend, and investigate real-world scenarios.
                        </p>'

# 5. Feature 2 Icon + Heading + Text
$content = $content -replace '<i class="fas fa-handshake"([^>]*)>', '<i class="fas fa-user-shield"$1>'
$content = $content -replace 'Guaranteed Internship\s*</h3>\s*<p([^>]*)>\s*Every 16-week student gets placed with our partner companies. Real experience, not\s*simulations.\s*</p>', 'Industry Mentors
                        </h3>
                        <p$1>
                            Taught by active security professionals from Proton, Hiddenlayer, Cyberville, and Epix Initiative.
                        </p>'

# 6. Feature 3 Icon + Heading + Text
$content = $content -replace '<i class="fas fa-rocket"([^>]*)>', '<i class="fas fa-certificate"$1>'
$content = $content -replace 'Career Launch Support\s*</h3>\s*<p([^>]*)>\s*Resume reviews, interview prep, and direct connections to hiring managers in our network.\s*</p>', 'Certification Prep
                        </h3>
                        <p$1>
                            Built-in preparation for CompTIA Security+, CEH, and CISSP depending on your track.
                        </p>'

Set-Content -Path 'c:\Users\lenovo\OneDrive\Desktop\elitech-hub\index.html' -Value $content
Write-Host "Replaced 'What Sets Us Apart' content"
