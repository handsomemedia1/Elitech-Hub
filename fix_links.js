const fs = require('fs');
const file = 'article.html';
let content = fs.readFileSync(file, 'utf8');

const targetContent = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/core.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/navbar.css">
    <link rel="stylesheet" href="css/blog-post.css?v=2.1">
    <link rel="stylesheet" href="css/article-layout.css">
    <link rel="stylesheet" href="css/popup.css">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" id="og-title" content="Article - Elitech Hub">`;

// Search for where <link rel="preconnect" href="https://fonts.googleapis.com"> starts and where <meta property="og:description" id="og-description" content=""> starts
const startIndex = content.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com">');
const endIndex = content.indexOf('<meta property="og:description" id="og-description" content="">');

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + targetContent + '\n    ' + content.substring(endIndex);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed CSS links');
} else {
    console.log('Markers not found');
}
