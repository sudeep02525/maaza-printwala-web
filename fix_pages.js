const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the top level imports that got messed up
  content = content.replace(/import \{ getImageUrl \} from '@\/utils\/getImageUrl\.js';[\r\n]+import \{ getImageUrl \} from '@\/utils\/getImageUrl\.js';[\r\n]+src=\{getImageUrl\(product\.images\?\.\\\[0\\\]\) \|\| 'https:\/\/images\.unsplash\.com\/photo-1586075010923-2dd4570fb338\?auto=format&fit=crop&w=600&q=80'\}/, '');
  content = content.replace(/import \{ getImageUrl \} from '@\/utils\/getImageUrl\.js';[\r\n]+import React from 'react';[\r\n]+import React from 'react';/, "import React from 'react';\nimport { getImageUrl } from '@/utils/getImageUrl.js';");
  
  if (!content.includes('getImageUrl')) {
    content = "import { getImageUrl } from '@/utils/getImageUrl.js';\n" + content;
  }

  // Replace src={product.images?.[0] || '...'}
  content = content.replace(/src=\{product\.images\?\.\[0\] \|\| 'https:\/\/images\.unsplash\.com\/photo-1586075010923-2dd4570fb338\?auto=format&fit=crop&w=600&q=80'\}/g, "src={getImageUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'}");

  // Replace src={prod.images?.[0] || '...'}
  content = content.replace(/src=\{prod\.images\?\.\[0\] \|\| 'https:\/\/images\.unsplash\.com\/photo-1586075010923-2dd4570fb338\?auto=format&fit=crop&w=300&q=80'\}/g, "src={getImageUrl(prod.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'}");

  // The messed up line in [slug]/page.jsx at the top
  content = content.replace(/import \{ getImageUrl \} from '@\/utils\/getImageUrl\.js';\s*src=\{getImageUrl\(product\.images\?\.\[0\]\) \|\| 'https:\/\/images\.unsplash\.com\/photo-1586075010923-2dd4570fb338\?auto=format&fit=crop&w=600&q=80'\}/g, "import { getImageUrl } from '@/utils/getImageUrl.js';");

  fs.writeFileSync(filePath, content, 'utf8');
}

fixFile('c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\products\\page.jsx');
fixFile('c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\[slug]\\page.jsx');
