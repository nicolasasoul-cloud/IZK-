import Whale from "@/components/Whale";

export default function SwimmingWhale() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-0 top-[38%] w-[38vw] min-w-[280px] max-w-[520px] animate-whale-swim">
        <div className="animate-whale-bob">
          <Whale tone="gold" />
        </div>
      </div>
    </div>
  );
}
