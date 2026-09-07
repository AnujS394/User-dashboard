import { useState } from "react";
import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

const FAQS = [
  { q: "How does 1Fi's 0% EMI work?", a: "1Fi uses your mutual fund holdings as collateral to give you a spending limit. When you buy a product, we pledge a portion of your MF units — without redeeming them — and split the total cost into equal monthly instalments. You pay zero interest." },
  { q: "Are my mutual funds redeemed?", a: "No. Your funds are pledged (lien marked), not redeemed. You continue earning returns while your units remain invested. Once the loan is fully repaid, the lien is removed." },
  { q: "What is my EMI limit based on?", a: "Your limit is calculated based on the current value of your mutual fund portfolio, typically 50–80% of your eligible fund holdings. The limit is reviewed monthly as NAV fluctuates." },
  { q: "What happens if I miss an EMI payment?", a: "A grace period of 5 days applies. After that, a late payment fee is charged. Persistent defaults may result in partial redemption of pledged funds to recover the outstanding amount." },
  { q: "Can I prepay or close my loan early?", a: "Yes. You can prepay any outstanding EMIs at any time with zero foreclosure charges. Head to EMI Dues → select the loan → Prepay." },
  { q: "Which brands and products are available?", a: "1Fi Marketplace offers smartphones, laptops, audio, tablets, wearables, travel & flights, hotels, jewelry, furniture, appliances, and gaming — across 20+ brands including Apple, Samsung, Air India, CGH Earth, Giva, and Wakefit." },
];

const TICKET_CATEGORIES = ["EMI / Payment", "Order Issue", "KYC / Account", "Marketplace", "Technical Issue", "Other"];

export default function HelpScreen({ navigate }: Props) {
  const [tab, setTab] = useState<"faq" | "contact">("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ category: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function submitTicket() {
    if (!ticket.category || !ticket.subject || !ticket.message) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Help & Support" onBack={() => navigate({ name: "profile" })} />

      <div className="mx-4 mt-4 bg-white rounded-2xl p-1 flex gap-1" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.06)" }}>
        {(["faq", "contact"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition-all"
            style={{ background: tab === t ? "#712CDC" : "transparent", color: tab === t ? "white" : "#6B6B8A" }}>
            {t === "faq" ? "❓ FAQs" : "📩 Contact Us"}
          </button>
        ))}
      </div>

      <div className="px-4 mt-3 space-y-3">
        {tab === "faq" ? (
          <>
            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "💬", label: "Live Chat", sub: "Avg wait: 2 min" },
                { icon: "📞", label: "Call Us", sub: "1800-123-4567" },
                { icon: "✉️", label: "Email", sub: "help@1fi.in" },
                { icon: "🤝", label: "Community", sub: "Ask the community" },
              ].map((item) => (
                <button key={item.label} className="bg-white rounded-2xl p-3 text-left" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-semibold text-[#1A1A2E] mt-1">{item.label}</p>
                  <p className="text-[10px] text-[#A0A0B8]">{item.sub}</p>
                </button>
              ))}
            </div>

            <p className="text-xs text-[#6B6B8A] font-semibold px-1">Frequently Asked Questions</p>

            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
                <button className="w-full flex items-start justify-between gap-3 p-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <p className="text-sm font-semibold text-[#1A1A2E] leading-snug flex-1">{faq.q}</p>
                  <span className="text-[#712CDC] text-lg flex-shrink-0 font-light mt-0.5">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#6B6B8A] leading-relaxed border-t border-[#F5F4F8] pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : submitted ? (
          <div className="flex flex-col items-center text-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <div>
              <p className="text-lg font-bold text-[#1A1A2E]">Ticket Raised!</p>
              <p className="text-sm text-[#6B6B8A] mt-1">Ticket #{Math.floor(Math.random() * 90000) + 10000} · We'll respond within 24 hours.</p>
            </div>
            <button onClick={() => { setSubmitted(false); setTicket({ category: "", subject: "", message: "" }); }}
              className="px-6 py-3 rounded-2xl font-semibold text-sm text-white" style={{ background: "#712CDC" }}>
              Raise Another Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#6B6B8A] font-semibold px-1">Raise a Support Ticket</p>

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
              <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {TICKET_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setTicket((t) => ({ ...t, category: cat }))}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                    style={{ borderColor: ticket.category === cat ? "#712CDC" : "#E8E6F0", background: ticket.category === cat ? "#EDE5FD" : "white", color: ticket.category === cat ? "#712CDC" : "#6B6B8A" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
              <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-2">Subject</p>
              <input value={ticket.subject} onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                className="w-full text-sm text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-4 py-3 placeholder:text-[#C0C0D0]" />
            </div>

            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
              <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-2">Message</p>
              <textarea value={ticket.message} onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))}
                placeholder="Describe your issue in detail..."
                rows={4} className="w-full text-sm text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-4 py-3 placeholder:text-[#C0C0D0] resize-none" />
            </div>

            <button onClick={submitTicket} disabled={!ticket.category || !ticket.subject || !ticket.message}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all"
              style={{ background: ticket.category && ticket.subject && ticket.message ? "#712CDC" : "#E8E6F0", color: ticket.category && ticket.subject && ticket.message ? "white" : "#A0A0B8" }}>
              Submit Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
