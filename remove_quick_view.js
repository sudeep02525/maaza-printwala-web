const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/category/all/page.jsx',
  'src/app/[locale]/category/[slug]/page.jsx',
  'src/app/[locale]/category/[slug]/[subSlug]/page.jsx'
];

const overlayButtonRegex = /\{\/\*\s*Quick View Overlay Button\s*\*\/\}\s*<div className="absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">\s*<button[\s\S]*?<\/button>\s*<\/div>/g;

const listButtonRegex = /<button\s*onClick=\{\(\)\s*=>\s*setQuickViewProduct\(prod\)\}[\s\S]*?<\/button>/g;

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    content = content.replace(overlayButtonRegex, '');
    content = content.replace(listButtonRegex, '');

    fs.writeFileSync(fullPath, content);
    console.log(`Removed quick view buttons from ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
