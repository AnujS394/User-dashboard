import { useState } from "react";
import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

const NOTIF_SETTINGS = [
  { id: "emi", label: "EMI Reminders", desc: "Due date alerts 3 days before debit", icon: "📋" },
  { id: "offers", label: "Offers & Deals", desc: "New products, discounts, and brand offers", icon: "🏷️" },
  { id: "account", label: "Account Activity", desc: "Login alerts, limit changes, KYC updates", icon: "🔔" },
  { id: "portfolio", label: "Portfolio Updates", desc: "NAV changes, fund performance alerts", icon: "📈" },
  { id: "payment", label: "Payment Confirmation", desc: "EMI debit and payment receipts", icon: "✅" },
  { id: "promo", label: "Promotions", desc: "New brands, features, and app updates", icon: "🎁" },
];

const RECENT_NOTIFS = [
  { id: "n1", icon: "📋", title: "EMI Due in 3 days", body: "Your next EMI of ₹3,208 is due on Dec 15. Ensure sufficient balance.", time: "Today · 9:00 AM", unread: true, category: "emi" },
  { id: "n2", icon: "🏷️", title: "0% EMI on Air India flights", body: "Book your next vacation on easy no-cost EMI. Offers valid till Dec 31.", time: "Yesterday · 2:30 PM", unread: true, category: "offers" },
  { id: "n3", icon: "✅", title: "Payment Successful", body: "₹3,208 auto-debited from HDFC XXXX4821 for November EMI.", time: "Dec 1 · 8:05 AM", unread: false, category: "payment" },
  { id: "n4", icon: "📈", title: "Portfolio up by 2.4%", body: "Your mutual fund portfolio gained ₹19,850 this month.", time: "Nov 30 · 6:00 PM", unread: false, category: "portfolio" },
  { id: "n5", icon: "🎁", title: "New brand: CGH Earth Hotels", body: "Luxury resorts now available on 1Fi Marketplace. Book your stay on EMI.", time: "Nov 28 · 11:00 AM", unread: false, category: "promo" },
  { id: "n6", icon: "🔔", title: "Login from new device", body: "New login detected from Chrome on MacOS. If this wasn't you, secure your account.", time: "Nov 25 · 3:20 PM", unread: false, category: "account" },
];

export default function NotificationsScreen({ navigate }: Props) {
  const [tab, setTab] = useState<"inbox" | "settings">("inbox");
  const [settings, setSettings] = useState<Record<string, boolean>>(Object.fromEntries(NOTIF_SETTINGS.map((n) => [n.id, true])));
  const [notifs, setNotifs] = useState(RECENT_NOTIFS);

  function toggle(id: string) { setSettings((s) => ({ ...s, [id]: !s[id] })); }
  function markAllRead() { setNotifs((n) => n.map((x) => ({ ...x, unread: false }))); }
  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Notifications" onBack={() => navigate({ name: "profile" })} action={tab === "inbox" && unreadCount > 0 ? { label: "Mark all read", onPress: markAllRead } : undefined} />

      {/* Tabs */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-1 flex gap-1" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.06)" }}>
        {(["inbox", "settings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all flex items-center justify-center gap-1.5"
            style={{ background: tab === t ? "#712CDC" : "transparent", color: tab === t ? "white" : "#6B6B8A" }}>
            {t === "inbox" ? "📬" : "⚙️"} {t === "inbox" ? "Inbox" : "Settings"}
            {t === "inbox" && unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-[#712CDC] text-[9px] font-black flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 mt-3 space-y-2">
        {tab === "inbox" ? (
          notifs.length === 0 ? (
            <div className="text-center py-16 text-[#A0A0B8] text-sm">No notifications</div>
          ) : (
            notifs.map((n) => (
              <button key={n.id} onClick={() => setNotifs((list) => list.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
                className="w-full bg-white rounded-2xl p-4 flex items-start gap-3 text-left"
                style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)", borderLeft: n.unread ? "3px solid #712CDC" : "3px solid transparent" }}>
                <span className="text-2xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#1A1A2E] leading-tight">{n.title}</p>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-[#712CDC] flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-[#6B6B8A] mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-[#A0A0B8] mt-1.5">{n.time}</p>
                </div>
              </button>
            ))
          )
        ) : (
          <>
            <p className="text-xs text-[#6B6B8A] font-medium px-1">Notification preferences</p>
            {NOTIF_SETTINGS.map((ns) => (
              <div key={ns.id} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
                <span className="text-2xl flex-shrink-0">{ns.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1A1A2E]">{ns.label}</p>
                  <p className="text-xs text-[#6B6B8A] mt-0.5">{ns.desc}</p>
                </div>
                <Toggle on={settings[ns.id]} onChange={() => toggle(ns.id)} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all" style={{ background: on ? "#712CDC" : "#E8E6F0" }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
    </button>
  );
}
