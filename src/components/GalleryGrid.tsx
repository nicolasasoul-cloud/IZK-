"use client";

import { useState } from "react";
import Whale from "@/components/Whale";
import ArtworkCard from "@/components/ArtworkCard";
import type { Artwork } from "@/data/artwork";

export default function GalleryGrid({ artwork }: { artwork: Artwork[] }) {
  const [selected, setSelected] = useState<Artwork | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artwork.map((piece) => (
          <ArtworkCard
            key={piece.id}
            artwork={piece}
            onClick={() => setSelected(piece)}
          />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-foam/10 bg-abyss"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`relative aspect-[4/3] w-full bg-gradient-to-br ${selected.gradient}`}
            >
              <div className="absolute inset-0 flex items-center justify-center p-16 opacity-70 mix-blend-plus-lighter">
                <Whale tone={selected.whaleTone} className="w-full" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-foam">
                {selected.title}
              </h3>
              <p className="mt-1 text-sm uppercase tracking-wide text-foam/50">
                {selected.medium} &middot; {selected.year}
              </p>
              <p className="mt-4 text-foam/70">{selected.description}</p>
              <p className="mt-4 font-display text-xl text-gold">
                ${selected.price}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-ink/60 p-2 text-foam hover:text-glow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
