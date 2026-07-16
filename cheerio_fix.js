const fs = require('fs');
const cheerio = require('cheerio');

function fixIndexHtml() {
    let html = fs.readFileSync('index.html', 'utf8');
    const $ = cheerio.load(html);

    // Find tags that say Landing Pages, E-Commerce, Web Apps and change their style
    $('span').each((i, el) => {
        const text = $(el).text().trim();
        if (text === 'Landing Pages' || text === 'E-Commerce' || text === 'Web Apps') {
            $(el).attr('style', 'background: #0f172a; color: #f8fafc; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; border: 1px solid rgba(57, 255, 20, 0.4);');
            $(el).addClass('neon-text');
        }
    });

    // Fix Security-First Approach and other small purple text
    $('p').each((i, el) => {
        const style = $(el).attr('style');
        if (style && style.includes('color: #8B5CF6') && style.includes('0.8rem')) {
            $(el).addClass('neon-text');
            $(el).attr('style', style.replace('color: #8B5CF6;', 'color: #39ff14;')); // Ensure the inline color is overriden if needed, though class has !important
        }
    });

    fs.writeFileSync('index.html', $.html(), 'utf8');
    console.log('Fixed index.html');
}

function fixProgramsHtml() {
    let html = fs.readFileSync('programs.html', 'utf8');
    const $ = cheerio.load(html);

    // Fix Weeks 5-8 background
    $('div').each((i, el) => {
        const style = $(el).attr('style');
        if (style && style.includes('background: linear-gradient(135deg, #06B6D4, #0891B2)')) {
            $(el).attr('style', 'background: #0f172a; padding: 2rem; border: 2px solid #06B6D4; border-radius: 1rem;');
        }
        // Fix the Penetration testing text (red -> bright cyan)
        if ($(el).text().includes('Penetration testing, web app hacking')) {
            if (style && style.includes('color: #64748b')) {
                $(el).attr('style', 'color: #38bdf8; font-size: 0.875rem; font-weight: bold;');
            }
        }
    });

    // Fix Tools Badges
    $('div').each((i, el) => {
        const style = $(el).attr('style');
        if (style && style.includes('background: rgba(220, 38, 38, 0.2)')) {
            $(el).attr('style', style.replace('background: rgba(220, 38, 38, 0.2)', 'background: #0f172a; border: 1px solid #ff3333;'));
            $(el).find('span, p, h6, div, i').css('color', '#ff3333');
            $(el).find('span, p, h6, div').css('font-weight', 'bold');
        }
        if (style && style.includes('background: rgba(6, 182, 212, 0.2)')) {
            $(el).attr('style', style.replace('background: rgba(6, 182, 212, 0.2)', 'background: #0f172a; border: 1px solid #06B6D4;'));
            $(el).find('span, p, h6, div, i').css('color', '#06B6D4');
            $(el).find('span, p, h6, div').css('font-weight', 'bold');
        }
        if (style && style.includes('background: rgba(16, 185, 129, 0.2)')) {
            $(el).attr('style', style.replace('background: rgba(16, 185, 129, 0.2)', 'background: #0f172a; border: 1px solid #39ff14;'));
            $(el).find('span, p, h6, div, i').addClass('neon-text');
        }
        if (style && style.includes('background: rgba(139, 92, 246, 0.2)')) {
            $(el).attr('style', style.replace('background: rgba(139, 92, 246, 0.2)', 'background: #0f172a; border: 1px solid #8B5CF6;'));
            $(el).find('span, p, h6, div, i').css('color', '#8B5CF6');
            $(el).find('span, p, h6, div').css('font-weight', 'bold');
        }
        
        // Any remaining light pills inside "Tools & Technologies You'll Master"
        // E.g. Splunk & Log Analysis
        if (style && style.includes('background: #fca5a5')) { // this was for text, but wait... 
            // In the screenshot, Splunk has a light red background.
        }
        if (style && style.includes('background: #f8fafc') && $(el).text().includes('Splunk')) {
           // Actually, earlier the node script might have made them dark. Let's just catch anything with light backgrounds.
        }
    });
    
    // Explicitly target the badges by their text
    const tools = ['Kali Linux', 'Nmap & Wireshark', 'Metasploit', 'Burp Suite', 'Nessus', 'Splunk'];
    $('div').each((i, el) => {
        const text = $(el).text();
        const style = $(el).attr('style');
        tools.forEach(t => {
            if (text.includes(t) && style && (style.includes('background: #') || style.includes('background: rgba'))) {
                // If it's the wrapper div for the badge, make it dark
                if ($(el).children().length > 0 && style.includes('padding') && style.includes('border-radius')) {
                    // Check if it's currently light or pastel
                    $(el).attr('style', 'background: #0f172a; border: 1px solid rgba(255,255,255,0.2); border-radius: 0.75rem; padding: 1rem; display: flex; align-items: center; gap: 0.75rem;');
                    $(el).find('div, p, h6, span').css('color', '#f8fafc');
                    $(el).find('i').addClass('neon-text');
                }
            }
        });
    });

    // Fix Industry Certifications Preparation background
    $('div').each((i, el) => {
        const style = $(el).attr('style');
        if (style && style.includes('border: 2px solid #10B981')) { // The one I mistakenly made double borders earlier
            $(el).attr('style', 'background: #070d1a; border: 2px solid #39ff14; border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);');
            $(el).addClass('neon-box');
        }
        // If it still has pastel green F0FDF4
        if (style && style.includes('background: #F0FDF4')) {
            $(el).attr('style', 'background: #070d1a; border: 2px solid #39ff14; border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);');
        }
    });

    fs.writeFileSync('programs.html', $.html(), 'utf8');
    console.log('Fixed programs.html');
}

fixIndexHtml();
fixProgramsHtml();
