import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";
import { MOCK_USER } from "../../services/mockData";

interface Props { navigate: (s: Screen) => void }

const STEPS = [
  { id: "pan", label: "PAN Verification", desc: "PAN card linked and verified with Income Tax", status: "done", value: MOCK_USER.pan },
  { id: "aadhaar", label: "Aadhaar eKYC", desc: "Identity verified via Aadhaar OTP authentication", status: "done", value: "XXXX XXXX 4821" },
  { id: "face", label: "Face Match", desc: "Live selfie matched with Aadhaar photo", status: "done", value: "Passed — 98.4% match" },
  { id: "bank", label: "Bank Account Verification", desc: "Primary account verified via penny drop", status: "done", value: "HDFC XXXX4821" },
  { id: "mf", label: "Mutual Fund Linkage", desc: "Portfolio imported and verified via CAMS / KFintech", status: "done", value: "4 funds · ₹8,47,913" },
  { id: "address", label: "Address Verification", desc: "Address confirmed via Aadhaar records", status: "done", value: "Gurugram, Haryana" },
];

export default function KYCScreen({ navigate }: Props) {
  const allDone = STEPS.every((s) => s.status === "done");

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="KYC Status" onBack={() => navigate({ name: "profile" })} />

      <div className="px-4 pt-4 space-y-3">
        {/* Status card */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: allDone ? "linear-gradient(135deg, #22C55E, #16a34a)" : "linear-gradient(135deg, #F5A623, #d97706)" }}>
              <span className="text-3xl">{allDone ? "✓" : "⏳"}</span>
            </div>
            <div>
              <p className="text-lg font-black text-[#1A1A2E]">{allDone ? "KYC Verified" : "KYC Pending"}</p>
              <p className="text-xs text-[#6B6B8A] mt-0.5">
                {allDone ? "Full access to all 1Fi features" : "Complete steps below to unlock your limit"}
              </p>
              {allDone && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                    ✓ CKYC Registered · ID: 50384210
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <div className="flex justify-between mb-2">
            <p className="text-sm font-bold text-[#1A1A2E]">Verification Steps</p>
            <p className="text-xs text-[#712CDC] font-semibold">{STEPS.filter((s) => s.status === "done").length}/{STEPS.length} complete</p>
          </div>
          <div className="h-2 bg-[#F5F4F8] rounded-full overflow-hidden">
            <div className="h-full bg-[#712CDC] rounded-full transition-all"
              style={{ width: `${(STEPS.filter((s) => s.status === "done").length / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="bg-white rounded-2xl p-4 flex items-start gap-3" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
              {/* Step icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${step.status === "done" ? "bg-green-500 text-white" : "bg-[#F5F4F8] text-[#A0A0B8]"}`}>
                {step.status === "done" ? "✓" : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E]">{step.label}</p>
                <p className="text-xs text-[#6B6B8A] mt-0.5 leading-relaxed">{step.desc}</p>
                {step.value && (
                  <p className="text-[10px] text-[#712CDC] font-semibold mt-1 bg-[#EDE5FD] inline-block px-2 py-0.5 rounded-full">{step.value}</p>
                )}
              </div>
              {step.status === "done" && (
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Verified</span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex gap-2">
          <span className="flex-shrink-0">🔒</span>
          <p className="text-xs text-[#712CDC] leading-relaxed">Your KYC data is encrypted and stored securely. 1Fi is a regulated NBFC and complies with RBI guidelines.</p>
        </div>
      </div>
    </div>
  );
}
