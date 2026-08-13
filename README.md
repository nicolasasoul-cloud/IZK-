# IZK

Brand site for IZK — "a rare, wise whale moving through the world." Built
with Next.js (App Router) and Tailwind CSS, exported as a fully static
site (no server runtime — required for Cloudflare Pages hosting).

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
- `src/components/ShopGrid.tsx` — "Buy print" links to each artwork's
  `stripeLink` (a Stripe Payment Link), or falls back to a mailto inquiry
  if unset
- `src/components/ContactForm.tsx` — posts to Formspree if configured,
  otherwise falls back to opening a mailto: draft

## Deploying to Cloudflare Pages

This site builds to static HTML/CSS/JS (`output: "export"` in
`next.config.ts`) — Cloudflare Pages has no Next.js server runtime, so a
normal server build 404s there. In the Cloudflare Pages project settings:

- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Framework preset:** Next.js (Static HTML Export), if offered — otherwise
  "None" with the settings above

There's no `src/app/api/` directory and no server-only environment
variables to set, since a static export can't run server code (route
handlers, Stripe Checkout session creation, etc. don't work here — that's
why the shop/contact features below use Payment Links and Formspree
instead).

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_FORMSPREE_ENDPOINT` — enables the About page contact form's
  in-page submit via [Formspree](https://formspree.io). Without it, the
  form falls back to a mailto: link — nothing breaks.

For the shop, add a `stripeLink` (a Stripe [Payment
Link](https://dashboard.stripe.com/payment-links)) to each entry in
`src/data/artwork.ts` once real prices are set — no environment variable
needed, since checkout is just a link to Stripe's hosted page.

## Migrating content from Squarespace

Squarespace can export pages/blog content as XML (Settings → Advanced →
Import/Export). Use that for copy, and re-export images at full
resolution rather than pulling the compressed web versions.
