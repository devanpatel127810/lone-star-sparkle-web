# Lone Star Wash & Dry — MVP Website

A fast, mobile‑first laundromat website for the DFW area. Built with React + Vite + TypeScript + Tailwind (shadcn‑ui). Includes SEO, structured data, sitemap, and accessible UX.

Note: The original request preferred Next.js, but this project runs on Lovable (Vite + React). This delivers the same Jamstack benefits: static hosting, great performance, and easy deployment.

## Quick start

1. Install deps
```bash
npm i
```
2. Run locally
```bash
npm run dev
```
3. Build
```bash
npm run build && npm run preview
```

## One‑click deploy
- Vercel: Import the repo and accept defaults (Framework: Vite). Build: `npm run build`. Output: `dist`.
- Netlify: New site from Git. Build: `npm run build`. Publish: `dist`.

## How to update content (owner‑friendly)
For MVP, update a few constants at the top of the homepage:
- File: `src/pages/Index.tsx`
- Look for these lines:
```ts
const phone = "[PHONE]";
const address = "[ADDRESS]";
const hours = "[HOURS]";
const mapQuery = "Lone+Star+Wash+and+Dry+DFW"; // used for Google Maps
```
Replace the placeholders (keep the formatting).

Images to replace:
- `src/assets/hero-lone-star.webp` — swap with a real storefront/interior photo (WebP/JPEG ≤ 300KB if possible).

Want a no‑code JSON source later? Easiest path: move these values to `public/site.json` and fetch at runtime. I can wire this up in the next iteration or set up Netlify CMS/Contentful if preferred.

## Contact & conversions
- “Call Now” uses a `tel:` link.
- “Get Directions” opens Google Maps using `mapQuery`.
- “Book Pickup” is a placeholder CTA ready to connect to Formspree or a serverless function.

To add a contact form with Formspree:
1. Create a Formspree project and form.
2. Add a Contact page/section that posts to your endpoint (I can add this on request).

## SEO
- Title and meta description set in `index.html`.
- LocalBusiness JSON‑LD injected on the homepage (values come from the constants above).
- `public/sitemap.xml` generated with key routes.
- `public/robots.txt` includes a Sitemap reference and allows all bots.
- Canonical tag points to `https://lonestarwashanddry.com/` — update if different.

## Accessibility
- Semantic HTML (header/main/section/article/footer)
- Single H1 per page, clear hierarchy
- Keyboard‑navigable buttons/links; focus ring visible
- Meaningful alt text; color contrast aligned to AA

## File structure (key parts)
```
src/
  assets/
    hero-lone-star.webp
  components/
    ui/ (shadcn)
  pages/
    Index.tsx        # homepage (edit placeholders here)
public/
  sitemap.xml
  robots.txt
```

## What to replace before launch (TODO)
- [PHONE], [ADDRESS], [ZIP], [HOURS] in `src/pages/Index.tsx`
- Replace hero image with real photos
- Confirm canonical domain in `index.html` and `robots.txt`

## Testing checklist
- Lighthouse target: Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 90
- Mobile layout: buttons are thumb‑reachable, no horizontal scroll
- CTAs: Call opens dialer; Directions opens Maps
- Images: hero optimized; below‑the‑fold images lazy‑load
- Keyboard nav and focus states verified

## Suggested next phase features
- Easy: Services page, Pricing table, FAQ with accordion, Gallery grid
- Medium: Pickup form (Formspree) with validation, Testimonials carousel, Hours by day with open/closed indicator
- Hard: Netlify CMS/Contentful, multi‑location support, reviews sync from Google/Yelp

## License
This project template is provided as‑is for Lone Star Wash & Dry.
