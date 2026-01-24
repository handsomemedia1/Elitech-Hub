/**
 * Elitech Hub Analytics
 * Google Analytics + Custom View Tracking
 */

(function () {
    // Google Analytics 4 Configuration
    // Replace G-XXXXXXXXXX with your actual GA4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with real ID

    // Load Google Analytics script
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);

        // Make gtag available globally
        window.gtag = gtag;
    }

    // Custom view tracking for blog posts
    const API_URL = 'http://localhost:3001/api'; // Update for production

    // Track page view (for blog posts)
    window.trackPageView = async function (postId, postSlug) {
        if (!postId && !postSlug) return;

        try {
            await fetch(`${API_URL}/blog/track-view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    postSlug,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent
                })
            });
        } catch (err) {
            console.log('View tracking failed:', err);
        }
    };

    // Auto-track blog post views
    if (window.location.pathname.includes('/blog/') ||
        window.location.search.includes('post=') ||
        document.querySelector('[data-post-id]')) {

        const postElement = document.querySelector('[data-post-id]');
        if (postElement) {
            const postId = postElement.dataset.postId;
            const postSlug = postElement.dataset.postSlug;
            window.trackPageView(postId, postSlug);
        }
    }

    console.log('📊 Elitech Analytics loaded');
})();
