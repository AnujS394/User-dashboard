import { createPortal } from "react-dom";
import type { Product, Variant, EmiPlan, Screen } from "../types";
import { formatINR } from "../lib/emi";
import ProductImage from "../components/ProductImage";

interface Props {
  product: Product;
  variant: Variant;
  emiPlan: EmiPlan;
  onClose: () => void;
  navigate: (s: Screen) => void;
}

export default function ConfirmationSheet({ product, variant, emiPlan, onClose, navigate }: Props) {
  const variantPrice = product.basePrice + variant.priceDelta;

  function handleConfirm() {
    onClose();
    navigate({
      name: "payment",
      order: {
        product,
        variantLabel: variant.label,
        variantPrice,
        emiPlan,
      },
    });
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white rounded-t-3xl"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.20)", maxHeight: "calc(100dvh - 16px)", overflowY: "auto" }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#E8E6F0] rounded-full" />
        </div>

        <div className="px-5 pb-8 pt-2">
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-0.5">Order Summary</h2>
          <p className="text-xs text-[#6B6B8A] mb-4">Review before proceeding to payment</p>

          {/* Product row */}
          <div className="flex items-center gap-3 bg-[#F5F4F8] rounded-2xl p-3 mb-4">
            <ProductImage product={product} className="w-14 h-14 rounded-xl flex-shrink-0" imageClassName="object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#712CDC] font-semibold">{product.brand}</p>
              <p className="text-sm font-bold text-[#1A1A2E] leading-tight">{product.name}</p>
              <p className="text-xs text-[#6B6B8A] mt-0.5">{variant.label}</p>
            </div>
            <p className="text-sm font-black text-[#1A1A2E] flex-shrink-0">{formatINR(variantPrice)}</p>
          </div>

          {/* EMI details */}
          <div className="space-y-2.5 mb-4">
            <SummaryRow label="Tenure" value={`${emiPlan.tenureMonths} months`} />
            <SummaryRow label="Monthly EMI" value={formatINR(emiPlan.monthlyAmount)} purple />
            <SummaryRow label="Interest Rate" value="0% (No-cost EMI)" green />
            <SummaryRow label="Processing Fee" value="₹0" />
            <div className="border-t border-[#E8E6F0] pt-2.5">
              <SummaryRow label="Total Payable" value={formatINR(emiPlan.totalPayable)} bold />
            </div>
          </div>

          {/* Note */}
          <div className="bg-[#EDE5FD] rounded-xl p-3 flex gap-2 mb-4">
            <span className="text-[#712CDC] text-xs flex-shrink-0 mt-0.5">✦</span>
            <p className="text-xs text-[#712CDC] leading-relaxed">
              Your mutual fund holdings are pledged as collateral. Not redeemed — you continue earning returns.
            </p>
          </div>

          {/* Buttons */}
          <div className="sticky bottom-0 flex gap-3 bg-white pt-2">
            <button onClick={onClose}
              className="flex-1 py-4 rounded-2xl border-2 border-[#E8E6F0] font-semibold text-sm text-[#6B6B8A] active:bg-[#F5F4F8]">
              Cancel
            </button>
            <button onClick={handleConfirm}
              className="flex-1 py-4 rounded-2xl font-bold text-sm text-white active:opacity-80"
              style={{ background: "#712CDC" }}>
              Proceed to Pay →
            </button>
          </div>
        </div>
      </div>
    </>
    , document.body,
  );
}

function SummaryRow({ label, value, purple, green, bold }: { label: string; value: string; purple?: boolean; green?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#6B6B8A]">{label}</span>
      <span className={`text-sm font-semibold ${bold ? "text-base font-black text-[#1A1A2E]" : purple ? "text-[#712CDC] font-bold" : green ? "text-[#22C55E]" : "text-[#1A1A2E]"}`}>
        {value}
      </span>
    </div>
  );
}
