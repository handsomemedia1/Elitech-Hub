const fs = require('fs');
const path = require('path');

const pagesToPatch = [
  'src/app/(dashboard)/admin/page.tsx',
  'src/app/(dashboard)/admin/courses/page.tsx',
  'src/app/(dashboard)/admin/users/page.tsx',
  'src/app/(dashboard)/admin/applications/page.tsx',
  'src/app/(dashboard)/writer/posts/page.tsx'
];

pagesToPatch.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add a safety timeout to useEffect
    // Find the useEffect that calls fetchX() and has an empty dependency array
    if (content.includes('setLoading(true);') || content.includes('setLoading(false)')) {
      // We can just inject a global safety timeout in the component body
      // But it's safer to just replace useEffect(() => {
      
      if (!content.includes('const timeoutId = setTimeout(')) {
        content = content.replace(/useEffect\(\(\) => \{\n\s+([a-zA-Z0-9_]+)\(\);\n\s+\}, \[\]\);/g, 
`useEffect(() => {
    $1();
    // Safety timeout to prevent infinite loading if Supabase is paused
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);`);
      }
      
      fs.writeFileSync(fullPath, content);
      console.log(`Patched ${pagePath}`);
    }
  }
});
