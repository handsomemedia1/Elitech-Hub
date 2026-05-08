const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/lenovo/OneDrive/Desktop/elitech-hub';
const DIST = path.join(ROOT, 'dist_frontend');

// 1. Find all HTML files
function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory() && !filePath.includes('dist_frontend') && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            results = results.concat(getAllHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

const htmlFiles = getAllHtmlFiles(ROOT);

console.log(`Found ${htmlFiles.length} HTML files.`);

// 2. Update LinkedIn links and Navbar Portfolio in all files
let portfolioAddedCount = 0;
let linkedinUpdatedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Update LinkedIn links
    const oldLinkedin1 = '"https://linkedin.com/company/elitechub"';
    const oldLinkedin2 = "'https://linkedin.com/company/elitechub'";
    const oldLinkedin3 = '"https://www.linkedin.com/company/elitechub"';
    const newLinkedin = '"https://www.linkedin.com/company/elitech-hub/?viewAsMember=true"';

    if (content.includes(oldLinkedin1) || content.includes(oldLinkedin2) || content.includes(oldLinkedin3)) {
        content = content.split(oldLinkedin1).join(newLinkedin);
        content = content.split(oldLinkedin2).join(newLinkedin.replace(/"/g, "'"));
        content = content.split(oldLinkedin3).join(newLinkedin);
        linkedinUpdatedCount++;
        changed = true;
    }

    // Add Portfolio to Navbar (Desktop)
    const servicesDesktopStr1 = '<a href="services.html" data-page="services"><i class="fas fa-cogs"></i> Services</a>';
    const servicesDesktopStr2 = '<a href="services.html" data-page="services"><i class="fas fa-cogs"></i>\n                            Services</a>';
    const portfolioDesktopStr = '<a href="portfolio.html" data-page="portfolio"><i class="fas fa-laptop-code"></i> Portfolio</a>';
    
    if (content.includes(servicesDesktopStr1) && !content.includes(portfolioDesktopStr)) {
        content = content.replace(servicesDesktopStr1, servicesDesktopStr1 + '\n                        ' + portfolioDesktopStr);
        changed = true;
        portfolioAddedCount++;
    } else if (content.includes(servicesDesktopStr2) && !content.includes(portfolioDesktopStr)) {
        content = content.replace(servicesDesktopStr2, servicesDesktopStr2 + '\n                        ' + portfolioDesktopStr);
        changed = true;
        portfolioAddedCount++;
    }

    // Add Portfolio to Navbar (Mobile)
    const servicesMobileStr1 = '<li><a href="services.html" class="nav-link"><i class="fas fa-cogs"></i> Services</a></li>';
    const servicesMobileStr2 = '<li><a href="services.html" class="nav-link" data-page="services"><i class="fas fa-cogs"></i>\n                                Services</a></li>';
    const portfolioMobileStr = '<li><a href="portfolio.html" class="nav-link" data-page="portfolio"><i class="fas fa-laptop-code"></i> Portfolio</a></li>';
    const portfolioMobileStrSimple = '<li><a href="portfolio.html" class="nav-link"><i class="fas fa-laptop-code"></i> Portfolio</a></li>';

    if (content.includes(servicesMobileStr1) && !content.includes('portfolio.html" class="nav-link"')) {
        content = content.replace(servicesMobileStr1, servicesMobileStr1 + '\n                        ' + portfolioMobileStrSimple);
        changed = true;
    } else if (content.includes(servicesMobileStr2) && !content.includes('portfolio.html" class="nav-link"')) {
        content = content.replace(servicesMobileStr2, servicesMobileStr2 + '\n                        ' + portfolioMobileStr);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        
        // Try updating dist_frontend as well
        const relativePath = path.relative(ROOT, file);
        const distFile = path.join(DIST, relativePath);
        if (fs.existsSync(distFile)) {
            fs.writeFileSync(distFile, content, 'utf8');
        }
    }
}

console.log(`Updated LinkedIn in ${linkedinUpdatedCount} files.`);
console.log(`Added Portfolio to navbar in ${portfolioAddedCount} files.`);

// 3. Update about.html founder and advisors
const aboutFile = path.join(ROOT, 'about.html');
let aboutContent = fs.readFileSync(aboutFile, 'utf8');

// Founder link
const founderNameStr = '<h3\n                            style="font-family: \'Space Grotesk\', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: #DC2626;">\n                            Elijah Adeyeye</h3>';
const founderLinkStr = '<h3\n                            style="font-family: \'Space Grotesk\', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; color: #DC2626;">\n                            <a href="https://elijahadeyeye.vercel.app/" target="_blank" style="color: #DC2626; text-decoration: none;">Elijah Adeyeye</a></h3>';
aboutContent = aboutContent.replace(founderNameStr, founderLinkStr);

// Dr. Kehinde Image
const kehindeDiv = `<div
                            style="width: 80px; height: 80px; background: linear-gradient(135deg, #c3151c, #ff4757); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.75rem; font-weight: 800; flex-shrink: 0;">
                            OK
                        </div>`;
const kehindeImg = `<div style="width: 80px; height: 80px; border-radius: 1rem; flex-shrink: 0; overflow: hidden; border: 2px solid #c3151c;">
                            <img src="assets/images/olasunkanmi-kehinde.png" alt="Dr. Olasunkanmi J. Kehinde" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>`;
aboutContent = aboutContent.replace(kehindeDiv, kehindeImg);

// Dr. Alonge Image
const alongeDiv = `<div
                            style="width: 80px; height: 80px; background: linear-gradient(135deg, #12346b, #1e5bb5); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.75rem; font-weight: 800; flex-shrink: 0;">
                            AA
                        </div>`;
const alongeImg = `<div style="width: 80px; height: 80px; border-radius: 1rem; flex-shrink: 0; overflow: hidden; border: 2px solid #12346b;">
                            <img src="assets/images/ayodele-alonge.png" alt="Dr. Ayodele John Alonge" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>`;
aboutContent = aboutContent.replace(alongeDiv, alongeImg);

// Yemi Adeyeye Image and Link
const yemiDiv = `<div
                            style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #34d399); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.75rem; font-weight: 800; flex-shrink: 0;">
                            YA
                        </div>`;
const yemiImg = `<div style="width: 80px; height: 80px; border-radius: 1rem; flex-shrink: 0; overflow: hidden; border: 2px solid #10b981;">
                            <img src="assets/images/yemi-adeyeye.jpg" alt="Dr. Yemi Adeyeye" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>`;
aboutContent = aboutContent.replace(yemiDiv, yemiImg);

const yemiNameStr = '<h3\n                                style="font-family: \'Montserrat\', sans-serif; font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem;">\n                                Yemi Adeyeye, Ph.D.\n                            </h3>';
const yemiLinkStr = '<h3\n                                style="font-family: \'Montserrat\', sans-serif; font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem;">\n                                <a href="https://yemiadeyeye.com/" target="_blank" style="color: #0f172a; text-decoration: none;">Yemi Adeyeye, Ph.D.</a>\n                            </h3>';
aboutContent = aboutContent.replace(yemiNameStr, yemiLinkStr);

// CEE Writing Services Partner Update
const ceePartnerDivOld = `<div
                        style="width: 100px; height: 100px; margin: 0 auto 1.5rem; background: #FFF5F5; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="assets/images/cee-partner.png" alt="CEE Writing Services" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=CEE&background=DC2626&color=fff&size=100';">
                    </div>
                    <h3
                        style="font-family: 'Space Grotesk', sans-serif; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; color: #111827;">
                        CEE Writing Services</h3>`;
const ceePartnerDivNew = `<a href="https://ceewriting.com/" target="_blank" style="display: block; text-decoration: none;">
                    <div
                        style="width: 100px; height: 100px; margin: 0 auto 1.5rem; background: #FFF5F5; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <img src="assets/images/cee-partner.png" alt="CEE Writing Services" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=CEE&background=DC2626&color=fff&size=100';">
                    </div>
                    <h3
                        style="font-family: 'Space Grotesk', sans-serif; font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; color: #111827; text-decoration: underline;">
                        CEE Writing Services</h3>
                    </a>`;
aboutContent = aboutContent.replace(ceePartnerDivOld, ceePartnerDivNew);

fs.writeFileSync(aboutFile, aboutContent, 'utf8');
fs.writeFileSync(path.join(DIST, 'about.html'), aboutContent, 'utf8');

console.log('Updated about.html with images and links for founder and advisors.');
