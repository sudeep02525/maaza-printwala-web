const fs = require('fs');

function fixUseClient(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('use client')) {
    // Remove existing 'use client' declarations
    c = c.replace(/'use client';?\r?\n?/g, '');
    c = c.replace(/"use client";?\r?\n?/g, '');
    
    // Prepend 'use client' to the very top
    c = "'use client';\n" + c;
    fs.writeFileSync(file, c);
    console.log('Fixed:', file);
  } else {
    console.log('No use client found in:', file);
  }
}

fixUseClient('src/components/configurator/ProductGallery.jsx');
