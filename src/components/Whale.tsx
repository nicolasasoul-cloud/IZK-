type WhaleProps = {
  className?: string;
  tone?: "gold" | "glow" | "ink";
};

const TONES: Record<NonNullable<WhaleProps["tone"]>, string> = {
  gold: "var(--gold)",
  glow: "var(--bioluminescent)",
  ink: "var(--ink)",
};

/**
 * Placeholder whale mark. Swap this file's <path> data for IZK's own
 * illustration once final art exists — the swim/tail/glow animation
 * classes (globals.css) work on any silhouette with the same structure.
 */
export default function Whale({ className, tone = "gold" }: WhaleProps) {
  const fill = TONES[tone];

  return (
    <svg
      viewBox="0 0 400 200"
      className={className}
      role="img"
      aria-label="IZK whale mark"
    >
      {/* horizontal tail flukes, side profile */}
      <g className="animate-tail-flick" style={{ transformOrigin: "78px 120px" }}>
        <path
          d="M85 112 C 45 98 20 85 5 78 C 20 98 42 110 70 120 Z"
          fill={fill}
        />
        <path
          d="M85 128 C 45 140 18 152 3 158 C 20 138 42 126 70 120 Z"
          fill={fill}
        />
      </g>

      {/* body */}
      <path
        d="M80 120
           Q 70 90 110 75
           Q 150 55 210 50
           Q 290 42 340 62
           Q 375 75 385 98
           Q 388 108 372 112
           Q 355 124 320 133
           Q 250 150 170 146
           Q 110 142 75 128
           Q 65 124 80 120 Z"
        fill={fill}
      />

      {/* pectoral fin */}
      <path
        d="M210 133 Q 230 158 262 142 Q 240 140 218 134 Z"
        fill={fill}
        opacity={0.85}
      />

      {/* eye */}
      <circle cx="352" cy="82" r="5" fill="var(--ink)" />

      {/* back linework, nod to old linocut / cave-art whale motifs */}
      <g stroke="var(--ink)" strokeOpacity={0.18} strokeWidth={2} fill="none">
        <path d="M150 66 Q 210 54 270 60" />
        <path d="M145 78 Q 205 68 275 74" />
      </g>

      {/* bioluminescent communication marks */}
      <g fill="var(--bioluminescent)">
        <circle className="animate-drift-glow" style={{ animationDelay: "0s" }} cx="170" cy="112" r="3" />
        <circle className="animate-drift-glow" style={{ animationDelay: "0.8s" }} cx="210" cy="118" r="2.4" />
        <circle className="animate-drift-glow" style={{ animationDelay: "1.6s" }} cx="245" cy="108" r="2.6" />
        <circle className="animate-drift-glow" style={{ animationDelay: "2.4s" }} cx="290" cy="100" r="2" />
      </g>
    </svg>
  );
}
