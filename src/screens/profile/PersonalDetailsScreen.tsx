import { useState } from "react";
import type { Screen } from "../../types";
import { MOCK_USER } from "../../services/mockData";
import SubHeader from "../../components/SubHeader";

interface Props { navigate: (s: Screen) => void }

export default function PersonalDetailsScreen({ navigate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone] = useState(MOCK_USER.phone);
  const [dob] = useState(MOCK_USER.dob);
  const [address, setAddress] = useState(MOCK_USER.address);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-full bg-[#F5F4F8] pb-10">
      <SubHeader title="Personal Details" onBack={() => navigate({ name: "profile" })} action={!editing ? { label: "Edit", onPress: () => setEditing(true) } : undefined} />

      <div className="px-4 pt-4 space-y-3">
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <p className="text-sm text-green-700 font-medium">Details saved successfully</p>
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(113,44,220,0.06)" }}>
          <Field label="Full Name" value={name} editing={editing} onChange={setName} />
          <Field label="Email Address" value={email} editing={editing} onChange={setEmail} type="email" />
          <Field label="Phone Number" value={phone} editing={false} locked />
          <Field label="Date of Birth" value={dob} editing={false} locked />
          <Field label="PAN Number" value={MOCK_USER.pan} editing={false} locked masked />
          <Field label="Address" value={address} editing={editing} onChange={setAddress} multiline last />
        </div>

        <div className="bg-[#EDE5FD] rounded-2xl p-4 flex gap-2">
          <span className="text-[#712CDC] flex-shrink-0 mt-0.5">🔒</span>
          <p className="text-xs text-[#712CDC] leading-relaxed">
            Phone, date of birth and PAN are linked to your KYC and cannot be changed. Contact support to update these.
          </p>
        </div>

        {editing && (
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-3.5 rounded-2xl border-2 border-[#E8E6F0] text-[#6B6B8A] font-semibold text-sm">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white" style={{ background: "#712CDC" }}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange, type = "text", locked, masked, multiline, last }: {
  label: string; value: string; editing: boolean; onChange?: (v: string) => void;
  type?: string; locked?: boolean; masked?: boolean; multiline?: boolean; last?: boolean;
}) {
  const displayed = masked ? value.replace(/.(?=.{4})/g, "•") : value;
  return (
    <div className={`px-5 py-4 ${!last ? "border-b border-[#F5F4F8]" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A0B8] mb-1">{label}</p>
      {editing && !locked ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={2}
            className="w-full text-sm font-medium text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-3 py-2 resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full text-sm font-medium text-[#1A1A2E] outline-none bg-[#F5F4F8] rounded-xl px-3 py-2"
          />
        )
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#1A1A2E]">{displayed}</p>
          {locked && <span className="text-[10px] text-[#A0A0B8] bg-[#F5F4F8] px-2 py-0.5 rounded-full">Locked</span>}
        </div>
      )}
    </div>
  );
}
