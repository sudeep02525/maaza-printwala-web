const fs = require('fs');
const path = require('path');
function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const srcDir = path.resolve('src');
      const fileDir = path.dirname(path.resolve(fullPath));
      let relPath = path.relative(fileDir, path.join(srcDir, 'i18n/routing.js'));
      relPath = relPath.replace(/\\/g, '/');
      if (!relPath.startsWith('.')) relPath = './' + relPath;
      let changed = false;
      if (content.includes('import Link from \'next/link\'')) {
        content = content.replace(/import Link from 'next\/link';?/g, 'import { Link } from \'' + relPath + '\';');
        changed = true;
      }
      if (content.includes('import Link from \"next/link\"')) {
        content = content.replace(/import Link from \"next\/link\";?/g, 'import { Link } from \'' + relPath + '\';');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}
replaceInDir('src');
