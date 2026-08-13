import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ARTWORK } from "@/data/artwork";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "Checkout isn't connected yet. Add STRIPE_SECRET_KEY (and NEXT_PUBLIC_SITE_URL) to your environment to enable purchases.",
      },
      { status: 503 },
    );
  }

  const { artworkId } = (await req.json()) as { artworkId?: string };
  const artwork = ARTWORK.find((piece) => piece.id === artworkId);

  if (!artwork) {
    return NextResponse.json({ error: "Unknown artwork." }, { status: 404 });
  }

  const stripe = new Stripe(secretKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: artwork.price * 100,
          product_data: {
            name: artwork.title,
            description: `${artwork.medium} · ${artwork.year}`,
          },
        },
      },
    ],
    success_url: `${siteUrl}/shop?success=1`,
    cancel_url: `${siteUrl}/shop?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
