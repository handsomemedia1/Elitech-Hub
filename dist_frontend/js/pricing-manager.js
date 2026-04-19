/**
 * Pricing Manager
 * Handles automatic currency detection, manual selection, and price conversions
 */

const PricingManager = {
    // Configuration
    config: {
        apiEndpoint: 'https://ipapi.co/json/',
        defaultCurrency: 'NGN',
        storageKey: 'elitech_user_currency',
        storageLocationKey: 'elitech_user_location',
        exchangeRates: {
            'NGN': 1,       // Base (Nigeria)
            'USD': 0.00065, // US Dollar
            'GBP': 0.00051, // British Pound
            'EUR': 0.00060, // Euro
            'CAD': 0.00088, // Canadian Dollar
            'AUD': 0.00099, // Australian Dollar
            'INR': 0.054,   // Indian Rupee
            'ZAR': 0.012,   // South African Rand
            'KES': 0.086,   // Kenyan Shilling
            'GHS': 0.0087,  // Ghanaian Cedi
            'CNY': 0.0047,  // Chinese Yuan
            'JPY': 0.098,   // Japanese Yen
            'AED': 0.0024,  // UAE Dirham
            'SAR': 0.0024,  // Saudi Riyal
            'BRL': 0.0033,  // Brazilian Real
            'CHF': 0.00058, // Swiss Franc
            'SGD': 0.00088, // Singapore Dollar
            'NZD': 0.0011,  // New Zealand Dollar
            'SEK': 0.0069,  // Swedish Krona
            'KRW': 0.88,    // South Korean Won
            'TRY': 0.021,   // Turkish Lira
            'MXN': 0.011    // Mexican Peso
        },
        currencySymbols: {
            'NGN': '₦', 'USD': '$', 'GBP': '£', 'EUR': '€',
            'CAD': 'C$', 'AUD': 'A$', 'INR': '₹', 'ZAR': 'R ',
            'KES': 'KSh ', 'GHS': '₵', 'CNY': '¥', 'JPY': '¥',
            'AED': 'د.إ', 'SAR': 'ر.س', 'BRL': 'R$', 'CHF': 'Fr.',
            'SGD': 'S$', 'NZD': 'NZ$', 'SEK': 'kr', 'KRW': '₩',
            'TRY': '₺', 'MXN': '$'
        },
        currencyFlags: {
            'NGN': '🇳🇬', 'USD': '🇺🇸', 'GBP': '🇬🇧', 'EUR': '🇪🇺',
            'CAD': '🇨🇦', 'AUD': '🇦🇺', 'INR': '🇮🇳', 'ZAR': '🇿🇦',
            'KES': '🇰🇪', 'GHS': '🇬🇭', 'CNY': '🇨🇳', 'JPY': '🇯🇵',
            'AED': '🇦🇪', 'SAR': '🇸🇦', 'BRL': '🇧🇷', 'CHF': '🇨🇭',
            'SGD': '🇸🇬', 'NZD': '🇳🇿', 'SEK': '🇸🇪', 'KRW': '🇰🇷',
            'TRY': '🇹🇷', 'MXN': '🇲🇽'
        }
    },

    // Initialize
    init() {
        this.detectLocation();
        this.setupCurrencySelector();
    },

    // Detect user location
    async detectLocation() {
        // Use sessionStorage instead of localStorage so if they change VPN and open a new tab, it updates!
        // For explicitly chosen manual currency, we will use localStorage.
        const manualCurrency = localStorage.getItem(this.config.storageKey);
        if (manualCurrency) {
            this.updatePrices(manualCurrency);
            return;
        }

        const sessionCurrency = sessionStorage.getItem(this.config.storageKey);
        if (sessionCurrency) {
            this.updatePrices(sessionCurrency);
            return;
        }

        try {
            // Fetch location from IP
            const response = await fetch(this.config.apiEndpoint);
            const data = await response.json();

            let currency = 'NGN'; // Default

            // Determine currency based on country code using extensive map
            if (data.country_code) {
                switch (data.country_code) {
                    case 'NG': currency = 'NGN'; break;
                    case 'GB': currency = 'GBP'; break;
                    case 'US': currency = 'USD'; break;
                    case 'CA': currency = 'CAD'; break;
                    case 'AU': currency = 'AUD'; break;
                    case 'IN': currency = 'INR'; break;
                    case 'ZA': currency = 'ZAR'; break;
                    case 'KE': currency = 'KES'; break;
                    case 'GH': currency = 'GHS'; break;
                    case 'CN': currency = 'CNY'; break;
                    case 'JP': currency = 'JPY'; break;
                    case 'AE': currency = 'AED'; break;
                    case 'SA': currency = 'SAR'; break;
                    case 'BR': currency = 'BRL'; break;
                    case 'CH': currency = 'CHF'; break;
                    case 'SG': currency = 'SGD'; break;
                    case 'NZ': currency = 'NZD'; break;
                    case 'SE': currency = 'SEK'; break;
                    case 'KR': currency = 'KRW'; break;
                    case 'TR': currency = 'TRY'; break;
                    case 'MX': currency = 'MXN'; break;
                    // EU Countries
                    case 'DE': case 'FR': case 'IT': case 'ES': case 'NL': case 'BE':
                    case 'AT': case 'IE': case 'FI': case 'PT': case 'GR':
                        currency = 'EUR';
                        break;
                    default:
                        currency = 'USD'; // Global standard fallback
                        break;
                }
            }

            // Save auto-detected to session (so VPN testing works on new tab)
            sessionStorage.setItem(this.config.storageKey, currency);

            // Update UI
            this.updatePrices(currency);

        } catch (err) {
            console.error('Location detection failed:', err);
            // Fallback to default (NGN)
            this.updatePrices(this.config.defaultCurrency);
        }
    },

    // Update all prices on the page
    updatePrices(currency) {
        const priceElements = document.querySelectorAll('[data-price-ngn]');

        priceElements.forEach(el => {
            const specificPrice = el.getAttribute(`data-price-${currency.toLowerCase()}`);

            if (specificPrice) {
                if (/^\d+$/.test(specificPrice)) {
                    el.innerHTML = `${this.config.currencySymbols[currency] || '$'}${parseInt(specificPrice).toLocaleString()}`;
                } else {
                    el.innerHTML = specificPrice;
                }
            } else {
                // Calculate from base NGN
                const basePrice = parseInt(el.getAttribute('data-price-ngn'));
                if (!isNaN(basePrice)) {
                    const rate = this.config.exchangeRates[currency] || this.config.exchangeRates['USD'];
                    const convertedPrice = Math.ceil((basePrice * rate) / 5) * 5; // Round to nearest 5 for clean numbers
                    el.innerHTML = `${this.config.currencySymbols[currency] || currency + ' '}${convertedPrice.toLocaleString()}`;
                }
            }
        });

        // Update generic currency labels
        document.querySelectorAll('.currency-label').forEach(el => {
            el.textContent = currency;
            if (el.dataset.flag) {
                const flag = this.config.currencyFlags[currency] || '🌐';
                el.innerHTML = `<span style="margin-right:0.5rem">${flag}</span> ${currency} Pricing`;
            }
        });

        // Update manual selector if it exists
        const selectBox = document.getElementById('elitech-currency-selector');
        if (selectBox && selectBox.value !== currency) {
            selectBox.value = currency;
        }

        console.log(`Prices updated to ${currency}`);
    },

    // Inject manual currency selector widget
    setupCurrencySelector() {
        if (document.getElementById('elitech-currency-widget')) return;

        // Create floating widget
        const widget = document.createElement('div');
        widget.id = 'elitech-currency-widget';
        widget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            border-radius: 30px;
            padding: 8px 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #e5e7eb;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.3s ease;
        `;

        const sIcon = document.createElement('i');
        sIcon.className = 'fas fa-globe';
        sIcon.style.color = '#1b8aca';

        const select = document.createElement('select');
        select.id = 'elitech-currency-selector';
        select.style.cssText = `
            border: none;
            background: transparent;
            outline: none;
            cursor: pointer;
            font-weight: 600;
            color: #1f2937;
            appearance: none;
            padding-right: 15px;
            font-size: 0.95rem;
        `;

        // Create options
        const currencies = Object.keys(this.config.exchangeRates).sort();
        currencies.forEach(cur => {
            const opt = document.createElement('option');
            opt.value = cur;
            opt.textContent = `${this.config.currencyFlags[cur] || '🌐'} ${cur}`;
            select.appendChild(opt);
        });

        // Set current selection
        let current = localStorage.getItem(this.config.storageKey) || sessionStorage.getItem(this.config.storageKey) || 'NGN';
        select.value = current;

        // Down arrow icon overlay
        const caret = document.createElement('i');
        caret.className = 'fas fa-chevron-down';
        caret.style.cssText = `
            font-size: 0.75rem;
            color: #6b7280;
            margin-left: -20px;
            pointer-events: none;
        `;

        select.addEventListener('change', (e) => {
            const newCur = e.target.value;
            // Explicitly set in localStorage to override session
            localStorage.setItem(this.config.storageKey, newCur);
            this.updatePrices(newCur);
        });

        widget.appendChild(sIcon);
        widget.appendChild(select);
        widget.appendChild(caret);
        
        // Slightly subtle UI - less opaque until hovered
        widget.style.opacity = '0.9';
        widget.addEventListener('mouseenter', () => widget.style.opacity = '1');
        widget.addEventListener('mouseleave', () => widget.style.opacity = '0.9');

        document.body.appendChild(widget);
    },

    getCurrentCurrency() {
        return localStorage.getItem(this.config.storageKey) || sessionStorage.getItem(this.config.storageKey) || this.config.defaultCurrency;
    },

    convertAmount(amountNGN, targetCurrency) {
        if (!targetCurrency) targetCurrency = this.getCurrentCurrency();
        const rate = this.config.exchangeRates[targetCurrency] || 1;
        return Math.ceil(amountNGN * rate);
    }
};

// Auto-run on load
document.addEventListener('DOMContentLoaded', () => {
    PricingManager.init();
});
