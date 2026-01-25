/* ============================================
   ELITECH HUB - MAIN JAVASCRIPT
   Modern, Clean Interactions
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       1. UTILITY FUNCTIONS
       ============================================ */

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /* ============================================
       2. MOBILE NAVIGATION
       ============================================ */

    function initMobileNav() {
        const navToggle = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('mobileNav');

        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            const icon = navToggle.querySelector('i');
            navLinks.classList.toggle('active');

            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on link click
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ============================================
       3. NAVBAR SCROLL BEHAVIOR
       ============================================ */

    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        const handleScroll = throttle(() => {
            const currentScroll = window.pageYOffset;

            // Add scrolled class for styling
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll (optional - disabled by default)
            // Uncomment below to enable auto-hide navbar on scroll down
            /*
            if (currentScroll > scrollThreshold) {
                if (currentScroll > lastScroll && !navbar.classList.contains('nav-hidden')) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('nav-hidden');
                } else if (currentScroll < lastScroll && navbar.classList.contains('nav-hidden')) {
                    // Scrolling up - show navbar
                    navbar.classList.remove('nav-hidden');
                }
            }
            */

            lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    /* ============================================
       4. SMOOTH SCROLL FOR ANCHOR LINKS
       ============================================ */

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip empty hash links
                if (href === '#' || href === '#!') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /* ============================================
       5. INTERSECTION OBSERVER FOR ANIMATIONS
       ============================================ */

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    /* ============================================
       6. ACTIVE NAV LINK HIGHLIGHTING
       ============================================ */

    function initActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        const highlightNav = throttle(() => {
            const scrollPos = window.pageYOffset + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);

        window.addEventListener('scroll', highlightNav);
    }

    /* ============================================
       7. FORM HANDLING
       ============================================ */

    function initFormHandling() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn?.textContent;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }

                // Add your form submission logic here
                // Example: fetch('/api/submit', { method: 'POST', body: new FormData(form) })

                // Simulate delay
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    }
                    // Show success message
                    alert('Thank you! We will get back to you soon.');
                    form.reset();
                }, 1000);
            });
        });
    }

    /* ============================================
       8. LAZY LOADING IMAGES
       ============================================ */

    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /* ============================================
       9. BACK TO TOP BUTTON
       ============================================ */

    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');

        if (!backToTopBtn) return;

        const handleScroll = throttle(() => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ============================================
       10. DARK/LIGHT MODE TOGGLE
       ============================================ */

    function initThemeToggle() {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Create theme toggle button
        const themeToggleBtn = document.getElementById('themeToggle');
        if (!themeToggleBtn) return;

        // Set initial icon
        updateThemeIcon(currentTheme);

        // Toggle theme on button click
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const icon = themeToggleBtn.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }

    /* ============================================
       11. TERMINAL ANIMATION (Optional)
       ============================================ */

    function initTerminalAnimation() {
        const terminal = document.getElementById('terminalContent');
        if (!terminal) return;

        // Terminal animation can be added here if needed
        // For now, static content is displayed
    }

    /* ============================================
       11. PERFORMANCE MONITORING
       ============================================ */

    function logPerformance() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Log page load time
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
                }
            });
        }
    }

    /* ============================================
       12. INITIALIZE ALL FEATURES
       ============================================ */

    function init() {
        // Core functionality
        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initThemeToggle();

        // Enhanced features
        initScrollAnimations();
        initActiveNavLinks();
        initFormHandling();
        initLazyLoading();
        initBackToTop();
        initTerminalAnimation();

        // Development only
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logPerformance();
        }

        // Add loaded class to body
        document.body.classList.add('loaded');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ============================================
       13. EXPOSE PUBLIC API
       ============================================ */

    window.ElitechHub = {
        init: init,
        utils: {
            debounce: debounce,
            throttle: throttle
        }
    };

})();

/* ============================================
   14. SERVICE WORKER REGISTRATION (Optional)
   ============================================ */

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
