"""
Navbar Injection Script v2
Reads the canonical navbar from components/navbar.html and injects it into
EVERY html page in the project — both pages with navbar-placeholder AND
pages that already have a hardcoded nav (replaces existing nav block).
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
COMPONENT_PATH = os.path.join(ROOT, 'components', 'navbar.html')

# Pages that live in subfolders need path prefixes adjusted
SUBFOLDERS = ['blog-posts']

# Pages to SKIP (non-visitor pages)
SKIP_PAGES = {
    'admin.html', 'dashboard.html', 'login.html', 'members.html',
    'thank-you.html', 'yandex_6d910a5f997cec90.html'
}

def get_navbar_html(prefix=''):
    """Read the component and optionally prefix relative links for subfolders."""
    with open(COMPONENT_PATH, 'r', encoding='utf-8') as f:
        html = f.read()
    if prefix:
        # Adjust relative hrefs and srcs
        html = re.sub(r'href="(?!http|#|mailto|javascript)([^"]+)"', 
                      lambda m: f'href="{prefix}{m.group(1)}"', html)
        html = re.sub(r'src="(?!http|data)([^"]+)"', 
                      lambda m: f'src="{prefix}{m.group(1)}"', html)
    return html

def inject_into_file(filepath, navbar_html):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Strategy 1: Replace existing <nav class="navbar"...>...</nav> block
    nav_pattern = re.compile(
        r'[ \t]*<!--\s*Navigation[^>]*-->\s*\n?[ \t]*<!--[^>]*-->\s*\n?[ \t]*<nav[^>]*class="navbar"[^>]*>.*?</nav>',
        re.DOTALL
    )
    if nav_pattern.search(content):
        content = nav_pattern.sub(navbar_html, content, count=1)

    # Strategy 2: Replace simpler <nav class="navbar"...>...</nav> block (no comments)
    elif re.search(r'<nav[^>]*class="navbar"[^>]*>', content):
        nav_simple = re.compile(r'<nav[^>]*class="navbar"[^>]*>.*?</nav>', re.DOTALL)
        content = nav_simple.sub(navbar_html, content, count=1)

    # Strategy 3: Replace navbar-placeholder div
    elif '<div id="navbar-placeholder"></div>' in content:
        content = content.replace('<div id="navbar-placeholder"></div>', navbar_html, 1)

    # Strategy 4: Insert after <body> opening tag
    elif re.search(r'<body[^>]*>', content):
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + navbar_html, content, count=1)

    else:
        print(f"  [SKIP] No injection point found: {os.path.basename(filepath)}")
        return False

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def run():
    print("=== Navbar Injection v2 ===\n")
    updated = []
    skipped = []
    errors = []

    # Process root-level HTML files
    navbar_html = get_navbar_html()
    for fname in os.listdir(ROOT):
        if not fname.endswith('.html'):
            continue
        if fname in SKIP_PAGES:
            print(f"  [SKIP] {fname}")
            skipped.append(fname)
            continue
        fpath = os.path.join(ROOT, fname)
        try:
            result = inject_into_file(fpath, navbar_html)
            if result:
                print(f"  [OK]   {fname}")
                updated.append(fname)
            else:
                print(f"  [--]   {fname} (no change needed)")
                skipped.append(fname)
        except Exception as e:
            print(f"  [ERR]  {fname}: {e}")
            errors.append(fname)

    # Process subfolder HTML files
    for subfolder in SUBFOLDERS:
        sfpath = os.path.join(ROOT, subfolder)
        if not os.path.isdir(sfpath):
            continue
        navbar_sub = get_navbar_html(prefix='../')
        for fname in os.listdir(sfpath):
            if not fname.endswith('.html'):
                continue
            fpath = os.path.join(sfpath, fname)
            try:
                result = inject_into_file(fpath, navbar_sub)
                if result:
                    print(f"  [OK]   {subfolder}/{fname}")
                    updated.append(f"{subfolder}/{fname}")
                else:
                    print(f"  [--]   {subfolder}/{fname} (no change needed)")
                    skipped.append(f"{subfolder}/{fname}")
            except Exception as e:
                print(f"  [ERR]  {subfolder}/{fname}: {e}")
                errors.append(fname)

    print(f"\n=== Done! Updated {len(updated)} files, skipped {len(skipped)}, errors {len(errors)} ===")
    if errors:
        print(f"Errors in: {errors}")

if __name__ == '__main__':
    run()
