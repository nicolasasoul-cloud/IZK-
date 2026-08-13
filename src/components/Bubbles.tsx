const BUBBLES = [
  { left: "6%", size: 6, delay: "0s", duration: "9s" },
  { left: "16%", size: 10, delay: "2s", duration: "12s" },
  { left: "28%", size: 4, delay: "4.5s", duration: "8s" },
  { left: "41%", size: 8, delay: "1s", duration: "11s" },
  { left: "55%", size: 5, delay: "3.2s", duration: "9.5s" },
  { left: "68%", size: 9, delay: "0.6s", duration: "13s" },
  { left: "79%", size: 4, delay: "5s", duration: "10s" },
  { left: "90%", size: 7, delay: "2.6s", duration: "12.5s" },
];

export default function Bubbles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="animate-rise absolute bottom-0 rounded-full bg-glow/30"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  );
}
