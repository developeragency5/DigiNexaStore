import { Link } from "wouter";

const cookieTypes = [
  {
    name: "Essential Cookies",
    badge: "Always Active",
    badgeColor: "bg-green-100 text-green-700",
    desc: "These cookies are strictly necessary for the website to function. They cannot be switched off. They are set in response to actions you take, such as session management and security. No personal data is sold or shared via essential cookies.",
    examples: ["Session management", "Security tokens", "Load balancing", "CSRF protection"],
  },
  {
    name: "Analytics Cookies",
    badge: "Optional",
    badgeColor: "bg-blue-100 text-blue-600",
    desc: "These cookies help us understand how visitors interact with Digi Nexa Store by collecting aggregated, anonymous statistics. We use this data to improve site performance and content. Individual users cannot be identified from this data.",
    examples: ["Page view counts", "Navigation paths", "Session duration", "Device/browser type", "Entry/exit pages"],
  },
  {
    name: "Preference Cookies",
    badge: "Optional",
    badgeColor: "bg-purple-100 text-purple-600",
    desc: "These cookies remember your choices to provide a more personalised experience. For example, remembering your preferred category or search filters between visits.",
    examples: ["Filter preferences", "Display settings", "Recently viewed apps"],
  },
  {
    name: "Advertising & Tracking Technologies",
    badge: "Optional",
    badgeColor: "bg-orange-100 text-orange-700",
    desc: "Digi Nexa Store uses advertising technology to serve interest-based advertisements and to measure the performance of advertising campaigns. These technologies may set cookies or use pixel tags on your device. This data may be shared with our digital advertising network partners to serve you relevant ads on Digi Nexa Store and other sites across the internet. See our Advertising Disclosure for full details.",
    examples: ["Conversion tracking pixels", "Interest-based ad targeting", "Ad frequency capping", "Campaign attribution"],
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    body: `Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, remember your preferences, and provide information to website owners and advertisers.

Cookies can be:
• "Session" cookies — deleted when you close your browser
• "Persistent" cookies — stored on your device for a set period or until you delete them
• "First-party" cookies — set by Digi Nexa Store directly
• "Third-party" cookies — set by our partners (analytics or advertising services)`,
  },
  {
    title: "How We Use Cookies",
    body: `Digi Nexa Store uses cookies and similar technologies to:
• Keep the website functioning correctly (essential)
• Remember your preferences between visits (preference)
• Understand how you use our site so we can improve it (analytics)
• Deliver interest-based advertisements and measure advertising performance (advertising)

The advertising and tracking technologies we use may involve sharing data with our digital advertising network partners. See our Advertising Disclosure for details on your opt-out rights.`,
  },
  {
    title: "Third-Party Cookies & Technologies",
    body: `We use the following categories of third-party technologies:

Analytics — We may use privacy-friendly analytics tools to measure site performance. These services collect aggregated, anonymous data only.

Digital Advertising Networks — Our advertising partners may set cookies or tracking pixels on your device to enable interest-based advertising, conversion tracking, and campaign measurement. These partners may collect data about your visits to Digi Nexa Store and other websites to build audience profiles for advertising purposes.

You can opt out of interest-based advertising via:
• optout.aboutads.info (DAA)
• optout.networkadvertising.org (NAI)
• youronlinechoices.eu (EDAA — for EEA users)`,
  },
  {
    title: "Managing Cookies",
    body: `You can control and delete cookies as you wish.

Browser Cookie Controls
• Chrome: Settings → Privacy and security → Cookies and other site data
• Firefox: Settings → Privacy & Security → Cookies and Site Data
• Safari: Preferences → Privacy → Manage Website Data
• Edge: Settings → Cookies and site permissions

Global Privacy Control (GPC)
If your browser sends a GPC signal, Digi Nexa Store will treat it as a request to opt out of sharing for interest-based advertising.

Note: Disabling essential cookies will impair site functionality. Disabling advertising cookies means you will still see ads, but they will not be tailored to your interests.`,
  },
  {
    title: "Cookie Consent",
    body: `Essential cookies are placed automatically as they are strictly necessary.

For optional analytics, preference, and advertising cookies, we ask for your consent where required by law (for example, for users in the European Union under GDPR or the UK under UK GDPR).

By continuing to use Digi Nexa Store without adjusting your cookie settings, you consent to our use of optional cookies. You may withdraw this consent at any time using the browser controls or opt-out tools described above.`,
  },
  {
    title: "Retention Periods",
    body: `Cookie retention varies by type:
• Essential cookies — Session (deleted when browser closes) or up to 1 year
• Analytics cookies — Typically aggregated and anonymised; raw session data deleted after 14 months
• Preference cookies — Up to 12 months
• Advertising/tracking technologies — As specified by the relevant advertising partner; typically 30–90 days`,
  },
  {
    title: "Updates to This Policy",
    body: `We may update this Cookie Policy from time to time to reflect changes in technology, our practices, or applicable law. We will notify you of significant changes by posting a notice on our website. The "Last Updated" date at the top of this page indicates when it was last revised.`,
  },
  {
    title: "Contact Us",
    body: `If you have questions about our use of cookies or tracking technologies:

Email: hello@diginexa.store
Subject: "Cookie Policy Inquiry"
Digi Nexa Store

Last Updated: April 6, 2025`,
  },
];

export function CookiePolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Cookie Policy</h1>
          <p className="text-gray-500">Last updated: April 6, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            This Cookie Policy explains how Digi Nexa Store uses cookies and similar tracking technologies when you visit our website.
            It covers what they are, why we use them, and how you can control them — including advertising technologies.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure →</Link>
            <Link href="/ccpa-privacy-rights" className="text-primary hover:underline">California Privacy Rights →</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Types of Cookies & Technologies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map(({ name, badge, badgeColor, desc, examples }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900">{name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map(ex => (
                    <span key={ex} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {sections.map(({ title, body }) => (
            <div key={title} className="px-8 py-7">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
