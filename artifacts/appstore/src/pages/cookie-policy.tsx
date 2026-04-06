const cookieTypes = [
  {
    name: "Essential Cookies",
    badge: "Always Active",
    badgeColor: "bg-green-100 text-green-700",
    desc: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting your preferences or filling in forms.",
    examples: ["Session management", "Security tokens", "Load balancing"],
  },
  {
    name: "Analytics Cookies",
    badge: "Optional",
    badgeColor: "bg-blue-100 text-blue-600",
    desc: "These cookies allow us to count visits and understand how visitors interact with AppVault. All information collected is aggregated and anonymous — we cannot identify individual users.",
    examples: ["Page view counts", "Navigation paths", "Session duration", "Device/browser type"],
  },
  {
    name: "Preference Cookies",
    badge: "Optional",
    badgeColor: "bg-purple-100 text-purple-600",
    desc: "These cookies remember your choices to provide a more personalised experience. For example, remembering your preferred category or search filters.",
    examples: ["Filter preferences", "Display settings", "Recently viewed apps"],
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    body: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to website owners.

Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (which stay on your device for a set period or until you delete them).`,
  },
  {
    title: "How We Use Cookies",
    body: `AppVault uses cookies to:
• Keep the website functioning correctly
• Remember your preferences between visits
• Understand how you use our site so we can improve it
• Measure the performance of our content

We do not use cookies to serve advertisements or track you across third-party websites.`,
  },
  {
    title: "Third-Party Cookies",
    body: `We may use third-party analytics services (such as privacy-friendly analytics tools) that place their own cookies. These services only collect aggregated, anonymous data and do not track individual users across sites.

We do not use Google Analytics, Meta Pixel, or any advertising network cookies.`,
  },
  {
    title: "Managing Cookies",
    body: `You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and you can set most browsers to prevent them from being placed.

To manage cookies in your browser:
• Chrome: Settings → Privacy and security → Cookies and other site data
• Firefox: Settings → Privacy & Security → Cookies and Site Data
• Safari: Preferences → Privacy → Manage Website Data
• Edge: Settings → Cookies and site permissions

Note: If you disable cookies, some features of AppVault may not work as intended.`,
  },
  {
    title: "Cookie Consent",
    body: `By continuing to use AppVault, you consent to our use of essential cookies. For optional analytics and preference cookies, we will ask for your consent separately where required by law (for example, if you are located in the European Union under GDPR).`,
  },
  {
    title: "Updates to This Policy",
    body: `We may update this Cookie Policy from time to time to reflect changes in technology or law. We will notify you of significant changes by posting a notice on our website. The "Last Updated" date at the top of this page indicates when the policy was last revised.`,
  },
  {
    title: "Contact Us",
    body: `If you have questions about our use of cookies, please contact us at:

Email: hello@appvault.app
AppVault, Inc.`,
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
          <p className="text-gray-500">Last updated: April 1, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            This Cookie Policy explains how AppVault uses cookies and similar technologies when you visit our website. It explains what these technologies are and why we use them.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Cookie type cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
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

        {/* Text sections */}
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
