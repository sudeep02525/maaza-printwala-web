'use client';

import { useState, Suspense, use, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Type, Image as ImageIcon, LayoutTemplate, Square, Hexagon,
  Undo2, Redo2, ZoomIn, ZoomOut, Settings2, Download, Check, ChevronDown, Save
} from 'lucide-react';
import axiosInstance from '../../../../../services/axiosInstance.js';
import { useConfiguratorStore } from '@/store/configuratorStore.js';
import Button from '@/components/ui/Button.jsx';

function CanvasEditor({ slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId') || '1';
  
  const { setDesignReady, priceData } = useConfiguratorStore();

  const [activeTab, setActiveTab] = useState('text');
  const [zoom, setZoom] = useState(100);
  const [activeElementId, setActiveElementId] = useState(null);

  // Template Data definitions
  const templateData = useMemo(() => {
    switch(templateId) {
      case '2': // Elegant Maroon
        return {
          bgColor: '#451a2e',
          elements: [
            { id: 1, type: 'text', text: 'C & C', x: 280, y: 150, fontSize: 42, fontFamily: 'serif', color: '#eab308', fontWeight: 'bold' },
            { id: 2, type: 'shape', width: 60, height: 2, x: 320, y: 210, color: '#eab308' },
            { id: 3, type: 'text', text: 'BOUTIQUE', x: 285, y: 220, fontSize: 16, fontFamily: 'sans-serif', color: '#ffffff', fontWeight: 'normal', letterSpacing: '4px' },
            { id: 4, type: 'text', text: 'www.boutique.com', x: 280, y: 350, fontSize: 12, fontFamily: 'sans-serif', color: '#eab308', fontWeight: 'normal' }
          ]
        };
      case '3': // Bold Red
        return {
          bgColor: '#ffffff',
          elements: [
            { id: 1, type: 'shape', width: 700, height: 160, x: 0, y: 0, color: '#dc2626' },
            { id: 2, type: 'text', text: 'V', x: 45, y: 35, fontSize: 48, fontFamily: 'sans-serif', color: '#ffffff', fontWeight: '900' },
            { id: 3, type: 'text', text: 'VANGUARD', x: 40, y: 200, fontSize: 28, fontFamily: 'sans-serif', color: '#0f172a', fontWeight: '900' },
            { id: 4, type: 'text', text: 'CREATIVE AGENCY', x: 42, y: 240, fontSize: 12, fontFamily: 'sans-serif', color: '#dc2626', fontWeight: 'bold' },
            { id: 5, type: 'text', text: 'New York, NY', x: 40, y: 350, fontSize: 12, fontFamily: 'sans-serif', color: '#64748b', fontWeight: 'normal' },
            { id: 6, type: 'text', text: 'vanguard.io', x: 550, y: 350, fontSize: 12, fontFamily: 'sans-serif', color: '#64748b', fontWeight: 'normal' }
          ]
        };
      case '4': // Photo Real Estate
        return {
          bgColor: '#f1f5f9',
          elements: [
            { id: 1, type: 'shape', width: 250, height: 400, x: 0, y: 0, color: '#94a3b8' },
            { id: 2, type: 'shape', width: 14, height: 14, x: 270, y: 80, color: '#2563eb' },
            { id: 3, type: 'text', text: 'Sarah\nJenkins', x: 270, y: 100, fontSize: 32, fontFamily: 'sans-serif', color: '#0f172a', fontWeight: '900' },
            { id: 4, type: 'text', text: 'REAL ESTATE AGENT', x: 270, y: 180, fontSize: 10, fontFamily: 'sans-serif', color: '#2563eb', fontWeight: 'bold' },
            { id: 5, type: 'text', text: '123 Luxury Ave\nsarah@realty.com', x: 270, y: 250, fontSize: 12, fontFamily: 'sans-serif', color: '#64748b', fontWeight: 'normal' }
          ]
        };
      case '1': // Minimalist (Default)
      default:
        return {
          bgColor: '#ffffff',
          elements: [
            { id: 1, type: 'text', text: 'Company Name', x: 250, y: 140, fontSize: 32, fontFamily: 'sans-serif', color: '#1e293b', fontWeight: 'bold' },
            { id: 2, type: 'text', text: 'Tagline or Message', x: 260, y: 180, fontSize: 14, fontFamily: 'sans-serif', color: '#94a3b8', fontWeight: 'normal', letterSpacing: '2px' },
            { id: 3, type: 'text', text: 'John Doe\nCEO & Founder', x: 40, y: 340, fontSize: 12, fontFamily: 'sans-serif', color: '#64748b', fontWeight: 'normal' },
            { id: 4, type: 'text', text: '+1 234 567 890\nhello@company.com', x: 500, y: 340, fontSize: 12, fontFamily: 'sans-serif', color: '#64748b', fontWeight: 'normal', textAlign: 'right' }
          ]
        };
    }
  }, [templateId]);

  // State for canvas elements
  const [elements, setElements] = useState(templateData.elements);
  
  // Update elements when template changes
  useEffect(() => {
    setElements(templateData.elements);
  }, [templateData]);

  // 1. Fetch Product context
  const { data: prodData } = useQuery({
    queryKey: ['productDetail', slug],
    queryFn: () => axiosInstance.get(`/products/${slug}`),
    retry: false,
  });

  const product = prodData?.data?.product || null;

  // Interactions
  const handleDragStart = (e, id) => {
    e.stopPropagation();
    setActiveElementId(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const el = elements.find(el => el.id === id);
    if(!el) return;

    const startElX = el.x;
    const startElY = el.y;

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startX) / (zoom / 100);
      const dy = (moveEvent.clientY - startY) / (zoom / 100);
      
      setElements(prev => prev.map(item => 
        item.id === id ? { ...item, x: startElX + dx, y: startElY + dy } : item
      ));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const updateActiveElement = (updates) => {
    if (!activeElementId) return;
    setElements(prev => prev.map(el => el.id === activeElementId ? { ...el, ...updates } : el));
  };

  const activeElement = elements.find(el => el.id === activeElementId);
  const textElements = elements.filter(el => el.type === 'text');

  const handleComplete = () => {
    // Save to state and return to product page
    setDesignReady('TEMPLATE', {
      templateId: templateId || 'custom-canvas',
      templateName: 'Custom Canvas Design',
      previewUrl: '', // Could generate a data URL here if using html2canvas
      customFields: elements,
    });
    router.push(`/products/${slug}`);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* TOP NAVBAR */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/products/${slug}`)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
               <span className="text-white font-bold text-lg">V</span>
             </div>
             <span className="font-bold text-slate-800 text-sm hidden sm:block">PrintWala</span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          
          <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors">
            {product?.name || 'Standard Visiting Cards'} <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1 hidden md:flex">
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400">
              <Undo2 className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400">
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors">
            <Eye className="w-4 h-4" /> Preview
          </button>
          
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total:</span>
            <span className="text-sm font-bold text-slate-900">₹{priceData?.totalPrice?.toFixed(2) || '200.00'}</span>
          </div>

          <Button onClick={handleComplete} className="bg-[#41b6e6] hover:bg-[#2fa3d1] text-black font-bold border-none shadow-none text-sm px-6">
            Next
          </Button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden bg-[#eef1f5]">
        
        {/* LEFT SIDEBAR - Icons */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 z-10 shrink-0 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
          <SidebarIcon icon={LayoutTemplate} label="Product options" />
          <SidebarIcon icon={Type} label="Text" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
          <SidebarIcon icon={ImageIcon} label="Uploads" active={activeTab === 'uploads'} onClick={() => setActiveTab('uploads')} />
          <SidebarIcon icon={Hexagon} label="Graphics" active={activeTab === 'graphics'} onClick={() => setActiveTab('graphics')} />
          <SidebarIcon icon={Square} label="Background" active={activeTab === 'background'} onClick={() => setActiveTab('background')} />
          <SidebarIcon icon={LayoutTemplate} label="Template" />
        </div>

        {/* LEFT SIDEBAR - Floating Panel */}
        <div className="z-10 flex flex-col shrink-0 py-4 px-4 pointer-events-none">
           <div className="w-[300px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col h-full pointer-events-auto overflow-hidden">
             {activeTab === 'text' && (
               <div className="p-5 flex flex-col h-full overflow-y-auto no-scrollbar">
                 <div className="flex items-center justify-between mb-6">
                   <h2 className="font-bold text-[20px] text-slate-900">Text</h2>
                   <button className="text-slate-400 hover:text-slate-600"><Settings2 className="w-5 h-5" /></button>
                 </div>
                 
                 <button 
                   onClick={() => setElements([...elements, { id: Date.now(), type: 'text', text: 'New Text', x: 100, y: 100, fontSize: 16, fontFamily: 'sans-serif', color: '#000000', fontWeight: 'normal' }])}
                   className="w-full bg-[#68c6e8] hover:bg-[#56b9dd] text-slate-900 border-2 border-[#1e96c8] font-bold py-2.5 rounded-md flex items-center justify-center gap-2 mb-6 transition-colors shadow-sm"
                 >
                   + Add text
                 </button>

                 <div className="space-y-5">
                   {textElements.map((el) => (
                     <div key={el.id} className="group relative">
                       <label className="text-[13px] text-slate-500 mb-0.5 block px-1">{el.text}</label>
                       <input 
                         type="text" 
                         value={el.text}
                         onChange={(e) => {
                            setElements(prev => prev.map(item => item.id === el.id ? { ...item, text: e.target.value } : item));
                         }}
                         onFocus={() => setActiveElementId(el.id)}
                         className={`w-full border-b ${activeElementId === el.id ? 'border-blue-500' : 'border-slate-300 group-hover:border-slate-400'} pb-1.5 px-1 text-[15px] text-slate-700 bg-transparent focus:outline-none transition-colors`}
                       />
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'uploads' && (
               <div className="p-5 flex flex-col h-full">
                 <h2 className="font-bold text-[20px] text-slate-900 mb-6">Uploads</h2>
                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                   <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                   <p className="text-sm font-bold text-blue-600">Click to upload</p>
                   <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* CANVAS AREA */}
        <div 
          className="flex-1 absolute inset-0 left-20 bg-[#eef1f5] relative overflow-hidden flex flex-col z-0"
          onClick={() => setActiveElementId(null)}
        >
          {/* Top Canvas Tools */}
          {activeElement && activeElement.type === 'text' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md border border-slate-200 p-1.5 flex items-center gap-1 z-20 animate-in fade-in slide-in-from-top-2" onClick={e => e.stopPropagation()}>
              <select 
                value={activeElement.fontFamily}
                onChange={(e) => updateActiveElement({ fontFamily: e.target.value })}
                className="text-sm border-r border-slate-200 pr-2 pl-2 py-1 outline-none font-medium bg-transparent cursor-pointer hover:bg-slate-50 rounded"
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
              <div className="flex items-center border-r border-slate-200 px-1">
                 <button onClick={() => updateActiveElement({ fontSize: Math.max(8, activeElement.fontSize - 2) })} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600">-</button>
                 <input type="number" value={activeElement.fontSize} onChange={(e) => updateActiveElement({ fontSize: parseInt(e.target.value) || 12 })} className="w-10 text-center text-sm font-medium outline-none no-spinners" />
                 <button onClick={() => updateActiveElement({ fontSize: activeElement.fontSize + 2 })} className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600">+</button>
              </div>
              <div className="px-2">
                 <input 
                   type="color" 
                   value={activeElement.color} 
                   onChange={(e) => updateActiveElement({ color: e.target.value })}
                   className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                 />
              </div>
            </div>
          )}

          {/* Zoom controls & Grid tags */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-teal-50 text-teal-600 border border-teal-200 rounded-full">Safety Area</span>
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full">Bleed</span>
          </div>

          {/* Centered Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative overflow-auto">
             
             {/* The Canvas (Business Card Base) */}
             <div 
               className="shadow-xl relative overflow-hidden"
               style={{ 
                 width: '700px', 
                 height: '400px', // 1.75 ratio 
                 backgroundColor: templateData.bgColor,
                 transform: `scale(${zoom / 100})`,
                 transformOrigin: 'center center',
                 transition: 'transform 0.1s ease-out'
               }}
             >
                {/* Bleed line */}
                <div className="absolute inset-2 border border-blue-300 border-dashed pointer-events-none opacity-50 z-0"></div>
                {/* Safe zone line */}
                <div className="absolute inset-6 border border-teal-400 border-dashed pointer-events-none opacity-50 z-0"></div>
                


                {/* Elements */}
                {elements.map(el => {
                  if (el.type === 'text') {
                    const isActive = activeElementId === el.id;
                    return (
                      <div
                        key={el.id}
                        onMouseDown={(e) => handleDragStart(e, el.id)}
                        className={`absolute cursor-move px-1 py-0.5 whitespace-pre-wrap select-none
                          ${isActive ? 'ring-1 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-slate-300 hover:ring-offset-2'}
                        `}
                        style={{
                          left: el.x,
                          top: el.y,
                          color: el.color,
                          fontSize: `${el.fontSize}px`,
                          fontFamily: el.fontFamily,
                          fontWeight: el.fontWeight,
                          textAlign: el.textAlign || 'left',
                          zIndex: isActive ? 10 : 1,
                        }}
                      >
                        {el.text}
                      </div>
                    );
                  }
                  if (el.type === 'shape') {
                    return (
                      <div
                        key={el.id}
                        className="absolute z-0"
                        style={{
                          left: el.x,
                          top: el.y,
                          width: el.width,
                          height: el.height,
                          backgroundColor: el.color,
                        }}
                      />
                    );
                  }
                  return null;
                })}
             </div>
             
             {/* Rulers/Measurements (Mocked) */}
             <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex items-center gap-4">
                <div className="h-px bg-slate-300 w-32 relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2 bg-slate-400"></div></div>
                <span className="text-xs text-slate-400 font-medium tracking-wide">9.19cm</span>
                <div className="h-px bg-slate-300 w-32 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2 bg-slate-400"></div></div>
             </div>
             <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center gap-4">
                <div className="w-px bg-slate-300 h-24 relative"><div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2 bg-slate-400"></div></div>
                <span className="text-xs text-slate-400 font-medium tracking-wide rotate-[-90deg]">5.38cm</span>
                <div className="w-px bg-slate-300 h-24 relative"><div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-2 bg-slate-400"></div></div>
             </div>
          </div>

          {/* Bottom Zoom Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-md border border-slate-200 px-3 py-1.5 flex items-center gap-3 z-10">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-600"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-bold text-slate-700 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-600"><ZoomIn className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-600"><Settings2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Front/Back Toggle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 pointer-events-auto">
           <div className="flex flex-col items-center gap-1">
             <button className="w-16 h-10 bg-white border-2 border-[#1e96c8] rounded shadow-sm flex items-center justify-center">
                <div className="w-12 h-6 border border-slate-200 relative"><div className="absolute top-1 left-1 w-6 h-[1px] bg-slate-300"></div></div>
             </button>
             <span className="text-[11px] font-bold text-slate-800">Front</span>
           </div>
           <div className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
             <button className="w-16 h-10 bg-white border border-slate-300 rounded shadow-sm flex items-center justify-center hover:border-slate-400">
                <div className="w-12 h-6 border border-slate-200 bg-slate-50"></div>
             </button>
             <span className="text-[11px] font-bold text-slate-800">Back</span>
           </div>
        </div>

        {/* Need Design Help Button */}
        <div className="absolute bottom-6 right-6 z-10 pointer-events-auto">
          <button className="bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-[13px] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-colors">
            <span className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[10px]">?</span>
            Need design help?
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for Sidebar icons
function SidebarIcon({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-16 h-16 flex flex-col items-center justify-center gap-1.5 rounded-lg transition-colors
        ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
      `}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-700'}`} />
      <span className="text-[9px] font-bold text-center leading-tight tracking-wide">{label}</span>
    </button>
  );
}

// Icon we need but isn't imported from lucide-react above
function Eye(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
}
function UploadCloud(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
}


export default function TemplateCustomizerPage({ params }) {
  const unwrappedParams = use(params);
  // Optional: Extract templateId from search params if needed
  
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#0082CA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CanvasEditor slug={unwrappedParams.slug} />
    </Suspense>
  );
}
