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
    
    // Remove sticky behavior
    content = content.replace(
      /className="w-full lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-24 lg:z-20"/g,
      'className="w-full lg:w-64 shrink-0 space-y-6"'
    );
    
    // Also remove the scrollbar from the box because it looks weird if it's not sticky
    content = content.replace(
      /className="bg-white p-6 rounded-lg border border-slate-200 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] max-h-\[calc\(100vh-8rem\)\] overflow-y-auto \[\&::-webkit-scrollbar\]:w-1\.5 \[\&::-webkit-scrollbar-track\]:bg-transparent \[\&::-webkit-scrollbar-thumb\]:bg-slate-200 \[\&::-webkit-scrollbar-thumb\]:rounded-full"/g,
      'className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"'
    );

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
