import os
import glob

def clean():
    html_files = glob.glob('c:/Users/lenovo/OneDrive/Desktop/elitech-hub/**/*.html', recursive=True)
    count = 0
    for filepath in html_files:
        if 'dist_frontend' in filepath:
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
        except Exception as e:
            print(f"Skipping {filepath}: {e}")
            continue
            
        original_content = content
        start = 0
        while True:
            idx = content.find('<script', start)
            if idx == -1:
                break
            end_idx = content.find('</script>', idx)
            if end_idx == -1:
                break
            
            script_block = content[idx:end_idx+9]
            if 'mobileMenuBtn.addEventListener' in script_block and 'initMobileDrawer' not in script_block:
                content = content[:idx] + content[end_idx+9:]
                start = idx
            else:
                start = end_idx + 9
                
        if content != original_content:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Cleaned {filepath}")
                count += 1
            except Exception as e:
                print(f"Failed to write {filepath}: {e}")
            
    print(f"Total files cleaned: {count}")

if __name__ == '__main__':
    clean()
