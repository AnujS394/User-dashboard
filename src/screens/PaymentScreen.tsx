import { useState } from "react";
import type { Screen, OrderSummary } from "../types";
import { formatINR } from "../lib/emi";
import ProductImage from "../components/ProductImage";

interface Props {
  order: OrderSummary;
  navigate: (s: Screen) => void;
}

type PayMethod = "mf-collateral" | "upi" | "netbanking" | "card";

const UPI_APPS = [
  { id: "gpay", label: "Google Pay", icon: "🟢" },
  { id: "phonepe", label: "PhonePe", icon: "🟣" },
  { id: "paytm", label: "Paytm", icon: "🔵" },
  { id: "bhim", label: "BHIM UPI", icon: "🇮🇳" },
];

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"];

export default function PaymentScreen({ order, navigate }: Props) {
  const [method, setMethod] = useState<PayMethod>("mf-collateral");
  const [upiApp, setUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paying, setPaying] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);

  const firstEmi = formatINR(order.emiPlan.monthlyAmount);

  function handlePay() {
    if (method === "mf-collateral") { setPinModal(true); return; }
    startPayment();
  }

  function handlePinDigit(i: number, val: string) {
    const next = [...pin]; next[i] = val.slice(-1); setPin(next);
    if (val && i < 3) (document.getElementById(`pay-pin-${i + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d) && i === 3) setTimeout(() => { setPinModal(false); setPin(["", "", "", ""]); startPayment(); }, 300);
  }

  function startPayment() {
    setPaying(true);
    setTimeout(() => navigate({ name: "payment-success", order }), 2200);
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-[280px]">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-20"
        style={{ boxShadow: "0 1px 0 #E8E6F0" }}>
        <button onClick={() => navigate({ name: "product", productId: order.product.id })}
          className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider">SECURE CHECKOUT</p>
          <p className="text-base font-bold text-[#1A1A2E]">Payment</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 6l2.5 2.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          SSL Secured
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Order summary strip */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <ProductImage product={order.product} className="w-14 h-14 rounded-xl flex-shrink-0" imageClassName="object-cover" alt={order.product.name} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#712CDC] font-semibold">{order.product.brand}</p>
            <p className="text-sm font-bold text-[#1A1A2E] leading-tight">{order.product.name}</p>
            <p className="text-xs text-[#6B6B8A]">{order.variantLabel}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-black text-[#1A1A2E]">{formatINR(order.variantPrice)}</p>
            <p className="text-[10px] text-[#712CDC] font-semibold">{order.emiPlan.tenureMonths}m EMI</p>
          </div>
        </div>

        {/* EMI breakdown */}
        <div className="bg-[#EDE5FD] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-[#712CDC]">Your EMI Plan</p>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-bold">0% Interest</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { label: "1st EMI today", value: firstEmi },
              { label: "Tenure", value: `${order.emiPlan.tenureMonths} months` },
              { label: "Total", value: formatINR(order.emiPlan.totalPayable) },
            ].map((item) => (
              <div key={item.label} className="bg-white/60 rounded-xl p-2 text-center">
                <p className="text-[9px] text-[#712CDC] uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-black text-[#1A1A2E] mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method selector */}
        <p className="text-xs text-[#6B6B8A] font-semibold px-1">Choose Payment Method</p>

        {/* 1Fi MF Collateral — recommended */}
        <MethodCard
          selected={method === "mf-collateral"}
          onSelect={() => setMethod("mf-collateral")}
          icon="💜"
          label="1Fi Mutual Fund Collateral"
          badge="Recommended"
          badgeColor="#712CDC"
          desc="Auto-pledge your MF units. No upfront payment. No interest."
        >
          {method === "mf-collateral" && (
            <div className="mt-3 pt-3 border-t border-[#E8E6F0] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B6B8A]">Available MF Limit</span>
                <span className="font-bold text-[#712CDC]">₹2,50,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B6B8A]">This purchase uses</span>
                <span className="font-bold text-[#1A1A2E]">{formatINR(order.variantPrice)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B6B8A]">Remaining limit</span>
                <span className="font-bold text-green-600">{formatINR(250000 - order.variantPrice)}</span>
              </div>
              <div className="h-1.5 bg-[#F5F4F8] rounded-full overflow-hidden">
                <div className="h-full bg-[#712CDC] rounded-full" style={{ width: `${(order.variantPrice / 250000) * 100}%` }} />
              </div>
              <p className="text-[10px] text-[#A0A0B8]">Only {Math.round((order.variantPrice / 250000) * 100)}% of your limit used for this order</p>
            </div>
          )}
        </MethodCard>

        {/* UPI */}
        <MethodCard selected={method === "upi"} onSelect={() => setMethod("upi")} icon="📲" label="UPI" desc="Pay using any UPI app">
          {method === "upi" && (
            <div className="mt-3 pt-3 border-t border-[#E8E6F0] space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {UPI_APPS.map((app) => (
                  <button key={app.id} onClick={() => setUpiApp(app.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
                    style={{ borderColor: upiApp === app.id ? "#712CDC" : "#E8E6F0", background: upiApp === app.id ? "#EDE5FD" : "white" }}>
                    <span className="text-xl">{app.icon}</span>
                    <span className="text-[9px] font-semibold text-[#1A1A2E] text-center leading-tight">{app.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-1.5">Or enter UPI ID</p>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                  className="w-full text-sm text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-4 py-3 placeholder:text-[#C0C0D0]" />
              </div>
            </div>
          )}
        </MethodCard>

        {/* Net Banking */}
        <MethodCard selected={method === "netbanking"} onSelect={() => setMethod("netbanking")} icon="🏦" label="Net Banking" desc="Pay through your bank's portal">
          {method === "netbanking" && (
            <div className="mt-3 pt-3 border-t border-[#E8E6F0]">
              <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-2">Select Bank</p>
              <div className="space-y-1.5">
                {BANKS.map((bank) => (
                  <button key={bank} onClick={() => setSelectedBank(bank)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all"
                    style={{ borderColor: selectedBank === bank ? "#712CDC" : "#E8E6F0", background: selectedBank === bank ? "#EDE5FD" : "white" }}>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: selectedBank === bank ? "#712CDC" : "#D1C4E9" }}>
                      {selectedBank === bank && <div className="w-2.5 h-2.5 rounded-full bg-[#712CDC]" />}
                    </div>
                    <span className="text-sm text-[#1A1A2E] font-medium">{bank}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </MethodCard>

        {/* Card */}
        <MethodCard selected={method === "card"} onSelect={() => setMethod("card")} icon="💳" label="Credit / Debit Card" desc="Visa, Mastercard, RuPay accepted">
          {method === "card" && (
            <div className="mt-3 pt-3 border-t border-[#E8E6F0] space-y-3">
              <CardInput label="Card Number" value={cardNum} onChange={(v) => setCardNum(v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())} placeholder="1234 5678 9012 3456" />
              <div className="grid grid-cols-2 gap-3">
                <CardInput label="Expiry (MM/YY)" value={cardExpiry} onChange={(v) => {
                  const d = v.replace(/\D/g, "").slice(0, 4);
                  setCardExpiry(d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d);
                }} placeholder="MM/YY" />
                <CardInput label="CVV" value={cardCvv} onChange={(v) => setCardCvv(v.replace(/\D/g, "").slice(0, 3))} placeholder="•••" type="password" />
              </div>
              <CardInput label="Name on Card" value={cardName} onChange={setCardName} placeholder="As printed on card" />
            </div>
          )}
        </MethodCard>
      </div>

      {/* Sticky pay button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white px-4 py-4 z-30"
        style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.10)", paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-[#6B6B8A]">First EMI due today</p>
            <p className="text-xl font-black text-[#1A1A2E]">{firstEmi}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#A0A0B8]">Total payable</p>
            <p className="text-sm font-bold text-[#6B6B8A]">{formatINR(order.emiPlan.totalPayable)}</p>
          </div>
        </div>
        <button onClick={handlePay} disabled={paying}
          className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 transition-all"
          style={{ background: paying ? "#9b5de5" : "#712CDC" }}>
          {paying ? (
            <><div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Processing…</>
          ) : (
            <>🔒 Pay {firstEmi} Now</>
          )}
        </button>
        <p className="text-center text-[10px] text-[#A0A0B8] mt-2">
          Remaining {order.emiPlan.tenureMonths - 1} EMIs of {firstEmi} auto-debited monthly
        </p>
      </div>

      {/* Transaction PIN modal for MF collateral */}
      {pinModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white rounded-t-3xl p-6"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
            <div className="w-10 h-1 bg-[#E8E6F0] rounded-full mx-auto mb-5" />
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#EDE5FD] flex items-center justify-center text-3xl mb-3">🔐</div>
              <p className="text-base font-bold text-[#1A1A2E]">Confirm with Transaction PIN</p>
              <p className="text-xs text-[#6B6B8A] mt-1">Enter your 4-digit PIN to authorise pledge</p>
            </div>
            <div className="flex gap-4 justify-center mb-6">
              {pin.map((d, i) => (
                <input key={i} id={`pay-pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handlePinDigit(i, e.target.value)}
                  className="w-16 h-16 rounded-2xl text-center text-2xl font-black outline-none border-2 transition-all"
                  style={{ borderColor: d ? "#712CDC" : "#E8E6F0", background: d ? "#EDE5FD" : "#F5F4F8", color: "#712CDC" }}
                  autoFocus={i === 0} />
              ))}
            </div>
            <p className="text-center text-[10px] text-[#A0A0B8] mb-4">Demo: enter any 4 digits to confirm</p>
            <button onClick={() => { setPinModal(false); setPin(["", "", "", ""]); }}
              className="w-full py-3 rounded-2xl border border-[#E8E6F0] text-sm font-semibold text-[#6B6B8A]">Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

function MethodCard({ selected, onSelect, icon, label, badge, badgeColor, desc, children }: {
  selected: boolean; onSelect: () => void; icon: string; label: string;
  badge?: string; badgeColor?: string; desc: string; children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-all"
      style={{ boxShadow: selected ? "0 4px 20px rgba(113,44,220,0.15)" : "0 2px 8px rgba(113,44,220,0.04)", border: selected ? "2px solid #712CDC" : "2px solid transparent" }}>
      <button onClick={onSelect} className="w-full flex items-center gap-3 p-4 text-left">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: selected ? "#712CDC" : "#A0A0B8" }}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#712CDC]" />}
        </div>
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
            {badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: (badgeColor ?? "#712CDC") + "20", color: badgeColor ?? "#712CDC" }}>{badge}</span>}
          </div>
          <p className="text-xs text-[#6B6B8A] mt-0.5">{desc}</p>
        </div>
      </button>
      {selected && children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function CardInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-1.5">{label}</p>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm font-medium text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-4 py-3 placeholder:text-[#C0C0D0]" />
    </div>
  );
}
