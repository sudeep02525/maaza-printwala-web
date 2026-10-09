import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Layers, Image as ImageIcon, Type, Square, Save, Undo, Redo, ZoomIn, ShoppingCart } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { templateEngine } from '../engines/TemplateEngine.js';
import { productConfigEngine } from '../engines/ProductConfigurationEngine.js';
import axiosInstance from '../../../services/axiosInstance.js';
import * as fabric from 'fabric';

export default function DesignStudio({ slug }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('templateId');
  
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customFields, setCustomFields] = useState({});
  const [activeObject, setActiveObject] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (templateId) {
      setLoading(true);
      templateEngine.getTemplateById(templateId).then(data => {
        let activeData = data;
        const variantId = searchParams.get('variantId');
        
        if (variantId && data.colorVariants) {
          const variant = data.colorVariants.find(v => v._id === variantId || v._id?.toString() === variantId);
          if (variant) {
             activeData = {
               ...data,
               previewFront: variant.previewFront || data.previewFront,
               previewBack: variant.previewBack || data.previewBack,
               canvasJson: variant.canvasJson || data.canvasJson,
             };
          }
        }
        
        setTemplate(activeData);
        if (activeData && activeData.editableFields) {
          const initialFields = {};
          activeData.editableFields.forEach(f => {
            initialFields[f.label || f.key] = f.defaultValue || '';
          });
          setCustomFields(initialFields);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [templateId, searchParams]);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (template && canvasRef.current && containerRef.current && !fabricRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 350,
        backgroundColor: '#ffffff'
      });
      fabricRef.current = canvas;

      // Handle Selection
      canvas.on('selection:created', (e) => setActiveObject(e.selected[0]));
      canvas.on('selection:updated', (e) => setActiveObject(e.selected[0]));
      canvas.on('selection:cleared', () => setActiveObject(null));

      // Simulate loading canvas JSON or creating dummy text for editable fields
      if (template.canvasJson) {
        canvas.loadFromJSON(template.canvasJson).then(() => {
          canvas.renderAll();
        }).catch(err => console.error("Error loading canvas JSON:", err));
      } else if (template.editableFields) {
        // Create dummy objects for testing editable fields
        template.editableFields.forEach((field, idx) => {
          if (field.type === 'TEXT') {
            const text = new fabric.Textbox(field.defaultValue || field.label, {
              left: 50,
              top: 50 + (idx * 50),
              width: 200,
              fontSize: 20,
              fontFamily: 'Arial',
              fill: '#333333',
              id: field.label || field.key // use label as ID for mapping
            });
            canvas.add(text);
          }
        });
        canvas.renderAll();
      }
    }
    
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [template]);

  const handleFieldChange = (key, value) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));
    
    if (fabricRef.current) {
      const objects = fabricRef.current.getObjects();
      const obj = objects.find(o => o.id === key);
      if (obj && obj.type === 'textbox') {
        obj.set({ text: value });
        fabricRef.current.renderAll();
      }
    }
  };

  const handlePropertyChange = (property, value) => {
    if (activeObject && fabricRef.current) {
      activeObject.set(property, value);
      fabricRef.current.renderAll();
    }
  };

  const addToCart = async () => {
    if (!templateId) return;
    setAddingToCart(true);
    try {
      const res = await axiosInstance.get(`/products/${slug}`);
      const productId = res.data?.product?._id;
      
      if (!productId) throw new Error('Product not found');

      // Add to Cart payload
      await axiosInstance.post('/cart/items', {
        productId,
        quantity: 100, // default minimum
        configuration: {},
        designType: 'TEMPLATE',
        template: {
          templateId,
          customFields
        }
      });
      
      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart. ' + (err.message || ''));
    } finally {
      setAddingToCart(false);
    }
  };

  const addText = () => {
    if (fabricRef.current) {
      const text = new fabric.Textbox('New Text', {
        left: 100, top: 100, width: 200, fontSize: 24, fontFamily: 'Arial', fill: '#000000'
      });
      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      fabricRef.current.renderAll();
    }
  };

  const addShape = () => {
    if (fabricRef.current) {
      const rect = new fabric.Rect({
        left: 100, top: 100, width: 100, height: 100, fill: '#3b82f6'
      });
      fabricRef.current.add(rect);
      fabricRef.current.setActiveObject(rect);
      fabricRef.current.renderAll();
    }
  };

  const deleteSelected = useCallback((e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject && fabricRef.current) {
      if (activeObject.isEditing) return; // Don't delete if typing inside a textbox
      fabricRef.current.remove(activeObject);
      setActiveObject(null);
      fabricRef.current.renderAll();
    }
  }, [activeObject]);

  useEffect(() => {
    window.addEventListener('keydown', deleteSelected);
    return () => window.removeEventListener('keydown', deleteSelected);
  }, [deleteSelected]);

  return (
    <div className="flex flex-col w-full h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="font-black text-xl tracking-tighter text-blue-600">PrintWala</div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="text-sm font-semibold text-slate-700">Design: {slug}</div>
          {template && (
            <>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="text-sm text-slate-500">Template: {template.name}</div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><Undo className="w-4 h-4" /></button>
          <button className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><Redo className="w-4 h-4" /></button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-md">Save Draft</button>
          <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-md">Preview</button>
          <button 
            onClick={addToCart} 
            disabled={addingToCart || !template}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-md shadow-sm flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> {addingToCart ? 'Adding...' : 'Add to Cart'}
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
          <button onClick={addText} className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <Type className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Text</span>
          </button>
          <button onClick={addShape} className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
            <Square className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Shapes</span>
          </button>
        </div>

        {/* Left Panel Content */}
        <div className="w-72 bg-white border-r border-slate-200 shrink-0 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Customize</div>
          <div className="p-4 overflow-y-auto flex flex-col gap-4">
            {loading ? (
              <div className="text-xs text-slate-500 italic">Loading template...</div>
            ) : template ? (
              <>
                {(template.thumbnail || template.previewFront) && (
                  <div className="w-full aspect-[1.75/1] bg-white border border-slate-200 p-1 rounded relative group/img">
                    <img 
                      src={template.thumbnail || template.previewFront} 
                      alt={template.name} 
                      className={`w-full h-full object-contain rounded-sm transition-opacity duration-300 ${template.previewBack ? 'group-hover/img:opacity-0' : ''}`}
                    />
                    {template.previewBack && (
                      <img 
                        src={template.previewBack} 
                        alt={`${template.name} back`}
                        className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-contain rounded-sm opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </div>
                )}
                
                <div className="flex flex-col gap-4 mt-2">
                  {template.editableFields?.length > 0 ? (
                    template.editableFields.map((field) => (
                      <div key={field._id || field.key} className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                        <input 
                          type="text" 
                          value={customFields[field.label || field.key] || ''} 
                          onChange={(e) => handleFieldChange(field.label || field.key, e.target.value)}
                          className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic">No editable fields.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-xs text-slate-500 italic">No template loaded.</div>
            )}
          </div>
        </div>

        {/* Center Workspace */}
        <div ref={containerRef} className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden">
           <div className="shadow-lg border border-slate-200 bg-white">
              <canvas ref={canvasRef} id="design-canvas" />
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
          <div className="p-4">
            {activeObject ? (
              <div className="flex flex-col gap-4">
                {(activeObject.type === 'textbox' || activeObject.type === 'rect' || activeObject.type === 'circle') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600">Color</label>
                    <input 
                      type="color" 
                      value={activeObject.fill || '#000000'}
                      onChange={(e) => handlePropertyChange('fill', e.target.value)}
                      className="w-full h-8 cursor-pointer rounded"
                    />
                  </div>
                )}
                {activeObject.type === 'textbox' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600">Font Size</label>
                    <input 
                      type="number" 
                      value={activeObject.fontSize || 20}
                      onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value, 10))}
                      className="w-full text-sm p-2 border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-600">Opacity</label>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={activeObject.opacity ?? 1}
                    onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">Select an object on the canvas to see its properties.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
