import './globals.css';
import { fontDisplay, fontBody } from '@/app/fonts.js';

export default function RootNotFound() {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="font-sans antialiased bg-[var(--bg-page)] text-[var(--text-main)] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--bg-card)] p-8 sm:p-10 rounded-2xl shadow-sm border border-[var(--border)] text-center transition-all">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <a href="/" className="inline-block">
              <img
                src="/logo-maaza.png"
                alt="Maza Printwala"
                className="h-10 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo-maaza-dark.png"
                alt="Maza Printwala"
                className="h-10 w-auto object-contain hidden dark:block"
              />
            </a>
          </div>

          {/* 404 Display */}
          <div className="mb-2">
            <span className="font-display font-black text-7xl sm:text-8xl tracking-tight text-[#0082CA]/20 dark:text-[#38BDF8]/20 select-none">
              404
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-main)] tracking-tight mb-3">
            Page Not Found
          </h1>

          <p className="font-sans text-sm sm:text-base text-[var(--text-muted)] font-normal leading-relaxed mb-8 max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0082CA] hover:bg-[#006EA8] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              Return to Homepage
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)] font-bold text-sm rounded-xl transition-all"
            >
              Explore Products
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
