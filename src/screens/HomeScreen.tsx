import { useState } from "react";
import type { Screen } from "../types";
import { BRANDS } from "../services/mockData";

interface Props {
  navigate: (s: Screen) => void;
}

const OFFERS = [
  {
    category: "FURNITURE | MATTRESS | HOME DECOR",
    title: "Dream homes, easy EMIs",
    badge: "Comfort on 12m no-cost EMIs",
    bg: "from-[#4a1d96] to-[#712CDC]",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=180&fit=crop",
    brandId: "wakefit",
  },
  {
    category: "FLIGHTS | HOTELS | PACKAGES",
    title: "Travel now, pay in EMIs",
    badge: "No foreclosure charges",
    bg: "from-[#064e3b] to-[#059669]",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=180&fit=crop",
    brandId: "air-india",
  },
  {
    category: "SMARTPHONES | LAPTOPS | TABLETS",
    title: "Your next device, zero interest",
    badge: "Up to 24m no-cost EMIs",
    bg: "from-[#1e3a5f] to-[#2563eb]",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=180&fit=crop",
    brandId: "croma",
  },
  {
    category: "JEWELRY | BEAUTY | WELLNESS",
    title: "Luxury jewelry, easy EMIs",
    badge: "0% interest, 0 hidden fees",
    bg: "from-[#78350f] to-[#d97706]",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=180&fit=crop",
    brandId: "giva",
  },
];

export default function HomeScreen({ navigate }: Props) {
  const [offerIdx, setOfferIdx] = useState(0);

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4">
        {/* Logo bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #5a1db8 0%, #712CDC 100%)" }}>
              <span className="text-white font-black text-sm leading-none">1Fi</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-black text-[#1A1A2E] leading-none tracking-tight">1Fi</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#712CDC] leading-none mt-0.5">Marketplace</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate({ name: "profile-notifications" })}
              aria-label="Open notifications"
              className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#6B6B8A" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#EDE5FD] flex items-center justify-center">
              <span className="text-xs font-bold text-[#712CDC]">RS</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-[#6B6B8A]">Good morning 👋</p>
          <p className="text-lg font-bold text-[#1A1A2E]">Rahul Sharma</p>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-4">
        {/* Hero Banner */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)" }}
        >
          <div className="flex-1 z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200 mb-1">Get Started</p>
            <h2 className="text-xl font-bold text-white leading-tight">
              Shop on{" "}
              <span style={{ color: "#F5A623" }}>no-cost EMI</span>
            </h2>
            <p className="text-xs text-purple-200 mt-1.5 leading-relaxed max-w-[180px]">
              Backed by your mutual funds. No credit pull. No charges. Quick approval.
            </p>
            <button
              onClick={() => navigate({ name: "shop" })}
              className="mt-4 bg-white text-[#712CDC] font-semibold text-xs px-4 py-2 rounded-full"
            >
              Check eligibility →
            </button>
          </div>
          <div className="absolute right-4 top-0 bottom-0 flex flex-col items-end justify-center opacity-25 pointer-events-none">
            <p className="text-7xl font-black text-white leading-none">0%</p>
            <p className="text-2xl font-black text-white leading-none">INTEREST</p>
          </div>
        </div>

        {/* Offers Carousel */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B8A] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#712CDC] inline-block" />
            Offers
          </p>
          <div
            className={`rounded-2xl overflow-hidden relative bg-gradient-to-r ${OFFERS[offerIdx].bg} cursor-pointer`}
            style={{ minHeight: 160 }}
            onClick={() => navigate({ name: "marketplace", brandId: OFFERS[offerIdx].brandId })}
          >
            <img src={OFFERS[offerIdx].image} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-40" />
            <div className="relative p-5 max-w-[55%]">
              <p className="text-[9px] font-bold text-yellow-300 uppercase tracking-wider mb-2">
                {OFFERS[offerIdx].category}
              </p>
              <h3 className="text-lg font-bold text-white leading-tight">{OFFERS[offerIdx].title}</h3>
              <div className="mt-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 inline-flex items-center gap-1.5">
                <span className="text-green-400 text-xs">✓</span>
                <span className="text-white text-xs">{OFFERS[offerIdx].badge}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {OFFERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setOfferIdx(i)}
                className="rounded-full transition-all"
                style={{ width: i === offerIdx ? 20 : 6, height: 6, background: i === offerIdx ? "#712CDC" : "#D1C4E9" }}
              />
            ))}
          </div>
        </div>

        {/* Top Brands */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6B6B8A] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#712CDC] inline-block" />
            Shop using 1Fi at Top Brands
          </p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => navigate({ name: "marketplace", brandId: brand.id })}
                className="flex-shrink-0 flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: brand.color + "15", border: `1.5px solid ${brand.color}30` }}
                >
                  {brand.logo}
                </div>
                <span className="text-[10px] text-[#6B6B8A] font-medium text-center max-w-[56px] leading-tight">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ name: "shop", initialTab: 2 })}
            className="bg-white rounded-2xl p-4 text-left"
            style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDE5FD] flex items-center justify-center mb-3">
              <span className="text-xl">🛍️</span>
            </div>
            <p className="text-sm font-semibold text-[#1A1A2E]">1Fi Marketplace</p>
            <p className="text-xs text-[#6B6B8A] mt-0.5">Browse all products</p>
          </button>
          <button
            onClick={() => navigate({ name: "emi-calculator" })}
            className="bg-white rounded-2xl p-4 text-left"
            style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDE5FD] flex items-center justify-center mb-3">
              <span className="text-xl">🧮</span>
            </div>
            <p className="text-sm font-semibold text-[#1A1A2E]">EMI Calculator</p>
            <p className="text-xs text-[#6B6B8A] mt-0.5">Plan your payments</p>
          </button>
        </div>
      </div>
    </div>
  );
}
