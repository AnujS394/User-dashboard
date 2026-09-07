import { useState, useEffect } from "react";
import type { Product, Variant, EmiPlan, Screen } from "../types";
import { getProduct, getEmiPlans } from "../services/marketplaceApi";
import { useMarketplace } from "../state/MarketplaceContext";
import { formatINR } from "../lib/emi";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import ConfirmationSheet from "./ConfirmationSheet";

interface Props {
  productId: string;
  navigate: (s: Screen) => void;
}

export default function ProductDetailScreen({ productId, navigate }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const [emiPlans, setEmiPlans] = useState<EmiPlan[]>([]);
  const [emiLoading, setEmiLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const { selection, setProduct: selectProduct, setVariant, setEmiPlan } = useMarketplace();

  async function load() {
    setLoading(true); setError(false);
    try {
      const p = await getProduct(productId);
      if (!p) throw new Error("not found");
      setProduct(p); selectProduct(p);
    } catch { setError(true); }
    finally { setLoading(false); }
  }

  async function loadEmi(variantId?: string) {
    setEmiLoading(true);
    try { const plans = await getEmiPlans(productId, variantId); setEmiPlans(plans); }
    finally { setEmiLoading(false); }
  }

  useEffect(() => { load(); }, [productId]);
  useEffect(() => { if (product) loadEmi(selection.variant?.id); }, [product, selection.variant?.id]);

  const price = product ? product.basePrice + (selection.variant?.priceDelta ?? 0) : 0;
  const canContinue = !!selection.variant && !!selection.emiPlan;

  if (loading) return (
    <div className="min-h-full bg-[#F5F4F8]">
      <div className="bg-white h-64 animate-pulse" />
      <div className="px-4 pt-4 space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-full bg-[#F5F4F8] flex flex-col">
      <BackHeader onBack={() => navigate({ name: "marketplace" })} />
      <EmptyState title="Product not found" subtitle="We couldn't load this product." icon="error" ctaLabel="Retry" onCta={load} />
    </div>
  );

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-52">
      <BackHeader onBack={() => navigate({ name: "marketplace" })} title={product.brand} subtitle={product.name} />

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="relative bg-[#F5F4F8]" style={{ aspectRatio: "4/3" }}>
          <ProductImage product={product} src={product.images[imageIdx] ?? product.images[0]} className="w-full h-full" imageClassName="object-contain p-4" />
          {product.badge && (
            <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#712CDC" }}>
              {product.badge}
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 p-3 justify-center">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setImageIdx(i)}
                className="w-14 h-14 rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: i === imageIdx ? "#712CDC" : "transparent" }}>
                <ProductImage product={product} src={img} className="w-full h-full" imageClassName="object-cover" alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 space-y-3 pt-3">
        {/* Product info */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#712CDC]">{product.brand}</p>
          <h1 className="text-xl font-bold text-[#1A1A2E] mt-1">{product.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-black text-[#1A1A2E]">{formatINR(price)}</span>
            {product.rating && <span className="flex items-center gap-1 text-sm text-[#6B6B8A]"><span className="text-yellow-400">★</span>{product.rating}</span>}
          </div>
          <p className="text-sm text-[#6B6B8A] mt-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Variant selector */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
          <p className="text-sm font-bold text-[#1A1A2E] mb-3">Select Variant</p>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => {
              const vPrice = product.basePrice + v.priceDelta;
              const selected = selection.variant?.id === v.id;
              return (
                <button key={v.id} onClick={() => v.inStock && setVariant(v)} disabled={!v.inStock}
                  className="flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left"
                  style={{ borderColor: selected ? "#712CDC" : "#E8E6F0", background: selected ? "#EDE5FD" : "white", opacity: v.inStock ? 1 : 0.45 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: selected ? "#712CDC" : "#A0A0B8" }}>
                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#712CDC]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A2E]">{v.label}</p>
                      {!v.inStock && <p className="text-xs text-[#A0A0B8]">Out of stock</p>}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#1A1A2E]">{formatINR(vPrice)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
            <button className="w-full flex items-center justify-between p-4" onClick={() => setShowSpecs(!showSpecs)}>
              <p className="text-sm font-bold text-[#1A1A2E]">Specifications</p>
              <span className="text-[#712CDC] text-xl font-light">{showSpecs ? "−" : "+"}</span>
            </button>
            {showSpecs && (
              <div className="px-4 pb-4 space-y-0">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2.5 border-t border-[#F5F4F8]">
                    <span className="text-xs text-[#6B6B8A] font-medium">{key}</span>
                    <span className="text-xs font-semibold text-[#1A1A2E] text-right max-w-[55%]">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EMI Plans */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#1A1A2E]">EMI Plans</p>
            <span className="text-xs text-[#22C55E] bg-green-50 font-semibold px-2 py-1 rounded-full">0% Interest</span>
          </div>
          {!selection.variant ? (
            <p className="text-xs text-[#A0A0B8] text-center py-4">Select a variant to view EMI plans</p>
          ) : emiLoading ? (
            <div className="space-y-2 animate-pulse">{[1, 2, 3].map((i) => <div key={i} className="h-14 bg-[#F5F4F8] rounded-xl" />)}</div>
          ) : (
            <div className="space-y-2">
              {emiPlans.map((plan) => {
                const selected = selection.emiPlan?.id === plan.id;
                return (
                  <button key={plan.id} onClick={() => setEmiPlan(plan)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all"
                    style={{ borderColor: selected ? "#712CDC" : "#E8E6F0", background: selected ? "#EDE5FD" : "#F5F4F8" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: selected ? "#712CDC" : "#A0A0B8" }}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#712CDC]" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold" style={{ color: selected ? "#712CDC" : "#1A1A2E" }}>{formatINR(plan.monthlyAmount)}/mo</p>
                        <p className="text-[10px] text-[#6B6B8A]">{plan.tenureMonths} months · Total {formatINR(plan.totalPayable)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#22C55E] bg-green-50 px-2 py-0.5 rounded-full">0% EMI</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-[64px] left-0 right-0 max-w-md mx-auto bg-white px-4 pt-3 z-50"
        style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.10)", paddingBottom: "16px" }}>
        {selection.emiPlan && selection.variant && (
          <div className="flex items-center justify-between mb-2 px-1">
            <div>
              <p className="text-[10px] text-[#6B6B8A]">{selection.variant.label}</p>
              <p className="text-sm font-bold text-[#1A1A2E]">{formatINR(selection.emiPlan.monthlyAmount)}/mo × {selection.emiPlan.tenureMonths}m</p>
            </div>
            <p className="text-xs text-[#6B6B8A]">Total: {formatINR(selection.emiPlan.totalPayable)}</p>
          </div>
        )}
        <button onClick={() => canContinue && setShowConfirm(true)}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all"
          style={{ background: canContinue ? "#712CDC" : "#E8E6F0", color: canContinue ? "white" : "#A0A0B8" }}>
          {canContinue ? "Review & Pay →" : !selection.variant ? "Select a variant to continue" : "Select an EMI plan"}
        </button>
      </div>

      {showConfirm && product && selection.variant && selection.emiPlan && (
        <ConfirmationSheet
          product={product}
          variant={selection.variant}
          emiPlan={selection.emiPlan}
          onClose={() => setShowConfirm(false)}
          navigate={navigate}
        />
      )}
    </div>
  );
}

function BackHeader({ onBack, title, subtitle }: { onBack: () => void; title?: string; subtitle?: string }) {
  return (
    <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-20" style={{ boxShadow: "0 1px 0 #E8E6F0" }}>
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {(title || subtitle) && (
        <div>
          {title && <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider">{title}</p>}
          {subtitle && <p className="text-base font-bold text-[#1A1A2E]">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
