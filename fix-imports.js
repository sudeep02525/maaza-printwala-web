const fs = require('fs');
const path = require('path');

function fixImportsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import ') && lines[i].includes('from \'../')) {
          lines[i] = lines[i].replace(/from '(\.\.\/)+/, (match) => {
             return match.replace(/'/, "'../");
          });
          changed = true;
        } else if (lines[i].includes('import ') && lines[i].includes('from \"../')) {
          lines[i] = lines[i].replace(/from \"(\.\.\/)+/, (match) => {
             return match.replace(/\"/, "\"../");
          });
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, lines.join('\n'));
        console.log('Fixed imports in ' + fullPath);
      }
    }
  }
}

fixImportsInDir('src/app/[locale]');
