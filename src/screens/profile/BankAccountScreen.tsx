import { useState } from "react";
import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

const BANKS = [
  { id: "hdfc", name: "HDFC Bank", acc: "XXXX XXXX 4821", ifsc: "HDFC0001234", type: "Savings", primary: true },
  { id: "sbi", name: "State Bank of India", acc: "XXXX XXXX 7703", ifsc: "SBIN0004321", type: "Savings", primary: false },
];

export default function BankAccountScreen({ navigate }: Props) {
  const [banks, setBanks] = useState(BANKS);
  const [showAdd, setShowAdd] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: "", acc: "", ifsc: "", type: "Savings" });
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");

  function setPrimary(id: string) {
    setBanks((b) => b.map((x) => ({ ...x, primary: x.id === id })));
    showToast("Primary account updated");
  }

  function removeBank(id: string) {
    setBanks((b) => b.filter((x) => x.id !== id));
    showToast("Bank account removed");
  }

  function addBank() {
    if (!newAcc.name || !newAcc.acc || !newAcc.ifsc) return;
    setAdding(true);
    setTimeout(() => {
      setBanks((b) => [...b, { id: Date.now().toString(), name: newAcc.name, acc: "XXXX XXXX " + newAcc.acc.slice(-4), ifsc: newAcc.ifsc, type: newAcc.type, primary: false }]);
      setNewAcc({ name: "", acc: "", ifsc: "", type: "Savings" });
      setShowAdd(false);
      setAdding(false);
      showToast("Bank account added successfully");
    }, 1200);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Linked Bank Accounts" onBack={() => navigate({ name: "profile" })} />

      <div className="px-4 pt-4 space-y-3">
        {toast && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-green-500 text-sm">✓</span>
            <p className="text-sm text-green-700 font-medium">{toast}</p>
          </div>
        )}

        <p className="text-xs text-[#6B6B8A] font-medium px-1">Your linked accounts</p>

        {banks.map((bank) => (
          <div key={bank.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EDE5FD] flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏦</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#1A1A2E]">{bank.name}</p>
                  {bank.primary && (
                    <span className="text-[9px] font-bold text-[#712CDC] bg-[#EDE5FD] px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</span>
                  )}
                </div>
                <p className="text-xs text-[#6B6B8A] mt-0.5">{bank.acc} · {bank.type}</p>
                <p className="text-[10px] text-[#A0A0B8]">IFSC: {bank.ifsc}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <span className="text-[10px] text-green-600 font-medium">Verified</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-[#F5F4F8]">
              {!bank.primary && (
                <button onClick={() => setPrimary(bank.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#712CDC] bg-[#EDE5FD]">
                  Set as Primary
                </button>
              )}
              {!bank.primary && (
                <button onClick={() => removeBank(bank.id)} className="flex-1 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50">
                  Remove
                </button>
              )}
              {bank.primary && (
                <p className="flex-1 text-center text-xs text-[#A0A0B8] py-2">Primary account cannot be removed</p>
              )}
            </div>
          </div>
        ))}

        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 border-2 border-dashed border-[#E8E6F0]">
            <div className="w-10 h-10 rounded-xl bg-[#EDE5FD] flex items-center justify-center">
              <span className="text-[#712CDC] text-xl">+</span>
            </div>
            <p className="text-sm font-semibold text-[#712CDC]">Add New Bank Account</p>
          </button>
        ) : (
          <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
            <p className="text-sm font-bold text-[#1A1A2E]">Add Bank Account</p>
            <Input label="Bank Name" value={newAcc.name} onChange={(v) => setNewAcc((x) => ({ ...x, name: v }))} placeholder="e.g. ICICI Bank" />
            <Input label="Account Number" value={newAcc.acc} onChange={(v) => setNewAcc((x) => ({ ...x, acc: v }))} placeholder="Enter account number" type="number" />
            <Input label="IFSC Code" value={newAcc.ifsc} onChange={(v) => setNewAcc((x) => ({ ...x, ifsc: v.toUpperCase() }))} placeholder="e.g. ICIC0001234" />
            <div>
              <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-1.5">Account Type</p>
              <div className="flex gap-2">
                {["Savings", "Current"].map((t) => (
                  <button key={t} onClick={() => setNewAcc((x) => ({ ...x, type: t }))} className="flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all"
                    style={{ borderColor: newAcc.type === t ? "#712CDC" : "#E8E6F0", background: newAcc.type === t ? "#EDE5FD" : "white", color: newAcc.type === t ? "#712CDC" : "#6B6B8A" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl border border-[#E8E6F0] text-sm font-semibold text-[#6B6B8A]">Cancel</button>
              <button onClick={addBank} disabled={adding} className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#712CDC", opacity: adding ? 0.7 : 1 }}>
                {adding ? "Verifying…" : "Add Account"}
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex gap-2">
          <span className="text-[#712CDC] flex-shrink-0">ℹ️</span>
          <p className="text-xs text-[#712CDC] leading-relaxed">EMI repayments are auto-debited from your primary account on the due date. Ensure sufficient balance.</p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#A0A0B8] uppercase tracking-wider mb-1.5">{label}</p>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full text-sm font-medium text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-4 py-3 placeholder:text-[#C0C0D0]" />
    </div>
  );
}
