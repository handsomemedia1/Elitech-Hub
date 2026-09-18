const fs = require('fs');
const path = require('path');

function processDir(dir, basePath) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!entry.name.startsWith('(') && !entry.name.startsWith('_')) {
                processDir(fullPath, basePath + '/' + entry.name);
            } else {
                processDir(fullPath, basePath);
            }
        } else if (entry.name === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            let routePath = basePath || '/';
            
            // Handle dynamic routes like [slug]
            // For SEO canonicals, a dynamic route should ideally generate its canonical in generateMetadata, 
            // but for static pages we can just inject alternates.
            
            if (content.includes('export const metadata')) {
                if (!content.includes('alternates: {') && !content.includes('canonical:')) {
                    content = content.replace(
                        /export const metadata(: Metadata)? = \{/, 
                        xport const metadata = {\n  alternates: { canonical: '' },
                    );
                    fs.writeFileSync(fullPath, content);
                    console.log('Updated: ' + fullPath + ' -> ' + routePath);
                }
            }
        }
    }
}

processDir(path.join(__dirname, 'src', 'app'), '');
