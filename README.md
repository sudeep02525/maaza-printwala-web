# Maza Printwala - Storefront Web App

This is the Next.js storefront application for Maza Printwala, a premium printing and custom design service.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + custom Neumorphic components
- **State Management:** Zustand
- **Data Fetching:** Tanstack React Query + Axios
- **i18n:** next-intl (English, Hindi, Marathi)

## Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_GA_ID=your_ga_id
```

## Running Locally

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture Notes
- The app uses `next-intl` for internationalization, with all strings localized.
- Product/Category pages use a hybrid pattern (Server components for metadata + Client components for interactive UI).
- Cart state and Auth tokens are managed client-side using Zustand and stored securely.
- Tracking (Meta/GA) is loaded conditionally based on cookie consent.
