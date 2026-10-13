'use client';

import React from 'react';
import { Package, AlertCircle, Info, Check } from 'lucide-react';
import { useConfiguratorStore } from '@/store/configuratorStore.js';
import { cn } from '@/lib/utils.js';

export default function SchemaConfigurator({ schema, isLoading }) {
  const { configuration, updateConfiguration } = useConfiguratorStore();

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-lg border border-[var(--border)] space-y-6 animate-pulse shadow-xs">
        <div className="h-6 bg-[var(--border)] rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-[var(--border)] rounded w-1/4"></div>
              <div className="h-11 bg-[var(--hover)] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!schema || !schema.attributes || schema.attributes.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border)] text-center text-[var(--text-muted)] text-sm shadow-xs">
        No specification schema found for this product. Standard configuration applies.
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] p-6 sm:p-8 rounded-lg border border-[var(--border)] shadow-xs space-y-6 select-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <h3 className="text-base font-black text-[var(--text-main)] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#0082CA]" />
          <span>1. Select Custom Specifications</span>
        </h3>
        <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
          Schema Driven
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schema.attributes.map((attr) => {
          const val = configuration[attr.key];
          const isMissing = attr.required && (val === undefined || val === null || val === '');

          return (
            <div key={attr.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  {attr.label} {attr.required && <span className="text-[#C71578]">*</span>}
                </label>
                {attr.description && (
                  <span className="text-[10px] text-[var(--text-faint)] flex items-center gap-1 cursor-help" title={attr.description}>
                    <Info className="w-3 h-3 text-[#0082CA]" /> Info
                  </span>
                )}
              </div>

              {/* 1. SELECT & SELECT-WITH-IMAGE */}
              {(attr.type === 'select' || attr.type === 'select-with-image') && (
                <div>
                  {attr.options && attr.options.length <= 4 ? (
                    /* Render as clickable pill buttons for <= 4 options */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {attr.options.map((opt) => {
                        const isSelected = val === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateConfiguration(attr.key, opt.value)}
                            className={cn(
                              'px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-between text-left',
                              isSelected
                                ? 'bg-[#0082CA] text-white border-[#0082CA] shadow-xs'
                                : 'bg-[var(--bg-subtle)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--hover)] hover:border-[var(--border-strong)]'
                            )}
                          >
                            <span className="truncate pr-1">{opt.label}</span>
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            ) : opt.priceModifier ? (
                              <span className="text-[10px] text-[var(--text-muted)] shrink-0">+₹{opt.priceModifier}</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Render as clean select dropdown for > 4 options */
                    <select
                      value={val || ''}
                      onChange={(e) => updateConfiguration(attr.key, e.target.value)}
                      className={cn(
                        'w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border rounded-lg text-sm font-semibold text-[var(--text-main)] transition-all cursor-pointer',
                        'focus:outline-none focus:ring-2 focus:ring-[#0082CA]/20 focus:border-[#0082CA]',
                        isMissing ? 'border-amber-300 bg-amber-50/30' : 'border-[var(--border-strong)]'
                      )}
                    >
                      <option value="" disabled>Select {attr.label}</option>
                      {attr.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} {opt.priceModifier ? `(+₹${opt.priceModifier})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* 2. SWATCH (Color or Material pills) */}
              {attr.type === 'swatch' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attr.options?.map((opt) => {
                    const isSelected = val === opt.value;
                    const isHex = opt.image?.startsWith('#');

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateConfiguration(attr.key, opt.value)}
                        className={cn(
                          'px-3.5 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-2',
                          isSelected
                            ? 'bg-[#0082CA] text-white border-[#0082CA] shadow-xs scale-102'
                            : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]'
                        )}
                      >
                        {isHex ? (
                          <span
                            className="w-4 h-4 rounded-full border border-[var(--border-strong)] shadow-2xs shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: opt.image }}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white mix-blend-difference" />}
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-[var(--border)] shrink-0"></span>
                        )}
                        <span>{opt.label}</span>
                        {opt.priceModifier ? <span className="text-[10px] opacity-75">(+₹{opt.priceModifier})</span> : null}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. NUMERIC RANGE (e.g. Banner Dimensions in ft) */}
              {attr.type === 'numeric-range' && (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                        Width ({attr.unit || 'ft'})
                      </span>
                      <input
                        type="number"
                        min={attr.minRange || 1}
                        max={attr.maxRange || 50}
                        step={0.5}
                        value={configuration.width !== undefined ? configuration.width : 3}
                        onChange={(e) => updateConfiguration('width', Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-strong)] rounded-lg text-sm font-bold text-[var(--text-main)] focus:ring-2 focus:ring-[#0082CA]/20 focus:border-[#0082CA] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                        Height ({attr.unit || 'ft'})
                      </span>
                      <input
                        type="number"
                        min={attr.minRange || 1}
                        max={attr.maxRange || 50}
                        step={0.5}
                        value={configuration.height !== undefined ? configuration.height : 2}
                        onChange={(e) => updateConfiguration('height', Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-strong)] rounded-lg text-sm font-bold text-[var(--text-main)] focus:ring-2 focus:ring-[#0082CA]/20 focus:border-[#0082CA] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  {(configuration.width < (attr.minRange || 1) ||
                    configuration.width > (attr.maxRange || 50) ||
                    configuration.height < (attr.minRange || 1) ||
                    configuration.height > (attr.maxRange || 50)) && (
                    <p className="text-[11px] font-semibold text-[#C71578] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Dimensions must be between {attr.minRange || 1} and {attr.maxRange || 50} {attr.unit || 'ft'}.</span>
                    </p>
                  )}
                </div>
              )}

              {isMissing && (
                <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Required selection</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
