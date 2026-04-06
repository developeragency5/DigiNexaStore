const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us, such as when you contact us through our website. This may include your name and email address.

We also automatically collect certain information when you visit AppVault, including:
• Log data (IP address, browser type, pages visited, time and date of visits)
• Device information (hardware model, operating system, unique device identifiers)
• Usage data (how you interact with our site, search queries, pages viewed)

We use cookies and similar tracking technologies to collect this information. See our Cookie Policy for more details.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to:
• Operate, maintain, and improve AppVault
• Respond to your comments and questions
• Understand how users interact with our platform
• Detect and prevent fraudulent or abusive activity
• Comply with legal obligations

We do not sell your personal information to third parties. Ever.`,
  },
  {
    title: "3. Information Sharing",
    body: `We may share your information in the following limited circumstances:
• With service providers who assist us in operating our website (these parties are bound by confidentiality obligations)
• If required by law, court order, or governmental authority
• In connection with a merger, acquisition, or sale of all or part of our assets
• With your consent

AppVault does not engage in targeted advertising or sell user data to advertisers.`,
  },
  {
    title: "4. Data Retention",
    body: `We retain personal information for as long as necessary to fulfil the purposes for which it was collected, including legal, accounting, or reporting requirements. When you request deletion of your data, we will remove it within 30 days except where retention is required by law.`,
  },
  {
    title: "5. Cookies",
    body: `We use cookies to improve your experience on AppVault. Cookies are small text files stored on your device. We use them to remember your preferences, understand how you use our site, and measure the effectiveness of our content. You can control cookies through your browser settings. For full details, see our Cookie Policy.`,
  },
  {
    title: "6. Third-Party Links",
    body: `AppVault contains links to third-party app stores (Google Play, Apple App Store) and developer websites. These sites have their own privacy policies, which we do not control. We encourage you to read the privacy policy of any site you visit. We are not responsible for the content or privacy practices of those sites.`,
  },
  {
    title: "7. Children's Privacy",
    body: `AppVault is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will delete it promptly.`,
  },
  {
    title: "8. Your Rights",
    body: `Depending on your location, you may have certain rights regarding your personal information, including:
• The right to access the personal information we hold about you
• The right to correct inaccurate information
• The right to request deletion of your information
• The right to object to or restrict certain processing
• The right to data portability

To exercise any of these rights, please contact us at hello@appvault.app.`,
  },
  {
    title: "9. Security",
    body: `We implement reasonable technical and organisational measures to protect your information from unauthorised access, disclosure, alteration, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or by updating the "Last Updated" date below. Your continued use of AppVault after any changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: "11. Contact Us",
    body: `If you have questions about this Privacy Policy or our privacy practices, please contact us at:

Email: hello@appvault.app
AppVault, Inc.`,
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
          <p className="text-gray-500">Last updated: April 1, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            AppVault ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, and share information about you when you use our website and services.
          </p>
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
