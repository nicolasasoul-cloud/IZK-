"use client";

import { useState } from "react";
import Whale from "@/components/Whale";
import type { Artwork } from "@/data/artwork";

export default function ShopGrid({ products }: { products: Artwork[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function buy(artworkId: string) {
    setPendingId(artworkId);
    setNotice(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error ?? "Something went wrong. Try again shortly.");
        return;
      }
      window.location.assign(data.url);
    } catch {
      setNotice("Something went wrong. Try again shortly.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      {notice && (
        <p className="mb-8 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
          {notice}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
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
                <button
                  type="button"
                  onClick={() => buy(product.id)}
                  disabled={pendingId === product.id}
                  className="rounded-full bg-glow px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-glow-soft disabled:opacity-60"
                >
                  {pendingId === product.id ? "Redirecting…" : "Buy print"}
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
