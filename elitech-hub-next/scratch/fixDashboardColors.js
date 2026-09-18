const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/admin/users/users.module.css',
  'src/app/(dashboard)/writer/writer.module.css'
];

const replacements = [
  { match: /background(-color)?:\s*(?:#ffffff|white);/g, replace: 'background$1: #0f172a;' },
  { match: /background(-color)?:\s*#f8fafc;/g, replace: 'background$1: #070d1a;' },
  { match: /color:\s*#0f172a;/g, replace: 'color: #ffffff;' },
  { match: /border(-bottom)?:\s*1px solid #e2e8f0;/g, replace: 'border$1: 1px solid #1e293b;' },
  { match: /border:\s*1px solid #cbd5e1;/g, replace: 'border: 1px solid #1e293b;' },
  { match: /color:\s*#334155;/g, replace: 'color: #cbd5e1;' },
  { match: /background:\s*#f1f5f9;/g, replace: 'background: #1e293b;' },
  { match: /color:\s*#475569;/g, replace: 'color: #cbd5e1;' },
];

files.forEach(file => {
  const filePath = path.join('C:/Users/lenovo/OneDrive/Desktop/elitech-hub/elitech-hub-next', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(({match, replace}) => {
      content = content.replace(match, replace);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
