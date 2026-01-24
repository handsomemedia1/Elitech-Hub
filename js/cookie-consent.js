/**
 * Cookie Consent Banner
 * Shows a GDPR-compliant cookie consent popup
 */

(function () {
    // Check if user already consented
    if (localStorage.getItem('elitech_cookie_consent')) {
        enableAnalytics();
        return;
    }

    // Create and inject the banner
    const banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.innerHTML = `
        <div class="cookie-banner">
            <div class="cookie-content">
                <div class="cookie-icon">🍪</div>
                <div class="cookie-text">
                    <h4>We value your privacy</h4>
                    <p>We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.</p>
                </div>
            </div>
            <div class="cookie-actions">
                <a href="policies.html#cookies" class="cookie-link">Cookie Policy</a>
                <button class="cookie-btn cookie-decline" onclick="declineCookies()">Decline</button>
                <button class="cookie-btn cookie-accept" onclick="acceptCookies()">Accept All</button>
            </div>
        </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        #cookieConsent {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 9999;
            padding: 1rem;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .cookie-banner {
            max-width: 1000px;
            margin: 0 auto;
            background: #0A0A0A;
            border-radius: 1rem;
            padding: 1.5rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            box-shadow: 0 -5px 30px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .cookie-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .cookie-icon {
            font-size: 2.5rem;
            flex-shrink: 0;
        }

        .cookie-text h4 {
            color: #ffffff;
            font-size: 1rem;
            margin: 0 0 0.25rem 0;
            font-family: 'Montserrat', sans-serif;
        }

        .cookie-text p {
            color: #9CA3AF;
            font-size: 0.85rem;
            margin: 0;
            line-height: 1.5;
        }

        .cookie-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-shrink: 0;
        }

        .cookie-link {
            color: #c3151c;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .cookie-link:hover {
            text-decoration: underline;
        }

        .cookie-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
            font-family: inherit;
        }

        .cookie-decline {
            background: transparent;
            color: #9CA3AF;
            border: 1px solid #374151;
        }

        .cookie-decline:hover {
            background: #374151;
            color: #ffffff;
        }

        .cookie-accept {
            background: #c3151c;
            color: #ffffff;
        }

        .cookie-accept:hover {
            background: #a01118;
        }

        @media (max-width: 768px) {
            .cookie-banner {
                flex-direction: column;
                text-align: center;
            }

            .cookie-content {
                flex-direction: column;
            }

            .cookie-actions {
                width: 100%;
                justify-content: center;
            }
        }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(banner);
})();

// Accept cookies
function acceptCookies() {
    localStorage.setItem('elitech_cookie_consent', 'accepted');
    localStorage.setItem('elitech_cookie_date', new Date().toISOString());
    document.getElementById('cookieConsent').remove();
    enableAnalytics();
}

// Decline cookies
function declineCookies() {
    localStorage.setItem('elitech_cookie_consent', 'declined');
    document.getElementById('cookieConsent').remove();
    disableAnalytics();
}

// Enable Google Analytics
function enableAnalytics() {
    window['ga-disable-G-JDFJL7WM7Y'] = false;
}

// Disable Google Analytics
function disableAnalytics() {
    window['ga-disable-G-JDFJL7WM7Y'] = true;
    // Clear existing GA cookies
    document.cookie.split(';').forEach(function (c) {
        if (c.trim().startsWith('_ga')) {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        }
    });
}
