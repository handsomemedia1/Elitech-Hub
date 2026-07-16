const fs = require('fs');
let content = fs.readFileSync('programs.html', 'utf8');

// 1. Tools badges
content = content.replace(/background:\s*rgba\(220, 38, 38, 0\.2\);/g, 'background: #0f172a; border: 1px solid #ff3333;');
content = content.replace(/background:\s*rgba\(6, 182, 212, 0\.2\);/g, 'background: #0f172a; border: 1px solid #06B6D4;');
content = content.replace(/background:\s*rgba\(16, 185, 129, 0\.2\);/g, 'background: #0f172a; border: 1px solid #39ff14;');
content = content.replace(/background:\s*rgba\(139, 92, 246, 0\.2\);/g, 'background: #0f172a; border: 1px solid #8B5CF6;');
content = content.replace(/background:\s*#f8fafc;\s*color:\s*#374151;/g, 'background: #0f172a; color: #f8fafc; border: 1px solid rgba(255,255,255,0.2);'); // any remaining pills

// 2. Weeks 5-8 bright cyan background -> dark
content = content.replace(/background:\s*#06B6D4;/g, 'background: #0f172a; border: 2px solid #06B6D4;');
// And the red text on it
content = content.replace(/color:\s*#c3151c;\s*font-weight:\s*600;\s*font-size:\s*0\.875rem;/g, 'color: #38bdf8; font-weight: 600; font-size: 0.875rem;');
content = content.replace(/color:\s*#fca5a5;/g, 'color: #38bdf8;'); // Just in case it was modified to fca5a5 earlier

// 3. Industry Certifications container (light green -> dark)
content = content.replace(/background:\s*#F0FDF4;/gi, 'background: #070d1a; border: 2px solid #39ff14;');
content = content.replace(/background:\s*#f0fdf4;/gi, 'background: #070d1a; border: 2px solid #39ff14;');

// Make the text inside it lighter
content = content.replace(/color:\s*#94a3b8;\s*margin-bottom:\s*2rem;/g, 'color: #f8fafc; margin-bottom: 2rem;');

// 4. Update the actual tools text to use the neon-text class if it's the 39ff14 (green) one, 
// and a generic bright text for the others.
// Actually, let's just make sure all of them have bright text instead of `#fca5a5` (faded pink) or `#67e8f9` (faded cyan).
content = content.replace(/color:\s*#fca5a5;/g, 'color: #ff3333; font-weight: bold;');
content = content.replace(/color:\s*#67e8f9;/g, 'color: #06b6d4; font-weight: bold;');
content = content.replace(/color:\s*#6ee7b7;/g, 'color: #39ff14; font-weight: bold; text-shadow: 0 0 5px rgba(57, 255, 20, 0.4);');
content = content.replace(/color:\s*#a78bfa;/g, 'color: #8B5CF6; font-weight: bold;');

fs.writeFileSync('programs.html', content, 'utf8');
