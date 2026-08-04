const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/category/[slug]/page.jsx',
  'src/app/[locale]/category/[slug]/[subSlug]/page.jsx'
];

const newFiltersUI = `              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-6 text-[#0082CA]">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Filters</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Availability', options: ['In Stock', 'Pre-order', 'Out of Stock'] },
                    { name: 'Price', options: ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹5000', 'Above ₹5000'] },
                    { name: 'Material', options: ['Standard Paper', 'Premium Cardstock', 'Matte Finish', 'Glossy'] },
                    { name: 'Printing', options: ['Single Sided', 'Double Sided', 'Full Color', 'Black & White'] },
                    { name: 'Finish', options: ['Gloss', 'Matte', 'Spot UV', 'Foil Stamping'] },
                    { name: 'Size', options: ['Standard', 'Large', 'Custom Size'] },
                    { name: 'Color', options: ['CMYK', 'Pantone', 'Grayscale'] },
                  ].map((filter, idx) => (
                    <details key={idx} className="border-t border-slate-100 pt-4 group" open={idx < 2}>
                      <summary className="flex items-center justify-between cursor-pointer list-none mb-3 outline-none [&::-webkit-details-marker]:hidden">
                        <span className="text-sm font-bold text-slate-700 group-hover:text-[#0082CA] transition-colors">{filter.name}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0082CA] group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="flex flex-col gap-2 pl-1 pb-2">
                        {filter.options.map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0082CA] focus:ring-[#0082CA]" />
                            <span className="text-sm text-slate-600">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>`;

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find the start of the sidebar
    const sidebarStartStr = '<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">';
    const sidebarStartIndex = content.indexOf(sidebarStartStr);
    
    if (sidebarStartIndex !== -1) {
      // Find the end of this block
      // It ends where {/* RIGHT SIDE: PRODUCTS */} starts, minus the enclosing div for the left sidebar
      const rightSideIndex = content.indexOf('{/* RIGHT SIDE: PRODUCTS */}');
      
      if (rightSideIndex !== -1) {
        // We need to find the closing div of the sidebar. 
        // A simple way is to replace everything from sidebarStartIndex to just before </div>\n\n            {/* RIGHT SIDE: PRODUCTS */}
        const searchEndStr = '</div>\n\n            {/* RIGHT SIDE: PRODUCTS */}';
        const sidebarEndIndex = content.indexOf(searchEndStr, sidebarStartIndex);
        
        if (sidebarEndIndex !== -1) {
          content = content.substring(0, sidebarStartIndex) + newFiltersUI + '\n            ' + content.substring(sidebarEndIndex);
          fs.writeFileSync(fullPath, content);
          console.log(`Updated ${file}`);
        } else {
          console.log(`Could not find end of sidebar block in ${file}`);
        }
      }
    } else {
      console.log(`Sidebar start not found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
