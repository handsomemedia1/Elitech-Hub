/**
 * Smart Pop-up Lead Capture Engine
 * Contextual pop-ups segmented by page intent
 * + Returning visitor detection + Funnel tracking
 * Elitech Hub — 2026
 */

(function () {
    'use strict';

    // ==========================================
    //  CONFIG
    // ==========================================
    const CONFIG = {
        SCROLL_TRIGGER: 0.4,        // 40% scroll depth
        TIME_TRIGGER: 15000,        // 15 seconds on page
        SUPPRESS_DAYS: 7,           // Days to suppress after submission
        SESSION_KEY: 'elitech_popup_shown',
        SUBMIT_KEY: 'elitech_popup_submitted',
        VISITOR_KEY: 'elitech_visitor',
        FUNNEL_KEY: 'elitech_funnel',
        CONSENT_KEY: 'elitech_cookie_consent'
    };

    // ==========================================
    //  PAGE SEGMENT DETECTION
    // ==========================================
    function getPageSegment() {
        const path = window.location.pathname.toLowerCase();
        const page = path.split('/').pop() || 'index.html';

        if (['programs.html', 'course.html', 'apply.html'].some(p => page.includes(p))) return 'programs';
        if (['blog.html', 'research.html', 'lab.html', 'research-paper.html', 'researcher-guidelines.html', 'article.html'].some(p => page.includes(p))) return 'content';
        if (['services.html', 'get-involved.html', 'about.html', 'volunteer.html', 'mentor-application.html'].some(p => page.includes(p))) return 'business';
        if (['index.html', ''].some(p => page === p || page === '/')) return 'homepage';

        return null; // admin, login, dashboard, etc — no popup
    }

    // ==========================================
    //  POP-UP CONTENT BY SEGMENT
    // ==========================================
    const OFFERS = {
        homepage: {
            icon: 'fas fa-rocket',
            title: 'Join 1,000+ Learners Getting Cybersecurity Opportunities',
            subtitle: 'Get free resources, job alerts, and early access to training programs. Delivered to your inbox — no spam.',
            cta: 'Join the Community',
            returnTitle: 'Welcome Back! Ready to Level Up?',
            returnSubtitle: 'You visited before — that means you\'re serious. Get cybersecurity career resources and be first to know when programs open.',
            returnCta: 'Get Access Now'
        },
        programs: {
            icon: 'fas fa-map-signs',
            title: 'Free: Beginner Cybersecurity Roadmap (2026-Ready)',
            subtitle: 'Download the step-by-step guide used by 300+ students to launch their cybersecurity careers. Tools, certifications, and job-ready skills.',
            cta: 'Send Me the Roadmap',
            returnTitle: 'Still exploring programs?',
            returnSubtitle: 'Get the free cybersecurity career roadmap + notifications when new cohorts open. No commitment required.',
            returnCta: 'Get the Roadmap'
        },
        content: {
            icon: 'fas fa-envelope-open-text',
            title: 'Weekly Cybersecurity Insights + Job Alerts',
            subtitle: 'Curated threat analysis, career tips, and Nigeria + remote cybersecurity opportunities. Every week, straight to your inbox.',
            cta: 'Subscribe Free',
            returnTitle: 'You keep coming back for insights — make it official',
            returnSubtitle: 'Get weekly cybersecurity analysis, job alerts, and exclusive research notes delivered free.',
            returnCta: 'Subscribe Now'
        },
        business: {
            icon: 'fas fa-handshake',
            title: 'Get Our Impact & Partnership Deck',
            subtitle: 'See our training outcomes, research output, and partnership opportunities. Perfect for sponsors, collaborators, and organizations.',
            cta: 'Request the Deck',
            returnTitle: 'Interested in partnering with us?',
            returnSubtitle: 'Get our impact report and partnership deck to explore collaboration opportunities.',
            returnCta: 'Get the Deck'
        }
    };

    // ==========================================
    //  VISITOR TRACKING (Cookies + localStorage)
    // ==========================================
    function trackVisitor() {
        let visitor = {};
        try { visitor = JSON.parse(localStorage.getItem(CONFIG.VISITOR_KEY) || '{}'); } catch (e) { }

        const now = new Date().toISOString();
        visitor.visits = (visitor.visits || 0) + 1;
        visitor.firstVisit = visitor.firstVisit || now;
        visitor.lastVisit = now;

        localStorage.setItem(CONFIG.VISITOR_KEY, JSON.stringify(visitor));

        // Set cookie for server-side access
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `elitech_visits=${visitor.visits};expires=${d.toUTCString()};path=/;SameSite=Lax`;

        return visitor;
    }

    function trackFunnel() {
        let funnel = [];
        try { funnel = JSON.parse(localStorage.getItem(CONFIG.FUNNEL_KEY) || '[]'); } catch (e) { }

        const page = window.location.pathname.split('/').pop() || 'index.html';
        const entry = { page, time: Date.now() };

        funnel.push(entry);
        if (funnel.length > 50) funnel = funnel.slice(-50); // Keep last 50

        localStorage.setItem(CONFIG.FUNNEL_KEY, JSON.stringify(funnel));

        // Fire GA event
        if (typeof gtag === 'function') {
            gtag('event', 'page_visit', {
                event_category: 'funnel',
                event_label: page,
                value: funnel.length
            });
        }
    }

    function isReturningVisitor(visitor) {
        return (visitor.visits || 0) >= 2;
    }

    // ==========================================
    //  SUPPRESSION CHECKS
    // ==========================================
    function isSubmitted() {
        try {
            const submitted = localStorage.getItem(CONFIG.SUBMIT_KEY);
            if (!submitted) return false;
            const diff = Date.now() - parseInt(submitted);
            return diff < (CONFIG.SUPPRESS_DAYS * 24 * 60 * 60 * 1000);
        } catch (e) { return false; }
    }

    function isShownThisSession() {
        try { return sessionStorage.getItem(CONFIG.SESSION_KEY) === 'true'; } catch (e) { return false; }
    }

    function markShown() {
        try { sessionStorage.setItem(CONFIG.SESSION_KEY, 'true'); } catch (e) { }
    }

    function markSubmitted() {
        try { localStorage.setItem(CONFIG.SUBMIT_KEY, Date.now().toString()); } catch (e) { }
    }

    // ==========================================
    //  BUILD POP-UP DOM
    // ==========================================
    function buildPopup(segment, isReturn) {
        const offer = OFFERS[segment];
        if (!offer) return null;

        const title = isReturn ? offer.returnTitle : offer.title;
        const subtitle = isReturn ? offer.returnSubtitle : offer.subtitle;
        const cta = isReturn ? offer.returnCta : offer.cta;

        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.id = 'smartPopup';

        overlay.innerHTML = `
            <div class="popup-card">
                <div class="popup-accent ${segment}"></div>
                <button class="popup-close" onclick="window.ElitechPopup.close()" aria-label="Close">&times;</button>
                
                <div class="popup-body" id="popupForm">
                    ${isReturn ? '<div class="popup-returning"><i class="fas fa-hand-peace"></i> Welcome back!</div>' : ''}
                    <div class="popup-icon ${segment}"><i class="${offer.icon}"></i></div>
                    <h2>${title}</h2>
                    <p class="popup-subtitle">${subtitle}</p>
                    
                    <form class="popup-form" onsubmit="return window.ElitechPopup.submit(event)">
                        <div class="popup-input-group">
                            <i class="fas fa-envelope"></i>
                            <input type="email" class="popup-input" id="popupEmail" placeholder="Your email address" required>
                        </div>
                        <div class="popup-input-group">
                            <i class="fab fa-whatsapp"></i>
                            <input type="tel" class="popup-input" id="popupWhatsapp" placeholder="WhatsApp number (optional)">
                        </div>
                        <div class="popup-optional"><i class="fas fa-info-circle"></i> WhatsApp is optional — we only use it for high-value alerts</div>
                        <div class="popup-consent">
                            <input type="checkbox" id="popupConsent" required>
                            <label for="popupConsent">I agree to receive emails from Elitech Hub. No spam — unsubscribe anytime. <a href="policies.html">Privacy Policy</a></label>
                        </div>
                        <button type="submit" class="popup-submit ${segment}"><i class="fas fa-arrow-right"></i> ${cta}</button>
                    </form>
                    
                    <div class="popup-trust">
                        <span><i class="fas fa-lock"></i> No spam</span>
                        <span><i class="fas fa-users"></i> 1,000+ subscribers</span>
                        <span><i class="fas fa-times-circle"></i> Unsubscribe anytime</span>
                    </div>
                </div>

                <div class="popup-success" id="popupSuccess">
                    <div class="popup-success-icon"><i class="fas fa-check"></i></div>
                    <h3>You're In! 🎉</h3>
                    <p>Check your inbox for your first resource. Welcome to the Elitech Hub community.</p>
                </div>
            </div>
        `;

        return overlay;
    }

    // ==========================================
    //  SHOW / CLOSE / SUBMIT
    // ==========================================
    function showPopup() {
        const segment = getPageSegment();
        if (!segment || isSubmitted() || isShownThisSession()) return;

        const visitor = JSON.parse(localStorage.getItem(CONFIG.VISITOR_KEY) || '{}');
        const popup = buildPopup(segment, isReturningVisitor(visitor));
        if (!popup) return;

        document.body.appendChild(popup);

        // Need tiny delay for CSS transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                popup.classList.add('active');
            });
        });

        markShown();

        // Close on overlay click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) window.ElitechPopup.close();
        });

        // Close on Escape
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                window.ElitechPopup.close();
                document.removeEventListener('keydown', escHandler);
            }
        });

        // GA event
        if (typeof gtag === 'function') {
            gtag('event', 'popup_shown', {
                event_category: 'lead_capture',
                event_label: segment,
                value: visitor.visits || 1
            });
        }
    }

    function closePopup() {
        const popup = document.getElementById('smartPopup');
        if (!popup) return;
        popup.classList.remove('active');
        setTimeout(() => popup.remove(), 400);
    }

    function submitPopup(e) {
        e.preventDefault();

        const email = document.getElementById('popupEmail').value.trim();
        const whatsapp = document.getElementById('popupWhatsapp').value.trim();
        const consent = document.getElementById('popupConsent').checked;

        if (!email || !consent) return false;

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;

        const segment = getPageSegment();
        const visitData = JSON.parse(localStorage.getItem(CONFIG.VISITOR_KEY) || '{}');

        // Store locally (backup)
        const leads = JSON.parse(localStorage.getItem('elitech_leads') || '[]');
        leads.push({
            email,
            whatsapp: whatsapp || null,
            segment,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            visits: visitData.visits || 1
        });
        localStorage.setItem('elitech_leads', JSON.stringify(leads));

        // Send to backend (async, non-blocking)
        sendToBackend(email, whatsapp, segment, visitData.visits || 1);

        // Mark submitted
        markSubmitted();

        // Set consent cookie for analytics
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `elitech_lead=1;expires=${d.toUTCString()};path=/;SameSite=Lax`;

        // Show success state
        document.getElementById('popupForm').style.display = 'none';
        const success = document.getElementById('popupSuccess');
        success.classList.add('active');

        // GA event
        if (typeof gtag === 'function') {
            gtag('event', 'popup_submit', {
                event_category: 'lead_capture',
                event_label: segment,
                value: 1
            });
        }

        // Auto-close after 3 seconds
        setTimeout(closePopup, 3000);

        return false;
    }

    // ==========================================
    //  BACKEND SYNC
    // ==========================================
    function sendToBackend(email, whatsapp, segment, visits) {
        // Detect API base URL
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const API_BASE = isLocal
            ? 'http://localhost:3001'
            : 'https://elitech-hub-api.vercel.app';

        fetch(`${API_BASE}/api/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                whatsapp: whatsapp || null,
                segment,
                page: window.location.pathname,
                visits
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('✅ Lead synced to backend');
                }
            })
            .catch(err => {
                // Fail silently — localStorage is the backup
                console.warn('Lead backend sync failed (stored locally):', err.message);
            });
    }

    // ==========================================
    //  TRIGGER SYSTEM
    // ==========================================
    function initTriggers() {
        if (!getPageSegment() || isSubmitted() || isShownThisSession()) return;

        let triggered = false;
        const trigger = () => {
            if (triggered) return;
            triggered = true;
            showPopup();
        };

        // 1. Time trigger
        setTimeout(trigger, CONFIG.TIME_TRIGGER);

        // 2. Scroll trigger
        const scrollHandler = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercent >= CONFIG.SCROLL_TRIGGER) {
                trigger();
                window.removeEventListener('scroll', scrollHandler);
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });

        // 3. Exit intent (desktop only)
        if (window.innerWidth > 768) {
            document.addEventListener('mouseout', (e) => {
                if (e.clientY <= 0 && e.relatedTarget === null) {
                    trigger();
                }
            });
        }
    }

    // ==========================================
    //  GLOBAL API
    // ==========================================
    window.ElitechPopup = {
        close: closePopup,
        submit: submitPopup,
        show: showPopup,
        getLeads: () => JSON.parse(localStorage.getItem('elitech_leads') || '[]'),
        getFunnel: () => JSON.parse(localStorage.getItem(CONFIG.FUNNEL_KEY) || '[]'),
        getVisitor: () => JSON.parse(localStorage.getItem(CONFIG.VISITOR_KEY) || '{}')
    };

    // ==========================================
    //  INIT
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        trackVisitor();
        trackFunnel();

        // Wait for page loader to finish before arming triggers
        setTimeout(initTriggers, 2000);
    });

})();
