import os
import re

app_dir = os.path.join('src', 'app')

def process_dir(directory, base_path):
    for entry in os.scandir(directory):
        if entry.is_dir():
            if not entry.name.startswith('(') and not entry.name.startswith('_'):
                process_dir(entry.path, base_path + '/' + entry.name)
            else:
                process_dir(entry.path, base_path)
        elif entry.name == 'page.tsx':
            with open(entry.path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            route_path = base_path if base_path else '/'
            
            if 'export const metadata' in content and 'alternates: {' not in content:
                content = re.sub(
                    r'export const metadata(: Metadata)? = \{',
                    f"export const metadata\\1 = {{\\n  alternates: {{ canonical: '{route_path}' }},",
                    content,
                    count=1
                )
                with open(entry.path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {entry.path} -> {route_path}")

process_dir(app_dir, '')
