const { execSync } = require('child_process');
const fs = require('fs');

let content = execSync('git show HEAD:"src/components/configurator/ProductGallery.jsx"').toString();

// Fix use client
content = content.replace(/'use client';?\r?\n?/g, '');
content = content.replace(/"use client";?\r?\n?/g, '');
content = "'use client';\n" + content;

// Add import if missing
if (!content.includes('getImageUrl')) {
  content = content.replace("'use client';\n", "'use client';\nimport { getImageUrl } from '@/utils/getImageUrl.js';\n");
}

// Wrap images
content = content.replace(/src=\{images\[activeIdx\]\?\.url \|\| images\[0\]\?\.url\}/g, 'src={getImageUrl(images[activeIdx]?.url || images[0]?.url)}');
content = content.replace(/backgroundImage: `url\(\$\{images\[activeIdx\]\?\.url \|\| images\[0\]\?\.url\}\)`/g, 'backgroundImage: `url(${getImageUrl(images[activeIdx]?.url || images[0]?.url)})`');

// Already wrapped maybe
// content = content.replace(/<img src=\{getImageUrl\(img\.url\)\}/g, '<img src={getImageUrl(img.url)}');

fs.writeFileSync('src/components/configurator/ProductGallery.jsx', content);
console.log('Restored and fixed ProductGallery.jsx completely');
