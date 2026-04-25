import { Link } from "wouter";

const sections = [
  {
    title: "1. Information We Collect",
    body: `1.1 Non-Personal Data
We automatically collect non-personal information when you visit our website, including:
• Device information (browser type, operating system, device identifiers)
• IP address
• Pages visited, time spent, clicks, and interactions
• Search queries and browsing activity
• Referral sources (e.g., search engines, social media)

1.2 Cookies & Tracking Technologies
We use cookies and similar technologies to collect information about your browsing activities. Cookies help us improve website performance, analyze traffic, and personalize user experience. You can disable cookies through your browser settings, but doing so may affect some features of the website.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use collected data to:
• Operate and maintain Digi Nexa Store
• Improve website functionality and user experience
• Analyze trends and user behavior
• Optimize layout for different devices
• Deliver relevant and trending content
• Serve advertisements (if applicable)
• Prevent misuse and ensure security

We do not sell personal data to third parties.`,
  },
  {
    title: "3. Legal Basis for Processing",
    body: `We process data based on:
• Legitimate Interest: Improving website performance and user experience
• Consent: For cookies and advertising (where required)
• Legal Obligations: Compliance with applicable laws`,
  },
  {
    title: "4. Advertising and Third-Party Networks",
    body: `We use third-party advertising networks and may participate in advertising programs, including remarketing. Advertisements displayed on our site are clearly separate from our content and are not influenced by advertiser relationships.

Our advertising partners may use cookies and similar technologies to:
• Show ads based on your visits to this and other websites
• Measure ad performance and click-through rates
• Personalize advertising content based on your interests

You can opt out of interest-based advertising from many participating networks by visiting:
https://www.aboutads.info/choices/
https://optout.networkadvertising.org`,
  },
  {
    title: "5. Third-Party Links & Services",
    body: `Digi Nexa Store redirects users to third-party websites, including the official iOS and Android app stores. These websites operate under their own privacy policies, which we do not control. We strongly advise you to review their privacy policies before downloading apps or using their services.

We also use third-party services for:
• Analytics: a third-party analytics service (to track website usage)
• Advertising: third-party advertising networks that may use cookies for ad personalization`,
  },
  {
    title: "6. Third-Party Data Sharing",
    body: `We may share limited data with:
• Analytics providers (to understand usage)
• Advertising partners (to display relevant ads)
• Legal authorities (if required by law)

We do not sell or rent your personal data.`,
  },
  {
    title: "7. Data Security",
    body: `We implement standard security measures such as:
• HTTPS encryption
• Secure data handling practices

However, no online system is completely secure.`,
  },
  {
    title: "8. Data Retention",
    body: `We retain non-personal data (such as analytics data) only as long as necessary to fulfil the purposes described in this Policy.

After this period, data is deleted or anonymized.`,
  },
  {
    title: "9. Automated Decision-Making",
    body: `We do not use automated decision-making that significantly affects users.`,
  },
  {
    title: "10. Your Rights",
    body: `Depending on your location, you may have the right to:
• Access your data
• Request deletion
• Opt out of cookies and advertising
• Withdraw consent

To exercise your rights, contact us at: support@diginexastore.com`,
  },
  {
    title: "11. Global Privacy Control (GPC)",
    body: `If your browser sends a Global Privacy Control (GPC) signal, we treat it as a request to opt out of tracking where applicable.`,
  },
  {
    title: "12. Children's Privacy",
    body: `Digi Nexa Store is not intended for children under the age of 13. We do not knowingly collect data from children.`,
  },
  {
    title: "13. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.`,
  },
  {
    title: "14. Contact Us",
    body: `If you have any questions about this Privacy Policy:

Email: support@diginexastore.com
Digi Nexa Store`,
  },
];

export function PrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: April 6, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Digi Nexa Store ("we", "us", or "our") respects your privacy and is committed to protecting your information.
            This Privacy Policy explains how we collect, use, and safeguard data when you visit and use our website.
            By accessing Digi Nexa Store, you agree to the practices described in this policy.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy →</Link>
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure →</Link>
            <Link href="/ccpa-privacy-rights" className="text-primary hover:underline">California Privacy Rights →</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
