import type { Screen } from "../types";
import EmptyState from "../components/EmptyState";

interface Props {
  navigate: (s: Screen) => void;
}

export default function EmiDuesScreen({ navigate }: Props) {
  return (
    <div className="min-h-full bg-[#F5F4F8] flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <p className="text-lg font-bold text-[#1A1A2E]">EMI Dues</p>
        <p className="text-xs text-[#6B6B8A] mt-0.5">Track your upcoming payments</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <EmptyState
          icon="dues"
          title="Nothing Due Yet"
          subtitle="Looks like you haven't shopped yet with 1Fi"
          ctaLabel="Check eligibility"
          onCta={() => navigate({ name: "shop", initialTab: 2 })}
        />
      </div>
    </div>
  );
}
