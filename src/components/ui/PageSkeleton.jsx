import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-subtle)]">
      {/* Banner Skeleton */}
      <div className="w-full h-[250px] md:h-[350px] bg-[var(--border)] animate-pulse relative overflow-hidden" />
      
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-72 shrink-0 space-y-6">
          <div className="h-6 w-32 bg-[var(--border)] rounded animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-full bg-[var(--border)] rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 w-full">
          <div className="h-8 w-48 bg-[var(--border)] rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-[380px] bg-[var(--border)] rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
