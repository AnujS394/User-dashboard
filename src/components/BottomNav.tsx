import type { Screen } from "../types";

interface Props {
  current: Screen["name"];
  navigate: (s: Screen) => void;
}

const TABS = [
  {
    name: "home" as Screen["name"],
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 4l9 8" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "shop" as Screen["name"],
    label: "Shop",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="6" x2="21" y2="6" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" />
        <path d="M16 10a4 4 0 01-8 0" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "emi-dues" as Screen["name"],
    label: "EMI Dues",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" />
        <path d="M3 9h18" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" />
        <path d="M8 14h.01M12 14h.01M16 14h.01" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "limit" as Screen["name"],
    label: "Limit",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "profile" as Screen["name"],
    label: "Profile",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? "#712CDC" : "#A0A0B8"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav({ current, navigate }: Props) {
  const resolvedName = current === "marketplace" || current === "product" ? "shop" : current;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white flex items-center justify-around px-2 pt-2 pb-safe"
      style={{ boxShadow: "0 -2px 16px rgba(0,0,0,0.10)", paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
    >
      {TABS.map((tab) => {
        const active = resolvedName === tab.name;
        return (
          <button
            key={tab.name}
            onClick={() => navigate({ name: tab.name } as Screen)}
            className="flex flex-col items-center gap-1 flex-1 py-1"
          >
            {tab.icon(active)}
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#712CDC" : "#A0A0B8" }}
            >
              {tab.label}
            </span>
            {active && (
              <span className="absolute top-0 block w-6 h-0.5 rounded-full bg-[#712CDC]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
