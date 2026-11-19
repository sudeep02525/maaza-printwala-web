import { Fraunces, Public_Sans } from 'next/font/google';

/**
 * Storefront typography
 * ---------------------
 * Display : Fraunces  -> headings, hero, section titles, brand wordmark
 * Body    : Public Sans -> paragraphs, prices, buttons, labels, forms
 *
 * Both are variable fonts (single file each). next/font self-hosts them,
 * so there is no render-blocking request to Google and no layout shift.
 *
 * If `next build` complains about an invalid axis, delete the `axes` line
 * below and keep the rest - you lose automatic optical sizing, nothing else.
 */
export const fontDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
});

export const fontBody = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
});
