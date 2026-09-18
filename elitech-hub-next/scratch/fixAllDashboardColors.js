const fs = require('fs');
const path = require('path');

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.module.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacements = [
        { match: /background(-color)?:\s*(?:#ffffff|white);/g, replace: 'background$1: #0f172a;' },
        { match: /background(-color)?:\s*#f8fafc;/g, replace: 'background$1: #070d1a;' },
        { match: /color:\s*#0f172a;/g, replace: 'color: #ffffff;' },
        { match: /border(-bottom|-top|-left|-right)?:\s*1px solid #e2e8f0;/g, replace: 'border$1: 1px solid #1e293b;' },
        { match: /border(-bottom|-top|-left|-right)?:\s*1px solid #cbd5e1;/g, replace: 'border$1: 1px solid #1e293b;' },
        { match: /border-color:\s*#e2e8f0;/g, replace: 'border-color: #1e293b;' },
        { match: /color:\s*#334155;/g, replace: 'color: #cbd5e1;' },
        { match: /background(-color)?:\s*#f1f5f9;/g, replace: 'background$1: #1e293b;' },
        { match: /color:\s*#475569;/g, replace: 'color: #cbd5e1;' },
      ];
      
      let changed = false;
      replacements.forEach(({match, replace}) => {
        if (match.test(content)) {
          content = content.replace(match, replace);
          changed = true;
        }
      });
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, '../src/app/(dashboard)'));
