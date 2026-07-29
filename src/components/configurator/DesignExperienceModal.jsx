'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, LayoutTemplate, ArrowRight, ShieldCheck } from 'lucide-react';
import ArtworkUploader from './ArtworkUploader.jsx';
import Modal from '../ui/Modal.jsx';

export default function DesignExperienceModal({ isOpen, onClose, product }) {
  const router = useRouter();
  const [selectedExp, setSelectedExp] = useState(null); // 'UPLOAD' | 'TEMPLATE'

  if (!isOpen) return null;

  const handleSelectTemplate = () => {
    onClose();
    router.push(`/products/${product.slug || product._id}/templates`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Design Method"
      maxWidth="max-w-3xl"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Option A: Upload Own Design */}
              <button
                onClick={() => setSelectedExp('UPLOAD')}
                className="p-6 rounded-2xl border border-slate-200 hover:border-[#0082CA] bg-white hover:bg-blue-50/20 text-left transition-all group flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0082CA] flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Upload Your Own Design</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Upload your artwork file (PDF, AI, EPS, PNG, or WEBP). Our staff will review your file resolution and bleed margin boundaries before press.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-[#0082CA] group-hover:translate-x-1 transition-transform">
                  <span>Upload Artwork File</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>

              {/* Option B: Choose a Template */}
              <button
                onClick={handleSelectTemplate}
                className="p-6 rounded-2xl border border-slate-200 hover:border-[#C71578] bg-white hover:bg-pink-50/20 text-left transition-all group flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#C71578] flex items-center justify-center group-hover:scale-105 transition-transform border border-pink-100">
                    <LayoutTemplate className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Customise Ready-Made Template</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Browse our structured layout library for {product.name} and fill in personalized text details directly in your browser.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-bold text-[#C71578] group-hover:translate-x-1 transition-transform">
                  <span>Browse Template Library</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
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
