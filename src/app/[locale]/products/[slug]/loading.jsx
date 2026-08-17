import React from 'react';

export default function Loading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 lg:pb-12">
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 select-none font-sans">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-slate-200 rounded w-[250px] animate-pulse mb-4" />
        
        {/* Main Product Stage Skeleton */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
          
          {/* LEFT COL: Gallery Skeleton */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 self-start space-y-6 z-10">
            <div className="w-full aspect-square bg-slate-200 rounded-lg animate-pulse" />
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-slate-200 rounded animate-pulse" />
              <div className="w-24 h-24 bg-slate-200 rounded animate-pulse" />
              <div className="w-24 h-24 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          
          {/* RIGHT COL: Detailed Information Skeleton */}
          <div className="w-full lg:w-1/2 space-y-8 pb-10">
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse mt-4" />
              <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-4/6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <div className="h-14 bg-slate-200 rounded w-full animate-pulse" />
              <div className="h-14 bg-slate-200 rounded w-full animate-pulse" />
              <div className="h-14 bg-slate-200 rounded w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
