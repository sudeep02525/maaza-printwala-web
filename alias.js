const fs = require('fs');
const path = require('path');

const srcFolders = ['components', 'config', 'hooks', 'lib', 'store', 'providers', 'i18n', 'messages'];

function convertToAlias(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      convertToAlias(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import ')) {
          for (const folder of srcFolders) {
            // matches from '../../components/..
            const regex = new RegExp(`(from |import )['"](\\.\\.\\/)+(\\.\\/)*${folder}`, 'g');
            if (regex.test(lines[i])) {
              lines[i] = lines[i].replace(regex, `$1'@/${folder}`);
              changed = true;
            }
          }
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, lines.join('\n'));
        console.log('Fixed aliases in ' + fullPath);
      }
    }
  }
}

convertToAlias('src');
