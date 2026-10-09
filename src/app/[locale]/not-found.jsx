import { Link } from '@/i18n/routing.js';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAFCFF] text-slate-800 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-slate-200 mb-6">404</h1>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex px-8 py-3 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-all shadow-md shadow-[#0082CA]/20"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
