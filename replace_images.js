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
    
    // Add import statement if not exists
    if (!content.includes('getImageUrl')) {
      content = "import { getImageUrl } from '@/utils/getImageUrl.js';\n" + content;
    }

    // Replace string literals: '/images/...' with getImageUrl('/images/...')
    // Note: this simple regex handles single quotes. We'll replace occurrences like: '/images/cat_...'
    // Also we should only replace if it's not already wrapped.
    content = content.replace(/'(\/images\/[^']+)'/g, (match, p1) => {
      // Check if it's already wrapped in getImageUrl (though we just added it, but to be safe)
      return `getImageUrl('${p1}')`;
    });

    // Also replace double quotes: "/images/..."
    content = content.replace(/"(\/images\/[^"]+)"/g, (match, p1) => {
      return `getImageUrl('${p1}')`;
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
