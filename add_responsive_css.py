"""
Add responsive.css to pages that are missing it
"""
import os
import re

pages = [
    'blog.html', 'researcher-guidelines.html', 'researcher.html', 'research.html',
    'payment.html', 'thank-you.html', 'login.html', 'course.html', 
    'research-paper.html', 'mentor-application.html', 'volunteer.html', 'writer.html'
]

updated = 0
for page in pages:
    if not os.path.exists(page):
        print(f'Not found: {page}')
        continue
    
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if responsive.css is already included
    if 'responsive.css' in content:
        print(f'Already has responsive.css: {page}')
        continue
    
    # Find where to inject (after navbar.css or theme.css)
    if 'navbar.css' in content:
        new_content = content.replace(
            'href="css/navbar.css">',
            'href="css/navbar.css">\n    <link rel="stylesheet" href="css/responsive.css">'
        )
    elif 'theme.css' in content:
        new_content = content.replace(
            'href="css/theme.css">',
            'href="css/theme.css">\n    <link rel="stylesheet" href="css/responsive.css">'
        )
    elif 'core.css' in content:
        new_content = content.replace(
            'href="css/core.css">',
            'href="css/core.css">\n    <link rel="stylesheet" href="css/responsive.css">'
        )
    else:
        print(f'No suitable injection point: {page}')
        continue
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(new_content)
    updated += 1
    print(f'Added responsive.css to: {page}')

print(f'\nTotal updated: {updated} files')
