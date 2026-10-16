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
  Sparkles,
  Eye,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  X,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { templateEngine } from '../engines/TemplateEngine.js';
import axiosInstance from '../../../services/axiosInstance.js';
import { useSettingsStore } from '@/store/settingsStore.js';
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

  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Active Tool for the Left Sidebar Panel: 'customize' | 'templates' | 'uploads' | 'text' | 'shapes'
  const [activeTool, setActiveTool] = useState('customize');

  const [template, setTemplate] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customFields, setCustomFields] = useState({});
  const [activeObject, setActiveObject] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Product & Configuration Schema for Order
  const [product, setProduct] = useState(null);
  const [productSchema, setProductSchema] = useState(null);
  const [productConfig, setProductConfig] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(100);

  // 2-Sided Card Editing: 'front' | 'back'
  const [activeSide, setActiveSide] = useState('front');
  const frontCanvasJsonRef = useRef(null);
  const backCanvasJsonRef = useRef(null);

  // Available templates for this product
  const [productTemplates, setProductTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // User uploaded images & DPI check
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadDpiWarning, setUploadDpiWarning] = useState(null);
  const fileInputRef = useRef(null);

  // Shape creation color
  const [selectedShapeColor, setSelectedShapeColor] = useState('#3b82f6');

  // Undo / Redo History Stacks
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const isHistoryLocked = useRef(false);

  // Zoom Control
  const [zoom, setZoom] = useState(1);

  // Print Guides (Bleed & Safe Area)
  const [showGuides, setShowGuides] = useState(true);

  // Save Draft Feedback
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [previewTab, setPreviewTab] = useState('front');

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);

  // Save Canvas State to Undo History
  const recordHistory = useCallback(() => {
    if (!fabricRef.current || isHistoryLocked.current) return;
    try {
      const json = JSON.stringify(fabricRef.current.toJSON());
      setHistoryStack(prev => {
        if (prev.length > 0 && prev[prev.length - 1] === json) return prev;
        return [...prev.slice(-25), json];
      });
      setRedoStack([]);
    } catch (e) {
      console.warn("Could not record canvas history:", e);
    }
  }, []);

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
        // Record initial state
        setTimeout(() => recordHistory(), 100);
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
      setTimeout(() => recordHistory(), 100);
    }
  }, [recordHistory]);

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

      // Hook history listener
      canvas.on('object:modified', () => recordHistory());
      canvas.on('object:added', () => recordHistory());
      canvas.on('object:removed', () => recordHistory());
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, [recordHistory]);

  // 2. Load template data onto the canvas whenever template or activeSide changes (NO DISPOSE)
  useEffect(() => {
    if (fabricRef.current && template) {
      const cached = activeSide === 'back' ? backCanvasJsonRef.current : frontCanvasJsonRef.current;
      if (cached) {
        fabricRef.current.clear();
        fabricRef.current.backgroundColor = '#ffffff';
        fabricRef.current.loadFromJSON(cached).then(() => {
          fabricRef.current.renderAll();
        }).catch(err => console.error("Error restoring cached canvas:", err));
      } else {
        let sideJson = template.canvasJson;
        if (activeSide === 'back') {
          if (template.canvasJsonBack) {
            sideJson = template.canvasJsonBack;
          } else {
            // Elegant fallback matching back side with variant's color
            const activeVar = template.colorVariants?.find(v => (v._id || v.name) === selectedVariantId);
            const bgFill = activeVar?.colorCode || template.canvasJson?.objects?.[0]?.fill || '#0f172a';
            sideJson = {
              version: "7.4.0",
              width: 600,
              height: 350,
              objects: [
                { type: "Rect", left: 0, top: 0, width: 600, height: 350, fill: bgFill, selectable: false, originX: "left", originY: "top" },
                { type: "Textbox", left: 100, top: 120, width: 400, fontSize: 36, fontWeight: "bold", fontFamily: "Arial", fill: "#ffffff", text: customFields.company_name || template.name || 'PRINTWALA', textAlign: "center", originX: "left", originY: "top", id: "company_name" },
                { type: "Textbox", left: 100, top: 200, width: 400, fontSize: 14, fontFamily: "Arial", fill: "#94a3b8", text: customFields.website || 'www.maazaprintwala.in', textAlign: "center", originX: "left", originY: "top", id: "website" }
              ]
            };
          }
        }
        loadTemplateOnCanvas(fabricRef.current, { ...template, canvasJson: sideJson }, customFields);
      }
    }
  }, [template, activeSide, loadTemplateOnCanvas, selectedVariantId]);

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

  // Load Product and Configuration Schema for Add to Cart
  useEffect(() => {
    if (slug) {
      axiosInstance.get(`/products/${slug}`).then(res => {
        const prod = res.data?.product;
        if (prod) {
          setProduct(prod);
          axiosInstance.get(`/products/${prod._id}/schema`).then(sRes => {
            const sch = sRes.data?.schema;
            if (sch) {
              setProductSchema(sch);
              const initialConfig = {};
              if (sch.attributes) {
                sch.attributes.forEach(attr => {
                  if (attr.options && attr.options.length > 0) {
                    initialConfig[attr.key] = attr.options[0].value;
                  }
                });
              }
              setProductConfig(initialConfig);
              if (sch.quantityTiers && sch.quantityTiers.length > 0) {
                setOrderQuantity(sch.quantityTiers[0]);
              }
            }
          }).catch(err => console.error("Could not fetch product schema:", err));
        }
      }).catch(err => console.error("Could not fetch product:", err));
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
            canvasJsonBack: initialVariant.canvasJsonBack || data.canvasJsonBack,
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
        canvasJsonBack: initialVariant.canvasJsonBack || selectedTpl.canvasJsonBack,
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
    // Clear side canvas caches so the new variant's front and back designs apply immediately
    frontCanvasJsonRef.current = null;
    backCanvasJsonRef.current = null;
    setTemplate(prev => ({
      ...prev,
      previewFront: variant.previewFront || prev?.previewFront,
      previewBack: variant.previewBack || prev?.previewBack,
      canvasJson: variant.canvasJson || prev?.canvasJson,
      canvasJsonBack: variant.canvasJsonBack || prev?.canvasJsonBack,
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
        recordHistory();
      }
    }
  };

  const handlePropertyChange = (property, value) => {
    if (activeObject && fabricRef.current) {
      activeObject.set(property, value);
      fabricRef.current.renderAll();
      recordHistory();
    }
  };

  // Undo Functionality
  const handleUndo = () => {
    if (!fabricRef.current || historyStack.length <= 1) return;
    isHistoryLocked.current = true;
    const currentState = historyStack[historyStack.length - 1];
    const prevState = historyStack[historyStack.length - 2];

    setRedoStack(prev => [...prev, currentState]);
    setHistoryStack(prev => prev.slice(0, prev.length - 1));

    fabricRef.current.loadFromJSON(JSON.parse(prevState)).then(() => {
      fabricRef.current.renderAll();
      isHistoryLocked.current = false;
    }).catch(() => { isHistoryLocked.current = false; });
  };

  // Redo Functionality
  const handleRedo = () => {
    if (!fabricRef.current || redoStack.length === 0) return;
    isHistoryLocked.current = true;
    const nextState = redoStack[redoStack.length - 1];

    setHistoryStack(prev => [...prev, nextState]);
    setRedoStack(prev => prev.slice(0, prev.length - 1));

    fabricRef.current.loadFromJSON(JSON.parse(nextState)).then(() => {
      fabricRef.current.renderAll();
      isHistoryLocked.current = false;
    }).catch(() => { isHistoryLocked.current = false; });
  };

  // Save Draft (Local storage persistence + UI feedback)
  const handleSaveDraft = () => {
    if (!fabricRef.current || !template) return;
    const draftPayload = {
      templateId: template._id || templateId,
      slug,
      customFields,
      selectedVariantId,
      activeSide,
      canvasJson: fabricRef.current.toJSON(),
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(`maaza_draft_${slug}`, JSON.stringify(draftPayload));
      setDraftSavedMsg(true);
      setTimeout(() => setDraftSavedMsg(false), 3000);
    } catch (e) {
      console.error("Draft save failed:", e);
    }
  };

  // Open Realistic Preview Modal
  const handleOpenPreview = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({ format: 'png', multiplier: 2 });
    setPreviewDataUrl(dataUrl);
    setPreviewTab('front');
    setShowPreviewModal(true);
  };

  // Download Print Proof
  const handleDownloadProof = () => {
    if (!previewDataUrl) return;
    const link = document.createElement('a');
    link.download = `proof-${slug || 'printwala'}-${Date.now()}.png`;
    link.href = previewDataUrl;
    link.click();
  };

  // Toggle Front / Back Card Sides
  const handleSideToggle = (side) => {
    if (side === activeSide || !fabricRef.current) return;

    // 1. Save current side state
    if (activeSide === 'front') {
      frontCanvasJsonRef.current = fabricRef.current.toJSON();
    } else {
      backCanvasJsonRef.current = fabricRef.current.toJSON();
    }

    setActiveSide(side);
  };

  // Image Upload handler with DPI resolution check
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === 'string') {
        const testImg = new Image();
        testImg.src = dataUrl;
        testImg.onload = () => {
          const minDpi = settings?.defaultDpiCheck || 300;
          if (testImg.naturalWidth < 400 || testImg.naturalHeight < 400) {
            setUploadDpiWarning(`Low resolution (${testImg.naturalWidth}×${testImg.naturalHeight}px). For sharp print quality, minimum ${minDpi} DPI (800px+) is recommended.`);
          } else {
            setUploadDpiWarning(null);
          }
        };

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
      if (img.width > 220 || img.height > 220) {
        const scale = Math.min(220 / img.width, 220 / img.height);
        img.scale(scale);
      }
      img.set({
        left: 140,
        top: 100,
        originX: 'left',
        originY: 'top'
      });
      fabricRef.current.add(img);
      fabricRef.current.setActiveObject(img);
      fabricRef.current.renderAll();
      recordHistory();
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
      recordHistory();
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
      recordHistory();
    }
  };

  // Layer Arrangement: Bring Forward, Send Backward
  const handleLayer = (action) => {
    if (!fabricRef.current || !activeObject) return;
    if (action === 'forward') fabricRef.current.bringObjectForward(activeObject);
    if (action === 'backward') fabricRef.current.sendObjectBackwards(activeObject);
    if (action === 'front') fabricRef.current.bringObjectToFront(activeObject);
    if (action === 'back') fabricRef.current.sendObjectToBack(activeObject);
    fabricRef.current.renderAll();
    recordHistory();
  };

  // Keyboard shortcut listener for Delete & Undo/Redo
  const handleKeyDown = useCallback((e) => {
    if (!fabricRef.current) return;

    // Check if user is actively typing inside an input or editable textbox
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || activeObject?.isEditing) {
      return;
    }

    // Delete / Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && activeObject) {
      fabricRef.current.remove(activeObject);
      setActiveObject(null);
      fabricRef.current.renderAll();
      recordHistory();
    }

    // Ctrl+Z (Undo) / Ctrl+Y (Redo)
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    }
  }, [activeObject, recordHistory, historyStack, redoStack]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const addToCart = async () => {
    if (!template) return;
    setAddingToCart(true);
    try {
      let productId = product?._id;
      if (!productId) {
        const res = await axiosInstance.get(`/products/${slug}`);
        productId = res.data?.product?._id;
      }

      if (!productId) throw new Error('Product not found');

      // Build complete configuration from schema
      let finalConfig = { ...productConfig };
      if (productSchema?.attributes) {
        productSchema.attributes.forEach((attr) => {
          if (!finalConfig[attr.key] && attr.options && attr.options.length > 0) {
            finalConfig[attr.key] = attr.options[0].value;
          }
        });
      }

      const finalQty = orderQuantity || productSchema?.quantityTiers?.[0] || 100;

      // Add to Cart payload
      await axiosInstance.post('/cart/items', {
        productId,
        quantity: finalQty,
        configuration: finalConfig,
        designType: 'TEMPLATE',
        template: {
          templateId: template._id || templateId,
          customFields,
          activeSide,
          variantId: selectedVariantId
        }
      });

      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart. ' + (err.response?.data?.message || err.message || ''));
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[var(--hover)] font-sans overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <div className="font-black text-xl tracking-tighter text-blue-600">PrintWala</div>
          <div className="h-4 w-px bg-[var(--border)]"></div>
          <div className="text-sm font-semibold text-[var(--text-main)] capitalize">Product: {slug?.replace(/-/g, ' ')}</div>
          {template && (
            <>
              <div className="h-4 w-px bg-[var(--border)]"></div>
              <div className="text-sm text-[var(--text-muted)] font-medium">Template: {template.name}</div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button 
            type="button" 
            title="Undo (Ctrl+Z)"
            onClick={handleUndo}
            disabled={historyStack.length <= 1}
            className="p-2 hover:bg-[var(--hover)] rounded-md text-[var(--text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Undo className="w-4 h-4" />
          </button>

          {/* Redo Button */}
          <button 
            type="button" 
            title="Redo (Ctrl+Y)"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 hover:bg-[var(--hover)] rounded-md text-[var(--text-muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Redo className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1"></div>

          {/* Save Draft Button */}
          <button 
            type="button"
            onClick={handleSaveDraft}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${
              draftSavedMsg 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 border border-emerald-300' 
                : 'text-[var(--text-main)] hover:bg-[var(--hover)] border border-[var(--border)]'
            }`}
          >
            {draftSavedMsg ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
            {draftSavedMsg ? 'Saved ✓' : 'Save Draft'}
          </button>

          {/* Preview Button */}
          <button 
            type="button"
            onClick={handleOpenPreview}
            className="px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--hover)] border border-[var(--border)] rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" /> Preview
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1"></div>

          {/* Add to Cart Button */}
          <button 
            type="button"
            onClick={addToCart} 
            disabled={addingToCart || !template}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Icon Menu */}
        <div className="w-20 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col items-center py-3 gap-2 shrink-0 z-20 shadow-xs">
          <button 
            type="button"
            onClick={() => setActiveTool('customize')} 
            className={`flex flex-col items-center gap-1 p-2.5 w-full transition-colors ${
              activeTool === 'customize' 
                ? 'text-blue-600 bg-blue-50/70 border-r-2 border-blue-600 font-bold' 
                : 'text-[var(--text-muted)] hover:text-blue-600 hover:bg-[var(--bg-subtle)] font-medium'
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
                : 'text-[var(--text-muted)] hover:text-blue-600 hover:bg-[var(--bg-subtle)] font-medium'
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
                : 'text-[var(--text-muted)] hover:text-blue-600 hover:bg-[var(--bg-subtle)] font-medium'
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
                : 'text-[var(--text-muted)] hover:text-blue-600 hover:bg-[var(--bg-subtle)] font-medium'
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
                : 'text-[var(--text-muted)] hover:text-blue-600 hover:bg-[var(--bg-subtle)] font-medium'
            }`}
          >
            <Square className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-tight">Shapes</span>
          </button>
        </div>

        {/* Left Dynamic Tool Panel */}
        <div className="w-80 bg-[var(--bg-card)] border-r border-[var(--border)] shrink-0 flex flex-col shadow-sm z-10">
          
          {/* 1. CUSTOMIZE TOOL PANEL */}
          {activeTool === 'customize' && (
            <>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]">Customize Card</span>
                <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-semibold capitalize">{activeSide} Side</span>
              </div>
              <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
                {loading ? (
                  <div className="text-xs text-[var(--text-muted)] italic">Loading template...</div>
                ) : template ? (
                  <>
                    {/* Preview Image */}
                    {(template.thumbnail || template.previewFront) && (
                      <div className="w-full aspect-[1.714/1] bg-[var(--bg-card)] border border-[var(--border)] p-1 rounded relative group/img overflow-hidden shadow-xs">
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
                      <div className="flex flex-col gap-1.5 pb-3 border-b border-[var(--border)]">
                        <label className="text-xs font-semibold text-[var(--text-muted)]">Color Variant</label>
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
                                  isSelected ? 'border-blue-600 ring-2 ring-blue-300 scale-110 shadow-sm' : 'border-[var(--border-strong)] hover:scale-105'
                                }`}
                                style={{ backgroundColor: v.colorCode }}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--bg-card)] shadow-xs" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Editable Text Fields */}
                    <div className="flex flex-col gap-3">
                      <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Template Fields</div>
                      {template.editableFields?.length > 0 ? (
                        template.editableFields.map((field) => (
                          <div key={field._id || field.key} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[var(--text-muted)]">{field.label}</label>
                            <input
                              type="text"
                              value={customFields[field.key] ?? field.defaultValue ?? ''}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              className="w-full text-sm p-2 border border-[var(--border-strong)] rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-[var(--text-muted)] italic">No editable fields.</div>
                      )}
                    </div>

                    {/* Print & Paper Options */}
                    {productSchema && (
                      <div className="flex flex-col gap-3 pt-3 border-t border-[var(--border)]">
                        <div className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Print &amp; Paper Options</div>
                        {productSchema.attributes?.map((attr) => (
                          <div key={attr.key} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[var(--text-muted)]">
                              {attr.label || attr.key}
                            </label>
                            <select
                              value={productConfig[attr.key] || attr.options?.[0]?.value || ''}
                              onChange={(e) => setProductConfig(prev => ({ ...prev, [attr.key]: e.target.value }))}
                              className="w-full text-xs p-2 border border-[var(--border-strong)] rounded bg-[var(--bg-card)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-[var(--text-main)]"
                            >
                              {attr.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label || opt.value} {opt.priceModifier ? `(+₹${opt.priceModifier})` : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {/* Quantity Selection */}
                        {productSchema.quantityTiers && productSchema.quantityTiers.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[var(--text-muted)]">Quantity</label>
                            <select
                              value={orderQuantity}
                              onChange={(e) => setOrderQuantity(Number(e.target.value))}
                              className="w-full text-xs p-2 border border-[var(--border-strong)] rounded bg-[var(--bg-card)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-[var(--text-main)]"
                            >
                              {productSchema.quantityTiers.map((qty) => (
                                <option key={qty} value={qty}>
                                  {qty} Units
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-[var(--text-muted)] italic">No template loaded.</div>
                )}
              </div>
            </>
          )}

          {/* 2. TEMPLATES TOOL PANEL */}
          {activeTool === 'templates' && (
            <>
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]">Design Templates</span>
                <span className="text-xs text-[var(--text-faint)] font-medium">{productTemplates.length} available</span>
              </div>
              <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1">
                {loadingTemplates ? (
                  <div className="text-xs text-[var(--text-muted)] italic">Loading templates...</div>
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
                            : 'border-[var(--border)] hover:border-blue-400 hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <div className="w-full aspect-[1.714/1] bg-[var(--hover)] rounded overflow-hidden border border-[var(--border)] mb-2 relative">
                          {tpl.previewFront ? (
                            <img src={tpl.previewFront} alt={tpl.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-faint)]">Preview</div>
                          )}
                          {isCurrent && (
                            <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white p-1 rounded-full shadow-xs">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-main)]">{tpl.name}</span>
                          <span className="text-[11px] text-blue-600 font-semibold group-hover:underline">Select</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-[var(--text-muted)] italic">No templates available for this product.</div>
                )}
              </div>
            </>
          )}

          {/* 3. UPLOADS TOOL PANEL */}
          {activeTool === 'uploads' && (
            <>
              <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--text-main)]">Uploads</div>
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
                  <Upload className="w-4 h-4" /> Upload Logo or Image
                </button>
                <p className="text-[11px] text-[var(--text-faint)] text-center">Supports PNG, JPG, SVG, WebP</p>

                {/* DPI Warning Badge */}
                {uploadDpiWarning && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{uploadDpiWarning}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Your Images</span>
                    <span className="text-[11px] text-[var(--text-faint)]">Click to add</span>
                  </div>
                  {uploadedImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedImages.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          onClick={() => addImageToCanvas(imgUrl)}
                          title="Click to add to canvas"
                          className="aspect-square bg-[var(--bg-subtle)] rounded border border-[var(--border)] p-1 cursor-pointer hover:border-blue-500 hover:shadow-xs transition-all flex items-center justify-center overflow-hidden"
                        >
                          <img src={imgUrl} alt="uploaded" className="max-h-full max-w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-[var(--border)] rounded-lg text-center text-xs text-[var(--text-faint)]">
                      No images uploaded yet. Upload your logo to place it on the card!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* 4. TEXT TOOL PANEL */}
          {activeTool === 'text' && (
            <>
              <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--text-main)]">Add Text</div>
              <div className="p-4 overflow-y-auto flex flex-col gap-3 flex-1">
                <button
                  type="button"
                  onClick={() => addTextElement('Add a Heading', { fontSize: 32, fontWeight: 'bold' })}
                  className="w-full p-3 bg-[var(--bg-subtle)] hover:bg-blue-50/60 border border-[var(--border)] hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-xl font-black text-[var(--text-main)]">Add a Heading</div>
                  <div className="text-[11px] text-[var(--text-faint)]">32px Bold text</div>
                </button>

                <button
                  type="button"
                  onClick={() => addTextElement('Add a Subheading', { fontSize: 20, fontWeight: '600', fill: '#475569' })}
                  className="w-full p-3 bg-[var(--bg-subtle)] hover:bg-blue-50/60 border border-[var(--border)] hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-base font-bold text-[var(--text-main)]">Add a Subheading</div>
                  <div className="text-[11px] text-[var(--text-faint)]">20px Medium text</div>
                </button>

                <button
                  type="button"
                  onClick={() => addTextElement('Add body text', { fontSize: 14, fill: '#64748b' })}
                  className="w-full p-3 bg-[var(--bg-subtle)] hover:bg-blue-50/60 border border-[var(--border)] hover:border-blue-400 rounded-lg text-left transition-colors"
                >
                  <div className="text-sm font-normal text-[var(--text-muted)]">Add body text</div>
                  <div className="text-[11px] text-[var(--text-faint)]">14px Regular paragraph</div>
                </button>

                <div className="pt-2">
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Preset Badges</div>
                  <div className="flex gap-2 flex-wrap">
                    {['PREMIUM', 'SINCE 2026', 'ISO 9001', 'OFFICIAL', 'LIMITED'].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => addTextElement(preset, { fontSize: 12, fontWeight: 'bold', fill: '#1e3a8a', charSpacing: 100 })}
                        className="px-2.5 py-1 bg-[var(--hover)] hover:bg-blue-100 text-[var(--text-main)] hover:text-blue-700 text-xs font-bold rounded border border-[var(--border)] transition-colors"
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
              <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--text-main)]">Add Shapes</div>
              <div className="p-4 overflow-y-auto flex flex-col gap-4 flex-1">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] mb-1.5 block">Shape Color</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a', '#ffffff'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedShapeColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          selectedShapeColor === c ? 'border-blue-600 ring-2 ring-blue-300 scale-110' : 'border-[var(--border-strong)] hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={selectedShapeColor} 
                      onChange={e => setSelectedShapeColor(e.target.value)}
                      className="w-6 h-6 p-0 border border-[var(--border-strong)] rounded cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => addShapeElement('rect')}
                    className="p-3 bg-[var(--bg-subtle)] hover:bg-blue-500/10 border border-[var(--border)] rounded-lg flex flex-col items-center gap-2 text-[var(--text-main)] hover:text-blue-600 transition-colors"
                  >
                    <Square className="w-8 h-8" />
                    <span className="text-xs font-semibold">Rectangle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('rounded-rect')}
                    className="p-3 bg-[var(--bg-subtle)] hover:bg-blue-500/10 border border-[var(--border)] rounded-lg flex flex-col items-center gap-2 text-[var(--text-main)] hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 border-2 border-current rounded-md" />
                    <span className="text-xs font-semibold">Rounded Rect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('circle')}
                    className="p-3 bg-[var(--bg-subtle)] hover:bg-blue-500/10 border border-[var(--border)] rounded-lg flex flex-col items-center gap-2 text-[var(--text-main)] hover:text-blue-600 transition-colors"
                  >
                    <Circle className="w-8 h-8" />
                    <span className="text-xs font-semibold">Circle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('triangle')}
                    className="p-3 bg-[var(--bg-subtle)] hover:bg-blue-500/10 border border-[var(--border)] rounded-lg flex flex-col items-center gap-2 text-[var(--text-main)] hover:text-blue-600 transition-colors"
                  >
                    <Triangle className="w-8 h-8" />
                    <span className="text-xs font-semibold">Triangle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addShapeElement('line')}
                    className="p-3 col-span-2 bg-[var(--bg-subtle)] hover:bg-blue-500/10 border border-[var(--border)] rounded-lg flex items-center justify-center gap-2 text-[var(--text-main)] hover:text-blue-600 transition-colors"
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
        <div ref={containerRef} className="flex-1 bg-[var(--hover)] relative flex flex-col items-center justify-center overflow-hidden p-6">
          
          {/* Card Side Switcher (Front / Back) */}
          <div className="mb-4 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border)] shadow-xs flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={() => handleSideToggle('front')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeSide === 'front'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
              }`}
            >
              Front Side
            </button>
            <button
              type="button"
              onClick={() => handleSideToggle('back')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                activeSide === 'back'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
              }`}
            >
              Back Side
            </button>
          </div>

          {/* Canvas Wrapper with Zoom & Print Guides */}
          <div 
            className="relative transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* The Actual Canvas Box */}
            <div className="shadow-2xl border border-slate-300 bg-white rounded-sm overflow-hidden relative">
              <canvas ref={canvasRef} id="design-canvas" />

              {/* Print Guides Overlay (Bleed & Safe Area) */}
              {showGuides && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {/* Outer Bleed boundary */}
                  <div className="absolute inset-0 border border-dashed border-red-500/70">
                    <span className="absolute top-1 left-1.5 text-[9px] font-bold text-red-500 tracking-wider bg-white/80 px-1 rounded">
                      BLEED (CUT LINE)
                    </span>
                  </div>
                  {/* Inner Safe Area boundary */}
                  <div className="absolute inset-5 border border-dashed border-emerald-500/70">
                    <span className="absolute bottom-1 right-1.5 text-[9px] font-bold text-emerald-600 tracking-wider bg-white/80 px-1 rounded">
                      SAFE AREA (KEEP TEXT INSIDE)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Floating Status & Zoom Controls Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] px-4 py-1.5 rounded-full shadow-lg border border-[var(--border)] flex items-center gap-3 text-xs font-bold text-[var(--text-muted)] z-10">
            <span>Size: 600 × 350 px</span>
            
            <div className="w-px h-3 bg-[var(--border)]"></div>

            {/* Guides Toggle */}
            <button 
              type="button"
              onClick={() => setShowGuides(prev => !prev)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                showGuides ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
              }`}
            >
              Guides: {showGuides ? 'ON' : 'OFF'}
            </button>

            <div className="w-px h-3 bg-[var(--border)]"></div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button 
                type="button" 
                title="Zoom Out"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.15))}
                className="p-1 hover:bg-[var(--hover)] rounded text-[var(--text-muted)]"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
              <button 
                type="button" 
                title="Zoom In"
                onClick={() => setZoom(prev => Math.min(1.8, prev + 0.15))}
                className="p-1 hover:bg-[var(--hover)] rounded text-[var(--text-muted)]"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                title="Reset Zoom (100%)"
                onClick={() => setZoom(1)}
                className="p-1 hover:bg-[var(--hover)] rounded text-[var(--text-faint)] hover:text-[var(--text-muted)]"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-72 bg-[var(--bg-card)] border-l border-[var(--border)] shrink-0 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--text-main)] flex items-center justify-between">
            <span>Properties</span>
            {activeObject && (
              <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[var(--hover)] text-[var(--text-muted)] rounded font-semibold">
                {activeObject.type}
              </span>
            )}
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            {activeObject ? (
              <div className="flex flex-col gap-4">
                
                {/* 1. Color Picker */}
                {(activeObject.type?.toLowerCase() === 'textbox' ||
                  activeObject.type?.toLowerCase() === 'text' ||
                  activeObject.type?.toLowerCase() === 'rect' ||
                  activeObject.type?.toLowerCase() === 'circle' ||
                  activeObject.type?.toLowerCase() === 'triangle') && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[var(--text-muted)]">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeObject.fill || '#000000'}
                        onChange={(e) => handlePropertyChange('fill', e.target.value)}
                        className="w-9 h-8 cursor-pointer rounded border border-[var(--border)] p-0.5"
                      />
                      <span className="text-xs font-mono text-[var(--text-muted)] uppercase">{activeObject.fill || '#000000'}</span>
                    </div>
                  </div>
                )}

                {/* 2. Text Specific Controls */}
                {(activeObject.type?.toLowerCase() === 'textbox' || activeObject.type?.toLowerCase() === 'text') && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Font Size</label>
                      <input
                        type="number"
                        value={activeObject.fontSize || 20}
                        onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value, 10))}
                        className="w-full text-sm p-2 border border-[var(--border-strong)] rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Font Family</label>
                      <select
                        value={activeObject.fontFamily || 'Arial'}
                        onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                        className="w-full text-xs p-2 border border-[var(--border-strong)] rounded focus:outline-none focus:border-blue-500 bg-[var(--bg-card)]"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Impact">Impact</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[var(--text-muted)]">Formatting & Alignment</label>
                      <div className="flex items-center gap-1 border border-[var(--border)] rounded p-1 bg-[var(--bg-subtle)]">
                        <button
                          type="button"
                          title="Bold"
                          onClick={() => handlePropertyChange('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                          className={`p-1.5 rounded text-xs transition-colors ${activeObject.fontWeight === 'bold' ? 'bg-[var(--bg-card)] shadow-xs font-bold text-blue-600' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Italic"
                          onClick={() => handlePropertyChange('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`p-1.5 rounded text-xs transition-colors ${activeObject.fontStyle === 'italic' ? 'bg-[var(--bg-card)] shadow-xs font-bold text-blue-600' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-4 bg-[var(--border)] mx-1"></div>
                        <button
                          type="button"
                          title="Align Left"
                          onClick={() => handlePropertyChange('textAlign', 'left')}
                          className={`p-1.5 rounded text-xs transition-colors ${activeObject.textAlign === 'left' ? 'bg-[var(--bg-card)] shadow-xs text-blue-600' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Align Center"
                          onClick={() => handlePropertyChange('textAlign', 'center')}
                          className={`p-1.5 rounded text-xs transition-colors ${activeObject.textAlign === 'center' ? 'bg-[var(--bg-card)] shadow-xs text-blue-600' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Align Right"
                          onClick={() => handlePropertyChange('textAlign', 'right')}
                          className={`p-1.5 rounded text-xs transition-colors ${activeObject.textAlign === 'right' ? 'bg-[var(--bg-card)] shadow-xs text-blue-600' : 'text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
                        >
                          <AlignRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* 3. Opacity Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-muted)]">
                    <span>Opacity</span>
                    <span>{Math.round((activeObject.opacity ?? 1) * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={activeObject.opacity ?? 1}
                    onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                </div>

                {/* 4. Layer Arrangement */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--border)]">
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Layer Position</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLayer('forward')}
                      className="px-2.5 py-1.5 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] border border-[var(--border)] rounded text-xs font-medium text-[var(--text-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <ArrowUp className="w-3 h-3" /> Forward
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLayer('backward')}
                      className="px-2.5 py-1.5 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] border border-[var(--border)] rounded text-xs font-medium text-[var(--text-main)] flex items-center justify-center gap-1 transition-colors"
                    >
                      <ArrowDown className="w-3 h-3" /> Backward
                    </button>
                  </div>
                </div>

                {/* 5. Delete Object */}
                <div className="pt-2 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => {
                      if (fabricRef.current && activeObject) {
                        fabricRef.current.remove(activeObject);
                        setActiveObject(null);
                        fabricRef.current.renderAll();
                        recordHistory();
                      }
                    }}
                    className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Element
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-xs text-[var(--text-muted)] italic p-4 text-center border-2 border-dashed border-[var(--border)] rounded-lg">
                Click any text, shape, or logo on the card to edit its properties, layers, and colors.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Realistic Card Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[var(--bg-card)] rounded-2xl max-w-2xl w-full shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-[var(--text-main)] text-base">Design Proof & Preview</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 hover:bg-[var(--hover)] rounded-full text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center justify-center bg-[var(--bg-subtle)]">
              {/* Preview Tabs */}
              <div className="mb-4 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--border)] shadow-xs flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewTab('front')}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition-colors ${
                    previewTab === 'front' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
                  }`}
                >
                  Front Side Proof
                </button>
                {template?.previewBack && (
                  <button
                    type="button"
                    onClick={() => setPreviewTab('back')}
                    className={`px-4 py-1 text-xs font-bold rounded-md transition-colors ${
                      previewTab === 'back' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
                    }`}
                  >
                    Back Side Proof
                  </button>
                )}
              </div>

              {/* Realistic Card Mockup Shadow Box */}
              <div className="w-[480px] aspect-[1.714/1] bg-white rounded-xl shadow-2xl border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                {previewTab === 'front' ? (
                  previewDataUrl ? (
                    <img src={previewDataUrl} alt="Front proof" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-xs text-[var(--text-faint)]">Loading proof...</div>
                  )
                ) : (
                  <img src={template.previewBack} alt="Back proof" className="w-full h-full object-contain rounded-lg" />
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>3.5" × 2.0" Standard Commercial Visiting Card Proof (300 DPI)</span>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadProof}
                className="px-4 py-2 bg-[var(--hover)] hover:bg-[var(--border)] text-[var(--text-main)] text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[var(--text-muted)]" /> Download Proof (PNG)
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 border border-[var(--border-strong)] text-[var(--text-main)] text-xs font-semibold rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    addToCart();
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Approve & Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
