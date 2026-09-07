import type { Product } from "../types";
import { formatINR, computeMonthlyAmount } from "../lib/emi";
import ProductImage from "./ProductImage";

interface Props {
  product: Product;
  onClick: () => void;
  compact?: boolean;
}

const BADGE_COLORS: Record<string, string> = {
  "New Launch": "#7C3AED",
  Bestseller: "#D97706",
  "Top Pick": "#059669",
};

export default function ProductCard({ product, onClick, compact }: Props) {
  const minEmi = computeMonthlyAmount(product.basePrice, 24, 0);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden text-left flex-shrink-0"
      style={{
        boxShadow: "0 2px 12px rgba(113,44,220,0.08)",
        width: compact ? 180 : "100%",
      }}
    >
      {/* Image */}
      <div className="relative bg-[#F5F4F8]" style={{ aspectRatio: "1/1" }}>
        <ProductImage product={product} className="w-full h-full" imageClassName="object-cover" />
        {product.badge && (
          <span
            className="absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: BADGE_COLORS[product.badge] ?? "#712CDC" }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#712CDC]">
          {product.brand}
        </p>
        <p className="text-sm font-semibold text-[#1A1A2E] mt-0.5 leading-tight">
          {product.name}
        </p>
        <p className="text-sm font-bold text-[#1A1A2E] mt-1">
          {formatINR(product.basePrice)}
        </p>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-[#712CDC] bg-[#EDE5FD] px-2 py-0.5 rounded-full">
            EMI {formatINR(minEmi)}/mo
          </span>
          {product.rating && (
            <span className="text-[10px] text-[#6B6B8A] flex items-center gap-0.5">
              ★ {product.rating}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
