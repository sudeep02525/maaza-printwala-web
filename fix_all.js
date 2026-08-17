const fs = require('fs');

const fixAllQueryStringLinks = (file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\/all\?search=/g, '/products?search=');
    content = content.replace(/\/all\?category=/g, '/products?category=');
    content = content.replace(/\/all\?need=/g, '/products?need=');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed /all? in ' + file);
  }
};

fixAllQueryStringLinks('c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\common\\Header.jsx');
fixAllQueryStringLinks('c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\DiscoverySections.jsx');
