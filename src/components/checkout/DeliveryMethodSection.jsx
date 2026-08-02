'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';

export default function DeliveryMethodSection({
  methods,
  selectedRuleId,
  subtotal,
  onSelect,
  isLoading,
  onBack,
  onFetchMethods,
  pinCode,
}) {
  const [selected, setSelected] = useState('');
  const effectiveSelected = selected || selectedRuleId || (methods.length > 0 ? methods[0]._id : '');

  useEffect(() => {
    if (pinCode && methods.length === 0) {
      onFetchMethods(pinCode);
    }
  }, [pinCode, methods.length, onFetchMethods]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (effectiveSelected) {
      onSelect(effectiveSelected);
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-slate-200 select-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-slate-900">4. Delivery Method</h2>
        <Badge variant="primary" size="sm">Logistics</Badge>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
        Select a shipping method serviceable for Indian PIN Code <span className="font-mono font-bold text-slate-900">{pinCode}</span>.
      </p>

      {isLoading && methods.length === 0 ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0082CA]"></div>
        </div>
      ) : methods.length === 0 ? (
        <Alert variant="error" title="Delivery Unavailable">
          No delivery methods found for PIN Code {pinCode}. Please verify your delivery address PIN code.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {methods.map((method) => {
              const isFree = method.freeDeliveryThreshold && subtotal >= method.freeDeliveryThreshold;
              const charge = isFree ? 0 : method.charge || 0;
              const isSelected = effectiveSelected === method._id;

              return (
                <label
                  key={method._id}
                  onClick={() => setSelected(method._id)}
                  className={`flex items-center justify-between p-5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0082CA] bg-blue-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={isSelected}
                      onChange={() => setSelected(method._id)}
                      className="mt-1 w-5 h-5 text-[#0082CA] border-slate-300 focus:ring-[#0082CA]"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-slate-900">{method.name}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-normal">
                        Estimated dispatch timeline: {method.estimatedDaysMin}–{method.estimatedDaysMax} working days
                      </p>
                      {method.freeDeliveryThreshold && (
                        <p className="text-[11px] font-bold text-emerald-700 mt-1">
                          {isFree
                            ? '✓ Free commercial shipping applied!'
                            : `Free shipping available on orders over ₹${method.freeDeliveryThreshold.toLocaleString('en-IN')}`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-4">
                    <span className={`text-base font-black ${isFree ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {isFree ? 'FREE' : `₹${charge.toLocaleString('en-IN')}`}
                    </span>
                    {isFree && method.charge > 0 && (
                      <span className="block text-xs text-slate-400 line-through font-semibold">
                        ₹{method.charge.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !effectiveSelected}
            >
              <span>Review Order Summary</span>
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
