export interface Variant {
  id: string;
  label: string;
  priceDelta: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating?: number;
  images: string[];
  basePrice: number;
  description: string;
  specifications?: Record<string, string>;
  variants: Variant[];
  badge?: string;
}

export interface EmiPlan {
  id: string;
  productId: string;
  tenureMonths: number;
  interestRate: number;
  processingFee: number;
  monthlyAmount: number;
  totalPayable: number;
}

export type Category =
  | "All"
  | "Smartphones"
  | "Laptops"
  | "Tablets"
  | "Audio"
  | "Travel & Flights"
  | "Hotels"
  | "Jewelry & Beauty"
  | "Furniture & Home"
  | "Cameras"
  | "Wearables"
  | "Appliances"
  | "Gaming"
  | "Fitness";

export interface BrandInfo {
  id: string;
  name: string;
  category: string;
  tagline: string;
  color: string;
  logo: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  pan: string;
  dob: string;
  address: string;
  kycStatus: "verified" | "pending" | "rejected";
  mfValue: number;
  emiLimit: number;
  usedLimit: number;
}

export interface OrderSummary {
  product: Product;
  variantLabel: string;
  variantPrice: number;
  emiPlan: EmiPlan;
}

export type Screen =
  | { name: "home" }
  | { name: "shop"; initialTab?: number }
  | { name: "marketplace"; brandId?: string; category?: Category }
  | { name: "product"; productId: string }
  | { name: "emi-calculator" }
  | { name: "emi-dues" }
  | { name: "limit" }
  | { name: "profile" }
  | { name: "sign-in" }
  | { name: "payment"; order: OrderSummary }
  | { name: "payment-success"; order: OrderSummary }
  | { name: "profile-personal" }
  | { name: "profile-bank" }
  | { name: "profile-mf" }
  | { name: "profile-kyc" }
  | { name: "profile-notifications" }
  | { name: "profile-security" }
  | { name: "profile-help" }
  | { name: "profile-terms" };
