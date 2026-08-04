const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/category/all/page.jsx',
  'src/app/[locale]/category/[slug]/page.jsx',
  'src/app/[locale]/category/[slug]/[subSlug]/page.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. Remove Filter icon
    content = content.replace(/<Filter className="w-5 h-5" \/>\s*/g, '');
    
    // 2. Add scrollbar properties to the filter box
    content = content.replace(
      /className="bg-white p-6 rounded-lg border border-slate-200 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\]"/g,
      'className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"'
    );

    // 3. Remove gap-2 from header to fix alignment after icon removal
    content = content.replace(
      /<div className="flex items-center gap-2 mb-6 text-\[#0082CA\]">/g,
      '<div className="flex items-center mb-6 text-[#0082CA]">'
    );

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
