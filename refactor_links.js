const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/components/ui/MegaMenu.jsx',
  'src/components/home/DiscoverySections.jsx',
  'src/components/common/Header.jsx',
  'src/components/common/Footer.jsx',
  'src/app/sitemap.js',
  'src/app/[locale]/page.jsx',
  'src/app/[locale]/category/[slug]/page.jsx',
  'src/app/[locale]/category/[slug]/[subSlug]/page.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace exact /products
    content = content.replace(/['"`]\/products['"`]/g, '"/category/all"');
    
    // Replace /products?
    content = content.replace(/\/products\?/g, '/category/all?');
    
    // Exception for MegaMenu active check
    content = content.replace(/pathname === '\/products'/g, "pathname === '/category/all'");

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

// Now move the page.jsx
const oldPagePath = path.join(__dirname, 'src/app/[locale]/products/page.jsx');
const newDirPath = path.join(__dirname, 'src/app/[locale]/category/all');
const newPagePath = path.join(newDirPath, 'page.jsx');

if (fs.existsSync(oldPagePath)) {
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath, { recursive: true });
  }
  
  let pageContent = fs.readFileSync(oldPagePath, 'utf8');
  pageContent = pageContent.replace(/router\.push\(`\/products\?/g, 'router.push(`/category/all?');
  
  fs.writeFileSync(newPagePath, pageContent);
  fs.unlinkSync(oldPagePath);
  console.log('Moved products/page.jsx to category/all/page.jsx and updated it.');
} else {
  console.log('products/page.jsx not found');
}
