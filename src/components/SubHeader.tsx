import type { Screen } from "../types";

interface Props {
  title: string;
  subtitle?: string;
  onBack: () => void;
  action?: { label: string; onPress: () => void };
}

export default function SubHeader({ title, subtitle, onBack, action }: Props) {
  return (
    <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 sticky top-0 z-20"
      style={{ boxShadow: "0 1px 0 #E8E6F0" }}>
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#F5F4F8] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="flex-1">
        <p className="text-base font-bold text-[#1A1A2E]">{title}</p>
        {subtitle && <p className="text-xs text-[#6B6B8A]">{subtitle}</p>}
      </div>
      {action && (
        <button onClick={action.onPress} className="text-sm font-semibold text-[#712CDC]">{action.label}</button>
      )}
    </div>
  );
}
