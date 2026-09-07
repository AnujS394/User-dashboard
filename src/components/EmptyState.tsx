interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  icon?: "bag" | "search" | "error" | "dues";
}

const ICONS = {
  bag: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="32" fill="#EDE5FD" />
      <path d="M22 24h20l-2.5 18H24.5L22 24z" stroke="#712CDC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 24v-3a4 4 0 018 0v3" stroke="#712CDC" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="32" fill="#EDE5FD" />
      <circle cx="30" cy="30" r="9" stroke="#712CDC" strokeWidth="2.5" />
      <path d="M37 37l6 6" stroke="#712CDC" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="32" fill="#FEE2E2" />
      <circle cx="32" cy="32" r="12" stroke="#EF4444" strokeWidth="2.5" />
      <path d="M32 26v7M32 37v1" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  dues: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="72" rx="22" ry="4" fill="#E8E6F0" />
      <rect x="18" y="16" width="36" height="50" rx="4" fill="white" stroke="#E8E6F0" strokeWidth="1.5" />
      <rect x="24" y="26" width="20" height="3" rx="1.5" fill="#EDE5FD" />
      <rect x="24" y="33" width="16" height="3" rx="1.5" fill="#EDE5FD" />
      <rect x="24" y="40" width="12" height="3" rx="1.5" fill="#F5A623" opacity="0.5" />
      <path d="M24 52h16" stroke="#E8E6F0" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="54" cy="22" r="10" fill="#712CDC" />
      <path d="M54 18v5M54 25v1" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="60" r="3" fill="#EDE5FD" />
      <circle cx="62" cy="48" r="2" fill="#EDE5FD" />
    </svg>
  ),
};

export default function EmptyState({ title, subtitle, ctaLabel, onCta, icon = "bag" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16 gap-4">
      {ICONS[icon]}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#A0A0B8] mb-2">{title}</p>
        {subtitle && <p className="text-base text-[#6B6B8A] leading-relaxed">{subtitle}</p>}
      </div>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-2 px-8 py-3.5 rounded-full font-semibold text-white text-sm"
          style={{ background: "#712CDC" }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
