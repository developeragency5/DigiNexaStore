import { useState } from "react";
import { Mail, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

const reasons = [
  "General question",
  "Suggest an app",
  "Report incorrect info",
  "Press / media inquiry",
  "Partnership",
  "Other",
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", reason: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.reason) e.reason = "Please select a reason.";
    if (!form.message.trim() || form.message.trim().length < 15) e.message = "Please write at least 15 characters.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSent(true);
  }

  function field(id: keyof typeof form) {
    return {
      value: form[id],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [id]: e.target.value })),
    };
  }

  const inputClass = (id: keyof typeof form) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[id]
        ? "border-red-300 focus:ring-red-200 bg-red-50"
        : "border-gray-200 focus:ring-primary/20 focus:border-primary/50 bg-gray-50"
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Get in Touch
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Digi Nexa Store</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have a question, spotted an error, or want to suggest an app? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <div className="md:col-span-2 space-y-5">
            {[
              {
                icon: Mail,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "Email Us",
                body: "support@diginexastore.com",
                sub: "We reply within 1 business day",
              },
              {
                icon: MessageSquare,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Suggest an App",
                body: "Found a hidden gem?",
                sub: 'Use the form and select "Suggest an app" as your reason.',
              },
              {
                icon: Clock,
                color: "text-amber-500",
                bg: "bg-amber-50",
                title: "Response Time",
                body: "Usually within 24 hours",
                sub: "Mon–Fri, 9 am – 6 pm EST",
              },
            ].map(({ icon: Icon, color, bg, title, body, sub }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                <div className={`h-10 w-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{title}</div>
                  <div className="text-sm text-gray-700 mt-0.5">{body}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Thanks for reaching out, <span className="font-semibold text-gray-700">{form.name}</span>.
                    We'll get back to you at <span className="font-semibold text-gray-700">{form.email}</span> within one business day.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", reason: "", message: "" }); }}
                    className="mt-6 text-sm font-medium text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your name</label>
                      <input type="text" placeholder="Jane Smith" className={inputClass("name")} {...field("name")} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email address</label>
                      <input type="email" placeholder="jane@example.com" className={inputClass("email")} {...field("email")} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reason for contact</label>
                    <select className={inputClass("reason")} {...field("reason")}>
                      <option value="">Select a reason…</option>
                      {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      className={`${inputClass("message")} resize-none`}
                      {...field("message")}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    Send Message
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    We'll never share your details with third parties.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
