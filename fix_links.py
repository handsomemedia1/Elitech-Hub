"""
Fix all broken links in HTML files
Replaces links like href="/" with href="index.html"
"""
import os

pages = [
    'index.html', 'programs.html', 'about.html', 'blog.html', 'contact.html', 
    'services.html', 'research.html', 'get-involved.html', 'security.html',
    'volunteer.html', 'mentor-application.html', 'policies.html', 
    'research-paper.html', 'payment.html', 'researcher.html', 'researcher-guidelines.html'
]

link_fixes = [
    ('href="/"', 'href="index.html"'),
    ("href='/'", "href='index.html'"),
    ('href="/programs"', 'href="programs.html"'),
    ('href="/blog"', 'href="blog.html"'),
    ('href="/about"', 'href="about.html"'),
    ('href="/services"', 'href="services.html"'),
    ('href="/research"', 'href="research.html"'),
    ('href="/contact"', 'href="contact.html"'),
    ('href="/security"', 'href="security.html"'),
    ('href="/get-involved"', 'href="get-involved.html"'),
    ('href="/researcher"', 'href="researcher.html"'),
    ('href="/payment"', 'href="payment.html"'),
]

fixed_count = 0
for page in pages:
    if not os.path.exists(page):
        continue
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in link_fixes:
        content = content.replace(old, new)
    
    if content != original:
        with open(page, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed_count += 1
        print(f'Fixed: {page}')

print(f'Total files fixed: {fixed_count}')
