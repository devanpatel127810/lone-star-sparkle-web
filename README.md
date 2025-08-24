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
Content is centralized in `src/content/site.json`:
```json
{
  "name": "Lone Star Wash and Dry",
  "phone": "[PHONE]",
  "address": "[ADDRESS]",
  "zip": "[ZIP]",
  "hours": "[HOURS]",
  "mapQuery": "Lone+Star+Wash+&+Dry+DFW",
  "website": "https://lonestarwashanddry.com/"
}
```
Change the placeholder values and rebuild.

Images to replace:
- `src/assets/hero-lone-star.webp` — swap with a real storefront/interior photo (WebP/JPEG ≤ 300KB if possible).

## Contact & conversions
- “Call Now” uses a `tel:` link.
- “Get Directions” opens Google Maps using `mapQuery`.
- “Book Pickup” connects to Supabase bookings in the app.

## SEO
- Title and meta description set in `index.html`.
- LocalBusiness JSON‑LD injected on the homepage.
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
    Index.tsx
  content/
    site.json        # owner‑editable config
public/
  sitemap.xml
  robots.txt
```

## What to replace before launch (TODO)
- [PHONE], [ADDRESS], [ZIP], [HOURS] in `src/content/site.json`
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
- Medium: Testimonials carousel, Hours by day with open/closed indicator
- Hard: Netlify CMS/Contentful, multi‑location support, reviews sync from Google/Yelp

## License
This project template is provided as‑is for Lone Star Wash & Dry.
