/**
 * Elitech Hub Site Settings Loader
 * 
 * Loads dynamic settings configured in the admin panel 
 * (Cohort Date and Program Prices) from localStorage and
 * applies them to the current page.
 */
document.addEventListener('DOMContentLoaded', () => {
    applySiteSettings();
});

function applySiteSettings() {
    try {
        // 1. Apply Cohort Date
        const cohortData = localStorage.getItem('elitechub_cohort');
        if (cohortData) {
            const cohort = JSON.parse(cohortData);
            const cohortString = `${cohort.month} ${cohort.year}`;

            // Directly update the cohort date element in the hero card
            const cohortDateEl = document.getElementById('cohort-date-text');
            if (cohortDateEl) {
                cohortDateEl.textContent = cohortString;
            }

            // Also handle any other pages that display "Next Cohort:" text
            document.querySelectorAll('.hero-date, .cohort-date-text, p').forEach(el => {
                if (el.tagName === 'P' && el.innerHTML.includes('Next Cohort:')) {
                    el.innerHTML = el.innerHTML.replace(/Next Cohort:.*?<\/strong>/, `Next Cohort: <strong>${cohortString}</strong>`);
                }
            });
        }

        // 2. Apply Prices
        const priceData = localStorage.getItem('elitechub_prices');
        if (priceData) {
            const prices = JSON.parse(priceData);

            // Apply Bootcamp Prices
            if (prices.bootcamp) {
                updatePricesByDataAttribute('bootcamp', prices.bootcamp);
            }

            // Apply Professional Program Prices
            if (prices.professional) {
                updatePricesByDataAttribute('professional', prices.professional);
            }

            // Handle static text replacements containing original prices
            // Look for "75,000 Naira" and "200,000 Naira"
            if (prices.bootcamp && prices.bootcamp.ngn) {
                const formattedBootcampPrice = parseInt(prices.bootcamp.ngn).toLocaleString();
                replaceTextInElements('75,000 Naira', `${formattedBootcampPrice} Naira`);
                // Also update the hero stat price if applicable
                replaceTextInElements('₦200K', `₦${(parseInt(prices.professional.ngn) / 1000)}K`);
            }

            if (prices.professional && prices.professional.ngn) {
                const formattedProPrice = parseInt(prices.professional.ngn).toLocaleString();
                replaceTextInElements('200,000 Naira', `${formattedProPrice} Naira`);
            }
        }
    } catch (error) {
        console.error("Error applying site settings:", error);
    }
}

function updatePricesByDataAttribute(programType, programPrices) {
    // This assumes specific selectors if the HTML adds classes or attributes
    // In many themes, prices are output directly in elements with specific IDs or classes
    // We will look for elements that might hold prices for these programs

    // Example: If the site uses a generic currency switcher, it might use data attributes
    // like data-price-ngn="75000"

    // We'll update the data attributes first so any currency switcher logic picks up the new prices
    document.querySelectorAll(`[data-program="${programType}"]`).forEach(el => {
        if (programPrices.ngn && el.hasAttribute('data-price-ngn')) el.setAttribute('data-price-ngn', programPrices.ngn);
        if (programPrices.usd && el.hasAttribute('data-price-usd')) el.setAttribute('data-price-usd', programPrices.usd);
        if (programPrices.gbp && el.hasAttribute('data-price-gbp')) el.setAttribute('data-price-gbp', programPrices.gbp);
        if (programPrices.eur && el.hasAttribute('data-price-eur')) el.setAttribute('data-price-eur', programPrices.eur);
    });
}

function replaceTextInElements(searchText, replaceText) {
    // A safe way to replace text in text nodes without breaking HTML
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue.includes(searchText)) {
            node.nodeValue = node.nodeValue.replace(searchText, replaceText);
        }
    }
}
