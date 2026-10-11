import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Sliders, 
  Layers, 
  Image as ImageIcon, 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  Upload, 
  Plus, 
  Undo, 
  Redo, 
  ShoppingCart, 
  Trash2, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { templateEngine } from '../engines/TemplateEngine.js';
import axiosInstance from '../../../services/axiosInstance.js';
import * as fabric from 'fabric';

/**
 * Normalizes Canvas JSON for Fabric v7 compatibility:
 * - Capitalizes object types (e.g., 'rect' -> 'Rect', 'textbox' -> 'Textbox')
 * - Ensures default originX/originY are 'left'/'top' so objects aren't shifted to center
 */
function normalizeCanvasJson(rawJson) {
  if (!rawJson) return null;
  const json = typeof rawJson === 'string' ? JSON.parse(rawJson) : JSON.parse(JSON.stringify(rawJson));

  if (Array.isArray(json.objects)) {
    json.objects = json.objects.map(obj => {
      const typeMap = {
        rect: 'Rect',
        textbox: 'Textbox',
        text: 'Text',
        circle: 'Circle',
        path: 'Path',
        group: 'Group',
        image: 'Image',
        line: 'Line',
        triangle: 'Triangle',
        polygon: 'Polygon',
        polyline: 'Polyline'
      };
      const lowerType = obj.type?.toLowerCase();
      if (typeMap[lowerType]) {
        obj.type = typeMap[lowerType];
      }

      // In Fabric v7, default Rect origin is center/center, which shunts un-anchored shapes off-canvas
      if (!obj.originX) obj.originX = 'left';
      if (!obj.originY) obj.originY = 'top';

      return obj;
    });
  }
  return json;
}

export default function DesignStudio({ slug }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('templateId');

  // Active Tool for the Left Sidebar Panel: 'customize' | 'templates' | 'uploads' | 'text' | 'shapes'
  const [activeTool, setActiveTool] = useState('customize');

  const [template, setTemplate] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customFields, setCustomFields] = useState({});
  const [activeObject, setActiveObject] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Available templates for this product
  const [productTemplates, setProductTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // User uploaded images
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Shape creation color
  const [selectedShapeColor, setSelectedShapeColor] = useState('#3b82f6');

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);

  // Helper to load template canvas data and sync custom fields
  const loadTemplateOnCanvas = useCallback((canvas, tpl, fields = {}) => {
    if (!canvas || !tpl) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';

    const canvasWidth = tpl.canvasJson?.width || 600;
    const canvasHeight = tpl.canvasJson?.height || 350;
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
    }

    if (tpl.canvasJson) {
      const normalized = normalizeCanvasJson(tpl.canvasJson);
      canvas.loadFromJSON(normalized).then(() => {
        // Synchronize custom field values into canvas textboxes
        const objects = canvas.getObjects();
        Object.entries(fields).forEach(([k, val]) => {
          if (!val) return;
          const match = objects.find(o => o.id === k || o.id === k.toLowerCase());
          if (match && (match.type?.toLowerCase() === 'textbox' || match.type?.toLowerCase() === 'text')) {
            match.set({ text: val });
          }
        });
        canvas.renderAll();
      }).catch(err => console.error("Error loading canvas JSON:", err));
    } else if (tpl.editableFields) {
      tpl.editableFields.forEach((field, idx) => {
        if (field.type === 'TEXT') {
          const text = new fabric.Textbox(fields[field.key] || field.defaultValue || field.label, {
            left: 50,
            top: 50 + (idx * 50),
            width: 250,
            fontSize: 20,
            fontFamily: 'Arial',
            fill: '#333333',
            originX: 'left',
            originY: 'top',
            id: field.key
          });
          canvas.add(text);
        }
      });
      canvas.renderAll();
    }
  }, []);

  // 1. Initialize Fabric Canvas ONCE on mount (empty deps, disposes ONLY on unmount)
  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
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
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  // 2. Load template data onto the canvas whenever template changes (NO DISPOSE)
  useEffect(() => {
    if (fabricRef.current && template) {
      loadTemplateOnCanvas(fabricRef.current, template, customFields);
    }
  }, [template, loadTemplateOnCanvas]);

  // Load all templates available for this product
  useEffect(() => {
    if (slug) {
      setLoadingTemplates(true);
      templateEngine.loadTemplates(slug).then(list => {
        const tpls = list || [];
        setProductTemplates(tpls);
        setLoadingTemplates(false);

        // If no templateId is provided in URL, auto-load the first template
        if (!templateId && tpls.length > 0) {
          handleSelectTemplate(tpls[0]);
        }
      }).catch(() => setLoadingTemplates(false));
    }
  }, [slug]);

  // Fetch specific Template by templateId query param
  useEffect(() => {
    if (templateId) {
      setLoading(true);
      templateEngine.getTemplateById(templateId).then(data => {
        if (!data) {
          setLoading(false);
          return;
        }

        let activeData = data;
        const variantId = searchParams.get('variantId');

        let initialVariant = null;
        if (data.colorVariants && data.colorVariants.length > 0) {
          initialVariant = variantId
            ? data.colorVariants.find(v => v._id === variantId || v._id?.toString() === variantId)
            : data.colorVariants[0];

          if (!initialVariant) initialVariant = data.colorVariants[0];

          activeData = {
            ...data,
            previewFront: initialVariant.previewFront || data.previewFront,
            previewBack: initialVariant.previewBack || data.previewBack,
            canvasJson: initialVariant.canvasJson || data.canvasJson,
          };
          setSelectedVariantId(initialVariant._id || initialVariant.name);
        }

        setTemplate(activeData);

        if (activeData.editableFields) {
          const initialFields = {};
          activeData.editableFields.forEach(f => {
            initialFields[f.key] = f.defaultValue || '';
          });
          setCustomFields(initialFields);
        }

        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [templateId, searchParams]);

  // Switch to another template from the Templates panel
  const handleSelectTemplate = (selectedTpl) => {
    if (!selectedTpl) return;
    router.replace(`/products/${slug}/design?templateId=${selectedTpl._id}`);

    let activeData = selectedTpl;
    const initialVariant = selectedTpl.colorVariants?.[0];
    if (initialVariant) {
      activeData = {
        ...selectedTpl,
        previewFront: initialVariant.previewFront || selectedTpl.previewFront,
        previewBack: initialVariant.previewBack || selectedTpl.previewBack,
        canvasJson: initialVariant.canvasJson || selectedTpl.canvasJson,
      };
      setSelectedVariantId(initialVariant._id || initialVariant.name);
    } else {
      setSelectedVariantId(null);
    }

    setTemplate(activeData);

    if (activeData.editableFields) {
      const initialFields = {};
      activeData.editableFields.forEach(f => {
        initialFields[f.key] = f.defaultValue || '';
      });
      setCustomFields(initialFields);
    }

    setActiveTool('customize');
  };

  // Handle color variant change — updates state, second useEffect reloads canvas safely without disposing
  const handleVariantChange = (variant) => {
    setSelectedVariantId(variant._id || variant.name);
    setTemplate(prev => ({
      ...prev,
      previewFront: variant.previewFront || prev?.previewFront,
      previewBack: variant.previewBack || prev?.previewBack,
      canvasJson: variant.canvasJson || prev?.canvasJson,
    }));
  };

  // Handle field change using exact field.key
  const handleFieldChange = (key, value) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));

    if (fabricRef.current) {
      const objects = fabricRef.current.getObjects();
      const obj = objects.find(o => o.id === key || o.id === key.toLowerCase());
      if (obj && (obj.type?.toLowerCase() === 'textbox' || obj.type?.toLowerCase() === 'text')) {
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

  // Image Upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        setUploadedImages(prev => [dataUrl, ...prev]);
        addImageToCanvas(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add an image onto the canvas
  const addImageToCanvas = (imgUrl) => {
    if (!fabricRef.current) return;
    fabric.FabricImage.fromURL(imgUrl).then(img => {
      // Scale down if image is too large
      if (img.width > 200 || img.height > 200) {
        const scale = Math.min(200 / img.width, 200 / img.height);
        img.scale(scale);
      }
      img.set({
        left: 120,
        top: 100,
        originX: 'left',
        originY: 'top'
      });
      fabricRef.current.add(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.renderAll();
    }).catch(err => console.error("Error adding image:", err));
  };

  // Add Styled Text Elements
  const addTextElement = (textString, options = {}) => {
    if (fabricRef.current) {
      const text = new fabric.Textbox(textString, {
        left: 80,
        top: 100,
        width: 300,
        fontSize: options.fontSize || 20,
        fontWeight: options.fontWeight || 'normal',
        fontFamily: options.fontFamily || 'Arial',
        fill: options.fill || '#0f172a',
        originX: 'left',
        originY: 'top',
        ...options
      });
      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      fabricRef.current.renderAll();
    }
  };

  // Add Shape Elements
  const addShapeElement = (shapeType) => {
    if (!fabricRef.current) return;
    let shape;
    if (shapeType === 'rect') {
      shape = new fabric.Rect({
        left: 100, top: 80, width: 140, height: 90, fill: selectedShapeColor, originX: 'left', originY: 'top'
      });
    } else if (shapeType === 'rounded-rect') {
      shape = new fabric.Rect({
        left: 100, top: 80, width: 140, height: 90, rx: 12, ry: 12, fill: selectedShapeColor, originX: 'left', originY: 'top'
      });
    } else if (shapeType === 'circle') {
      shape = new fabric.Circle({
        left: 100, top: 80, radius: 45, fill: selectedShapeColor, originX: 'left', originY: 'top'
      });
    } else if (shapeType === 'triangle') {
      shape = new fabric.Triangle({
        left: 100, top: 80, width: 100, height: 90, fill: selectedShapeColor, originX: 'left', originY: 'top'
      });
    } else if (shapeType === 'line') {
      shape = new fabric.Line([60, 100, 260, 100], {
        stroke: selectedShapeColor, strokeWidth: 3, originX: 'left', originY: 'top'
      });
    }

    if (shape) {
      fabricRef.current.add(shape);
      fabricRef.current.setActiveObject(shape);
      fabricRef.current.renderAll();
    }
  };

  const deleteSelected = useCallback((e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject && fabricRef.current) {
      if (activeObject.isEditing) return; // Don't delete if typing inside textbox
      fabricRef.current.remove(activeObject);
      setActiveObject(null);
      fabricRef.current.renderAll();
    }
  }, [activeObject]);

  useEffect(() => {
    window.addEventListener('keydown', deleteSelected);
    return () => window.removeEventListener('keydown', deleteSelected);
  }, [deleteSelected]);

  const addToCart = async () => {
    if (!template) return;
    setAddingToCart(true);
    try {
      const res = await axiosInstance.get(`/products/${slug}`);
      const productId = res.data?.product?._id;

      if (!productId) throw new Error('Product not found');

      // Add to Cart payload
      await axiosInstance.post('/cart/items', {
        productId,
        quantity: 100,
        configuration: {},
        designType: 'TEMPLATE',
        template: {
          templateId: template._id || templateId,
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

  return (
    <div className="flex flex-col w-full h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="font-black text-xl tracking-tighter text-blue-600">PrintWala</div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="text-sm font-semibold text-slate-700 capitalize">Product: {slug?.replace(/-/g, ' ')}</div>
          {template && (
            <>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="text-sm text-slate-500 font-medium">Template: {template.name}</div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button" 
            title="Undo" 
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button 
            type="button" 
            title="Redo" 
            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <button 
            type="button"
            onClick={addToCart} 
            disabled={addingToCart || !template}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-md shadow-sm flex items-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Icon Menu */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-2 shrink-0 z-20 shadow-xs">
          <button 
            type="button"
            onClick={() => setActiveTool('customize')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'customize' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Customize</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTool('templates')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'templates' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Templates</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTool('uploads')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'uploads' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Uploads</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTool('text')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'text' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Text</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTool('shapes')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'shapes' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <Square className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Shapes</span>
          </button>
        </div>

        {/* Left Dynamic Tool Panel */}
        <div className="w-80 bg-white border-r border-slate-200 shrink-0 flex flex-col shadow-sm z-10">
          
          {/* 1. CUSTOMIZE TOOL PANEL */}
          {activeTool === 'customize' && (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Customize Card</span>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold">Active</span>
              </div>
              <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
                {loading ? (
                  <div className="text-xs text-slate-500 italic">Loading template...</div>
                ) : template ? (
                  <>
                    {/* Preview Image */}
                    {(template.thumbnail || template.previewFront) && (
                      <div className="w-full aspect-[1.714/1] bg-white border border-slate-200 p-1 rounded relative group/img overflow-hidden shadow-xs">
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

                    {/* Color Variants Swatches */}
                    {template.colorVariants && template.colorVariants.length > 0 && (
                      <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100">
                        <label className="text-xs font-semibold text-slate-600">Color Variant</label>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {template.colorVariants.map((v, i) => {
                            const isSelected = selectedVariantId === (v._id || v.name);
                            return (
                              <button
                                key={v._id || i}
                                type="button"
                                title={v.name}
                                onClick={() => handleVariantChange(v)}
                                className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                                  isSelected ? 'border-blue-600 ring-2 ring-blue-300 scale-110 shadow-sm' : 'border-slate-300 hover:scale-105'
                                }`}
                                style={{ backgroundColor: v.colorCode }}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Editable Text Fields */}
                    <div className="flex flex-col gap-3">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Fields</div>
                      {template.editableFields?.length > 0 ? (
                        template.editableFields.map((field) => (
                          <div key={field._id || field.key} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-600">{field.label}</label>
                            <input
                              type="text"
                              value={customFields[field.key] ?? field.defaultValue ?? ''}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
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
            </>
          )}

          {/* 2. TEMPLATES TOOL PANEL */}
          {activeTool === 'templates' && (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Design Templates</span>
                <span className="text-xs text-slate-400 font-medium">{productTemplates.length} available</span>
              </div>
              <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1">
                {loadingTemplates ? (
                  <div className="text-xs text-slate-500 italic">Loading templates...</div>
                ) : productTemplates.length > 0 ? (
                  productTemplates.map((tpl) => {
                    const isCurrent = (template?._id === tpl._id) || (templateId === tpl._id);
                    return (
                      <div 
                        key={tpl._id}
                        onClick={() => handleSelectTemplate(tpl)}
                        className={`group cursor-pointer p-2.5 rounded-lg border transition-all ${
                          isCurrent 
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-full aspect-[1.714/1] bg-slate-100 rounded overflow-hidden border border-slate-200 mb-2 relative">
                          {tpl.previewFront ? (
                            <img src={tpl.previewFront} alt={tpl.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Preview</div>
                          )}
                          {isCurrent && (
                            <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white p-1 rounded-full shadow-xs">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{tpl.name}</span>
                          <span className="text-[11px] text-blue-600 font-semibold group-hover:underline">Select</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-500 italic">No templates available for this product.</div>
                )}
              </div>
            </>
          )}

          {/* 3. UPLOADS TOOL PANEL */}
          {activeTool === 'uploads' && (
            <>
              <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Uploads</div>
              <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Upload className="w-4 h-4" /> Upload Image
                </button>
                <p className="text-[11px] text-slate-400 text-center">Supports PNG, JPG, SVG, WebP</p>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Images</span>
                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          onClick={() => addImageToCanvas(imgUrl)}
                          title="Click to add to canvas"
                          className="aspect-square bg-slate-50 rounded border border-slate-200 p-1 cursor-pointer hover:border-blue-500 hover:shadow-xs transition-all flex items-center justify-center overflow-hidden"
                        >
                          <img src={imgUrl} alt="uploaded" className="max-h-full max-w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                      No images uploaded yet. Click upload to add logos, icons, or photos!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 4. TEXT TOOL PANEL */}
          {activeTool === 'text' && (
            <>
              <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Add Text</div>
              <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => addTextElement('Add a Heading', { fontSize: 32, fontWeight: 'bold' })}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-xl font-black text-slate-800">Add a Heading</div>
                  <div className="text-[11px] text-slate-400">32px Bold text</div>
                </button>

                <button
                  type="button"
                  onClick={() => addTextElement('Add a Subheading', { fontSize: 20, fontWeight: '600', fill: '#475569' })}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-base font-bold text-slate-700">Add a Subheading</div>
                  <div className="text-[11px] text-slate-400">20px Medium text</div>
                </button>

                <button
                  type="button"
                  onClick={() => addTextElement('Add body text', { fontSize: 14, fill: '#64748b' })}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-sm font-normal text-slate-600">Add body text</div>
                  <div className="text-[11px] text-slate-400">14px Regular paragraph</div>
                </button>

                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Preset Badges</div>
                  <div className="flex gap-2 flex-wrap">
                    {['PREMIUM', 'SINCE 2026', 'ISO 9001', 'OFFICIAL', 'LIMITED'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addTextElement(preset, { fontSize: 12, fontWeight: 'bold', fill: '#1e3a8a', charSpacing: 100 })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 text-xs font-bold rounded border border-slate-200 transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 5. SHAPES TOOL PANEL */}
          {activeTool === 'shapes' && (
            <>
              <div className="p-4 border-b border-slate-100 font-bold text-slate-800">Add Shapes</div>
              <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Shape Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a', '#ffffff'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedShapeColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          selectedShapeColor === c ? 'border-blue-600 ring-2 ring-blue-300 scale-110' : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={selectedShapeColor} 
                      onChange={e => setSelectedShapeColor(e.target.value)}
                      className="w-6 h-6 p-0 border border-slate-300 rounded cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => addShapeElement('rect')}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg flex flex-col items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Square className="w-8 h-8" />
                    <span className="text-xs font-semibold">Rectangle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('rounded-rect')}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg flex flex-col items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 border-2 border-current rounded-md" />
                    <span className="text-xs font-semibold">Rounded Rect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('circle')}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg flex flex-col items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Circle className="w-8 h-8" />
                    <span className="text-xs font-semibold">Circle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('triangle')}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg flex flex-col items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Triangle className="w-8 h-8" />
                    <span className="text-xs font-semibold">Triangle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('line')}
                    className="p-3 col-span-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                    <span className="text-xs font-semibold">Divider Line</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Center Workspace */}
        <div ref={containerRef} className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden p-6">
          <div className="shadow-2xl border border-slate-300 bg-white rounded-sm overflow-hidden">
            <canvas ref={canvasRef} id="design-canvas" />
          </div>

          {/* Bottom Status Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-slate-200 flex items-center gap-4 text-xs font-bold text-slate-600">
            <span>Size: 600 × 350 px</span>
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
                {(activeObject.type?.toLowerCase() === 'textbox' ||
                  activeObject.type?.toLowerCase() === 'text' ||
                  activeObject.type?.toLowerCase() === 'rect' ||
                  activeObject.type?.toLowerCase() === 'circle' ||
                  activeObject.type?.toLowerCase() === 'triangle') && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-600">Color</label>
                    <input
                      type="color"
                      value={activeObject.fill || '#000000'}
                      onChange={(e) => handlePropertyChange('fill', e.target.value)}
                      className="w-full h-8 cursor-pointer rounded border border-slate-200"
                    />
                  </div>
                )}
                {(activeObject.type?.toLowerCase() === 'textbox' || activeObject.type?.toLowerCase() === 'text') && (
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
                    className="w-full"
                  />
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (fabricRef.current && activeObject) {
                        fabricRef.current.remove(activeObject);
                        setActiveObject(null);
                        fabricRef.current.renderAll();
                      }
                    }}
                    className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Element
                  </button>
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
