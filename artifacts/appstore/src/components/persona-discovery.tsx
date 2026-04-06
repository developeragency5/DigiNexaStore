import { useState } from "react";
import {
  GraduationCap, Briefcase, Palette, Gamepad2, Dumbbell, Code2, Map,
  X, ChevronRight, ChevronLeft, Sparkles, Loader2, Star, ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";

const PERSONAS = [
  { id: "Student",    label: "Student",    icon: GraduationCap, color: "from-blue-500 to-indigo-600",    bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   desc: "Study smarter"    },
  { id: "Freelancer", label: "Freelancer", icon: Briefcase,      color: "from-amber-500 to-orange-600",   bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  desc: "Work anywhere"    },
  { id: "Creator",    label: "Creator",    icon: Palette,        color: "from-pink-500 to-rose-600",      bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-700",   desc: "Make & share"     },
  { id: "Gamer",      label: "Gamer",      icon: Gamepad2,       color: "from-violet-500 to-purple-600",  bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", desc: "Level up"         },
  { id: "Fitness",    label: "Fitness",    icon: Dumbbell,       color: "from-green-500 to-emerald-600",  bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  desc: "Stay active"      },
  { id: "Developer",  label: "Developer",  icon: Code2,          color: "from-slate-600 to-gray-800",     bg: "bg-slate-50",  border: "border-slate-200",  text: "text-slate-700",  desc: "Build faster"     },
  { id: "Traveler",   label: "Traveler",   icon: Map,            color: "from-teal-500 to-cyan-600",      bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-700",   desc: "Explore the world"},
];

const GOALS: Record<string, string[]> = {
  Student:    ["Study & take notes", "Learn a new language", "Manage time & focus", "Research & read", "Track assignments"],
  Freelancer: ["Manage projects & tasks", "Invoice clients & track payments", "Communicate with clients", "Design & create content", "Track time & productivity"],
  Creator:    ["Edit photos & videos", "Grow social media presence", "Design graphics & visuals", "Record & edit podcasts", "Plan & schedule content"],
  Gamer:      ["Play competitive multiplayer", "Discover new games", "Follow esports & streams", "Connect with gaming community", "Track game achievements"],
  Fitness:    ["Track workouts & activity", "Plan meals & nutrition", "Monitor sleep & recovery", "Follow guided workouts", "Run & cycle outdoors"],
  Developer:  ["Write & edit code", "Manage repositories & projects", "Learn new programming skills", "Monitor servers & deployments", "Collaborate with teams"],
  Traveler:   ["Book flights & hotels", "Navigate new cities", "Translate languages", "Discover local experiences", "Plan & organize trips"],
};

const APP_TYPES = ["Any type", "Social / Community", "Tools & Utilities", "Entertainment", "Learning", "Games"];
const PREFERENCES = ["Free only", "Free & paid", "Paid is fine"];

interface Recommendation {
  name: string;
  description: string;
  why: string;
  category: string;
  isFree: boolean;
}

function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    "Productivity": "💼", "Education": "📚", "Finance": "💰", "Health": "❤️",
    "Social": "💬", "Entertainment": "🎬", "Music": "🎵", "Travel": "✈️",
    "Photography": "📷", "Games": "🎮", "Food": "🍔", "Shopping": "🛍️",
    "News": "📰", "Sports": "⚽", "Utilities": "🔧", "Developer Tools": "💻",
    "Fitness": "🏃", "Design": "🎨", "Communication": "📡",
  };
  const key = Object.keys(icons).find(k => category.toLowerCase().includes(k.toLowerCase()));
  return <span className="text-2xl">{key ? icons[key] : "📱"}</span>;
}

export function PersonaDiscovery() {
  const [open, setOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<typeof PERSONAS[0] | null>(null);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [appType, setAppType] = useState("Any type");
  const [preference, setPreference] = useState("Free & paid");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState("");

  function openModal(persona: typeof PERSONAS[0]) {
    setSelectedPersona(persona);
    setStep(0);
    setGoal("");
    setAppType("Any type");
    setPreference("Free & paid");
    setResults(null);
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setLoading(false);
  }

  async function getRecommendations() {
    if (!selectedPersona || !goal) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${baseUrl}/api/persona/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: selectedPersona.id,
          goal,
          appType,
          preference,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResults(data.recommendations ?? []);
      setStep(3);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canProceed = step === 1 ? !!goal : true;

  return (
    <>
      {/* ── Section ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-10">
        {/* Background decoration */}
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">AI-Powered</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Discover by Persona</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md">
            Tell us who you are and what you need. Our AI will curate the perfect app list just for you.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {PERSONAS.map(persona => (
              <button
                key={persona.id}
                onClick={() => openModal(persona)}
                className="group relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <persona.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm font-semibold">{persona.label}</span>
                <span className="text-gray-500 text-[11px]">{persona.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {open && selectedPersona && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden onClick={closeModal} />

          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className={`bg-gradient-to-r ${selectedPersona.color} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <selectedPersona.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedPersona.label}</h3>
                    <p className="text-white/70 text-xs">
                      {step < 3 ? `Step ${step + 1} of 3` : "AI Recommendations"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Progress dots */}
              {step < 3 && (
                <div className="flex gap-1.5 mt-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "bg-white flex-[2]" : "bg-white/30 flex-1"}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-6 min-h-[320px] flex flex-col">

              {/* Step 0: Main Goal */}
              {step === 0 && (
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-0.5">What's your main goal?</h4>
                    <p className="text-gray-500 text-sm">Choose the goal that best describes what you need.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 flex-1">
                    {GOALS[selectedPersona.id]?.map(g => (
                      <button
                        key={g}
                        onClick={() => { setGoal(g); setStep(1); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 hover:-translate-x-0 focus:outline-none ${
                          goal === g
                            ? `${selectedPersona.bg} ${selectedPersona.border} ${selectedPersona.text} font-semibold`
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {goal === g && <CheckCircle2 className={`h-4 w-4 shrink-0 ${selectedPersona.text}`} />}
                        {goal !== g && <div className="w-4 h-4 shrink-0" />}
                        <span className="text-sm">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: App Type */}
              {step === 1 && (
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-0.5">What type of apps do you need?</h4>
                    <p className="text-gray-500 text-sm">We'll focus on the most relevant category for you.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    {APP_TYPES.map(t => (
                      <button
                        key={t}
                        onClick={() => setAppType(t)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-left text-sm transition-all duration-150 focus:outline-none ${
                          appType === t
                            ? `${selectedPersona.bg} ${selectedPersona.border} ${selectedPersona.text} font-semibold`
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {appType === t && <CheckCircle2 className={`h-4 w-4 shrink-0 ${selectedPersona.text}`} />}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Preference */}
              {step === 2 && (
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base mb-0.5">Free or paid preference?</h4>
                    <p className="text-gray-500 text-sm">We'll tailor recommendations to your budget.</p>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    {PREFERENCES.map(p => (
                      <button
                        key={p}
                        onClick={() => setPreference(p)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-150 focus:outline-none ${
                          preference === p
                            ? `${selectedPersona.bg} ${selectedPersona.border} ${selectedPersona.text} font-semibold`
                            : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {preference === p
                          ? <CheckCircle2 className={`h-5 w-5 shrink-0 ${selectedPersona.text}`} />
                          : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                        }
                        <div>
                          <div className="text-sm font-medium">{p}</div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {p === "Free only" ? "Only show free apps" : p === "Free & paid" ? "Show both free and paid apps" : "Happy to pay for quality apps"}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Results */}
              {step === 3 && (
                <div className="flex flex-col gap-3 flex-1">
                  {loading && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center animate-pulse`}>
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">Finding the best apps for you…</p>
                        <p className="text-sm text-gray-500 mt-1">Our AI is curating your personalized list</p>
                      </div>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  )}
                  {error && !loading && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-4 py-8 text-center">
                      <p className="text-red-500 font-medium">{error}</p>
                      <button onClick={getRecommendations} className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Try Again
                      </button>
                    </div>
                  )}
                  {results && !loading && (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm text-gray-600 font-medium">
                          AI picks for <span className="font-bold text-gray-900">{selectedPersona.label}</span> who wants to <span className="font-bold text-gray-900">{goal.toLowerCase()}</span>
                        </p>
                      </div>
                      <div className="overflow-y-auto max-h-[380px] flex flex-col gap-2 pr-1">
                        {results.map((rec, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3.5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-150"
                          >
                            <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <CategoryIcon category={rec.category} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-bold text-gray-900 text-sm">{rec.name}</h5>
                                {rec.isFree
                                  ? <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Free</span>
                                  : <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">Paid</span>
                                }
                                <span className="text-[10px] text-gray-400">{rec.category}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{rec.description}</p>
                              <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {rec.why}
                              </p>
                            </div>
                            <Link
                              href={`/apps?search=${encodeURIComponent(rec.name)}`}
                              onClick={closeModal}
                              className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors mt-0.5"
                              title="Search in appus"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Footer buttons */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => step > 0 ? setStep(s => s - 1) : closeModal()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {step === 0 ? "Cancel" : "Back"}
                  </button>
                  <button
                    disabled={!canProceed}
                    onClick={() => {
                      if (step < 2) { setStep(s => s + 1); }
                      else { setStep(3); getRecommendations(); }
                    }}
                    className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                      canProceed
                        ? `bg-gradient-to-r ${selectedPersona.color} text-white hover:opacity-90 hover:shadow-md`
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {step === 2 ? (
                      <><Sparkles className="h-4 w-4" /> Get Recommendations</>
                    ) : (
                      <>Next <ChevronRight className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
              )}
              {step === 3 && !loading && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => { setStep(0); setResults(null); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Start Over
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
