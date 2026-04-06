import { Link } from "wouter";

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us, such as when you subscribe to our newsletter or contact us. This may include your name and email address.

We also automatically collect certain information when you visit Appus, including:
• Log data (IP address, browser type, pages visited, time and date of visit, referring URL)
• Device information (hardware model, operating system, browser version, unique device identifiers)
• Usage data (how you interact with our site, search queries, pages viewed, clicks)
• Approximate geolocation (country/region level, inferred from IP address)

We use cookies, pixel tags, and similar tracking technologies to collect this information. See our Cookie Policy for full details, and our Advertising Disclosure for information on advertising-related tracking.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to:
• Operate, maintain, and improve Appus
• Respond to your comments, questions, and newsletter subscriptions
• Understand how users interact with our platform and optimise content
• Detect and prevent fraudulent or abusive activity
• Measure the performance of our advertising campaigns (conversion tracking)
• Serve interest-based advertisements through our advertising partners
• Comply with applicable legal obligations`,
  },
  {
    title: "3. Information Sharing",
    body: `We may share your information in the following circumstances:

Service Providers — With third-party companies that help us operate Appus (e.g., hosting, analytics, email delivery). These parties are bound by confidentiality obligations.

Advertising Technology Partners — We share browsing and interaction data (such as pages visited and clicks) with digital advertising networks to serve interest-based advertisements and measure conversions. This sharing may constitute "sharing for cross-context behavioural advertising" under the CCPA. See our Advertising Disclosure.

Legal Obligations — If required by law, court order, or governmental authority.

Business Transfers — In connection with a merger, acquisition, or sale of assets.

With Your Consent — For any other purpose you expressly consent to.

Appus does not sell your personal information for monetary compensation.`,
  },
  {
    title: "4. Data Retention",
    body: `We retain personal information for as long as necessary to fulfil the purposes described in this Policy, including legal, accounting, or reporting requirements.

Email addresses collected via newsletter subscription are retained until you unsubscribe.

When you request deletion of your data, we will remove it within 30 days except where retention is required by law or legitimate business necessity (e.g., fraud prevention).`,
  },
  {
    title: "5. Cookies & Tracking Technologies",
    body: `We use cookies, pixel tags, and similar technologies to:
• Keep the site functioning correctly (essential cookies)
• Remember your preferences between visits (preference cookies)
• Understand how you use our site (analytics cookies)
• Deliver and measure interest-based advertising (advertising/tracking technologies)

For full details on the types of cookies we use and how to control them, see our Cookie Policy.

For details on advertising-related tracking, including how to opt out of interest-based advertising, see our Advertising Disclosure.`,
  },
  {
    title: "6. Third-Party Links",
    body: `Appus contains links to third-party app stores (Google Play, Apple App Store) and developer websites. These sites have their own privacy policies, which we do not control. We encourage you to read the privacy policy of any site you visit before providing any personal information. We are not responsible for the content or privacy practices of third-party sites.`,
  },
  {
    title: "7. Children's Privacy",
    body: `Appus is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it promptly and halt any targeted advertising directed to that individual.`,
  },
  {
    title: "8. Your Rights",
    body: `Depending on your location, you may have the following rights:

All Users
• Right to access the personal information we hold about you
• Right to correct inaccurate information
• Right to request deletion of your information
• Right to withdraw consent (where processing is based on consent)

California Residents (CCPA/CPRA)
California residents have additional rights, including the right to opt out of the sale or sharing of personal information for cross-context behavioural advertising. See our California Privacy Rights (CCPA) page for full details.

EEA / UK Residents (GDPR / UK GDPR)
• Right to object to processing
• Right to restrict processing
• Right to data portability
• Right to lodge a complaint with a supervisory authority

To exercise any of these rights, contact us at hello@appus.net.`,
  },
  {
    title: "9. International Data Transfers",
    body: `Appus is operated from the United States. If you access Appus from outside the United States, your information may be transferred to and processed in the United States or other countries where our service providers operate.

We take appropriate steps to ensure that any international transfers comply with applicable data protection laws, including using standard contractual clauses where required.`,
  },
  {
    title: "10. Security",
    body: `We implement reasonable technical and organisational measures to protect your information from unauthorised access, disclosure, alteration, or destruction. However, no internet transmission is 100% secure. We cannot guarantee the absolute security of information transmitted to or from Appus.

Please notify us immediately at hello@appus.net if you become aware of any unauthorised access to your information.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify you of significant changes by posting a notice on our website or by updating the "Last Updated" date. Your continued use of Appus after any changes constitutes your acceptance of the updated Policy.`,
  },
  {
    title: "12. Contact Us",
    body: `If you have questions about this Privacy Policy or our privacy practices:

Email: hello@appus.net
Subject: "Privacy Inquiry"
Appus, Inc.

Last Updated: April 6, 2025`,
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
            Appus ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, share, and protect information about you when you use our website.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <Link href="/ccpa-privacy-rights" className="text-primary hover:underline">California Privacy Rights →</Link>
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure →</Link>
            <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy →</Link>
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
