import React from 'react';
import { Layers, Image as ImageIcon, Type, Square, Save, Undo, Redo, ZoomIn, Search, ShoppingCart } from 'lucide-react';

export default function DesignStudio({ slug }) {
  return (
    <div className="flex flex-col w-full h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="font-black text-xl tracking-tighter text-blue-600">PrintWala</div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="text-sm font-semibold text-slate-700">Design: {slug}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><Undo className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><Redo className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-md">Save Draft</button>
          <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-md">Preview</button>
          <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-md shadow-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Menu */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-4 shrink-0 z-10">
          <button className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <Layers className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Templates</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <ImageIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Uploads</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <Type className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Text</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <Square className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Shapes</span>
          </button>
        </div>

        {/* Left Panel Content */}
        <div className="w-72 bg-white border-r border-slate-200 shrink-0 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Templates</div>
          <div className="p-4 overflow-y-auto">
            {/* Placeholder items */}
            <div className="text-xs text-slate-500 italic">Template Engine initializing...</div>
          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden">
           {/* Placeholder Canvas */}
           <div className="w-[600px] h-[350px] bg-white shadow-lg relative flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 font-bold flex items-center gap-2"><ZoomIn className="w-5 h-5"/> Canvas Engine initializing...</span>
           </div>

           {/* Bottom Status Bar */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-slate-200 flex items-center gap-4 text-xs font-bold text-slate-600">
             <span>Zoom: 100%</span>
             <div className="w-px h-3 bg-slate-300"></div>
             <span>Ready</span>
           </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-72 bg-white border-l border-slate-200 shrink-0 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Properties</div>
          <div className="p-4 text-xs text-slate-500 italic">Select an object on the canvas to see its properties.</div>
        </div>
      </div>
    </div>
  );
}
