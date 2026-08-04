'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, LayoutTemplate, ArrowRight, ShieldCheck, Paintbrush } from 'lucide-react';
import ArtworkUploader from './ArtworkUploader.jsx';
import Modal from '../ui/Modal.jsx';
import { useConfiguratorStore } from '@/store/configuratorStore.js';

export default function DesignExperienceModal({ isOpen, onClose, product }) {
  const router = useRouter();
  const { setDesignReady } = useConfiguratorStore();
  const [selectedExp, setSelectedExp] = useState(null); // 'UPLOAD' | 'TEMPLATE' | 'CUSTOM'

  if (!isOpen) return null;

  const handleSelectTemplate = () => {
    onClose();
    router.push(`/products/${product.slug || product._id}/templates`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Design"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 select-none">
        {!selectedExp ? (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <h3 className="text-lg font-black text-slate-900">How Would You Like To Supply Artwork?</h3>
              <p className="text-xs text-slate-600 font-normal">
                Select whether you already have an artwork file to upload or prefer customizing one of our predefined layouts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Option A: Upload Own Design */}
              <button
                onClick={() => setSelectedExp('UPLOAD')}
                className="p-5 rounded-xl border border-slate-200 hover:border-[#0082CA] bg-white hover:bg-blue-50/30 text-left transition-all group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#0082CA] flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Upload My Design</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1">✔ Drag & Drop upload</p>
                    <p className="flex items-center gap-1">✔ JPG, PNG, PDF, AI, PSD</p>
                    <p className="flex items-center gap-1">✔ Instant upload preview</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-[#0082CA] group-hover:translate-x-1 transition-transform">
                  <span>Upload File</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>

              {/* Option B: Choose a Template */}
              <button
                onClick={handleSelectTemplate}
                className="p-5 rounded-xl border border-slate-200 hover:border-[#C71578] bg-white hover:bg-pink-50/30 text-left transition-all group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-pink-50 text-[#C71578] flex items-center justify-center group-hover:scale-105 transition-transform border border-pink-100">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Browse Templates</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1">✔ Ready-made designs</p>
                    <p className="flex items-center gap-1">✔ Multiple categories</p>
                    <p className="flex items-center gap-1">✔ Preview before selecting</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-[#C71578] group-hover:translate-x-1 transition-transform">
                  <span>View Library</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>

              {/* Option C: Hire a Designer */}
              <button
                onClick={() => {
                  setDesignReady('CUSTOM', { serviceFee: 499, status: 'pending_brief' });
                  onClose();
                }}
                className="p-5 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 text-left transition-all group flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                <div className="space-y-3 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-emerald-100">
                    <Paintbrush className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Need a Custom Design?</h3>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="flex items-center gap-1 text-emerald-700 font-medium pb-1">Our designers will create it.</p>
                    <p className="flex items-center gap-1">✔ Professional Design</p>
                    <p className="flex items-center gap-1">✔ Unlimited Revisions</p>
                    <p className="flex items-center gap-1">✔ Print Ready Files</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform relative z-10">
                  <span className="flex items-center">
                    Request Design
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-800">From ₹199</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedExp(null)}
              className="text-xs font-bold text-[#0082CA] hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Design Options
            </button>
            <ArtworkUploader product={product} onCloseModal={onClose} />
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
            <span>Standard commercial printing file submission</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">Secure server storage</span>
        </div>
      </div>
    </Modal>
  );
}
