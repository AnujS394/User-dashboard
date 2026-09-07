import type { Product, EmiPlan } from "../types";
import { MOCK_PRODUCTS, EMI_TENURES } from "./mockData";
import { buildEmiPlans } from "../lib/emi";

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function getProducts(opts?: { category?: string; brand?: string }): Promise<Product[]> {
  await delay();
  let list = MOCK_PRODUCTS;
  if (opts?.brand) {
    list = list.filter((p) => p.brand.toLowerCase() === opts.brand!.toLowerCase());
  }
  if (opts?.category && opts.category !== "All") {
    list = list.filter((p) => p.category === opts.category);
  }
  return list;
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(400);
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getEmiPlans(productId: string, variantId?: string): Promise<EmiPlan[]> {
  await delay(400);
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];
  const variant = variantId ? product.variants.find((v) => v.id === variantId) : null;
  const principal = product.basePrice + (variant?.priceDelta ?? 0);
  return buildEmiPlans(productId, principal, EMI_TENURES);
}

/** Compute EMI plans for any arbitrary amount — used by the EMI calculator. */
export function computeEmiForAmount(amount: number): EmiPlan[] {
  return buildEmiPlans("custom", amount, EMI_TENURES);
}
