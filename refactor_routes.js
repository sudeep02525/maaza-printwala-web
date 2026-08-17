const fs = require('fs');

const files = [
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\ui\\MegaMenu.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\ui\\CategoryNav.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\VisualCategories.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\PromoBanners.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\HomeSections.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\HeroBanner.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\DiscoverySections.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\home\\DesignTemplates.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\common\\Header.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\common\\Footer.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\sitemap.js",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\cart\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\products\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\[slug]\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\products\\[slug]\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\app\\[locale]\\checkout\\page.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\products\\ProductCard.jsx",
  "c:\\maaza-printwala\\maaza-printwala-web\\src\\components\\products\\RecentlyViewedProducts.jsx"
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace "/all" -> "/products"
    content = content.replace(/(['"`])\/all(\/?['"`])/g, '$1/products$2');
    
    // Specifically handle href={"/all"}
    content = content.replace(/href=\{\s*(['"`])\/all(\/?['"`])\s*\}/g, 'href={$1/products$2}');
    
    // Replace product detail links
    // Old: `/${product.category?.slug || 'products'}/${id}`
    // New: `/products/${id}`
    content = content.replace(/\/\$\{\w+\.category\?\.slug\s*\|\|\s*['"`]products['"`]\}\//g, '/products/');
    
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + f);
  }
});
