'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqAccordion({ faqs }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const renderFaq = (faq, idx) => {
    const isActive = activeFaq === idx;
    
    return (
      <div key={idx} className={`bg-[var(--bg-card)] transition-all duration-500 ${isActive ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-10 relative' : ''}`}>
        <button 
          onClick={() => setActiveFaq(isActive ? null : idx)} 
          className="w-full px-5 py-4 text-left font-bold text-[var(--text-main)] flex justify-between items-center text-[15px] transition-colors focus:outline-none"
        >
          <span className="pr-4">{faq.q || faq.question}</span>
          {isActive ? (
            <Minus className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
          ) : (
            <Plus className="w-5 h-5 text-[var(--text-main)] flex-shrink-0" />
          )}
        </button>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-[14px] text-[var(--text-muted)] leading-relaxed pr-8">
                {faq.a || faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full max-w-6xl mx-auto">
      <div className="flex flex-col border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--bg-card)]">
        {faqs.filter((_, i) => i % 2 === 0).map((faq, i) => renderFaq(faq, i * 2))}
      </div>
      <div className="flex flex-col border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--bg-card)]">
        {faqs.filter((_, i) => i % 2 !== 0).map((faq, i) => renderFaq(faq, i * 2 + 1))}
      </div>
    </div>
  );
}
