/* ============================================
   ADVANCED SEO OPTIMIZATION
   International SEO best practices
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       1. STRUCTURED DATA (JSON-LD)
       ============================================ */
    function addOrganizationSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Elitech Hub",
            "alternateName": "Elitech Hub Limited",
            "url": "https://www.elitechhub.com",
            "logo": "https://www.elitechhub.com/assets/images/logo.png",
            "description": "Nigeria's #1 Cybersecurity Training Company. 16-week professional program with guaranteed internship. 85% job placement rate.",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nigeria"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+234-708-196-8062",
                "contactType": "Admissions",
                "availableLanguage": "English"
            },
            "sameAs": [
                "https://www.linkedin.com/company/elitech-hub",
                "https://twitter.com/elitechhub",
                "https://www.facebook.com/elitechhub"
            ],
            "foundingDate": "2023",
            "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "10-50"
            },
            "areaServed": {
                "@type": "Country",
                "name": "Nigeria"
            },
            "makesOffer": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Course",
                        "name": "16-Week Professional Cybersecurity Training",
                        "description": "Comprehensive cybersecurity training with guaranteed internship",
                        "provider": {
                            "@type": "Organization",
                            "name": "Elitech Hub"
                        }
                    },
                    "price": "75000",
                    "priceCurrency": "NGN"
                }
            ]
        };

        injectSchema(schema);
    }

    function addCourseSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Professional Cybersecurity Training",
            "description": "16-week intensive cybersecurity training program with hands-on labs, industry certifications, and guaranteed internship placement.",
            "provider": {
                "@type": "Organization",
                "name": "Elitech Hub",
                "sameAs": "https://www.elitechhub.com"
            },
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "blended",
                "duration": "P16W",
                "instructor": {
                    "@type": "Person",
                    "name": "Elitech Hub Instructors"
                }
            },
            "offers": {
                "@type": "Offer",
                "category": "Paid",
                "price": "75000",
                "priceCurrency": "NGN"
            },
            "educationalCredentialAwarded": "Cybersecurity Professional Certificate"
        };

        injectSchema(schema);
    }

    function addLocalBusinessSchema() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Elitech Hub",
            "image": "https://www.elitechhub.com/assets/images/logo.png",
            "telephone": "+234-708-196-8062",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "Nigeria"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 6.5244,
                "longitude": 3.3792
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "17:00"
            },
            "priceRange": "₦₦"
        };

        injectSchema(schema);
    }

    function addBreadcrumbSchema() {
        const pathArray = window.location.pathname.split('/').filter(Boolean);
        const itemListElement = pathArray.map((segment, index) => {
            const position = index + 2; // Start from 2 (1 is homepage)
            const url = window.location.origin + '/' + pathArray.slice(0, index + 1).join('/');

            return {
                "@type": "ListItem",
                "position": position,
                "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                "item": url
            };
        });

        // Add homepage as first item
        itemListElement.unshift({
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": window.location.origin
        });

        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };

        injectSchema(schema);
    }

    function injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    /* ============================================
       2. META TAG OPTIMIZATION
       ============================================ */
    function optimizeMetaTags() {
        // Add missing Open Graph tags
        const ogTags = {
            'og:type': 'website',
            'og:site_name': 'Elitech Hub',
            'og:locale': 'en_US',
            'og:image:width': '1200',
            'og:image:height': '630'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            if (!document.querySelector(`meta[property="${property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', property);
                meta.content = content;
                document.head.appendChild(meta);
            }
        });

        // Add Twitter Card tags
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:site': '@elitechhub',
            'twitter:creator': '@elitechhub'
        };

        Object.entries(twitterTags).forEach(([name, content]) => {
            if (!document.querySelector(`meta[name="${name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = name;
                meta.content = content;
                document.head.appendChild(meta);
            }
        });

        // Add robots meta if not present
        if (!document.querySelector('meta[name="robots"]')) {
            const robots = document.createElement('meta');
            robots.name = 'robots';
            robots.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
            document.head.appendChild(robots);
        }
    }

    /* ============================================
       3. CANONICAL URL
       ============================================ */
    function ensureCanonicalUrl() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('?')[0].split('#')[0];
            document.head.appendChild(canonical);
        }
    }

    /* ============================================
       4. PERFORMANCE OPTIMIZATION
       ============================================ */
    function lazyLoadImages() {
        const images = document.querySelectorAll('img:not([loading])');

        images.forEach(img => {
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    }

    function preloadCriticalAssets() {
        // Preload critical fonts
        const fonts = [
            '/fonts/montserrat.woff2'
        ];

        fonts.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = font;
            document.head.appendChild(link);
        });
    }

    function deferNonCriticalCSS() {
        const links = document.querySelectorAll('link[rel="stylesheet"]');

        links.forEach(link => {
            if (!link.media || link.media === 'all') {
                // Mark as non-critical
                link.media = 'print';
                link.onload = function() {
                    this.media = 'all';
                };
            }
        });
    }

    /* ============================================
       5. ANALYTICS INTEGRATION
       ============================================ */
    function trackPageView() {
        // Track page views (integrate with your analytics)
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname
            });
        }
    }

    function trackUserEngagement() {
        // Track scroll depth
        let maxScroll = 0;

        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > maxScroll) {
                maxScroll = Math.round(scrollPercent / 25) * 25; // Track in 25% increments

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        'event_category': 'engagement',
                        'event_label': `${maxScroll}%`,
                        'value': maxScroll
                    });
                }
            }
        });

        // Track time on page
        let startTime = Date.now();

        window.addEventListener('beforeunload', function() {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);

            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    'event_category': 'engagement',
                    'event_label': document.title,
                    'value': timeSpent
                });
            }
        });
    }

    /* ============================================
       6. SITEMAP GENERATION HELPER
       ============================================ */
    function generateSitemapData() {
        const pages = [];
        const links = document.querySelectorAll('a[href]');

        links.forEach(link => {
            const href = link.getAttribute('href');

            if (href && href.startsWith('/') && !href.includes('#') && !pages.includes(href)) {
                pages.push({
                    url: window.location.origin + href,
                    lastmod: new Date().toISOString().split('T')[0],
                    priority: href === '/' ? '1.0' : '0.8'
                });
            }
        });

        return pages;
    }

    /* ============================================
       7. ACCESSIBILITY FOR SEO
       ============================================ */
    function enhanceAccessibility() {
        // Add alt text reminders
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            console.warn('Image missing alt text:', img.src);
            img.alt = 'Image'; // Fallback
        });

        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));

            if (previousLevel > 0 && level - previousLevel > 1) {
                console.warn('Heading hierarchy skip detected:', heading.textContent);
            }

            previousLevel = level;
        });

        // Add ARIA landmarks if missing
        if (!document.querySelector('[role="main"]') && !document.querySelector('main')) {
            const main = document.querySelector('.container, .content, #content');
            if (main) {
                main.setAttribute('role', 'main');
            }
        }
    }

    /* ============================================
       8. MOBILE OPTIMIZATION
       ============================================ */
    function ensureMobileOptimization() {
        // Add viewport meta if missing
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5';
            document.head.appendChild(viewport);
        }

        // Add mobile-web-app-capable
        if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
            const mobileCapable = document.createElement('meta');
            mobileCapable.name = 'mobile-web-app-capable';
            mobileCapable.content = 'yes';
            document.head.appendChild(mobileCapable);
        }
    }

    /* ============================================
       9. SOCIAL MEDIA OPTIMIZATION
       ============================================ */
    function optimizeSocialSharing() {
        // Ensure all social meta tags are present
        const currentUrl = window.location.href;
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const image = document.querySelector('meta[property="og:image"]')?.content ||
                     window.location.origin + '/assets/images/logo.png';

        const socialMeta = [
            { property: 'og:url', content: currentUrl },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: image },
            { name: 'twitter:url', content: currentUrl },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image }
        ];

        socialMeta.forEach(({ property, name, content }) => {
            const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;

            if (!document.querySelector(selector)) {
                const meta = document.createElement('meta');
                if (property) meta.setAttribute('property', property);
                if (name) meta.name = name;
                meta.content = content;
                document.head.appendChild(meta);
            }
        });
    }

    /* ============================================
       10. CORE WEB VITALS OPTIMIZATION
       ============================================ */
    function monitorCoreWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'LCP', {
                            'event_category': 'Web Vitals',
                            'value': Math.round(lastEntry.renderTime || lastEntry.loadTime),
                            'event_label': window.location.pathname
                        });
                    }
                });

                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.error('LCP observation failed:', e);
            }

            // Monitor First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();

                    entries.forEach(entry => {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'FID', {
                                'event_category': 'Web Vitals',
                                'value': Math.round(entry.processingStart - entry.startTime),
                                'event_label': window.location.pathname
                            });
                        }
                    });
                });

                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.error('FID observation failed:', e);
            }

            // Monitor Cumulative Layout Shift (CLS)
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    }

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'CLS', {
                            'event_category': 'Web Vitals',
                            'value': Math.round(clsScore * 1000),
                            'event_label': window.location.pathname
                        });
                    }
                });

                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.error('CLS observation failed:', e);
            }
        }
    }

    /* ============================================
       11. INITIALIZE ALL SEO FEATURES
       ============================================ */
    function initSEO() {
        // Structured data
        addOrganizationSchema();
        addCourseSchema();
        addLocalBusinessSchema();
        addBreadcrumbSchema();

        // Meta optimization
        optimizeMetaTags();
        ensureCanonicalUrl();
        optimizeSocialSharing();

        // Performance
        lazyLoadImages();
        preloadCriticalAssets();

        // Mobile & accessibility
        ensureMobileOptimization();
        enhanceAccessibility();

        // Analytics
        trackPageView();
        trackUserEngagement();
        monitorCoreWebVitals();

        console.log('%c📊 SEO optimizations initialized', 'color: #1b8aca; font-weight: bold; font-size: 14px;');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSEO);
    } else {
        initSEO();
    }

    // Expose SEO utilities to window object
    window.ElitechSEO = {
        generateSitemapData,
        trackPageView,
        addOrganizationSchema,
        addCourseSchema
    };

})();
