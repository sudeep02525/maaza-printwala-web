import React from 'react';
import { Link } from '@/i18n/routing.js';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/utils/getImageUrl.js';

/**
 * Promotional banners managed from the admin panel:
 * CMS -> Promotional Banners (stored under the key `homepage_banners`).
 *
 * Renders nothing at all when the admin has not added any banner, so the
 * homepage layout is unchanged until content exists.
 */
export default function CmsBanners({ banners }) {
  const items = Array.isArray(banners)
    ? banners.filter((b) => b && (b.title || b.image))
    : [];

  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--bg-page)] py-6">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <div
          className={`grid gap-4 ${
            items.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {items.map((banner, index) => {
            const href = banner.ctaLink || '/products';
            const image = getImageUrl(banner.image);

            const card = (
              <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0082CA] to-blue-800 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[220px] flex flex-col justify-between">
                {image && (
                  <div className="absolute inset-0 opacity-25 mix-blend-overlay group-hover:scale-110 transition-transform duration-700">
                    <img
                      src={image}
                      alt={banner.title || 'Promotional banner'}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="relative z-10">
                  {banner.badge && (
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
                      {banner.badge}
                    </span>
                  )}
                  {banner.title && (
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">
                      {banner.title}
                    </h3>
                  )}
                  {banner.subtitle && (
                    <p className="text-white/80 font-medium max-w-sm mb-6">{banner.subtitle}</p>
                  )}
                </div>

                {banner.ctaText && (
                  <div className="relative z-10 flex items-center gap-2 text-white font-bold group-hover:text-yellow-300 transition-colors">
                    {banner.ctaText}
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                )}
              </div>
            );

            // external links (https://...) must not go through the locale-aware Link
            return href.startsWith('http') ? (
              <a key={index} href={href} target="_blank" rel="noopener noreferrer" className="block">
                {card}
              </a>
            ) : (
              <Link key={index} href={href} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
