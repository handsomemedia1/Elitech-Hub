"""
Mobile UX Fix Script
- Adds mobile nav overlay div to all HTML pages
- Removes 1.5s artificial loader delay from all HTML pages
- Updates toggleMobileDropdown and mobile menu JS to use drawer pattern
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

SKIP_PAGES = {
    'admin.html', 'dashboard.html', 'login.html', 'members.html',
    'thank-you.html', 'yandex_6d910a5f997cec90.html'
}

# The overlay element to inject right before </body>
OVERLAY_HTML = '\n    <!-- Mobile Nav Overlay -->\n    <div class="nav-mobile-overlay" id="navOverlay"></div>'

# The consolidated mobile nav JS to inject (replaces any existing toggleMobileDropdown)
MOBILE_NAV_JS = '''
    <script>
    // ── Mobile Drawer Navigation ──
    (function() {
        function initMobileDrawer() {
            var btn = document.getElementById('mobileMenuBtn');
            var drawer = document.getElementById('mobileNav');
            var overlay = document.getElementById('navOverlay');
            if (!btn || !drawer) return;

            function openDrawer() {
                drawer.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                var icon = btn.querySelector('i');
                if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
            }

            function closeDrawer() {
                drawer.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
                var icon = btn.querySelector('i');
                if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
            }

            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                drawer.classList.contains('active') ? closeDrawer() : openDrawer();
            });

            if (overlay) overlay.addEventListener('click', closeDrawer);

            // Close on nav link click (not dropdown headers)
            var links = drawer.querySelectorAll('a.nav-link');
            links.forEach(function(link) {
                link.addEventListener('click', closeDrawer);
            });

            // Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') closeDrawer();
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMobileDrawer);
        } else {
            initMobileDrawer();
        }
    })();

    function toggleMobileDropdown(header) {
        var dropdown = header.parentElement;
        var isActive = dropdown.classList.contains('active');
        // Close all siblings first
        var siblings = dropdown.parentElement.querySelectorAll('.mobile-dropdown.active');
        siblings.forEach(function(s) { if (s !== dropdown) s.classList.remove('active'); });
        dropdown.classList.toggle('active', !isActive);
    }
    </script>'''

def fix_loader_delay(content):
    """Remove setTimeout 1500ms artificial delay for page loader."""
    # Pattern: setTimeout(() => { loader.classList.add('hidden'); }, 1500);
    # Replace the whole setTimeout block with an immediate hide
    pattern = re.compile(
        r'(window\.addEventListener\s*\(\s*[\'"]load[\'"]\s*,\s*function\s*\(\s*\)\s*\{[^}]*)'
        r'setTimeout\s*\(\s*\(\)\s*=>\s*\{([^}]*loader[^}]*hidden[^}]*)\}\s*,\s*\d+\s*\)\s*;',
        re.DOTALL
    )
    def replace_timeout(m):
        return m.group(1) + m.group(2).strip()
    return pattern.sub(replace_timeout, content)

def fix_loader_delay_v2(content):
    """Alternative pattern for pages with different formatting."""
    # Direct setTimeout with 1500
    content = re.sub(
        r'setTimeout\s*\(\s*\(\)\s*=>\s*\{\s*\n?\s*loader\.classList\.add\s*\([\'"]hidden[\'"]\)\s*;\s*\n?\s*\}\s*,\s*1500\s*\)',
        "loader.classList.add('hidden')",
        content
    )
    return content

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    fname = os.path.basename(filepath)
    changes = []

    # 1. Add overlay div if not present
    if 'nav-mobile-overlay' not in content and 'mobileNav' in content:
        content = content.replace('</body>', OVERLAY_HTML + '\n</body>', 1)
        changes.append('overlay')

    # 2. Remove 1.5s artificial delay
    new_content = fix_loader_delay(content)
    if new_content != content:
        content = new_content
        changes.append('loader-delay-v1')
    new_content = fix_loader_delay_v2(content)
    if new_content != content:
        content = new_content
        changes.append('loader-delay-v2')

    # 3. Remove old inline toggleMobileDropdown + page loader scripts 
    #    Replace with consolidated mobile JS (inject before </body>)
    if 'initMobileDrawer' not in content and 'mobileMenuBtn' in content:
        # Strip old inline mobile nav scripts
        content = re.sub(
            r'<script>\s*//\s*Mobile Dropdown Toggle Function\s*\n.*?toggleMobileDropdown.*?</script>',
            '',
            content,
            flags=re.DOTALL
        )
        # Inject the new consolidated script before </body>
        if MOBILE_NAV_JS.strip() not in content:
            content = content.replace('</body>', MOBILE_NAV_JS + '\n</body>', 1)
            changes.append('mobile-js')

    # 4. Fix certificate badges z-index so they don't cover the mobile drawer
    new_content = content.replace('id="certificateBadges"\n        style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;', 'id="certificateBadges"\n        style="position: fixed; bottom: 20px; right: 20px; z-index: 900;')
    new_content = new_content.replace('id="certificateBadges" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;', 'id="certificateBadges" style="position: fixed; bottom: 20px; right: 20px; z-index: 900;')
    if new_content != content:
        content = new_content
        changes.append('badges-zindex')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes
    return []

def run():
    print("=== Mobile UX Fix Script ===\n")
    updated = []
    errors = []

    for fname in os.listdir(ROOT):
        if not fname.endswith('.html'):
            continue
        if fname in SKIP_PAGES:
            continue
        fpath = os.path.join(ROOT, fname)
        try:
            changes = process_file(fpath)
            if changes:
                print(f"  [OK]   {fname}: {', '.join(changes)}")
                updated.append(fname)
        except Exception as e:
            print(f"  [ERR]  {fname}: {e}")
            errors.append(fname)

    # Also process blog-posts subfolder
    blog_dir = os.path.join(ROOT, 'blog-posts')
    if os.path.isdir(blog_dir):
        for fname in os.listdir(blog_dir):
            if not fname.endswith('.html'):
                continue
            fpath = os.path.join(blog_dir, fname)
            try:
                changes = process_file(fpath)
                if changes:
                    print(f"  [OK]   blog-posts/{fname}: {', '.join(changes)}")
                    updated.append(f"blog-posts/{fname}")
            except Exception as e:
                print(f"  [ERR]  blog-posts/{fname}: {e}")
                errors.append(fname)

    print(f"\n=== Done! Updated {len(updated)} files, errors: {len(errors)} ===")

if __name__ == '__main__':
    run()
