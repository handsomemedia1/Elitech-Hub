"""
Update all Apply Now links to point to apply.html
"""
import os

pages = [
    'index.html', 'programs.html', 'about.html', 'blog.html', 'contact.html', 
    'services.html', 'research.html', 'get-involved.html', 'security.html',
    'volunteer.html', 'mentor-application.html', 'policies.html', 'payment.html',
    'researcher-guidelines.html', 'course.html', 'components/navbar.html'
]

updated = 0
for page in pages:
    if not os.path.exists(page):
        print(f'Not found: {page}')
        continue
    
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Google Forms link with apply.html
    if 'href="https://forms.gle/elitech-application"' in content:
        new_content = content.replace(
            'href="https://forms.gle/elitech-application"',
            'href="apply.html"'
        )
        with open(page, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated += 1
        print(f'Updated: {page}')
    else:
        print(f'No Google Forms link: {page}')

print(f'\nTotal updated: {updated} files')
