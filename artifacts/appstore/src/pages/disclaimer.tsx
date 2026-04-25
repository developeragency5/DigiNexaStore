import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

const sections = [
  {
    title: "1. General Disclaimer",
    body: `Digi Nexa Store ("we", "us", "our") is an independent, third-party app discovery directory. We are not affiliated with, endorsed by, or officially connected to any platform operator or app developer or publisher unless explicitly stated.

The information published on Digi Nexa Store — including app descriptions, ratings, screenshots, pricing, and availability — is provided for general informational purposes only. While we strive to keep this information accurate and current, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of any information on Digi Nexa Store.`,
  },
  {
    title: "2. App Information Accuracy",
    body: `App details displayed on Digi Nexa Store — including but not limited to pricing, in-app purchase costs, platform availability, feature descriptions, version numbers, system requirements, and ratings — are sourced from publicly available information and may not reflect the most current status of an app.

App pricing and availability are subject to change by the developer or platform operator at any time without notice. Digi Nexa Store does not control and is not responsible for any changes made by app developers or app store operators.

Always verify current information directly on the relevant official app store before downloading or purchasing any application.`,
  },
  {
    title: "3. No Endorsement",
    body: `The listing or featuring of an app on Digi Nexa Store does not constitute an endorsement, recommendation, or guarantee by Digi Nexa Store. We organise apps based on publicly available metadata and category data sourced from the official iOS and Android app stores. We cannot verify every claim made by app developers.

Digi Nexa Store is not responsible for any issues you experience with an app, including but not limited to bugs, data loss, security vulnerabilities, subscription charges, or unsatisfactory performance.`,
  },
  {
    title: "4. Third-Party Links",
    body: `Digi Nexa Store contains links to external websites and app stores, including the official iOS and Android app stores. These links are provided for your convenience. We have no control over the content, policies, or practices of third-party websites and accept no responsibility for them.

The inclusion of any link does not imply our endorsement of the linked site. We are not responsible for any content, advertising, products, or other materials on or available through linked sites.`,
  },
  {
    title: "5. Affiliate Relationships",
    body: `Digi Nexa Store may participate in affiliate and referral programmes. This means we may earn a commission or referral fee if you click certain links and subsequently make a purchase or take an action on a third-party platform. This is disclosed in more detail in our Advertising Disclosure.

The existence of an affiliate relationship does not influence whether an app is listed, where it appears in the directory, or how it is described. Listings are organised based on publicly available metadata from the official app stores.`,
  },
  {
    title: "6. No Professional Advice",
    body: `Nothing on Digi Nexa Store constitutes professional, legal, financial, medical, or technical advice. App descriptions and informational content on the site are for general reference only. You should not rely solely on information from Digi Nexa Store when making decisions about app usage, particularly for applications in sensitive areas such as health, finance, or security.`,
  },
  {
    title: "7. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, Digi Nexa Store, its officers, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with:

• Your use of or inability to use Digi Nexa Store
• Any reliance on information displayed on Digi Nexa Store
• Any app you discover, download, or purchase as a result of using Digi Nexa Store
• Any third-party content linked from Digi Nexa Store

This limitation applies regardless of whether Digi Nexa Store has been advised of the possibility of such damages and regardless of the legal theory on which such liability is claimed.`,
  },
  {
    title: "8. Changes to This Disclaimer",
    body: `We may update this Disclaimer from time to time. The date at the top of this page reflects when it was last revised. Continued use of Digi Nexa Store after any changes constitutes your acceptance of the updated Disclaimer.`,
  },
  {
    title: "9. Contact",
    body: `If you have questions about this Disclaimer:

Email: support@diginexastore.com

Last Updated: April 22, 2026`,
  },
];

export function Disclaimer() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-extrabold text-gray-900">Disclaimer</h1>
          </div>
          <p className="text-gray-500 mb-1">Last updated: April 6, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            Please read this disclaimer carefully. It explains important limitations of the information
            provided on Digi Nexa Store, our relationship with third-party app stores and developers, and the
            extent of our liability.
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Related:{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
            {" · "}
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure</Link>
            {" · "}
            <Link href="/no-purchase-policy" className="text-primary hover:underline">No-Purchase Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
