import { useState, useEffect, useRef } from "react";
import type { Product, Category, Screen } from "../types";
import { getProducts } from "../services/marketplaceApi";
import { BRANDS } from "../services/mockData";
import ProductCard from "../components/ProductCard";
import { SkeletonCard } from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";

interface Props {
  navigate: (s: Screen) => void;
  embedded?: boolean;
  brandId?: string;
  initialCategory?: Category;
}

const CATEGORIES: Category[] = [
  "All",
  "Smartphones",
  "Laptops",
  "Tablets",
  "Audio",
  "Wearables",
  "Travel & Flights",
  "Hotels",
  "Jewelry & Beauty",
  "Furniture & Home",
  "Cameras",
];

export default function MarketplaceListScreen({
  navigate,
  embedded,
  brandId,
  initialCategory,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<Category>(initialCategory ?? "All");
  const [searchQuery, setSearchQuery] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);

  const brand = brandId ? BRANDS.find((b) => b.id === brandId) : null;

  async function load(cat: Category) {
    setLoading(true);
    setError(false);
    try {
      const data = await getProducts({
        category: cat === "All" ? undefined : cat,
        brand: brand?.name,
      });
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(category); }, [category, brandId]);

  const featured = products.filter((p) => p.badge);
  const searched = products.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={`${embedded ? "" : "min-h-full"} bg-[#F5F4F8] pb-6`}>
      {/* Standalone Header */}
      {!embedded && (
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => navigate({ name: "shop" })} className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider">SHOP</p>
            <p className="text-base font-bold text-[#1A1A2E]">
              {brand ? brand.name : "1Fi Marketplace"}
            </p>
          </div>
          {brand && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: brand.color + "15" }}
            >
              {brand.logo}
            </div>
          )}
        </div>
      )}

      {/* Brand banner (when filtered by brand) */}
      {brand && !embedded && (
        <div
          className="mx-4 mt-3 rounded-2xl p-4 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${brand.color}dd 0%, ${brand.color}99 100%)` }}
        >
          <div className="text-4xl">{brand.logo}</div>
          <div>
            <p className="text-lg font-black text-white">{brand.name}</p>
            <p className="text-xs text-white/80 mt-0.5">{brand.tagline}</p>
            <p className="text-[10px] text-white/60 mt-1 uppercase tracking-wider">{brand.category}</p>
          </div>
        </div>
      )}

      <div className="px-4 space-y-4 pt-3">
        {/* Search */}
        <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#A0A0B8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#A0A0B8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            placeholder={brand ? `Search in ${brand.name}...` : "Search products..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#A0A0B8]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[#A0A0B8] text-sm">✕</button>
          )}
        </div>

        {/* Category Chips — hide when brand-filtered to a single category */}
        {!brand && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setSearchQuery(""); }}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all"
                style={{
                  background: category === cat ? "#712CDC" : "white",
                  color: category === cat ? "white" : "#6B6B8A",
                  borderColor: category === cat ? "#712CDC" : "#E8E6F0",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Hero Banner (only when not brand-specific) */}
        {!brand && (
          <div
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)" }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-200">LIMITED TIME</p>
              <h2 className="text-base font-black text-white mt-1">0% EMI on all products</h2>
              <p className="text-xs text-purple-200 mt-0.5">Backed by your mutual fund investments</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setSearchQuery("");
                  requestAnimationFrame(() => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
                }}
                className="mt-3 bg-white text-[#712CDC] font-semibold text-xs px-4 py-2 rounded-full"
              >
                Shop Now →
              </button>
            </div>
            <div className="text-5xl opacity-90">🛍️</div>
          </div>
        )}

        {/* Featured row — only when no search and not brand-filtered */}
        {!searchQuery && !brand && featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#1A1A2E]">Featured Products</h3>
              <button className="text-xs font-semibold text-[#712CDC]">See all</button>
            </div>
            {loading ? (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} compact />)}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {featured.map((p) => (
                  <div key={p.id} style={{ width: 180, flexShrink: 0 }}>
                    <ProductCard product={p} onClick={() => navigate({ name: "product", productId: p.id })} compact />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Products Grid */}
        <div ref={productsRef}>
          <h3 className="text-base font-bold text-[#1A1A2E] mb-3">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : brand
              ? `All ${brand.name} Products`
              : category === "All"
              ? "All Products"
              : category}
            {!loading && !error && (
              <span className="ml-2 text-xs text-[#A0A0B8] font-normal">
                ({searched.length})
              </span>
            )}
          </h3>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <EmptyState
              title="Load failed"
              subtitle="Unable to fetch products. Please try again."
              icon="error"
              ctaLabel="Retry"
              onCta={() => load(category)}
            />
          ) : searched.length === 0 ? (
            <EmptyState
              title="No products found"
              subtitle={
                brand
                  ? `${brand.name} doesn't have products in this category yet.`
                  : "Try a different category or search term."
              }
              icon="search"
              ctaLabel={brand ? "View all categories" : undefined}
              onCta={brand ? () => navigate({ name: "marketplace" }) : undefined}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {searched.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => navigate({ name: "product", productId: p.id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
