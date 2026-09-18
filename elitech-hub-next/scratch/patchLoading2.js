const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/admin/page.tsx',
  'src/app/(dashboard)/admin/courses/page.tsx',
  'src/app/(dashboard)/admin/users/page.tsx',
  'src/app/(dashboard)/admin/applications/page.tsx',
  'src/app/(dashboard)/writer/posts/page.tsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('setLoading(true);') && !content.includes('setTimeout(() => setLoading(false), 4000);')) {
      content = content.replace(/setLoading\(true\);/g, 'setLoading(true);\n    setTimeout(() => setLoading(false), 4000); // Fallback to prevent infinite loading');
      fs.writeFileSync(fullPath, content);
      console.log('Patched', f);
    } else if (content.includes('const [loading, setLoading] = useState(true);')) {
      // If it doesn't have setLoading(true), just add the timeout in useEffect
      content = content.replace(/useEffect\(\(\) => \{/, 'useEffect(() => {\n    setTimeout(() => setLoading(false), 4000);');
      fs.writeFileSync(fullPath, content);
      console.log('Patched via useEffect', f);
    }
  }
});
