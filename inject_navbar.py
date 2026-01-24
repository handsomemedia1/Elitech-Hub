"""
Navbar Injection Script
Injects the navbar HTML directly into all pages that use navbar-placeholder
"""
import os
import re

NAVBAR_HTML = '''    <!-- Navigation (Direct Injection) -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="index.html" class="logo">
                <img src="assets/images/logo.png" alt="Elitech Hub" style="height: 40px; width: auto; margin-right: 0.5rem;">
                <span>Elitech<span class="logo-highlight">Hub</span></span>
            </a>
            <ul class="nav-desktop">
                <li><a href="index.html" class="nav-link" data-page="home">Home</a></li>
                <li class="nav-dropdown">
                    <span class="nav-link nav-dropdown-trigger">Learn <i class="fas fa-chevron-down"></i></span>
                    <div class="nav-dropdown-menu">
                        <a href="programs.html" data-page="programs"><i class="fas fa-graduation-cap"></i> Programs</a>
                        <a href="blog.html" data-page="blog"><i class="fas fa-newspaper"></i> Blog</a>
                        <a href="research.html" data-page="research"><i class="fas fa-flask"></i> Research</a>
                        <a href="researcher.html" data-page="researcher" style="color: #7C3AED;"><i class="fas fa-microscope"></i> Researcher Portal</a>
                    </div>
                </li>
                <li class="nav-dropdown">
                    <span class="nav-link nav-dropdown-trigger">Company <i class="fas fa-chevron-down"></i></span>
                    <div class="nav-dropdown-menu">
                        <a href="about.html" data-page="about"><i class="fas fa-users"></i> About Us</a>
                        <a href="services.html" data-page="services"><i class="fas fa-cogs"></i> Services</a>
                        <a href="security.html" data-page="security"><i class="fas fa-shield-alt"></i> Security &amp; Trust</a>
                    </div>
                </li>
                <li><a href="get-involved.html" class="nav-link" style="color: #c3151c; font-weight: 700;" data-page="get-involved">Get Involved</a></li>
                <li><a href="contact.html" class="nav-link" data-page="contact">Contact</a></li>
            </ul>
            <div class="nav-actions">
                <button class="search-trigger" aria-label="Search"><i class="fas fa-search"></i></button>
                <a href="https://forms.gle/elitech-application" class="btn btn-primary">Apply Now</a>
                <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
            </div>
        </div>
        <div class="nav-mobile" id="mobileNav">
            <ul class="nav-mobile-links">
                <li><a href="index.html" class="nav-link" data-page="home">Home</a></li>
                <li class="mobile-dropdown">
                    <div class="mobile-dropdown-header" onclick="toggleMobileDropdown(this)"><span>Learn</span><i class="fas fa-chevron-down"></i></div>
                    <ul class="mobile-dropdown-menu">
                        <li><a href="programs.html" class="nav-link"><i class="fas fa-graduation-cap"></i> Programs</a></li>
                        <li><a href="blog.html" class="nav-link"><i class="fas fa-newspaper"></i> Blog</a></li>
                        <li><a href="research.html" class="nav-link"><i class="fas fa-flask"></i> Research</a></li>
                        <li><a href="researcher.html" class="nav-link" style="color: #7C3AED;"><i class="fas fa-microscope"></i> Researcher Portal</a></li>
                    </ul>
                </li>
                <li class="mobile-dropdown">
                    <div class="mobile-dropdown-header" onclick="toggleMobileDropdown(this)"><span>Company</span><i class="fas fa-chevron-down"></i></div>
                    <ul class="mobile-dropdown-menu">
                        <li><a href="about.html" class="nav-link"><i class="fas fa-users"></i> About Us</a></li>
                        <li><a href="services.html" class="nav-link"><i class="fas fa-cogs"></i> Services</a></li>
                        <li><a href="security.html" class="nav-link"><i class="fas fa-shield-alt"></i> Security &amp; Trust</a></li>
                    </ul>
                </li>
                <li><a href="get-involved.html" class="nav-link" style="color: #c3151c; font-weight: 700;">Get Involved</a></li>
                <li><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
            <a href="https://forms.gle/elitech-application" class="btn btn-primary">Apply Now</a>
        </div>
    </nav>'''

# Pages to update (excluding index.html and programs.html which are already done)
PAGES = [
    'about.html', 'blog.html', 'contact.html', 'services.html', 
    'research.html', 'get-involved.html', 'security.html', 
    'volunteer.html', 'mentor-application.html', 'policies.html', 
    'research-paper.html', 'payment.html'
]

def inject_navbar():
    updated = []
    skipped = []
    
    for page in PAGES:
        filepath = page
        if not os.path.exists(filepath):
            print(f"  Skipped (not found): {page}")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has direct injection
        if 'Navigation (Direct Injection)' in content:
            skipped.append(page)
            continue
            
        # Replace placeholder with navbar
        pattern = r'<div id="navbar-placeholder"></div>'
        if re.search(pattern, content):
            new_content = re.sub(pattern, NAVBAR_HTML, content)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated.append(page)
            print(f"  [OK] Updated: {page}")
        else:
            print(f"  Skipped (no placeholder): {page}")
    
    print(f"\nDone! Updated {len(updated)} pages.")
    if skipped:
        print(f"Skipped {len(skipped)} (already injected): {skipped}")
    return updated

if __name__ == '__main__':
    print("Injecting navbar into pages...")
    inject_navbar()
