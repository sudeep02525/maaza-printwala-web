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
    
    // Replace specific category links
    newContent = newContent.replace(/href="\/products\?category=([^"]+)"/g, 'href="/category/$1"');
    newContent = newContent.replace(/href=\{\`\/products\?category=\$\{([^}]+)\}\`/g, 'href={`/category/${$1}`}');

    // Replace generic product links to 'all' or similar
    newContent = newContent.replace(/href="\/products"/g, 'href="/category/all"');
    
    // Also check for dynamic links with only /products
    newContent = newContent.replace(/href=\{\`\/products\`/g, 'href={`/category/all`');

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  });
});
