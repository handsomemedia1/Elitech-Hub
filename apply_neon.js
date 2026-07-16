const fs = require('fs');

function applyNeon(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Make pill backgrounds dark and add neon border
    content = content.replace(/background:\s*#f8fafc;\s*color:\s*#374151;/gi, 'background: #0f172a; color: #f8fafc; border: 1px solid rgba(255,255,255,0.1);');
    
    // Convert small subheadings to neon
    content = content.replace(/style="[^"]*color:\s*#(8B5CF6|008751);?[^"]*"/gi, (match) => {
        // Just inject the class, but we need to do it by finding the tag.
        // It's easier to just replace the whole tag.
        return match; 
    });

    // Specifically target the "Security-First Approach" etc
    content = content.replace(/<p style="font-size:\s*0\.8rem;\s*color:\s*#(8B5CF6|008751)[^>]*>(.*?)<\/p>/gi, '<p class="neon-text" style="font-size: 0.8rem; margin: 0;">$2</p>');
    content = content.replace(/<p style="font-size:\s*0\.8rem;\s*font-weight:\s*600;\s*color:\s*#8B5CF6;\s*text-transform:\s*uppercase[^>]*>(.*?)<\/p>/gi, '<p class="neon-text" style="font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase;">$1</p>');
    content = content.replace(/<p style="font-size:\s*0\.8rem;\s*color:\s*#38bdf8[^>]*>(.*?)<\/p>/gi, '<p class="neon-text" style="font-size: 0.8rem; margin: 0;">$1</p>');

    fs.writeFileSync(file, content, 'utf8');
}

applyNeon('index.html');
applyNeon('programs.html');
