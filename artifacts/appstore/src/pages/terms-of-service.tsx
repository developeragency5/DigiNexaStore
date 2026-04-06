const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using AppVault (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

We reserve the right to modify these Terms at any time. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "2. Description of Service",
    body: `AppVault is a curated app discovery platform that provides information about mobile applications and games for iOS and Android platforms. We do not distribute, host, or sell any applications. All apps are available through third-party app stores including Google Play and the Apple App Store.

AppVault provides links to external app stores for user convenience. We are not responsible for the content, functionality, or availability of third-party applications.`,
  },
  {
    title: "3. Use of the Service",
    body: `You agree to use AppVault only for lawful purposes and in a manner that does not infringe the rights of others. You must not:
• Use the Service in any way that violates applicable laws or regulations
• Attempt to gain unauthorised access to any part of the Service
• Transmit any harmful, offensive, or disruptive content
• Scrape, crawl, or systematically extract data from the Service without our written permission
• Use the Service to distribute spam or unsolicited communications
• Impersonate any person or entity`,
  },
  {
    title: "4. Intellectual Property",
    body: `All content on AppVault — including text, graphics, logos, and the selection and arrangement of content — is owned by AppVault or its licensors and is protected by copyright, trademark, and other intellectual property laws.

App names, icons, screenshots, and descriptions displayed on AppVault are the property of their respective developers and are used for informational purposes only. AppVault claims no ownership over third-party app intellectual property.`,
  },
  {
    title: "5. Accuracy of Information",
    body: `We strive to keep app information accurate and up to date. However, AppVault makes no warranties or representations regarding the accuracy, completeness, or reliability of any app descriptions, ratings, or other information displayed on the Service.

App details such as pricing, availability, and features may change without notice. Always verify current information on the relevant app store before downloading or purchasing any application.`,
  },
  {
    title: "6. Third-Party Links",
    body: `AppVault contains links to third-party websites and app stores. These links are provided for convenience only. We have no control over the content of third-party sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `TO THE FULLEST EXTENT PERMITTED BY LAW, APPVAULT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.

In no event shall our total liability to you exceed one hundred dollars ($100).`,
  },
  {
    title: "9. Governing Law",
    body: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved exclusively in the courts located in Delaware.`,
  },
  {
    title: "10. Termination",
    body: `We reserve the right to terminate or suspend your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.`,
  },
  {
    title: "11. Contact",
    body: `If you have questions about these Terms of Service, please contact us at:

Email: hello@appvault.app
AppVault, Inc.`,
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
          <p className="text-gray-500">Last updated: April 1, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Please read these Terms of Service carefully before using AppVault. They govern your use of our website and services.
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
