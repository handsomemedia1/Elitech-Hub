"""
Update all researcher.html links to researcher-guidelines.html
"""
import os

pages = [
    'index.html', 'programs.html', 'about.html', 'blog.html', 'contact.html', 
    'services.html', 'research.html', 'get-involved.html', 'security.html',
    'volunteer.html', 'mentor-application.html', 'policies.html', 'payment.html'
]

updated = 0
for page in pages:
    if not os.path.exists(page):
        continue
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'href="researcher.html"' in content:
        new_content = content.replace('href="researcher.html"', 'href="researcher-guidelines.html"')
        with open(page, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated += 1
        print(f'Updated: {page}')

print(f'Total updated: {updated} files')
