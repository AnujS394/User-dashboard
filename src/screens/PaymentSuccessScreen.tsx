import { useEffect, useState } from "react";
import type { Screen, OrderSummary } from "../types";
import { formatINR } from "../lib/emi";
import ProductImage from "../components/ProductImage";

interface Props { order: OrderSummary; navigate: (s: Screen) => void }

export default function PaymentSuccessScreen({ order, navigate }: Props) {
  const [confetti, setConfetti] = useState(true);
  const orderId = `1FI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  useEffect(() => { const t = setTimeout(() => setConfetti(false), 3000); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-full bg-[#F5F4F8] flex flex-col pb-10">
      {/* Confetti dots */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, background: ["#712CDC", "#F5A623", "#22C55E", "#3B82F6", "#EC4899"][i % 5], animationDelay: `${Math.random() * 0.5}s`, animationDuration: `${0.8 + Math.random()}s` }} />
          ))}
        </div>
      )}

      {/* Success hero */}
      <div className="flex flex-col items-center text-center px-6 pt-20 pb-8"
        style={{ background: "linear-gradient(180deg, #EDE5FD 0%, #F5F4F8 100%)" }}>
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-5"
          style={{ boxShadow: "0 8px 32px rgba(113,44,220,0.2)" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#22C55E" />
            <path d="M14 24l8 8 14-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Order Confirmed! 🎉</h1>
        <p className="text-sm text-[#6B6B8A] mt-2 leading-relaxed max-w-xs">
          Your {order.product.name} has been ordered successfully. First EMI auto-debited.
        </p>
      </div>

      <div className="px-4 space-y-3">
        {/* Order ID card */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <div className="flex items-center gap-3 mb-3">
            <ProductImage product={order.product} className="w-14 h-14 rounded-xl flex-shrink-0" imageClassName="object-cover" alt={order.product.name} />
            <div>
              <p className="text-xs text-[#712CDC] font-semibold">{order.product.brand}</p>
              <p className="text-sm font-bold text-[#1A1A2E]">{order.product.name}</p>
              <p className="text-xs text-[#6B6B8A]">{order.variantLabel}</p>
            </div>
          </div>
          <div className="bg-[#F5F4F8] rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-[#A0A0B8] uppercase tracking-wider">Order ID</p>
              <p className="text-sm font-black text-[#712CDC] font-mono">{orderId}</p>
            </div>
            <button className="text-xs text-[#712CDC] font-semibold bg-[#EDE5FD] px-3 py-1.5 rounded-full">Copy</button>
          </div>
        </div>

        {/* EMI schedule */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <div className="px-4 pt-4 pb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-[#1A1A2E]">EMI Schedule</p>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">0% Interest</span>
          </div>
          {Array.from({ length: Math.min(3, order.emiPlan.tenureMonths) }).map((_, i) => {
            const date = new Date(); date.setMonth(date.getMonth() + i);
            const label = date.toLocaleString("en-IN", { month: "long", year: "numeric" });
            return (
              <div key={i} className="flex items-center justify-between px-4 py-3 border-t border-[#F5F4F8]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-green-500 text-white" : "bg-[#EDE5FD] text-[#712CDC]"}`}>
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1A1A2E]">EMI {i + 1}</p>
                    <p className="text-[10px] text-[#A0A0B8]">{label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A1A2E]">{formatINR(order.emiPlan.monthlyAmount)}</p>
                  <p className="text-[10px] text-[i === 0 ? 'green-600' : '#A0A0B8']">{i === 0 ? "✓ Paid" : "Auto-debit"}</p>
                </div>
              </div>
            );
          })}
          {order.emiPlan.tenureMonths > 3 && (
            <div className="px-4 py-3 border-t border-[#F5F4F8]">
              <p className="text-xs text-[#A0A0B8] text-center">+ {order.emiPlan.tenureMonths - 3} more EMIs · View all in EMI Dues</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 space-y-2.5" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <Row label="Payment Method" value="1Fi MF Collateral" />
          <Row label="Monthly EMI" value={formatINR(order.emiPlan.monthlyAmount)} purple />
          <Row label="Tenure" value={`${order.emiPlan.tenureMonths} months`} />
          <Row label="Interest" value="₹0 (0% EMI)" green />
          <div className="border-t border-[#F5F4F8] pt-2.5">
            <Row label="Total Amount" value={formatINR(order.emiPlan.totalPayable)} bold />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button onClick={() => navigate({ name: "emi-dues" })}
            className="py-3.5 rounded-2xl border-2 border-[#712CDC] text-[#712CDC] font-semibold text-sm">
            View EMI Dues
          </button>
          <button onClick={() => navigate({ name: "home" })}
            className="py-3.5 rounded-2xl font-bold text-sm text-white" style={{ background: "#712CDC" }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, purple, green, bold }: { label: string; value: string; purple?: boolean; green?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[#6B6B8A]">{label}</span>
      <span className={`text-sm font-semibold ${bold ? "text-base font-black text-[#1A1A2E]" : purple ? "text-[#712CDC]" : green ? "text-green-600" : "text-[#1A1A2E]"}`}>{value}</span>
    </div>
  );
}
