import React, { useState } from "react";
import {
  FileStack,
  MapPin,
  Scale,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Copy,
  Check,
  Gavel,
  Landmark,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

const STAGES = [
  { id: "advocate", node: "Agent I", label: "Advocate Draft", icon: Gavel, glow: "#e0a458" },
  { id: "clerk", node: "Agent II", label: "Bureaucratic Challenge", icon: AlertTriangle, glow: "#d97757" },
  { id: "rebuttal", node: "Agent III", label: "Advocate Rebuttal", icon: Scale, glow: "#7fb9a2" },
  { id: "blueprint", node: "Output", label: "Final Blueprint", icon: Landmark, glow: "#8ea6f0" },
];

function FlowLine({ done, active }) {
  return (
    <div className="relative flex-1 h-[2px] mx-1 md:mx-2 overflow-hidden rounded-full bg-[#2c3350]">
      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
          done ? "w-full bg-[#7fb9a2]" : active ? "w-full bg-[#e0a458]" : "w-0"
        }`}
      />
      {active && !done && (
        <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[flow_1.1s_linear_infinite]" />
      )}
    </div>
  );
}

function NotingSheet({ children, entryNo }) {
  return (
    <div className="relative bg-[#f4ecd8] rounded-sm shadow-lg pl-10 pr-6 py-6 md:pl-14 md:pr-10 md:py-8 border border-[#cfc19a] animate-[fadein_0.5s_ease]">
      <div className="absolute top-0 left-0 h-full w-1 bg-[#8c2f2f]" />
      <div className="flex items-center justify-between mb-4 text-[#6b5a37] font-mono2 text-xs tracking-wide">
        <span>NOTING SHEET · ENTRY NO. {entryNo}</span>
        <span>SB-CAE / LIVE</span>
      </div>
      <div className="font-note text-[#2a2410] leading-relaxed text-[15px] md:text-base whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState({
    issueDescription: "",
    location: "",
    primaryAuthority: "",
    jurisdictionTrap: "",
    additionalContext: "",
  });
  const [stageIdx, setStageIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState({
    draft: "",
    challenge: "",
    rebuttalNarrative: "",
    primaryAuthority: "",
    secondaryAuthority: "",
    finalLetter: "",
    checklist: [],
  });
  const [copied, setCopied] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const runPipeline = async () => {
    setError("");
    setLoading(true);
    setResult({
      draft: "",
      challenge: "",
      rebuttalNarrative: "",
      primaryAuthority: "",
      secondaryAuthority: "",
      finalLetter: "",
      checklist: [],
    });

    try {
      // Agent I
      setStageIdx(0);
      const r1 = await fetch("/api/agent1-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then((r) => r.json());
      if (r1.error) throw new Error(r1.error);
      setResult((r) => ({ ...r, draft: r1.draft }));

      // Agent II
      setStageIdx(1);
      const r2 = await fetch("/api/agent2-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: form.location,
          jurisdictionTrap: form.jurisdictionTrap,
          advocateDraft: r1.draft,
        }),
      }).then((r) => r.json());
      if (r2.error) throw new Error(r2.error);
      setResult((r) => ({ ...r, challenge: r2.challenge }));

      // Agent III
      setStageIdx(2);
      const r3 = await fetch("/api/agent3-rebuttal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: form.location,
          jurisdictionTrap: form.jurisdictionTrap,
          advocateDraft: r1.draft,
          bureaucraticChallenge: r2.challenge,
        }),
      }).then((r) => r.json());
      if (r3.error) throw new Error(r3.error);
      setResult((r) => ({ ...r, ...r3 }));

      setStageIdx(3);
    } catch (err) {
      setError(err.message || "Pipeline failed. Check your ANTHROPIC_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(result.finalLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1220] font-note text-[#2a2410] relative overflow-hidden">
      <div className="bg-orb w-72 h-72 bg-[#8c2f2f] -top-10 -left-10" />
      <div className="bg-orb w-96 h-96 bg-[#2f6b4f] top-1/3 -right-20" style={{ animationDelay: "2s" }} />
      <div className="bg-orb w-64 h-64 bg-[#8ea6f0] bottom-0 left-1/3" style={{ animationDelay: "4s" }} />

      <header className="relative z-10 border-b border-[#242c46]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#8b97ba] font-mono2 text-xs tracking-[0.25em] uppercase mb-2">
              <Sparkles size={13} className="text-[#e0a458]" />
              Government of Bharat · Civic Grievance Cell
            </div>
            <h1 className="font-head text-[#f4ecd8] text-3xl md:text-5xl font-bold tracking-tight leading-none">
              Smart Bharat Civic
              <br />
              Advocate Engine
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#12182a] border border-[#334066] rounded-full px-4 py-2">
            <ShieldCheck size={16} className="text-[#7fb9a2]" />
            <span className="font-mono2 text-[10px] uppercase tracking-widest text-[#d7e0f7]">
              AI-Audited Draft
            </span>
          </div>
        </div>
      </header>

      {/* INPUT FORM */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-8">
        <div className="bg-[#12182a] border border-[#334066] rounded-sm p-5 md:p-6 space-y-4">
          <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#8b97ba]">
            File a new civic issue
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              className="bg-[#0d1220] border border-[#334066] rounded-sm p-3 text-[#f4ecd8] text-sm font-note md:col-span-2"
              rows={3}
              placeholder="Describe the issue (e.g. deep potholes causing accidents and waterlogging)..."
              value={form.issueDescription}
              onChange={update("issueDescription")}
            />
            <input
              className="bg-[#0d1220] border border-[#334066] rounded-sm p-3 text-[#f4ecd8] text-sm font-note"
              placeholder="Location (e.g. Outer Ring Road, Marathahalli, Bengaluru)"
              value={form.location}
              onChange={update("location")}
            />
            <input
              className="bg-[#0d1220] border border-[#334066] rounded-sm p-3 text-[#f4ecd8] text-sm font-note"
              placeholder="Primary authority (e.g. East Bengaluru City Corporation)"
              value={form.primaryAuthority}
              onChange={update("primaryAuthority")}
            />
            <input
              className="bg-[#0d1220] border border-[#334066] rounded-sm p-3 text-[#f4ecd8] text-sm font-note md:col-span-2"
              placeholder="Jurisdictional trap, if any (e.g. authority claims NHAI owns this stretch)"
              value={form.jurisdictionTrap}
              onChange={update("jurisdictionTrap")}
            />
            <textarea
              className="bg-[#0d1220] border border-[#334066] rounded-sm p-3 text-[#f4ecd8] text-sm font-note md:col-span-2"
              rows={2}
              placeholder="Any additional context (optional)"
              value={form.additionalContext}
              onChange={update("additionalContext")}
            />
          </div>
          <button
            onClick={runPipeline}
            disabled={loading || !form.issueDescription || !form.location || !form.primaryAuthority}
            className="flex items-center gap-2 bg-[#e0a458] text-[#0d1220] font-stamp uppercase tracking-wide text-sm px-5 py-2.5 rounded-sm disabled:opacity-40 hover:brightness-110 transition-all"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Running pipeline..." : "Run 3-agent pipeline"}
          </button>
          {error && (
            <div className="text-red-400 text-xs font-mono2 flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </div>
          )}
        </div>
      </div>

      {/* PIPELINE VISUALIZER */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pb-4">
        <div className="flex items-center">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === stageIdx;
            const isDone = i < stageIdx;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 shrink-0" style={{ color: s.glow }}>
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive ? "node-active scale-110" : "opacity-70"
                    }`}
                    style={{ borderColor: s.glow, background: isActive ? `${s.glow}22` : "#12182a" }}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="text-center leading-tight">
                    <div className="font-mono2 text-[9px] uppercase tracking-widest text-[#8b97ba]">{s.node}</div>
                    <div className="font-stamp text-[10px] md:text-xs text-[#f4ecd8] max-w-[80px] md:max-w-[100px]">
                      {s.label}
                    </div>
                  </div>
                </div>
                {i < STAGES.length - 1 && <FlowLine active={i <= stageIdx} done={i < stageIdx} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* RESULTS */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pb-10 space-y-5">
        {result.draft && (
          <NotingSheet entryNo="01 — Advocate Draft">{result.draft}</NotingSheet>
        )}
        {result.challenge && (
          <NotingSheet entryNo="02 — Bureaucratic Challenge">{result.challenge}</NotingSheet>
        )}
        {result.rebuttalNarrative && (
          <NotingSheet entryNo="03 — Advocate Rebuttal">{result.rebuttalNarrative}</NotingSheet>
        )}

        {result.finalLetter && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#12182a] text-[#f4ecd8] rounded-sm p-4 border-l-4 border-[#e0a458]">
                <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#e0a458] mb-1">Primary</div>
                <div className="font-stamp text-sm">{result.primaryAuthority}</div>
              </div>
              {result.secondaryAuthority && (
                <div className="bg-[#12182a] text-[#f4ecd8] rounded-sm p-4 border-l-4 border-[#7fb9a2]">
                  <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#7fb9a2] mb-1">
                    Secondary (cc)
                  </div>
                  <div className="font-stamp text-sm">{result.secondaryAuthority}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="font-mono2 text-[10px] uppercase tracking-widest text-[#8b97ba]">
                Final Rejection-Proof Letter
              </div>
              <button
                onClick={copyLetter}
                className="flex items-center gap-1.5 text-[10px] font-mono2 uppercase tracking-wide bg-[#1f2a44] text-[#f4ecd8] px-3 py-1.5 rounded-sm hover:bg-[#2c3a5e] transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy letter"}
              </button>
            </div>
            <NotingSheet entryNo="04 — Final Blueprint">{result.finalLetter}</NotingSheet>

            {result.checklist?.length > 0 && (
              <div className="bg-[#12182a] rounded-sm p-4 md:p-5">
                <div className="flex items-center gap-2 text-[#f4ecd8] font-stamp text-sm uppercase tracking-wide mb-3">
                  <ClipboardList size={16} className="text-[#e0a458]" />
                  Preemptive Action Checklist
                </div>
                <ul className="space-y-2">
                  {result.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#d7e0f7] text-sm">
                      <CheckCircle2 size={16} className="text-[#7fb9a2] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pb-10">
        <div className="flex items-center gap-2 text-[#5c6685] text-[11px] font-mono2">
          <FileStack size={13} />
          Smart Bharat Civic Advocate Engine · live 3-agent adversarial pipeline
        </div>
      </footer>
    </div>
  );
}
