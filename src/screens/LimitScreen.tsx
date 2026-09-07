import type { Screen } from "../types";
import { formatINR } from "../lib/emi";

interface Props {
  navigate: (s: Screen) => void;
}

export default function LimitScreen({ navigate }: Props) {
  const limit = 250000;
  const used = 0;
  const available = limit - used;
  const pct = Math.round((used / limit) * 100);

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <p className="text-lg font-bold text-[#1A1A2E]">My Limit</p>
        <p className="text-xs text-[#6B6B8A] mt-0.5">Backed by your mutual fund portfolio</p>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Limit Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)", boxShadow: "0 4px 20px rgba(113,44,220,0.3)" }}
        >
          <p className="text-purple-200 text-xs font-medium uppercase tracking-wider">Available Limit</p>
          <p className="text-4xl font-black text-white mt-2">{formatINR(available)}</p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-purple-200 mb-1.5">
              <span>Used: {formatINR(used)}</span>
              <span>Total: {formatINR(limit)}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Interest Rate", value: "0%", sub: "No-cost EMI" },
            { label: "Credit Score", value: "N/A", sub: "Not required" },
            { label: "Approval", value: "Instant", sub: "No paperwork" },
            { label: "Tenure", value: "3–24m", sub: "Flexible plans" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.06)" }}>
              <p className="text-xs text-[#6B6B8A]">{item.label}</p>
              <p className="text-lg font-black text-[#712CDC] mt-0.5">{item.value}</p>
              <p className="text-[10px] text-[#A0A0B8]">{item.sub}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate({ name: "shop", initialTab: 2 })}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm"
          style={{ background: "#712CDC" }}
        >
          Start Shopping →
        </button>
      </div>
    </div>
  );
}
