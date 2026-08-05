'use client';

import { use } from 'react';
import DesignStudio from '@/components/design-studio/layout/DesignStudio.jsx';

export default function ProductDesignPage({ params }) {
  const unwrappedParams = use(params);

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-100">
      <DesignStudio slug={unwrappedParams.slug} />
    </div>
  );
}
