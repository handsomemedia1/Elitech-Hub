const fs = require('fs');

const file = 'css/article-layout.css';
let content = fs.readFileSync(file, 'utf8');

// 1. Make Title Bigger
content = content.replace(
    'font-size: clamp(3rem, 6vw, 4.5rem);',
    'font-size: clamp(3.5rem, 8vw, 5.5rem);'
);

// 2. Widen the layout to push sidebar far right and expand text column
content = content.replace(
    'max-width: 1400px;',
    'max-width: 1600px;'
);
content = content.replace(
    'max-width: 950px;',
    'max-width: 1100px;'
);

// 3. Widen the hero content wrapper so the large title fits better
content = content.replace(
    'max-width: 1000px;',
    'max-width: 1400px;'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated article-layout.css');
