import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";
import { MOCK_USER } from "../../services/mockData";
import { formatINR } from "../../lib/emi";

interface Props { navigate: (s: Screen) => void }

const FUNDS = [
  { name: "Mirae Asset Large Cap Fund", type: "Equity · Large Cap", nav: 108.42, units: 1250.45, value: 135575, change: 12.4, folio: "MF001234" },
  { name: "HDFC Mid-Cap Opportunities Fund", type: "Equity · Mid Cap", nav: 224.18, units: 580.20, value: 130090, change: 18.7, folio: "MF002341" },
  { name: "Axis Bluechip Fund", type: "Equity · Large Cap", nav: 68.92, units: 2100.00, value: 144732, change: 9.2, folio: "MF003412" },
  { name: "SBI Liquid Fund", type: "Debt · Liquid", nav: 3487.65, units: 125.45, value: 437516, change: 6.8, folio: "MF004123" },
];

const totalValue = FUNDS.reduce((s, f) => s + f.value, 0);
const usedAsCollateral = MOCK_USER.emiLimit;
const freeValue = totalValue - usedAsCollateral;

export default function MutualFundScreen({ navigate }: Props) {
  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Mutual Fund Portfolio" subtitle="Linked as collateral" onBack={() => navigate({ name: "profile" })} />

      <div className="px-4 pt-4 space-y-3">
        {/* Summary card */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)", boxShadow: "0 4px 20px rgba(113,44,220,0.3)" }}>
          <p className="text-purple-200 text-xs font-medium uppercase tracking-wider">Total Portfolio Value</p>
          <p className="text-3xl font-black text-white mt-1">{formatINR(totalValue)}</p>
          <div className="flex gap-4 mt-4">
            <div>
              <p className="text-purple-200 text-[10px] uppercase tracking-wider">EMI Limit</p>
              <p className="text-white font-bold text-sm">{formatINR(usedAsCollateral)}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-purple-200 text-[10px] uppercase tracking-wider">Free Equity</p>
              <p className="text-white font-bold text-sm">{formatINR(freeValue)}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div>
              <p className="text-purple-200 text-[10px] uppercase tracking-wider">Funds</p>
              <p className="text-white font-bold text-sm">{FUNDS.length}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-purple-200 mb-1.5">
              <span>Collateral used: {formatINR(usedAsCollateral)}</span>
              <span>{Math.round((usedAsCollateral / totalValue) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${(usedAsCollateral / totalValue) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="bg-[#EDE5FD] rounded-2xl p-3 flex gap-2">
          <span className="text-[#712CDC] flex-shrink-0">✦</span>
          <p className="text-xs text-[#712CDC] leading-relaxed">Your mutual funds are pledged as collateral — they are NOT redeemed. You continue to earn returns while shopping on EMI.</p>
        </div>

        <p className="text-xs text-[#6B6B8A] font-semibold px-1 pt-1">Holdings ({FUNDS.length} funds)</p>

        {FUNDS.map((fund) => (
          <div key={fund.folio} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1A1A2E] leading-tight">{fund.name}</p>
                <p className="text-[10px] text-[#A0A0B8] mt-0.5">{fund.type} · Folio: {fund.folio}</p>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">+{fund.change}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Stat label="NAV" value={`₹${fund.nav.toFixed(2)}`} />
              <Stat label="Units" value={fund.units.toFixed(2)} />
              <Stat label="Value" value={formatINR(fund.value)} highlight />
            </div>
          </div>
        ))}

        <button className="w-full py-3.5 rounded-2xl font-bold text-sm text-white" style={{ background: "#712CDC" }}>
          Link More Funds →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-[#F5F4F8] rounded-xl p-2.5 text-center">
      <p className="text-[9px] text-[#A0A0B8] uppercase tracking-wider">{label}</p>
      <p className="text-xs font-bold mt-0.5" style={{ color: highlight ? "#712CDC" : "#1A1A2E" }}>{value}</p>
    </div>
  );
}
