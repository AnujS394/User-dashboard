export function SkeletonCard({ compact }: { compact?: boolean }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex-shrink-0 animate-pulse"
      style={{ width: compact ? 180 : "100%", boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}
    >
      <div className="bg-[#E8E6F0]" style={{ aspectRatio: "1/1" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 w-16 bg-[#E8E6F0] rounded-full" />
        <div className="h-4 w-full bg-[#E8E6F0] rounded-full" />
        <div className="h-4 w-20 bg-[#E8E6F0] rounded-full" />
        <div className="h-3 w-28 bg-[#E8E6F0] rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} compact />
      ))}
    </div>
  );
}
