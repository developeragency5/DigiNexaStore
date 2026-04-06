const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using Appus (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

We reserve the right to modify these Terms at any time. We will notify you of material changes by posting a notice on our website or updating the "Last Updated" date. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "2. Description of Service",
    body: `Appus is a curated app discovery platform that provides information about mobile applications and games for iOS and Android platforms. Appus is a free discovery and information service only.

We do NOT:
• Distribute, host, sell, or license any application
• Process payments or collect financial information from users
• Charge users any fee for browsing, searching, or using Appus

All apps are available exclusively through third-party app stores, including Google Play and the Apple App Store. Appus provides links to these platforms for your convenience. We are not a party to any transaction between you and an app store or developer.`,
  },
  {
    title: "3. No Purchases on Appus",
    body: `Appus does not sell, distribute, or facilitate the purchase of any applications or in-app content. Any transaction you make after following a link from Appus is governed entirely by the terms, policies, and payment systems of the relevant app store platform (Apple or Google) and/or the app developer.

Appus has no responsibility for:
• The cost, pricing, or availability of any app
• Purchases made through third-party app stores
• Refund requests, chargebacks, or subscription cancellations (these must be directed to the relevant app store — see our No-Purchase Policy for details)`,
  },
  {
    title: "4. Use of the Service",
    body: `You agree to use Appus only for lawful purposes and in a manner that does not infringe the rights of others. You must not:
• Use the Service in any way that violates applicable laws or regulations
• Attempt to gain unauthorised access to any part of the Service
• Transmit any harmful, offensive, or disruptive content
• Scrape, crawl, or systematically extract data from the Service without our prior written permission
• Use the Service to distribute spam or unsolicited communications
• Impersonate any person or entity
• Interfere with or disrupt the integrity or performance of the Service`,
  },
  {
    title: "5. Intellectual Property",
    body: `All content on Appus — including text, graphics, logos, the selection and arrangement of content, and underlying code — is owned by Appus or its licensors and is protected by copyright, trademark, and other intellectual property laws.

App names, icons, screenshots, descriptions, and other materials displayed on Appus are the intellectual property of their respective developers and are used for informational and editorial purposes only. Appus claims no ownership over third-party intellectual property.

You may not reproduce, distribute, or create derivative works from Appus content without our prior written consent.`,
  },
  {
    title: "6. Accuracy of Information",
    body: `We strive to keep app information accurate and current. However, Appus makes no warranties or representations regarding the accuracy, completeness, or reliability of any app descriptions, ratings, pricing, or other information displayed on the Service.

App details such as pricing, availability, and features may change without notice. Always verify current information on the relevant official app store before downloading or purchasing any application. See our Disclaimer for further details.`,
  },
  {
    title: "7. Third-Party Links",
    body: `Appus contains links to third-party websites and app stores. These links are provided for convenience only. We have no control over the content, policies, or practices of third-party sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.

The presence of a link on Appus does not imply our endorsement of the linked site or its content.`,
  },
  {
    title: "8. Advertising",
    body: `Appus displays digital advertisements, including interest-based advertisements served through third-party advertising networks. By using Appus, you consent to the display of such advertising. For details on how advertising data is collected and how to opt out of interest-based advertising, see our Advertising Disclosure.`,
  },
  {
    title: "9. Disclaimer of Warranties",
    body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

We do not warrant that:
• The Service will be uninterrupted, error-free, or available at any particular time
• Any information on the Service is accurate, current, or complete
• The Service is free of viruses or other harmful components

Your use of the Service is entirely at your own risk.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, APPVAULT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, ANY APP YOU DISCOVER VIA APPVAULT, OR ANY THIRD-PARTY CONTENT LINKED FROM APPVAULT.

IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM EXCEED ONE HUNDRED US DOLLARS (USD $100).

THIS LIMITATION APPLIES REGARDLESS OF THE LEGAL THEORY AND EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
  },
  {
    title: "11. Indemnification",
    body: `You agree to indemnify and hold harmless Appus and its officers, directors, employees, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from:
• Your violation of these Terms
• Your use of the Service
• Your violation of any applicable law or regulation
• Your infringement of any third-party rights`,
  },
  {
    title: "12. Governing Law & Dispute Resolution",
    body: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

Any dispute arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules, except that either party may seek injunctive or other equitable relief in a court of competent jurisdiction.

You waive any right to participate in a class action lawsuit or class-wide arbitration.

Nothing in this section prevents you from filing a complaint with a regulatory authority in your jurisdiction.`,
  },
  {
    title: "13. Termination",
    body: `We reserve the right to terminate or suspend your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

Upon termination, all rights granted to you under these Terms will immediately cease. Sections that by their nature should survive termination (including intellectual property, disclaimers, limitation of liability, and indemnification) will survive.`,
  },
  {
    title: "14. Contact",
    body: `If you have questions about these Terms of Service:

Email: hello@appus.net
Subject: "Terms of Service Inquiry"
Appus, Inc.

Last Updated: April 6, 2025`,
  },
];

export function TermsOfService() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-500">Last updated: April 6, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Please read these Terms of Service carefully before using Appus. They govern your use of our website
            and services, including important disclaimers, limitations of liability, and our no-purchase policy.
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
