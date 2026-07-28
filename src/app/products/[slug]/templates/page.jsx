'use client';

import { useState, Suspense, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LayoutTemplate, ArrowLeft, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Eye, Edit3 } from 'lucide-react';
import axiosInstance from '../../../../services/axiosInstance.js';
import { useConfiguratorStore } from '../../../../store/configuratorStore.js';
import Button from '../../../../components/ui/Button.jsx';
import Card from '../../../../components/ui/Card.jsx';
import Badge from '../../../../components/ui/Badge.jsx';

function TemplateCustomizerContent({ slug }) {
  const router = useRouter();
  const { setDesignReady } = useConfiguratorStore();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  // 1. Fetch Product context
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['productDetail', slug],
    queryFn: () => axiosInstance.get(`/products/${slug}`),
    retry: false,
  });

  const product = prodData?.data?.product || null;

  // 2. Fetch Templates for this Product
  const { data: tmplData, isLoading: tmplLoading } = useQuery({
    queryKey: ['productTemplates', slug],
    queryFn: () => axiosInstance.get(`/templates/product/${slug}`),
    enabled: !!slug,
    retry: false,
  });

  const templates = tmplData?.data?.templates || [];

  const handleSelectTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setIsSaved(false);
    // Initialize default values strictly from tmpl.editableFields (Data-Driven architecture)
    const defaults = {};
    if (tmpl.editableFields && Array.isArray(tmpl.editableFields)) {
      tmpl.editableFields.forEach((field) => {
        defaults[field.key] = field.defaultValue || '';
      });
    }
    setCustomFields(defaults);
  };

  const handleFieldChange = (key, val) => {
    setCustomFields((prev) => ({ ...prev, [key]: val }));
    setIsSaved(false);
  };

  const handleSaveCustomization = (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setDesignReady('TEMPLATE', {
      templateId: selectedTemplate._id,
      templateName: selectedTemplate.name,
      previewUrl: selectedTemplate.previewUrl,
      customFields,
    });
    setIsSaved(true);
  };

  if (prodLoading || tmplLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#D63384] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading layout templates...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href={`/products/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A58CA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product Configurator
        </Link>
        <span className="text-xs font-bold text-[#D63384] uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Template Customisation
        </span>
      </div>

      {/* Header */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">
            {product?.name || 'Print Item'} Layout Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Choose & Customise Predefined Layout
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
            Select a template layout below and edit its predefined text fields in your browser.
          </p>
        </div>
        {selectedTemplate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTemplate(null)}
            className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
          >
            Change Template Selection
          </Button>
        )}
      </Card>

      {!selectedTemplate ? (
        /* Templates Grid */
        templates.length === 0 ? (
          <Card className="p-16 text-center max-w-lg mx-auto space-y-4 border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <LayoutTemplate className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Templates Available Yet</h3>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              We are expanding our layout library for this item. Please use the Custom Artwork Upload option to submit your graphic file.
            </p>
            <Link href={`/products/${slug}`}>
              <Button variant="primary" size="sm">Return to Configurator</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {templates.map((tmpl) => (
              <Card
                key={tmpl._id}
                hover
                className="overflow-hidden flex flex-col justify-between group border-slate-200"
              >
                <div>
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={tmpl.previewUrl || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80'}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white px-2.5 py-1 rounded-md text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-xs">
                      <Eye className="w-3 h-3" /> {tmpl.editableFields?.length || 0} Editable Fields
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-base font-black text-slate-900 group-hover:text-[#D63384] transition-colors">
                      {tmpl.name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {tmpl.tags?.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="w-full group-hover:bg-[#D63384] group-hover:border-[#D63384]"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Select & Customise</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Template Customizer Editor (Strictly Data-Driven!) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Template Preview Card (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#D63384] uppercase tracking-widest block">
                  Active Layout Preview
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedTemplate.name}</h3>
              </div>
              <Badge variant="accent" size="sm">Dynamic Form</Badge>
            </div>

            <div className="relative aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center">
              <img
                src={selectedTemplate.previewUrl || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'}
                alt={selectedTemplate.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-normal text-slate-700 shadow-xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0A58CA]" />
                <span>Live Customisation Data Preview:</span>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {Object.entries(customFields).map(([k, v]) => (
                  <div key={k} className="bg-white p-2.5 rounded-lg border border-slate-200 truncate">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">{k}</span>
                    <span className="text-xs font-black text-slate-900 truncate block mt-0.5" title={String(v || '—')}>{String(v || '—')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Editable Fields Form (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#D63384]" />
                <span>Edit Predefined Text Fields</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Enter your text details below. Form fields are dynamically generated from schema layout definitions.
              </p>
            </div>

            <form onSubmit={handleSaveCustomization} className="space-y-5">
              {!selectedTemplate.editableFields || selectedTemplate.editableFields.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 font-normal">
                  This layout has no custom text fields configured. You may save this template directly.
                </div>
              ) : (
                selectedTemplate.editableFields.map((field, idx) => (
                  <div key={field.key || idx} className="space-y-1 w-full">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {field.label || field.key}
                    </label>
                    <input
                      type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                      placeholder={`Enter ${field.label || field.key}...`}
                      value={customFields[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D63384]/20 focus:border-[#D63384] transition-all"
                    />
                  </div>
                ))
              )}

              {!isSaved ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#D63384] hover:bg-[#b02a6c] focus:ring-[#D63384] shadow-md mt-4"
                >
                  <span>Verify & Save Customisation</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-4 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-950">Template Customisation Saved</h4>
                    <p className="text-xs text-emerald-800 mt-1 font-normal">
                      Your personalized layout options are attached to your configurator session.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => router.push(`/products/${slug}`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-xs"
                  >
                    <span>Return to Product Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TemplateCustomizerPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#D63384] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading layout templates...</p>
      </div>
    }>
      <TemplateCustomizerContent slug={unwrappedParams.slug} />
    </Suspense>
  );
}
