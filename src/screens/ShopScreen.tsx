import { useState, useEffect } from "react";
import type { Screen } from "../types";
import { BRANDS, NEARBY_STORES_BY_CITY, CITIES } from "../services/mockData";
import MarketplaceListScreen from "./MarketplaceListScreen";

interface Props {
  navigate: (s: Screen) => void;
  initialTab?: number;
}

const TABS = ["Top Brands", "Nearby Stores", "1Fi Marketplace"];

export default function ShopScreen({ navigate, initialTab = 0 }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Re-sync if parent changes initialTab (e.g. clicking brand from home)
  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  return (
    <div className="min-h-full bg-[#F5F4F8] flex flex-col">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3a0ca3 0%, #712CDC 60%, #9b5de5 100%)", minHeight: 220 }}
      >
        <div className="absolute inset-0 opacity-15 pointer-events-none text-6xl flex flex-wrap gap-4 p-4">
          <span>📱</span><span>💻</span><span>✈️</span><span>🛏️</span><span>💎</span><span>🎧</span>
        </div>
        <div className="relative px-5 pt-12 pb-16">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
            <span className="text-yellow-300 text-xs">✦</span>
            <span className="text-white text-[11px] font-medium">NO-COST EMIs</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">
            Shop today,<br />Pay later using<br />Mutual funds.
          </h1>
          <p className="text-purple-200 text-xs mt-2">No credit score required. No interest.<br />Backed by your investments.</p>
        </div>
      </div>

      {/* Tab Switcher — overlaps hero */}
      <div className="mx-4 -mt-6 bg-white rounded-2xl p-1.5 flex gap-1 z-10 relative"
        style={{ boxShadow: "0 4px 16px rgba(113,44,220,0.12)" }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap"
            style={{ background: activeTab === i ? "#712CDC" : "transparent", color: activeTab === i ? "white" : "#6B6B8A" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 mt-4 pb-24">
        {activeTab === 0 && <TopBrandsTab navigate={navigate} />}
        {activeTab === 1 && <NearbyStoresTab navigate={navigate} />}
        {activeTab === 2 && <MarketplaceListScreen navigate={navigate} embedded />}
      </div>
    </div>
  );
}

// ── TOP BRANDS ──────────────────────────────────────────────────────────────
function TopBrandsTab({ navigate }: { navigate: (s: Screen) => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(BRANDS.map((b) => b.category)))];
  const filtered = BRANDS.filter((b) => {
    const matchCat = activeCategory === "All" || b.category === activeCategory;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="px-4 space-y-4">
      {/* Search */}
      <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#A0A0B8" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="#A0A0B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#A0A0B8]"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all"
            style={{
              background: activeCategory === cat ? "#712CDC" : "white",
              color: activeCategory === cat ? "white" : "#6B6B8A",
              borderColor: activeCategory === cat ? "#712CDC" : "#E8E6F0",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((brand) => (
          <button
            key={brand.id}
            onClick={() => navigate({ name: "marketplace", brandId: brand.id })}
            className="bg-white rounded-2xl p-3 flex flex-col items-center gap-2 text-center active:scale-95 transition-transform"
            style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: brand.color + "15", border: `1.5px solid ${brand.color}25` }}
            >
              {brand.logo}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1A2E] leading-tight">{brand.name}</p>
              <p className="text-[9px] text-[#A0A0B8] mt-0.5 leading-tight">{brand.tagline}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-[#A0A0B8] text-sm">No brands found</div>
      )}
    </div>
  );
}

// ── NEARBY STORES ────────────────────────────────────────────────────────────
type LocationState = "idle" | "requesting" | "granted" | "denied";

function NearbyStoresTab({ navigate }: { navigate: (s: Screen) => void }) {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [city, setCity] = useState("Gurugram");
  const [search, setSearch] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [brandFilter, setBrandFilter] = useState("All");

  const stores = NEARBY_STORES_BY_CITY[city] ?? [];
  const filtered = stores.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.brand.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter === "All" || s.brand === brandFilter;
    return matchSearch && matchBrand;
  });

  const storeBrands = ["All", ...Array.from(new Set(stores.map((s) => s.brand)))];

  function requestLocation() {
    setLocationState("requesting");
    if (!navigator.geolocation) { setLocationState("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      () => {
        // Simulate city detection from coords
        setLocationState("granted");
        setCity("Bengaluru");
      },
      () => setLocationState("denied"),
      { timeout: 8000 },
    );
  }

  return (
    <div className="px-4 space-y-4">
      {/* Location permission prompt */}
      {locationState === "idle" && (
        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#712CDC]">Enable Location</p>
            <p className="text-xs text-[#712CDC]/70 mt-0.5">Find 1Fi partner stores near you</p>
          </div>
          <button
            onClick={requestLocation}
            className="text-xs font-bold text-white bg-[#712CDC] px-3 py-1.5 rounded-full flex-shrink-0"
          >
            Allow
          </button>
        </div>
      )}

      {locationState === "requesting" && (
        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl animate-pulse">📡</span>
          <p className="text-sm text-[#712CDC]">Detecting your location…</p>
        </div>
      )}

      {locationState === "granted" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
          <span className="text-green-500 text-sm">✓</span>
          <p className="text-xs text-green-700 font-medium">Location detected — showing stores near {city}</p>
        </div>
      )}

      {locationState === "denied" && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex items-center gap-2">
          <span className="text-orange-500 text-sm">⚠</span>
          <p className="text-xs text-orange-700">Location access denied. Select your city below.</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#A0A0B8" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="#A0A0B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#A0A0B8]"
        />
      </div>

      {/* Heading + City picker */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#1A1A2E]">Nearby Stores <span className="text-[#A0A0B8] font-normal text-xs">({filtered.length})</span></h3>
        <div className="relative">
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="text-xs text-[#712CDC] font-semibold flex items-center gap-1 bg-[#EDE5FD] px-3 py-1.5 rounded-full"
          >
            📍 {city} ▾
          </button>
          {showCityPicker && (
            <div className="absolute right-0 top-8 bg-white rounded-2xl py-2 z-20 min-w-[140px]"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setShowCityPicker(false); setBrandFilter("All"); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#EDE5FD] transition-colors"
                  style={{ color: c === city ? "#712CDC" : "#1A1A2E", fontWeight: c === city ? 600 : 400 }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brand filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {storeBrands.map((b) => (
          <button
            key={b}
            onClick={() => setBrandFilter(b)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all"
            style={{
              background: brandFilter === b ? "#712CDC" : "white",
              color: brandFilter === b ? "white" : "#6B6B8A",
              borderColor: brandFilter === b ? "#712CDC" : "#E8E6F0",
            }}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Store list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-[#A0A0B8] text-sm">No matching stores found</div>
      ) : (
        <div className="space-y-3 pb-6">
          {filtered.map((store, idx) => {
            const brand = BRANDS.find((b) => b.name === store.brand);
            return (
              <button
                key={idx}
                onClick={() => brand && navigate({ name: "marketplace", brandId: brand.id })}
                className="w-full bg-white rounded-2xl p-4 flex items-start gap-3 text-left active:scale-98 transition-transform"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: (brand?.color ?? "#712CDC") + "15" }}>
                  {brand?.logo ?? "🏪"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1A1A2E] leading-tight">{store.name}</p>
                    <span className="text-xs font-semibold text-[#712CDC] bg-[#EDE5FD] px-2 py-0.5 rounded-full flex-shrink-0">
                      {store.dist}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B8A] mt-0.5 leading-relaxed">{store.address}</p>
                  <span className="inline-block mt-1.5 text-[9px] text-[#712CDC] font-semibold bg-[#EDE5FD] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {store.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
