import type { Metadata } from "next";
import ShopGrid from "@/components/ShopGrid";
import { ARTWORK } from "@/data/artwork";

export const metadata: Metadata = {
  title: "Shop | IZK",
  description: "Fine art prints from IZK — order originals and prints from the deep.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-glow-soft">Shop</p>
      <h1 className="font-display mt-3 text-4xl text-foam sm:text-5xl">
        Prints from the deep
      </h1>
      <p className="mt-4 max-w-xl text-foam/70">
        Fine art prints, shipped worldwide. Originals available on request —
        get in touch through the About page.
      </p>

      <div className="mt-14">
        <ShopGrid products={ARTWORK} />
      </div>
    </div>
  );
}
