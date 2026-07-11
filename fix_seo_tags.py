import os
import glob
import re

html_files = glob.glob('*.html')

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regex to replace .html in canonical and hreflang links
        # e.g. href="https://elitechub.com/programs.html" -> href="https://elitechub.com/programs"
        # but skip index.html -> /
        
        # We only want to replace inside <link rel="canonical" ...> and <link rel="alternate" ...>
        # Actually it's simpler to just do a string replace for specific cases if we want, 
        # or use regex.
        
        def replacer(match):
            url = match.group(2)
            if url.endswith('index.html'):
                url = url[:-10] # remove index.html
            elif url.endswith('.html'):
                url = url[:-5] # remove .html
            return match.group(1) + url + match.group(3)

        pattern = r'(<link\s+(?:rel="canonical"|rel="alternate"[^>]+)\s*href=")(https://elitechub\.com/[^"]+)(")'
        new_content = re.sub(pattern, replacer, content)

        # Also strip <meta name="keywords" ...> completely as per modern SEO practices
        new_content = re.sub(r'<meta\s+name="keywords"\s+content="[^"]*"\s*>\s*', '', new_content)

        if content != new_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")

    except Exception as e:
        print(f"Error processing {file}: {e}")

print("Done updating SEO canonicals and keywords.")
