import jwt from 'jsonwebtoken';
import fetch from 'node-fetch'; // if node 18+, native fetch is available, but let's just use native fetch
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const token = jwt.sign(
        { writerId: '666ce0fa-6c13-4b42-b1eb-3a8b896e4886', email: 'mercy@elitechub.edu', role: 'writer' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log("Token generated.");

    try {
        const res = await fetch('https://elitech-hub.vercel.app/api/writers/seo-check', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Understanding Local SEO",
                content: "<p>This is a test post about local SEO. I need it to be at least 500 words but this is just a test.</p>",
                excerpt: "A short post about SEO."
            })
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

run();
