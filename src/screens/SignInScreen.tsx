import { useState } from "react";
import type { Screen } from "../types";
import { useAuth } from "../state/AuthContext";

interface Props { navigate: (s: Screen) => void }

type Step = "phone" | "otp" | "mpin";

export default function SignInScreen({ navigate }: Props) {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function sendOtp() {
    if (phone.length !== 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 1200);
  }

  function verifyOtp() {
    const code = otp.join("");
    if (code.length !== 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("mpin"); }, 900);
  }

  function verifyMpin() {
    const code = mpin.join("");
    if (code.length !== 4) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); login(); navigate({ name: "home" }); }, 1000);
  }

  function handleOtpInput(i: number, val: string) {
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d) && i === 5) setTimeout(verifyOtp, 200);
  }

  function handleMpinInput(i: number, val: string) {
    const next = [...mpin]; next[i] = val.slice(-1); setMpin(next);
    if (val && i < 3) (document.getElementById(`mpin-${i + 1}`) as HTMLInputElement)?.focus();
    if (next.every((d) => d) && i === 3) setTimeout(verifyMpin, 200);
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] flex flex-col">
      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-16 pb-10"
        style={{ background: "linear-gradient(135deg, #3a0ca3 0%, #712CDC 100%)" }}>
        <div className="absolute right-4 top-4 text-7xl opacity-10 font-black text-white leading-none">0%</div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
          <span className="text-2xl">💜</span>
        </div>
        <h1 className="text-2xl font-black text-white leading-tight">
          Welcome to <span className="text-yellow-300">1Fi</span>
        </h1>
        <p className="text-purple-200 text-sm mt-2 leading-relaxed">
          Shop today on 0% EMI backed by your mutual fund investments
        </p>
        {/* Step indicator */}
        <div className="flex gap-1.5 mt-6">
          {(["phone", "otp", "mpin"] as Step[]).map((s) => (
            <div key={s} className="h-1 flex-1 rounded-full transition-all"
              style={{ background: step === s || (step === "otp" && s === "phone") || (step === "mpin") ? "white" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-10 space-y-4">
        {step === "phone" && (
          <>
            <div>
              <p className="text-lg font-bold text-[#1A1A2E]">Enter Mobile Number</p>
              <p className="text-sm text-[#6B6B8A] mt-0.5">We'll send you a verification OTP</p>
            </div>
            <div className="bg-white rounded-2xl flex items-center gap-3 px-4 border-2 transition-all"
              style={{ borderColor: phone.length === 10 ? "#712CDC" : "#E8E6F0", boxShadow: "0 2px 12px rgba(113,44,220,0.08)" }}>
              <span className="text-sm font-semibold text-[#6B6B8A] py-4">🇮🇳 +91</span>
              <div className="w-px h-8 bg-[#E8E6F0]" />
              <input type="tel" inputMode="numeric" maxLength={10} value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="10-digit mobile number"
                className="flex-1 py-4 text-base font-semibold text-[#1A1A2E] outline-none bg-transparent placeholder:text-[#D0D0E0]" />
            </div>
            {error && <p className="text-xs text-red-500 px-1">{error}</p>}
            <button onClick={sendOtp} disabled={loading || phone.length !== 10}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: phone.length === 10 ? "#712CDC" : "#E8E6F0", color: phone.length === 10 ? "white" : "#A0A0B8" }}>
              {loading ? <Spinner /> : "Send OTP →"}
            </button>
            <p className="text-center text-xs text-[#A0A0B8]">
              By continuing, you agree to our{" "}
              <button className="text-[#712CDC] font-semibold">Terms & Conditions</button>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <div>
              <p className="text-lg font-bold text-[#1A1A2E]">Verify OTP</p>
              <p className="text-sm text-[#6B6B8A] mt-0.5">Sent to +91 {phone}</p>
            </div>
            <div className="flex gap-3 justify-between">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} type="tel" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  className="flex-1 h-14 rounded-2xl text-center text-xl font-black outline-none border-2 transition-all"
                  style={{ borderColor: d ? "#712CDC" : "#E8E6F0", background: d ? "#EDE5FD" : "white", color: "#712CDC" }}
                  autoFocus={i === 0} />
              ))}
            </div>
            <button onClick={verifyOtp} disabled={loading || otp.some((d) => !d)}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white"
              style={{ background: otp.every((d) => d) ? "#712CDC" : "#E8E6F0", color: otp.every((d) => d) ? "white" : "#A0A0B8" }}>
              {loading ? <Spinner /> : "Verify OTP →"}
            </button>
            <div className="flex items-center justify-between text-xs">
              <button className="text-[#712CDC] font-semibold" onClick={() => setStep("phone")}>← Change Number</button>
              <button className="text-[#6B6B8A]">Resend in 30s</button>
            </div>
            <div className="bg-[#EDE5FD] rounded-xl p-3 flex gap-2">
              <span className="text-[#712CDC] text-xs">💡</span>
              <p className="text-xs text-[#712CDC]">Demo tip: enter any 6 digits to continue</p>
            </div>
          </>
        )}

        {step === "mpin" && (
          <>
            <div>
              <p className="text-lg font-bold text-[#1A1A2E]">Enter MPIN</p>
              <p className="text-sm text-[#6B6B8A] mt-0.5">Your 4-digit 1Fi security PIN</p>
            </div>
            <div className="flex gap-4 justify-center py-4">
              {mpin.map((d, i) => (
                <input key={i} id={`mpin-${i}`} type="password" inputMode="numeric" maxLength={1} value={d}
                  onChange={(e) => handleMpinInput(i, e.target.value)}
                  className="w-16 h-16 rounded-2xl text-center text-2xl font-black outline-none border-2 transition-all"
                  style={{ borderColor: d ? "#712CDC" : "#E8E6F0", background: d ? "#EDE5FD" : "white", color: "#712CDC" }}
                  autoFocus={i === 0} />
              ))}
            </div>
            <button onClick={verifyMpin} disabled={loading || mpin.some((d) => !d)}
              className="w-full py-4 rounded-2xl font-bold text-sm"
              style={{ background: mpin.every((d) => d) ? "#712CDC" : "#E8E6F0", color: mpin.every((d) => d) ? "white" : "#A0A0B8" }}>
              {loading ? <Spinner /> : "Login →"}
            </button>
            <button className="w-full text-center text-sm text-[#712CDC] font-semibold">Forgot MPIN?</button>
            <div className="bg-[#EDE5FD] rounded-xl p-3 flex gap-2">
              <span className="text-[#712CDC] text-xs">💡</span>
              <p className="text-xs text-[#712CDC]">Demo tip: enter any 4 digits to log in</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />;
}
