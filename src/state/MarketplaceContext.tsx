import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product, Variant, EmiPlan } from "../types";

interface Selection {
  product: Product | null;
  variant: Variant | null;
  emiPlan: EmiPlan | null;
}

interface MarketplaceContextValue {
  selection: Selection;
  setProduct: (p: Product) => void;
  setVariant: (v: Variant) => void;
  setEmiPlan: (e: EmiPlan) => void;
  reset: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

const EMPTY: Selection = { product: null, variant: null, emiPlan: null };

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(EMPTY);

  return (
    <MarketplaceContext.Provider
      value={{
        selection,
        setProduct: (p) => setSelection({ product: p, variant: null, emiPlan: null }),
        setVariant: (v) => setSelection((s) => ({ ...s, variant: v, emiPlan: null })),
        setEmiPlan: (e) => setSelection((s) => ({ ...s, emiPlan: e })),
        reset: () => setSelection(EMPTY),
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be inside MarketplaceProvider");
  return ctx;
}
