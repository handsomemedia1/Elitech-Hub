import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to an empty page on the correct origin (elitechub.com) just to have the right origin context, or just evaluate.
    // Actually, we can just intercept or evaluate directly. 
    // Wait, testing from page.evaluate doesn't have an origin unless we navigate.
    await page.goto('https://elitechub.com', { waitUntil: 'networkidle2' }).catch(() => {});

    try {
        const result = await page.evaluate(async () => {
            try {
                const API_URL = 'https://elitech-hub.vercel.app/api';
                const response = await fetch(`${API_URL}/writers/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: "mercy@elitechub.edu", password: "somepassword" })
                });
                
                return {
                    ok: response.ok,
                    status: response.status,
                    body: await response.text()
                };
            } catch (err) {
                return {
                    error: true,
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                };
            }
        });
        
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error("Puppeteer evaluate error:", err);
    }

    await browser.close();
})();
