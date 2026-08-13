# IZK

Brand site for IZK — "a rare, wise whale moving through the world." Built
with Next.js (App Router) and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/` — pages: home (`/`), gallery, shop, about/contact
- `src/components/Whale.tsx` — the whale mark. This is placeholder art;
  swap the `<path>` data for IZK's real illustration and the swim/tail/glow
  animations (`src/app/globals.css`) keep working as-is
- `src/data/artwork.ts` — the art/product catalog. Replace placeholder
  entries with real pieces (title, medium, price, and swap the gradient
  for a real image) as they're ready
- `src/app/api/checkout/` — Stripe Checkout session creation for the shop
- `src/app/api/contact/` — contact form handler (uses Resend)

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `STRIPE_SECRET_KEY` — enables real checkout on the Shop page. Without
  it, "Buy print" shows a friendly "not connected yet" message instead of
  failing.
- `RESEND_API_KEY` / `CONTACT_TO_EMAIL` — enables the About page contact
  form. Same graceful fallback if unset.

## Deploying

Deploys cleanly to [Vercel](https://vercel.com/new) — connect the repo and
add the environment variables above in the project settings.

## Migrating content from Squarespace

Squarespace can export pages/blog content as XML (Settings → Advanced →
Import/Export). Use that for copy, and re-export images at full
resolution rather than pulling the compressed web versions.
