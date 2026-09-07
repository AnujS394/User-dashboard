import { useState, useMemo } from "react";
import type { Screen } from "../types";
import { computeEmiForAmount } from "../services/marketplaceApi";
import { formatINR } from "../lib/emi";

interface Props {
  navigate: (s: Screen) => void;
}

const QUICK_AMOUNTS = [10000, 25000, 50000, 75000, 100000, 150000, 200000, 500000];

export default function EmiCalculatorScreen({ navigate }: Props) {
  const [rawInput, setRawInput] = useState("");
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);

  const amount = parseInt(rawInput.replace(/,/g, ""), 10) || 0;
  const plans = useMemo(() => (amount >= 1000 ? computeEmiForAmount(amount) : []), [amount]);

  function handleInput(val: string) {
    // Allow only digits
    const digits = val.replace(/[^\d]/g, "");
    setRawInput(digits ? parseInt(digits, 10).toLocaleString("en-IN") : "");
    setSelectedTenure(null);
  }

  function setQuick(amt: number) {
    setRawInput(amt.toLocaleString("en-IN"));
    setSelectedTenure(null);
  }

  const selectedPlan = plans.find((p) => p.tenureMonths === selectedTenure) ?? null;

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-28">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={() => navigate({ name: "home" })}
          className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider">1Fi</p>
          <p className="text-base font-bold text-[#1A1A2E]">EMI Calculator</p>
        </div>
        <div className="ml-auto w-9 h-9 rounded-xl bg-[#EDE5FD] flex items-center justify-center text-lg">🧮</div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Hero note */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)" }}
        >
          <div className="text-3xl">✦</div>
          <div>
            <p className="text-sm font-bold text-white">0% Interest, Always</p>
            <p className="text-xs text-purple-200 mt-0.5">Enter any product amount to see EMI breakdown</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
          <p className="text-xs text-[#6B6B8A] font-medium mb-3">Product Amount (₹)</p>
          <div
            className="flex items-center gap-2 border-2 rounded-xl px-4 py-3 transition-all"
            style={{ borderColor: rawInput ? "#712CDC" : "#E8E6F0" }}
          >
            <span className="text-lg font-bold text-[#6B6B8A]">₹</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={rawInput}
              onChange={(e) => handleInput(e.target.value)}
              className="flex-1 text-2xl font-black text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#E8E6F0]"
            />
            {rawInput && (
              <button onClick={() => { setRawInput(""); setSelectedTenure(null); }} className="text-[#A0A0B8]">✕</button>
            )}
          </div>

          {/* Quick amount pills */}
          <p className="text-xs text-[#A0A0B8] mt-3 mb-2">Quick select</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setQuick(amt)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  background: amount === amt ? "#712CDC" : "#F5F4F8",
                  color: amount === amt ? "white" : "#6B6B8A",
                  borderColor: amount === amt ? "#712CDC" : "#E8E6F0",
                }}
              >
                {amt >= 100000 ? `₹${amt / 100000}L` : `₹${amt / 1000}K`}
              </button>
            ))}
          </div>
        </div>

        {/* EMI Plans Table */}
        {amount >= 1000 && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
            <div className="px-5 pt-4 pb-3 border-b border-[#F5F4F8] flex items-center justify-between">
              <p className="text-sm font-bold text-[#1A1A2E]">EMI Plans for {formatINR(amount)}</p>
              <span className="text-xs text-[#22C55E] bg-green-50 font-semibold px-2 py-0.5 rounded-full">0% Interest</span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-4 px-5 py-2.5 bg-[#F5F4F8]">
              <p className="text-[10px] font-semibold text-[#A0A0B8] uppercase tracking-wider">Tenure</p>
              <p className="text-[10px] font-semibold text-[#A0A0B8] uppercase tracking-wider text-right">Monthly</p>
              <p className="text-[10px] font-semibold text-[#A0A0B8] uppercase tracking-wider text-right">Interest</p>
              <p className="text-[10px] font-semibold text-[#A0A0B8] uppercase tracking-wider text-right">Total</p>
            </div>

            {plans.map((plan) => {
              const selected = selectedTenure === plan.tenureMonths;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedTenure(selected ? null : plan.tenureMonths)}
                  className="w-full grid grid-cols-4 px-5 py-4 border-b border-[#F5F4F8] last:border-0 transition-all text-left"
                  style={{ background: selected ? "#EDE5FD" : "white" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selected ? "#712CDC" : "#D1C4E9" }}
                    >
                      {selected && <div className="w-2 h-2 rounded-full bg-[#712CDC]" />}
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: selected ? "#712CDC" : "#1A1A2E" }}
                    >
                      {plan.tenureMonths}m
                    </span>
                  </div>
                  <p className="text-sm font-bold text-right" style={{ color: selected ? "#712CDC" : "#1A1A2E" }}>
                    {formatINR(plan.monthlyAmount)}
                  </p>
                  <p className="text-sm text-[#22C55E] font-semibold text-right">0%</p>
                  <p className="text-sm text-[#6B6B8A] text-right">{formatINR(plan.totalPayable)}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected plan summary */}
        {selectedPlan && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)" }}
          >
            <p className="text-xs text-purple-200 uppercase tracking-wider font-semibold mb-3">Your EMI Summary</p>
            <div className="space-y-2">
              <Row label="Loan Amount" value={formatINR(amount)} />
              <Row label="Tenure" value={`${selectedPlan.tenureMonths} months`} />
              <Row label="Interest Rate" value="0% (No cost EMI)" accent />
              <Row label="Processing Fee" value="₹0" />
              <div className="border-t border-white/20 pt-2 mt-2">
                <Row label="Monthly EMI" value={formatINR(selectedPlan.monthlyAmount)} big />
                <Row label="Total Payable" value={formatINR(selectedPlan.totalPayable)} />
              </div>
            </div>
            <button
              onClick={() => navigate({ name: "marketplace" })}
              className="mt-4 w-full bg-white text-[#712CDC] font-bold text-sm py-3 rounded-xl"
            >
              Browse Products →
            </button>
          </div>
        )}

        {amount > 0 && amount < 1000 && (
          <p className="text-center text-xs text-[#A0A0B8]">Enter at least ₹1,000 to see EMI plans</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, accent, big }: { label: string; value: string; accent?: boolean; big?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-purple-200">{label}</span>
      <span
        className={big ? "text-xl font-black text-white" : "text-sm font-semibold"}
        style={{ color: accent ? "#F5A623" : "white" }}
      >
        {value}
      </span>
    </div>
  );
}
