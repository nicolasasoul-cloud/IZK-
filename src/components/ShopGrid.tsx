import Whale from "@/components/Whale";
import { CONTACT_EMAIL } from "@/config/site";
import type { Artwork } from "@/data/artwork";

export default function ShopGrid({ products }: { products: Artwork[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const buyHref =
          product.stripeLink ??
          `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            `Print inquiry: ${product.title}`,
          )}`;

        return (
          <div
            key={product.id}
            className="flex flex-col overflow-hidden rounded-xl border border-foam/10"
          >
            <div
              className={`relative aspect-square w-full bg-gradient-to-br ${product.gradient}`}
            >
              <div className="absolute inset-0 flex items-center justify-center p-10 opacity-70 mix-blend-plus-lighter">
                <Whale tone={product.whaleTone} className="w-full" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <p className="font-display text-lg text-foam">
                {product.title}
              </p>
              <p className="text-xs uppercase tracking-wide text-foam/50">
                Fine art print &middot; {product.medium}
              </p>
              <p className="mt-auto flex items-center justify-between pt-3">
                <span className="font-display text-lg text-gold">
                  ${product.price}
                </span>
                <a
                  href={buyHref}
                  target={product.stripeLink ? "_blank" : undefined}
                  rel={product.stripeLink ? "noopener noreferrer" : undefined}
                  className="rounded-full bg-glow px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-glow-soft"
                >
                  Buy print
                </a>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
