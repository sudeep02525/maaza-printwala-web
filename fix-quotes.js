const fs = require('fs');
const path = require('path');

function fixQuotes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixQuotes(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content.replace(/from '@\/([^"']+)"/g, "from '@/$1'");
      newContent = newContent.replace(/import '@\/([^"']+)"/g, "import '@/$1'");
      newContent = newContent.replace(/from "@\/([^"']+)'/g, "from '@/$1'");
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed quotes in ' + fullPath);
      }
    }
  }
}

fixQuotes('src');
