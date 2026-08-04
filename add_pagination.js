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
    
    // 1. Add state and limit
    content = content.replace(
      /const \[viewMode, setViewMode\] = useState\('grid'\);([^\n]*)/,
      "const [viewMode, setViewMode] = useState('grid');$1\n  const [currentPage, setCurrentPage] = useState(1);\n  const PRODUCTS_PER_PAGE = 16;"
    );
    
    // 2. Add pagination calculation after filteredAndSortedProducts
    const useMemoEnd = '}, [rawProducts, sortBy]);';
    if (content.includes(useMemoEnd)) {
      content = content.replace(
        useMemoEnd,
        useMemoEnd + "\n\n  useEffect(() => {\n    setCurrentPage(1);\n  }, [filteredAndSortedProducts]);\n\n  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);\n  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);"
      );
    }

    // 3. Update the map
    content = content.replace(
      /\{filteredAndSortedProducts\.map\(/g,
      "{paginatedProducts.map("
    );
    
    // 4. Replace Pagination Mock
    const mockStart = '{/* Pagination Mock */}';
    const mockStartIndex = content.indexOf(mockStart);
    if (mockStartIndex !== -1) {
      // Find the end of this block
      // It looks like:
      //             {/* Pagination Mock */}
      //             {!prodLoading && filteredAndSortedProducts.length > 0 && (
      //               <div ...>
      //                 ...
      //               </div>
      //             )}
      const nextDivEnd = content.indexOf(')}', mockStartIndex);
      if (nextDivEnd !== -1) {
        const replacement = `{/* Pagination */}
            {!prodLoading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => {\n                    document.getElementById('explore-categories-scroll'); // just a dummy to ensure block works\n                    window.scrollTo({ top: 0, behavior: 'smooth' });\n                    setCurrentPage(prev => Math.max(prev - 1, 1));\n                  }}\n                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >&larr;</button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {\n                      window.scrollTo({ top: 0, behavior: 'smooth' });\n                      setCurrentPage(i + 1);\n                    }}\n                    className={\`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors \${currentPage === i + 1 ? 'bg-[#0082CA] text-white shadow-sm' : 'border border-slate-200 text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA]'}\`}
                  >{i + 1}</button>
                ))}
                
                <button 
                  onClick={() => {\n                    window.scrollTo({ top: 0, behavior: 'smooth' });\n                    setCurrentPage(prev => Math.min(prev + 1, totalPages));\n                  }}\n                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >&rarr;</button>
              </div>
            )}`;
        content = content.substring(0, mockStartIndex) + replacement + content.substring(nextDivEnd + 2);
      }
    }

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
