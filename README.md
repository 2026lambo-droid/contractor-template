# Contractor Template

A premium, agency-style contractor website template built with **React**, **Vite**, and **React Router**. Use this repo as a master template for client contractor/construction sites.

## Features

- **Pages:** Home, Services (index + detail by slug), About, Gallery, Reviews, Service Areas, Contact, 404
- **UI:** Glass header, hero with background image + trust chips + Quick Info card, service cards with hover states, sticky mobile call button
- **Config:** Single `src/site.config.js` for rebranding (company name, phone, address, hero image, etc.)
- **SEO:** Per-page title + meta description, LocalBusiness JSON-LD schema
- **Plain CSS:** Design tokens (colors, spacing, radii, shadows, typography), no Tailwind

## Quick start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Using as a template

1. **From GitHub:** Use **Use this template** → **Create a new repository**, or clone and push to your own repo.
2. **Rebrand:** Edit `src/site.config.js` (company name, phone, email, address, hero image URL, social links, etc.).
3. **Content:** Update `src/data/` (services, reviews, service areas, gallery) and replace gallery images as needed.

## Tech stack

- React 18
- Vite 7
- React Router DOM
- Plain CSS (no Tailwind or UI libraries)
