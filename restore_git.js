const { execSync } = require('child_process');
const fs = require('fs');

try {
  const contentSlug = execSync('git show HEAD:"src/app/[locale]/[slug]/page.jsx"').toString();
  fs.writeFileSync('src/app/[locale]/[slug]/page.jsx', contentSlug);
  console.log('Restored [slug]/page.jsx');

  const contentProducts = execSync('git show HEAD:"src/app/[locale]/all/page.jsx"').toString();
  fs.writeFileSync('src/app/[locale]/products/page.jsx', contentProducts);
  console.log('Restored products/page.jsx');

  // Fix images
  let c1 = fs.readFileSync('src/app/[locale]/[slug]/page.jsx', 'utf8');
  if(!c1.includes('getImageUrl')) c1 = 'import { getImageUrl } from \'@/utils/getImageUrl.js\';\n' + c1;
  c1 = c1.replace(/src=\{prod\.images\?\.\[0\] \|\|/g, 'src={getImageUrl(prod.images?.[0]) ||');
  c1 = c1.replace(/src=\{product\.images\?\.\[0\] \|\|/g, 'src={getImageUrl(product.images?.[0]) ||');
  fs.writeFileSync('src/app/[locale]/[slug]/page.jsx', c1);

  let c2 = fs.readFileSync('src/app/[locale]/products/page.jsx', 'utf8');
  if(!c2.includes('getImageUrl')) c2 = 'import { getImageUrl } from \'@/utils/getImageUrl.js\';\n' + c2;
  c2 = c2.replace(/src=\{prod\.images\?\.\[0\] \|\|/g, 'src={getImageUrl(prod.images?.[0]) ||');
  c2 = c2.replace(/src=\{product\.images\?\.\[0\] \|\|/g, 'src={getImageUrl(product.images?.[0]) ||');
  fs.writeFileSync('src/app/[locale]/products/page.jsx', c2);

  console.log('All fixed properly!');

} catch(e) {
  console.error(e);
}
