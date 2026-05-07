const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const BLOG_DIR = path.join(ROOT_DIR, 'blog-posts');

// 1. Rename the scholarship template file
const oldFile = path.join(BLOG_DIR, 'scholarship-template-example.html');
const newFile = path.join(BLOG_DIR, 'cybersecurity-scholarship-template-africa.html');
if (fs.existsSync(oldFile)) {
    fs.renameSync(oldFile, newFile);
    console.log(`Renamed scholarship-template-example.html to cybersecurity-scholarship-template-africa.html`);
}

// Helper to get all HTML files
function getAllHtmlFiles() {
    let files = [];
    const rootFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html')).map(f => path.join(ROOT_DIR, f));
    files.push(...rootFiles);
    
    if (fs.existsSync(BLOG_DIR)) {
        const blogFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html')).map(f => path.join(BLOG_DIR, f));
        files.push(...blogFiles);
    }
    return files;
}

const allHtmlFiles = getAllHtmlFiles();

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 2. Update all internal links to the old file
    content = content.replace(/scholarship-template-example\.html/g, 'cybersecurity-scholarship-template-africa.html');

    // 3. Find <meta name="description" content="..."> and replace "Nigeria" with "Africa"
    // We use a regex with a replacer function to only replace "Nigeria" inside the content attribute of meta description
    const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/gi;
    content = content.replace(metaDescRegex, (match, p1) => {
        let newContent = p1.replace(/Nigeria/gi, 'Africa');
        return match.replace(p1, newContent);
    });

    // 4. Update specific pages with High-CTR copy
    const basename = path.basename(file);
    if (basename === 'get-involved.html') {
        content = content.replace(/<title>.*?<\/title>/i, '<title>Join Elitech Hub — Volunteer & Partner in Cybersecurity Across Africa</title>');
        content = content.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, '<meta name="description" content="Partner with Africa’s fastest-growing cybersecurity hub. Volunteer, mentor, or collaborate with Elitech Hub to secure the continent’s digital future. Discover opportunities today.">');
    } 
    else if (basename === 'apply.html') {
        content = content.replace(/<title>.*?<\/title>/i, '<title>Apply Now — Only 12 Seats Left for Next Cybersecurity Cohort</title>');
        content = content.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, '<meta name="description" content="Fast-track your tech career with Elitech Hub\'s intensive cybersecurity programs. Guaranteed internships and hands-on training. Secure your spot before the next cohort fills up.">');
    }
    else if (basename === 'cybersecurity-scholarship-template-africa.html') {
        content = content.replace(/<title>.*?<\/title>/i, '<title>The Ultimate Cybersecurity Scholarship Application Template for African Students</title>');
        content = content.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i, '<meta name="description" content="Download our proven, high-converting scholarship template. Designed specifically for African students applying to global cybersecurity programs. Stop getting rejected and start winning funding.">');
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated meta tags in: ${basename}`);
    }
});

console.log('✅ Meta tags update and file rename complete.');
