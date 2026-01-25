/**
 * Navbar Component Loader and Functionality
 * This script loads the navbar component and handles all navbar interactions
 */

// Load navbar component
async function loadNavbar() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.log('No navbar-placeholder found');
        return;
    }

    // Determine the base path based on current URL
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/blog-posts/');

    // Build paths to try
    const pathsToTry = isInSubfolder
        ? ['../components/navbar.html', '/components/navbar.html']
        : ['components/navbar.html', '/components/navbar.html', './components/navbar.html'];

    let html = null;

    for (const path of pathsToTry) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const text = await response.text();
                // Verify it's actually HTML content, not an error page
                if (text.includes('<nav') || text.includes('navbar')) {
                    html = text;
                    console.log('Navbar loaded from:', path);
                    break;
                }
            }
        } catch (e) {
            console.log('Failed to load from', path, e);
        }
    }

    if (!html) {
        console.error('Failed to load navbar from any path. Tried:', pathsToTry);
        return;
    }

    // Fix relative paths if we're in a subfolder
    if (isInSubfolder) {
        html = html.replace(/href="(?!http|#|mailto)([^"]+)"/g, 'href="../$1"');
        html = html.replace(/src="(?!http)([^"]+)"/g, 'src="../$1"');
    }

    navbarPlaceholder.innerHTML = html;

    // Initialize navbar after loading
    initNavbar();
}

// Initialize navbar functionality
function initNavbar() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            mobileNav.classList.toggle('active');

            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-mobile-links a').forEach(link => {
        link.addEventListener('click', function () {
            if (mobileNav) mobileNav.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Set active page based on current URL
    setActivePage();
}

// Mobile Dropdown Toggle Function (global for onclick handlers)
function toggleMobileDropdown(header) {
    const dropdown = header.parentElement;
    dropdown.classList.toggle('active');
}

// Set active page in navigation
function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'home',
        '': 'home',
        'about.html': 'about',
        'programs.html': 'programs',
        'services.html': 'services',
        'blog.html': 'blog',
        'research.html': 'research',
        'researcher.html': 'researcher',
        'get-involved.html': 'get-involved',
        'contact.html': 'contact',
        'volunteer.html': 'get-involved',
        'mentor-application.html': 'get-involved',
        'security.html': 'security',
        'policies.html': 'company'
    };

    const activePage = pageMap[currentPage];
    if (activePage) {
        const activeLink = document.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Auto-load navbar when DOM is ready OR immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    // DOM is already ready, call immediately
    loadNavbar();
}
