const fs = require('fs');
function fixUseClient(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('use client')) {
    c = c.replace(/'use client';?\r?\n?/g, '');
    c = c.replace(/"use client";?\r?\n?/g, '');
    c = "'use client';\n" + c;
    fs.writeFileSync(file, c);
  }
}
fixUseClient('src/app/[locale]/[slug]/page.jsx');
fixUseClient('src/app/[locale]/products/page.jsx');
console.log('Fixed use client directive');
