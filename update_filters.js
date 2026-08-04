const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/[locale]/category/all/page.jsx',
  'src/app/[locale]/category/[slug]/page.jsx',
  'src/app/[locale]/category/[slug]/[subSlug]/page.jsx'
];

const newFiltersUI = `            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-6 text-[#0082CA]">
                <Filter className="w-5 h-5" />
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

const newSortingUI = `                 {/* Sorting */}
                 <div className="flex items-center gap-2 cursor-pointer group relative bg-white border border-slate-200 px-4 py-2 rounded-lg hover:border-[#0082CA] transition-colors">
                   <span className="text-sm font-bold text-slate-500">Sort By:</span>
                   <span className="text-sm font-bold text-slate-900 group-hover:text-[#0082CA] transition-colors">
                     {sortBy === 'popular' ? 'Popularity' : sortBy === 'newest' ? 'Newest' : sortBy === 'price_asc' ? 'Price Low' : sortBy === 'price_desc' ? 'Price High' : sortBy === 'best_selling' ? 'Best Selling' : sortBy === 'rating' ? 'Rating' : 'Popularity'}
                   </span>
                   <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                   <select 
                     value={sortBy} 
                     onChange={(e) => setSortBy(e.target.value)}
                     className="absolute inset-0 opacity-0 cursor-pointer w-full"
                   >
                     <option value="popular">Popularity</option>
                     <option value="newest">Newest</option>
                     <option value="price_asc">Price Low</option>
                     <option value="price_desc">Price High</option>
                     <option value="best_selling">Best Selling</option>
                     <option value="rating">Rating</option>
                   </select>
                 </div>`;

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace sidebar filters block
    const sidebarStartStr = '<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">';
    const sidebarEndStr = '</div>\n            </div>'; // End of the filter box
    const quickLinksStartStr = '<div className="bg-[#0082CA]/5 p-5 rounded-lg border border-[#0082CA]/10">';
    const quickLinksEndStr = '</ul>\n            </div>'; // End of quick links

    // A simpler way: we know it starts at `sidebarStartStr` and ends just before `</div>\n\n          {/* RIGHT SIDE`
    // Let's use regex
    const regexSidebar = /<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\]">[\s\S]*?<\/ul>\s*<\/div>/g;
    
    content = content.replace(regexSidebar, newFiltersUI);

    // Replace Sorting block
    const regexSorting = /\{\/\*\s*Sorting\s*\*\/\}\s*<div className="flex items-center gap-2 cursor-pointer group relative">[\s\S]*?<\/select>\s*<\/div>/g;
    content = content.replace(regexSorting, newSortingUI);

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
