/**
 * Pricing Manager
 * Handles automatic currency detection and price updates based on user location
 */

const PricingManager = {
    // Configuration
    config: {
        apiEndpoint: 'https://ipapi.co/json/',
        defaultCurrency: 'NGN',
        storageKey: 'elitech_user_currency',
        storageLocationKey: 'elitech_user_location',
        exchangeRates: {
            'NGN': 1,       // Base
            'USD': 0.00065, // 1 NGN -> USD (Approx 1500 NGN = 1 USD)
            'GBP': 0.00051, // 1 NGN -> GBP (Approx 1950 NGN = 1 GBP)
            'EUR': 0.00060  // 1 NGN -> EUR (Approx 1650 NGN = 1 EUR)
        },
        currencySymbols: {
            'NGN': '₦',
            'USD': '$',
            'GBP': '£',
            'EUR': '€'
        }
    },

    // Initialize
    init() {
        this.detectLocation();
        this.setupCurrencySelector();
    },

    // Detect user location
    async detectLocation() {
        // Check if we already have a stored currency preference
        const storedCurrency = localStorage.getItem(this.config.storageKey);
        if (storedCurrency) {
            this.updatePrices(storedCurrency);
            return;
        }

        try {
            // Fetch location from IP
            const response = await fetch(this.config.apiEndpoint);
            const data = await response.json();

            let currency = 'NGN'; // Default

            // Determine currency based on country code
            if (data.country_code) {
                switch (data.country_code) {
                    case 'NG':
                        currency = 'NGN';
                        break;
                    case 'GB':
                        currency = 'GBP';
                        break;
                    case 'US':
                        currency = 'USD';
                        break;
                    // EU Countries
                    case 'DE': case 'FR': case 'IT': case 'ES': case 'NL': case 'BE':
                    case 'AT': case 'IE': case 'FI': case 'PT': case 'GR':
                        currency = 'EUR';
                        break;
                    default:
                        // Default to USD for rest of world (except Nigeria)
                        currency = 'USD';
                        break;
                }
            }

            // Save preference
            localStorage.setItem(this.config.storageKey, currency);
            localStorage.setItem(this.config.storageLocationKey, JSON.stringify({
                country: data.country_name,
                code: data.country_code
            }));

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
            // Check if specific price is defined for this currency
            const specificPrice = el.getAttribute(`data-price-${currency.toLowerCase()}`);

            if (specificPrice) {
                // Check if it's a simple number (digits only)
                if (/^\d+$/.test(specificPrice)) {
                    el.innerHTML = `${this.config.currencySymbols[currency]}${parseInt(specificPrice).toLocaleString()}`;
                } else {
                    // It's a complex string (range, or already formatted). Use as is.
                    el.innerHTML = specificPrice;
                }
            } else {
                // Calculate from base NGN
                const basePrice = parseInt(el.getAttribute('data-price-ngn'));
                if (!isNaN(basePrice)) {
                    const rate = this.config.exchangeRates[currency];
                    const convertedPrice = Math.ceil((basePrice * rate) / 5) * 5; // Round to nearest 5
                    el.innerHTML = `${this.config.currencySymbols[currency]}${convertedPrice.toLocaleString()}`;
                }
            }
        });

        // Update any currency labels
        document.querySelectorAll('.currency-label').forEach(el => {
            el.textContent = currency;

            // Adjust flag if present
            if (el.dataset.flag) {
                let flag = '🇳🇬';
                if (currency === 'USD') flag = '🇺🇸';
                else if (currency === 'GBP') flag = '🇬🇧';
                else if (currency === 'EUR') flag = '🇪🇺';

                el.innerHTML = `<span style="margin-right:0.5rem">${flag}</span> ${currency} Pricing`;
            }
        });

        console.log(`Prices updated to ${currency}`);
    },

    // Manual currency selector (optional)
    setupCurrencySelector() {
        // Can be called to bind a dropdown if added later
    },

    // Helper to get current currency
    getCurrentCurrency() {
        return localStorage.getItem(this.config.storageKey) || this.config.defaultCurrency;
    },

    // Convert a specific amount
    convertAmount(amountNGN, targetCurrency) {
        if (!targetCurrency) targetCurrency = this.getCurrentCurrency();
        return Math.ceil(amountNGN * this.config.exchangeRates[targetCurrency]);
    }
};

// Auto-run on load
document.addEventListener('DOMContentLoaded', () => {
    PricingManager.init();
});
