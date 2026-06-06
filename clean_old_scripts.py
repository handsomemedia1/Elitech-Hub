import os
import glob

def clean():
    html_files = glob.glob('c:/Users/lenovo/OneDrive/Desktop/elitech-hub/**/*.html', recursive=True)
    count = 0
    for filepath in html_files:
        if 'dist_frontend' in filepath:
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
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
                # We removed the block, so we search from idx again
                start = idx
            else:
                start = end_idx + 9
                
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {filepath}")
            count += 1
            
    print(f"Total files cleaned: {count}")

if __name__ == '__main__':
    clean()
