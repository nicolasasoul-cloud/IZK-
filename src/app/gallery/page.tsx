import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { ARTWORK } from "@/data/artwork";

export const metadata: Metadata = {
  title: "Gallery | IZK",
  description: "Original art from IZK — a rare, wise whale moving through the world.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm uppercase tracking-[0.3em] text-glow-soft">
        Gallery
      </p>
      <h1 className="font-display mt-3 text-4xl text-foam sm:text-5xl">
        Work from the depths
      </h1>
      <p className="mt-4 max-w-xl text-foam/70">
        A running collection — ancient themes, an old way of communicating,
        and what gets left behind when something great sinks.
      </p>

      <div className="mt-14">
        <GalleryGrid artwork={ARTWORK} />
      </div>
    </div>
  );
}
