import os
import glob

# Search in current directory and dist_frontend
html_files = glob.glob('*.html')
html_files += glob.glob('dist_frontend/*.html')

old_code = """        window.addEventListener('load', function () {
            const loader = document.getElementById('pageLoader');
            if (loader) {
                loader.classList.add('hidden');
            }
        });"""

new_code = """        window.addEventListener('load', function () {
            const loader = document.getElementById('pageLoader');
            if (loader) {
                setTimeout(() => loader.classList.add('hidden'), 300);
            }
        });
        
        // Failsafe for slow connections (mobile)
        setTimeout(() => {
            const loader = document.getElementById('pageLoader');
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 2000);"""

updated_count = 0
for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        if old_code in content:
            content = content.replace(old_code, new_code)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
            print(f"Updated {file}")
    except Exception as e:
        print(f"Error processing {file}: {e}")

print(f"Total files updated: {updated_count}")
