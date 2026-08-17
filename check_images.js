const fs = require('fs');
const path = require('path');

function replaceDynamicImages(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceDynamicImages(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Ensure getImageUrl is imported if we are about to use it
      // Actually let's just log files that have 'prod.images' or 'product.images' or 'sub.image'
      if (content.match(/\w+\.images\?\.\[0\]/)) {
         console.log(fullPath);
      }
    }
  }
}
replaceDynamicImages(path.join(__dirname, 'src'));

