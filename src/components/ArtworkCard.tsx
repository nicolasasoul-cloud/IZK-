import Whale from "@/components/Whale";
import type { Artwork } from "@/data/artwork";

export default function ArtworkCard({
  artwork,
  onClick,
}: {
  artwork: Artwork;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-foam/10 text-left"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${artwork.gradient} transition-transform duration-500 group-hover:scale-105`}
      />
      <div className="absolute inset-0 flex items-center justify-center p-10 opacity-70 mix-blend-plus-lighter">
        <Whale tone={artwork.whaleTone} className="w-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4">
        <p className="font-display text-lg text-foam">{artwork.title}</p>
        <p className="text-xs uppercase tracking-wide text-foam/60">
          {artwork.medium} &middot; {artwork.year}
        </p>
      </div>
    </button>
  );
}
