'use client';

import React from 'react';

export default function CheckoutProgress({ currentStep, onStepClick }) {
  const steps = [
    { id: 1, name: 'Contact' },
    { id: 2, name: 'Delivery Address' },
    { id: 3, name: 'Billing & GST' },
    { id: 4, name: 'Delivery Method' },
    { id: 5, name: 'Review' },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center space-x-2 ${
                  isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#1E3A8A] text-white ring-4 ring-[#1E3A8A]/20 shadow-md'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs md:text-sm font-semibold ${
                    isCurrent ? 'text-[#1E3A8A]' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 md:mx-4 transition-colors ${
                    step.id < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
