'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function FaqAccordion({ faqs }) {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center text-sm hover:bg-slate-50 transition-colors">
            {faq.q}
            <ChevronRight className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-90 text-[#0082CA]' : 'text-slate-400'}`} />
          </button>
          {activeFaq === idx && (
            <div className="px-5 pb-5 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 bg-slate-50">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
