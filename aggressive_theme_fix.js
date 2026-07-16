const fs = require('fs');
const path = require('path');

const filesToFix = [
    'blog.html',
    'article.html',
    'lab.html',
    'research.html',
    'researcher-guidelines.html',
    'researcher.html',
    'about.html',
    'services.html',
    'css/blog-modern.css',
    'css/lab.css',
    'css/popup.css',
    'css/services.css'
];

const bgRegex = /background(-color)?:\s*(white|#ffffff|#fff|#f8fafc|#f9fafb|#f1f5f9|#F8FAFC|#F9FAFB|#F3F4F6)(?=[;!}])/gi;
const gradientRegex = /background:\s*linear-gradient\([^)]*(white|#ffffff|#fff|#f8fafc|#f9fafb|#f1f5f9|#F8FAFC|#F9FAFB|#e0e7ff|#f3e8ff)[^)]*\)(?=[;!}])/gi;
const colorDarkRegex = /color:\s*(#0A0A0A|#111111|#111|#222|#222222|#333|#333333|#1f2937|#374151|#0f172a|#1e293b|#334155|#475569|#64748b|#4b5563|#6b7280|#1e3a8a)(?=[;!}])/gi;
const borderColorRegex = /border(-[a-z]+)?:\s*([^;}]*)(#e2e8f0|#e5e7eb|#d1d5db|#f1f5f9|#E5E7EB|#E2E8F0)(?=[;!}])/gi;

filesToFix.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Replace light backgrounds with dark
    content = content.replace(bgRegex, 'background$1: #0f172a');
    
    // 2. Replace light gradients with dark gradients
    content = content.replace(gradientRegex, 'background: linear-gradient(180deg, #070d1a 0%, #0f172a 100%)');
    
    // 3. Replace dark text with light text
    content = content.replace(colorDarkRegex, (match, p1) => {
        // If it's a very dark color, make it white. If it's medium, make it light gray.
        const lower = p1.toLowerCase();
        if (['#0a0a0a', '#111111', '#111', '#222', '#222222', '#333', '#333333', '#1f2937', '#0f172a', '#1e293b'].includes(lower)) {
            return 'color: #f8fafc';
        }
        return 'color: #cbd5e1'; // Lighter gray for medium colors
    });

    // 4. Replace light borders with dark borders
    content = content.replace(borderColorRegex, (match, p1, p2) => {
        return `border${p1 || ''}: ${p2} rgba(255, 255, 255, 0.1)`;
    });

    // Handle "var(--dark)" and "var(--light)" if they exist
    content = content.replace(/background(-color)?:\s*var\(--light\)(?=[;!}])/gi, 'background$1: #0f172a');
    content = content.replace(/background(-color)?:\s*var\(--dark\)(?=[;!}])/gi, 'background$1: #070d1a');
    content = content.replace(/color:\s*var\(--dark\)(?=[;!}])/gi, 'color: #f8fafc');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
});
