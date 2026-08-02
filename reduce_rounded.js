const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('src', (err, results) => {
  if (err) throw err;
  results.filter(f => f.endsWith('.jsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    
    // Normalize custom pixel border-radii
    newContent = newContent.replace(/rounded-\[20px\]/g, 'rounded-lg');
    newContent = newContent.replace(/rounded-\[24px\]/g, 'rounded-lg');
    newContent = newContent.replace(/rounded-\[18px\]/g, 'rounded-lg');
    newContent = newContent.replace(/rounded-\[32px\]/g, 'rounded-lg');
    
    // Normalize directional rounded classes
    newContent = newContent.replace(/rounded-l-xl/g, 'rounded-l-lg');
    newContent = newContent.replace(/rounded-r-xl/g, 'rounded-r-lg');
    
    // In case there are more
    newContent = newContent.replace(/rounded-xl/g, 'rounded-lg');
    newContent = newContent.replace(/rounded-2xl/g, 'rounded-lg');
    newContent = newContent.replace(/rounded-3xl/g, 'rounded-lg');

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});
