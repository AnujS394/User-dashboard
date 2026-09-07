import { useState } from "react";
import type { Screen } from "../../types";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

export default function SecurityScreen({ navigate }: Props) {
  const [biometric, setBiometric] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [txnPin, setTxnPin] = useState(true);
  const [toast, setToast] = useState("");
  const [changingPin, setChangingPin] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"current" | "new" | "confirm">("current");

  const DEVICES = [
    { name: "iPhone 16 Pro", os: "iOS 19", location: "Gurugram, India", time: "Active now", current: true },
    { name: "Chrome · MacOS", os: "macOS 14", location: "Gurugram, India", time: "2 hours ago", current: false },
    { name: "Samsung Galaxy S25", os: "Android 15", location: "Delhi, India", time: "3 days ago", current: false },
  ];

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function handlePinDigit(idx: number, val: string) {
    const next = [...pin];
    next[idx] = val.slice(-1);
    setPin(next);
    if (val && idx < 3) (document.getElementById(`pin-${idx + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d) && idx === 3) {
      setTimeout(() => {
        if (step === "current") { setStep("new"); setPin(["", "", "", ""]); }
        else if (step === "new") { setStep("confirm"); setPin(["", "", "", ""]); }
        else { setChangingPin(false); setStep("current"); setPin(["", "", "", ""]); showToast("PIN changed successfully"); }
      }, 200);
    }
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Security & Privacy" onBack={() => navigate({ name: "profile" })} />

      <div className="px-4 pt-4 space-y-3">
        {toast && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <p className="text-sm text-green-700 font-medium">{toast}</p>
          </div>
        )}

        {/* Security settings */}
        <p className="text-xs text-[#6B6B8A] font-semibold px-1">Security Settings</p>

        {[
          { label: "Biometric Login", desc: "Use Face ID / Fingerprint to log in", icon: "🫆", on: biometric, set: () => { setBiometric(!biometric); showToast(!biometric ? "Biometric enabled" : "Biometric disabled"); } },
          { label: "Two-Factor Authentication", desc: "OTP verification for every login", icon: "🔐", on: twoFA, set: () => { setTwoFA(!twoFA); showToast(!twoFA ? "2FA enabled" : "2FA disabled"); } },
          { label: "Transaction PIN", desc: "Require PIN for payments & orders", icon: "🔑", on: txnPin, set: () => { setTxnPin(!txnPin); showToast(!txnPin ? "Transaction PIN enabled" : "Disabled"); } },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1A1A2E]">{item.label}</p>
              <p className="text-xs text-[#6B6B8A] mt-0.5">{item.desc}</p>
            </div>
            <Toggle on={item.on} onChange={item.set} />
          </div>
        ))}

        <button onClick={() => setChangingPin(true)} className="w-full bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
          <span className="text-2xl">🔄</span>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-[#1A1A2E]">Change Transaction PIN</p>
            <p className="text-xs text-[#6B6B8A] mt-0.5">Update your 4-digit transaction PIN</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#A0A0B8" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        {/* Active devices */}
        <p className="text-xs text-[#6B6B8A] font-semibold px-1 pt-2">Active Sessions</p>
        {DEVICES.map((d, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-start gap-3" style={{ boxShadow: "0 2px 8px rgba(113,44,220,0.04)" }}>
            <div className="w-10 h-10 rounded-xl bg-[#EDE5FD] flex items-center justify-center text-lg flex-shrink-0">
              {d.name.includes("iPhone") || d.name.includes("Samsung") ? "📱" : "💻"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#1A1A2E]">{d.name}</p>
                {d.current && <span className="text-[9px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">This device</span>}
              </div>
              <p className="text-xs text-[#6B6B8A] mt-0.5">{d.os} · {d.location}</p>
              <p className="text-[10px] text-[#A0A0B8] mt-0.5">{d.time}</p>
            </div>
            {!d.current && (
              <button className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-1.5 rounded-xl flex-shrink-0" onClick={() => showToast("Session terminated")}>
                Revoke
              </button>
            )}
          </div>
        ))}

        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2">
          <span className="flex-shrink-0 text-red-500">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-600">Suspicious activity?</p>
            <p className="text-xs text-red-500 mt-0.5">If you notice any unauthorized access, revoke all sessions immediately and contact support.</p>
            <button className="mt-2 text-xs font-bold text-red-600 underline">Revoke all other sessions</button>
          </div>
        </div>
      </div>

      {/* Change PIN modal */}
      {changingPin && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { setChangingPin(false); setStep("current"); setPin(["", "", "", ""]); }} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-w-md mx-auto" style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>
            <div className="w-10 h-1 bg-[#E8E6F0] rounded-full mx-auto mb-5" />
            <p className="text-base font-bold text-[#1A1A2E] text-center">
              {step === "current" ? "Enter Current PIN" : step === "new" ? "Enter New PIN" : "Confirm New PIN"}
            </p>
            <p className="text-xs text-[#6B6B8A] text-center mt-1 mb-6">
              {step === "current" ? "Verify your identity" : step === "new" ? "Choose a 4-digit PIN" : "Re-enter to confirm"}
            </p>
            <div className="flex gap-4 justify-center mb-6">
              {pin.map((d, i) => (
                <input key={i} id={`pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handlePinDigit(i, e.target.value)}
                  className="w-14 h-14 rounded-2xl text-center text-2xl font-black outline-none border-2 transition-all"
                  style={{ borderColor: d ? "#712CDC" : "#E8E6F0", background: d ? "#EDE5FD" : "#F5F4F8", color: "#712CDC" }}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <button onClick={() => { setChangingPin(false); setStep("current"); setPin(["", "", "", ""]); }}
              className="w-full py-3 rounded-2xl border border-[#E8E6F0] text-sm font-semibold text-[#6B6B8A]">Cancel</button>
          </div>
        </>
      )}
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
