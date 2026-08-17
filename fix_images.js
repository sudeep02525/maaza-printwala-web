const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, 'src', 'app', '[locale]', 'page.jsx'),
  path.join(__dirname, 'src', 'components', 'home', 'ExploreCategories.jsx'),
  path.join(__dirname, 'src', 'components', 'home', 'HomeSections.jsx'),
  path.join(__dirname, 'src', 'components', 'home', 'VisualCategories.jsx')
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix 'use client' directive issue
    const useClientRegex = /import \{ getImageUrl \} from '@\/utils\/getImageUrl\.js';\r?\n'use client';/;
    if (useClientRegex.test(content)) {
      content = content.replace(useClientRegex, "'use client';\nimport { getImageUrl } from '@/utils/getImageUrl.js';");
    }

    // 2. Fix JSX attribute missing braces: src=getImageUrl(...) -> src={getImageUrl(...)}
    // or img: getImageUrl(...) -> img: getImageUrl(...) this is valid object syntax so it's fine.
    // The issue is ONLY for JSX attributes: name=value without quotes or braces.
    // Specifically: src=getImageUrl(...) and image=getImageUrl(...) or similar
    
    // Replace src=getImageUrl('...') with src={getImageUrl('...')}
    content = content.replace(/src=getImageUrl\('([^']+)'\)/g, "src={getImageUrl('$1')}");
    content = content.replace(/src=getImageUrl\("([^"]+)"\)/g, "src={getImageUrl('$1')}");

    // Replace image=getImageUrl('...') with image={getImageUrl('...')} (if any)
    content = content.replace(/image=getImageUrl\('([^']+)'\)/g, "image={getImageUrl('$1')}");
    content = content.replace(/image=getImageUrl\("([^"]+)"\)/g, "image={getImageUrl('$1')}");

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}
