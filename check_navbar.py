import re

content = open('index.html', encoding='utf-8').read()

# Check for navbar.js
if 'navbar.js' in content:
    print('[OK] navbar.js: LOADED in index.html')
else:
    print('[WARN] navbar.js: NOT found in index.html - mobile menu JS comes from main.js')

# Check that mobileMenuBtn exists
if 'mobileMenuBtn' in content:
    print('[OK] mobileMenuBtn: HTML element found')
else:
    print('[FAIL] mobileMenuBtn: NOT found')

# Check that mobileNav exists
if 'mobileNav' in content:
    print('[OK] mobileNav: HTML element found')
else:
    print('[FAIL] mobileNav: NOT found')

# Check for broken nav-mobile css
if 'position: fixed;\n        .hero' in content or 'position: fixed;\r\n        .hero' in content:
    print('[FAIL] CSS SYNTAX ERROR: broken .nav-mobile block still present!')
else:
    print('[OK] CSS syntax: no broken .nav-mobile block found')

# Check braces balance in the inline style block
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
if style_match:
    style = style_match.group(1)
    opens = style.count('{')
    closes = style.count('}')
    if opens == closes:
        print(f'[OK] Inline style braces balanced: {opens} open / {closes} close')
    else:
        print(f'[FAIL] Inline style braces UNBALANCED: {opens} open / {closes} close')

# Confirm main.js is loaded (provides mobile nav toggle)
if 'js/main.js' in content:
    print('[OK] js/main.js: found (handles mobile menu toggle)')
else:
    print('[FAIL] js/main.js: NOT found - mobile menu will not work!')

# Check that the mobile menu media query exists in navbar.css
navbar_css = open('css/navbar.css', encoding='utf-8').read()
if 'max-width: 1024px' in navbar_css and 'mobile-menu-btn' in navbar_css:
    print('[OK] navbar.css: has responsive media query for mobile-menu-btn')
else:
    print('[FAIL] navbar.css: missing mobile responsive rule')

print('\n--- Summary ---')
print('If all checks above show [OK], the navbar SHOULD work on mobile/tablet.')
print('If you still see issues, try a hard refresh (Ctrl+Shift+R) in your browser.')
