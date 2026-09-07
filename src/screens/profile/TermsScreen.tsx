import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

const SECTIONS = [
  {
    title: "1. About 1Fi",
    body: "1Fi is a financial technology platform operated by 1Fi Financial Services Private Limited, an NBFC registered with the Reserve Bank of India (RBI). We provide affordability solutions by enabling users to purchase goods and services using their mutual fund investments as collateral, without requiring credit scores or credit cards.",
  },
  {
    title: "2. Eligibility",
    body: "To use 1Fi services, you must be: (a) an Indian resident aged 18 years or above; (b) a valid KYC-compliant mutual fund investor with holdings in recognized AMCs; (c) in possession of a valid PAN and Aadhaar card. 1Fi reserves the right to reject applications at its sole discretion.",
  },
  {
    title: "3. EMI and Lending Terms",
    body: "All EMI plans offered through 1Fi Marketplace are subject to approval based on your portfolio value and risk assessment. EMI deductions are auto-debited from your registered bank account on the due date. Late payments attract a fee of ₹500 per EMI or 2% of the outstanding amount, whichever is higher. 1Fi reserves the right to initiate partial redemption of pledged units in case of persistent default.",
  },
  {
    title: "4. Mutual Fund Pledge",
    body: "By using 1Fi, you authorize 1Fi to create a lien/pledge on your eligible mutual fund units to the extent of your outstanding loan amount. Pledged units will not be redeemed unless you default on payments. Returns on pledged units continue to accrue to your account. The lien is released upon full repayment of the outstanding loan.",
  },
  {
    title: "5. Privacy Policy",
    body: "1Fi collects personal information including PAN, Aadhaar, bank account details, and mutual fund portfolio data for the sole purpose of providing our services. We do not sell your data to third parties. All data is encrypted at rest and in transit. For the full Privacy Policy, visit 1fi.in/privacy.",
  },
  {
    title: "6. Marketplace and Products",
    body: "Products and services listed on 1Fi Marketplace are offered by third-party brands and vendors. 1Fi is not the seller of record and does not warrant the quality, accuracy, or availability of listed products. All disputes related to product quality must be resolved directly with the respective brand.",
  },
  {
    title: "7. Grievance Redressal",
    body: "For any grievances, contact our Grievance Officer at grievances@1fi.in or call 1800-123-4567 (toll-free, 9 AM – 6 PM, Mon–Sat). We will acknowledge your complaint within 24 hours and resolve it within 7 business days, as per RBI guidelines.",
  },
  {
    title: "8. Governing Law",
    body: "These Terms shall be governed by and construed in accordance with the laws of India. Any dispute shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.",
  },
];

export default function TermsScreen({ navigate }: Props) {
  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Terms & Conditions" subtitle="Last updated: September 2026" onBack={() => navigate({ name: "profile" })} />

      <div className="px-4 pt-4 space-y-3">
        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex gap-2">
          <span className="flex-shrink-0">📜</span>
          <p className="text-xs text-[#712CDC] leading-relaxed">
            Please read these terms carefully. By using 1Fi, you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
        </div>

        {SECTIONS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
            <p className="text-sm font-bold text-[#1A1A2E] mb-2">{s.title}</p>
            <p className="text-xs text-[#6B6B8A] leading-relaxed">{s.body}</p>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
          <p className="text-xs text-[#A0A0B8]">1Fi Financial Services Pvt. Ltd.</p>
          <p className="text-xs text-[#A0A0B8]">CIN: U65100KA2021PTC123456 · NBFC Reg: N-13.02345</p>
          <p className="text-xs text-[#A0A0B8] mt-1">Regulated by the Reserve Bank of India</p>
          <button className="mt-3 text-xs text-[#712CDC] font-semibold underline">View Full Policy at 1fi.in/terms</button>
        </div>
      </div>
    </div>
  );
}
