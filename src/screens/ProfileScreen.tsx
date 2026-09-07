import type { Screen } from "../types";
import { MOCK_USER } from "../services/mockData";
import { useAuth } from "../state/AuthContext";

interface Props { navigate: (s: Screen) => void }

export default function ProfileScreen({ navigate }: Props) {
  const { logout } = useAuth();

  const MENU: { icon: string; label: string; sub: string; screen: Screen; badge?: string; badgeColor?: string }[] = [
    { icon: "👤", label: "Personal Details", sub: "Name, email, PAN, address", screen: { name: "profile-personal" } },
    { icon: "🏦", label: "Linked Bank Accounts", sub: "Manage repayment accounts", screen: { name: "profile-bank" }, badge: "2 linked", badgeColor: "#22C55E" },
    { icon: "💼", label: "Mutual Fund Portfolio", sub: "Holdings linked as collateral", screen: { name: "profile-mf" }, badge: "₹8.47L", badgeColor: "#712CDC" },
    { icon: "🔐", label: "KYC Status", sub: "Identity verification", screen: { name: "profile-kyc" }, badge: MOCK_USER.kycStatus === "verified" ? "Verified" : "Pending", badgeColor: MOCK_USER.kycStatus === "verified" ? "#22C55E" : "#F5A623" },
    { icon: "🔔", label: "Notifications", sub: "Alerts, reminders, offers", screen: { name: "profile-notifications" }, badge: "2 new", badgeColor: "#712CDC" },
    { icon: "🔒", label: "Security & Privacy", sub: "PIN, biometrics, sessions", screen: { name: "profile-security" } },
    { icon: "❓", label: "Help & Support", sub: "FAQs, contact, tickets", screen: { name: "profile-help" } },
    { icon: "📄", label: "Terms & Conditions", sub: "Legal, privacy, grievance", screen: { name: "profile-terms" } },
  ];

  function handleSignOut() {
    logout();
    navigate({ name: "sign-in" });
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-8" style={{ background: "linear-gradient(135deg, #4a1d96 0%, #712CDC 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
            <span className="text-2xl font-black text-white">
              {MOCK_USER.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white">{MOCK_USER.name}</p>
            <p className="text-sm text-purple-200 truncate">{MOCK_USER.email}</p>
            <p className="text-xs text-purple-200 mt-0.5">{MOCK_USER.phone}</p>
          </div>
          <button onClick={() => navigate({ name: "profile-personal" })} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: "EMI Limit", value: "₹2.5L" },
            { label: "Used", value: "₹0" },
            { label: "KYC", value: "✓ Done" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-purple-200 text-[9px] uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 space-y-2">
        {MENU.map((item) => (
          <button key={item.label} onClick={() => navigate(item.screen)}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left active:bg-[#F5F4F8] transition-colors"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#F5F4F8] flex items-center justify-center text-xl flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1A1A2E]">{item.label}</p>
              <p className="text-xs text-[#A0A0B8] mt-0.5">{item.sub}</p>
            </div>
            {item.badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color: item.badgeColor, background: (item.badgeColor ?? "#712CDC") + "18" }}>
                {item.badge}
              </span>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M9 18l6-6-6-6" stroke="#D0D0E0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ))}

        {/* Sign Out */}
        <button onClick={handleSignOut}
          className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left mt-2 border border-red-100 active:bg-red-50 transition-colors"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl flex-shrink-0">🚪</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-500">Sign Out</p>
            <p className="text-xs text-red-400 mt-0.5">Log out of your 1Fi account</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-center text-[10px] text-[#A0A0B8] py-2">1Fi Financial Services Pvt. Ltd. · NBFC · RBI Regulated</p>
        <p className="text-center text-[10px] text-[#C0C0D0] pb-4">App v2.4.1</p>
      </div>
    </div>
  );
}
