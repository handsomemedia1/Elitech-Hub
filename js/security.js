/* ============================================
   ADVANCED SECURITY FEATURES
   Enterprise-grade website security
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       1. CONTENT SECURITY POLICY (CSP) META
       ============================================ */
    function initializeCSP() {
        // Add CSP meta tag if not already present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:3001 https://api.elitechhub.com https://region1.google-analytics.com https://www.google-analytics.com https://ipapi.co; frame-ancestors 'none';";
            document.head.appendChild(cspMeta);
        }
    }

    /* ============================================
       2. XSS PROTECTION
       ============================================ */
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    function protectForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');

                inputs.forEach(input => {
                    input.value = sanitizeInput(input.value);
                });
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function () {
                    this.value = sanitizeInput(this.value);
                });
            });
        });
    }

    /* ============================================
       3. CLICKJACKING PROTECTION
       ============================================ */
    function preventClickjacking() {
        if (window.self !== window.top) {
            // The page is in an iframe
            window.top.location = window.self.location;
        }
    }

    /* ============================================
       4. CSRF TOKEN GENERATION
       ============================================ */
    function generateCSRFToken() {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        sessionStorage.setItem('csrf_token', token);
        return token;
    }

    function addCSRFTokenToForms() {
        const forms = document.querySelectorAll('form');
        const token = sessionStorage.getItem('csrf_token') || generateCSRFToken();

        forms.forEach(form => {
            if (!form.querySelector('input[name="csrf_token"]')) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = token;
                form.appendChild(input);
            }
        });
    }

    /* ============================================
       5. SECURE COOKIE HANDLING
       ============================================ */
    function setSecureCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

        const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure`;
        document.cookie = cookieString;
    }

    function getSecureCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    /* ============================================
       6. SQL INJECTION PREVENTION (Client-side validation)
       ============================================ */
    function containsSQLInjection(input) {
        const sqlPatterns = [
            /(\bOR\b|\bAND\b).*=.*/i,
            /UNION.*SELECT/i,
            /SELECT.*FROM/i,
            /INSERT.*INTO/i,
            /DELETE.*FROM/i,
            /DROP.*TABLE/i,
            /UPDATE.*SET/i,
            /--/,
            /;.*DROP/i,
            /'.*OR.*'/i
        ];

        return sqlPatterns.some(pattern => pattern.test(input));
    }

    function validateInputs() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

        inputs.forEach(input => {
            input.addEventListener('input', function () {
                if (containsSQLInjection(this.value)) {
                    this.setCustomValidity('Invalid input detected');
                    this.classList.add('error');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('error');
                }
            });
        });
    }

    /* ============================================
       7. SECURE EXTERNAL LINKS
       ============================================ */
    function secureExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');

        links.forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        });
    }

    /* ============================================
       8. DISABLE RIGHT-CLICK ON SENSITIVE CONTENT
       ============================================ */
    function protectSensitiveContent() {
        const protectedElements = document.querySelectorAll('[data-protected="true"]');

        protectedElements.forEach(element => {
            element.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                return false;
            });

            element.addEventListener('copy', function (e) {
                e.preventDefault();
                return false;
            });
        });
    }

    /* ============================================
       9. SESSION TIMEOUT
       ============================================ */
    function initSessionTimeout(minutes = 30) {
        let timeout;

        function resetTimer() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                alert('Your session has expired for security reasons. Please refresh the page.');
                sessionStorage.clear();
            }, minutes * 60 * 1000);
        }

        // Reset timer on user activity
        ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    /* ============================================
       10. HTTPS ENFORCEMENT
       ============================================ */
    function enforceHTTPS() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            location.replace('https:' + window.location.href.substring(window.location.protocol.length));
        }
    }

    /* ============================================
       11. DISABLE CONSOLE IN PRODUCTION
       ============================================ */
    function disableConsoleInProduction() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = function () { };
            console.warn = function () { };
            console.error = function () { };
            console.debug = function () { };
            console.info = function () { };
        }
    }

    /* ============================================
       12. RATE LIMITING FOR FORMS
       ============================================ */
    const rateLimiter = {
        attempts: {},

        isAllowed: function (key, maxAttempts = 5, windowMs = 60000) {
            const now = Date.now();

            if (!this.attempts[key]) {
                this.attempts[key] = [];
            }

            // Remove old attempts
            this.attempts[key] = this.attempts[key].filter(time => now - time < windowMs);

            if (this.attempts[key].length >= maxAttempts) {
                return false;
            }

            this.attempts[key].push(now);
            return true;
        }
    };

    function protectFormSubmissions() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                const formId = this.id || 'anonymous-form';

                if (!rateLimiter.isAllowed(formId)) {
                    e.preventDefault();
                    alert('Too many attempts. Please wait a moment before trying again.');
                    return false;
                }
            });
        });
    }

    /* ============================================
       13. INPUT VALIDATION PATTERNS
       ============================================ */
    const validationPatterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\+\-\(\)]+$/,
        url: /^https?:\/\/.+/,
        alphanumeric: /^[a-zA-Z0-9\s]+$/
    };

    function enhanceFormValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.value && !validationPatterns.email.test(this.value)) {
                    this.setCustomValidity('Please enter a valid email address');
                } else {
                    this.setCustomValidity('');
                }
            });
        });

        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('blur', function () {
                if (this.value && !validationPatterns.phone.test(this.value)) {
                    this.setCustomValidity('Please enter a valid phone number');
                } else {
                    this.setCustomValidity('');
                }
            });
        });
    }

    /* ============================================
       14. SUBRESOURCE INTEGRITY (SRI) CHECK
       ============================================ */
    function checkSRI() {
        const externalScripts = document.querySelectorAll('script[src^="https://"], link[href^="https://"]');

        externalScripts.forEach(element => {
            if (!element.integrity && element.crossOrigin !== 'anonymous') {
                console.warn('External resource without SRI:', element.src || element.href);
            }
        });
    }

    /* ============================================
       15. INITIALIZE ALL SECURITY FEATURES
       ============================================ */
    function initSecurity() {
        // Core security
        enforceHTTPS();
        preventClickjacking();
        initializeCSP();

        // Form protection
        protectForms();
        addCSRFTokenToForms();
        validateInputs();
        protectFormSubmissions();
        enhanceFormValidation();

        // Content protection
        secureExternalLinks();
        protectSensitiveContent();

        // Session management
        initSessionTimeout(30);

        // Production optimizations
        disableConsoleInProduction();
        checkSRI();

        console.log('%c🛡️ Security features initialized', 'color: #2e8b57; font-weight: bold; font-size: 14px;');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    // Expose security utilities to window object (for manual use)
    window.ElitechSecurity = {
        sanitizeInput,
        setSecureCookie,
        getSecureCookie,
        generateCSRFToken,
        containsSQLInjection,
        rateLimiter
    };

})();
