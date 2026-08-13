export type Artwork = {
  id: string;
  title: string;
  year: string;
  medium: string;
  description: string;
  gradient: string;
  whaleTone: "gold" | "glow" | "ink";
  price: number;
};

/**
 * Placeholder catalog. Swap in IZK's real pieces (title, medium, price,
 * and a real image instead of the gradient) once assets are ready —
 * the gallery/shop grids just map over this array.
 */
export const ARTWORK: Artwork[] = [
  {
    id: "whale-fall",
    title: "Whale Fall",
    year: "2024",
    medium: "Ink and gouache on paper",
    description:
      "What sinks feeds what rises. A study of the ocean floor coming back to life.",
    gradient: "from-abyss via-deep to-mid",
    whaleTone: "gold",
    price: 180,
  },
  {
    id: "old-ones",
    title: "Old Ones",
    year: "2024",
    medium: "Charcoal on toned paper",
    description:
      "Among the oldest living creatures on earth — a portrait of a wisdom you can't rush.",
    gradient: "from-ink via-deep to-surface",
    whaleTone: "glow",
    price: 220,
  },
  {
    id: "song-beneath-the-ice",
    title: "Song Beneath the Ice",
    year: "2023",
    medium: "Mixed media",
    description:
      "A language built long before ours, traveling for miles in the dark.",
    gradient: "from-deep via-mid to-surface",
    whaleTone: "glow",
    price: 260,
  },
  {
    id: "family-line",
    title: "Family Line",
    year: "2023",
    medium: "Ink on paper",
    description: "Pod, kin, and the ones who stay close no matter the depth.",
    gradient: "from-mid via-surface to-glow-soft",
    whaleTone: "ink",
    price: 200,
  },
  {
    id: "ocean-as-world",
    title: "Ocean As World",
    year: "2024",
    medium: "Acrylic on canvas",
    description: "If the world is a giant ocean, this is what it looks like from underneath.",
    gradient: "from-abyss via-mid to-deep",
    whaleTone: "gold",
    price: 340,
  },
  {
    id: "sonar",
    title: "Sonar",
    year: "2022",
    medium: "Ink and gold leaf",
    description: "A study in how a whale finds its way without ever seeing far.",
    gradient: "from-deep via-abyss to-ink",
    whaleTone: "gold",
    price: 240,
  },
  {
    id: "playful-depths",
    title: "Playful Depths",
    year: "2023",
    medium: "Watercolor",
    description: "Mysterious and highly intelligent doesn't mean humorless.",
    gradient: "from-surface via-glow-soft to-mid",
    whaleTone: "ink",
    price: 160,
  },
  {
    id: "bioluminescence",
    title: "Bioluminescence",
    year: "2024",
    medium: "Ink and phosphor pigment",
    description: "Small lights, deep water, an old kind of communication.",
    gradient: "from-ink via-mid to-glow",
    whaleTone: "glow",
    price: 280,
  },
];
