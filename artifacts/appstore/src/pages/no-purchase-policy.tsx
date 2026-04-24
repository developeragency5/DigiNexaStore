import { Link } from "wouter";
import { ShoppingBag, ExternalLink } from "lucide-react";

const highlights = [
  {
    icon: "🚫",
    title: "No Purchases on Digi Nexa Store",
    body: "Digi Nexa Store does not process any payments, subscriptions, or in-app purchases. No credit card or payment information is ever requested on this site.",
  },
  {
    icon: "🔗",
    title: "Links Go to Official App Stores",
    body: "When you click 'Get' or 'Download', you are redirected to the official iOS or Android app store. All transactions are governed by those platforms.",
  },
  {
    icon: "💰",
    title: "No Refunds via Digi Nexa Store",
    body: "Because Digi Nexa Store does not collect payment, we cannot process refunds. Refund requests must be submitted to the relevant platform operator or the app developer directly.",
  },
  {
    icon: "🛡️",
    title: "You Are Never Charged by Digi Nexa Store",
    body: "Digi Nexa Store is entirely free to browse and search. We generate revenue through advertising, not from users. You will never receive a bill from Digi Nexa Store.",
  },
];

const sections = [
  {
    title: "1. Digi Nexa Store Is a Discovery Platform Only",
    body: `Digi Nexa Store is a free app and game discovery directory. Our sole purpose is to help you find the best iOS and Android apps and games.

We do not:
• Sell, distribute, or provide downloads of any application or game
• Process payments, subscriptions, or in-app purchases of any kind
• Collect payment card details, bank information, or billing addresses
• Offer any paid subscription or premium tier for end users
• Act as an agent, reseller, or marketplace for app developers

All applications listed on Digi Nexa Store are available exclusively through their respective official app store platforms.`,
  },
  {
    title: "2. Where Purchases Happen",
    body: `If an app listed on Digi Nexa Store is paid or contains in-app purchases, those transactions take place entirely on the following third-party platforms:

iOS App Store — for iOS applications. Governed by the iOS platform operator's terms of service and privacy policy. The platform handles all billing, refunds, and subscription management for those purchases.

Android Play Store — for Android applications. Governed by the Android platform operator's terms of service and privacy policy. The platform handles all billing, refunds, and subscription management for those purchases.

Digi Nexa Store has no involvement in, control over, or responsibility for transactions that occur on these platforms.`,
  },
  {
    title: "3. Pricing Information",
    body: `Pricing information displayed on Digi Nexa Store (e.g., "Free", "£2.99", "Freemium") is sourced from publicly available data and is provided for general informational purposes only.

App pricing is set and controlled entirely by the app developer and/or the app store platform. Prices may vary by country, currency, or promotional period. Digi Nexa Store does not guarantee the accuracy or currency of any pricing information.

Always verify the current price on the relevant app store before initiating a download or purchase.`,
  },
  {
    title: "4. Refund Policy",
    body: `Because Digi Nexa Store does not process any payments, Digi Nexa Store has no refund policy to offer. We are unable to process, authorise, or facilitate refunds of any kind.

If you have been charged for an app or in-app purchase and wish to request a refund, please contact the appropriate platform:

iOS App Store Refunds
Visit your platform's official support page or contact platform support. The platform operator's refund policy applies to all such purchases.

Android Play Store Refunds
Visit your platform's official support page or contact platform support. The platform operator's refund policy applies to all such purchases.

App Developer
For subscription or billing disputes with a specific app, you may also contact the developer directly using the contact information available on their app store listing.`,
  },
  {
    title: "5. Return Policy",
    body: `As Digi Nexa Store does not sell or distribute any physical or digital goods, there is no return policy applicable to anything accessed through Digi Nexa Store.

Apps are digital goods delivered directly by third-party platforms. Returns, cancellations, and withdrawal rights for digital goods are governed by the policies of the relevant app store platform and applicable consumer law in your jurisdiction.`,
  },
  {
    title: "6. Delivery",
    body: `Digi Nexa Store does not deliver any products — physical or digital. There are no shipping charges, delivery timelines, or logistics of any kind associated with using Digi Nexa Store.

When you follow a link from Digi Nexa Store to an app store and download an app, that download is delivered and managed entirely by the app store platform. Digi Nexa Store has no involvement in the download or installation process.`,
  },
  {
    title: "7. Subscription Services",
    body: `Digi Nexa Store does not offer, manage, or bill any subscription services to users. If an app you discover on Digi Nexa Store offers a subscription model, that subscription is managed directly by the app developer and/or the app store platform.

To cancel a subscription to a third-party app:

iOS: Manage subscriptions in your device's account settings.
Android: Manage subscriptions in your device's app store profile under Payments & subscriptions.

Digi Nexa Store is not responsible for any subscription charges incurred via third-party apps.`,
  },
  {
    title: "8. Chargebacks & Disputes",
    body: `If you have initiated a chargeback or payment dispute related to an app, please direct it to the payment processor or platform through which the original purchase was made (the relevant platform operator or the app's own payment processor).

If you believe a charge from Digi Nexa Store has appeared on your statement, please contact us immediately at hello@diginexa.store — we take these reports seriously and will investigate. However, please be aware that Digi Nexa Store does not charge users and a charge listed as "Digi Nexa Store" on your statement is likely a case of mistaken identity or fraud unrelated to our platform.`,
  },
  {
    title: "9. Contact",
    body: `If you have questions about this policy or believe you were charged by Digi Nexa Store in error:

Email: hello@diginexa.store
Subject: "Billing Inquiry"
Digi Nexa Store

We will respond within 2 business days.

Last Updated: April 6, 2025`,
  },
];

export function NoPurchasePolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-extrabold text-gray-900">No-Purchase Policy</h1>
          </div>
          <p className="text-gray-500 mb-4">Last updated: April 6, 2025</p>
          <p className="text-gray-600 leading-relaxed">
            Digi Nexa Store does not sell, distribute, or charge for any app or game. This page makes
            crystal clear what Digi Nexa Store is, what it is not, and where to direct refund or billing
            enquiries.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Key highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map(({ icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Refund direction cards */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-900 mb-2">Need a refund? Go here instead:</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span>iOS App Store: visit your platform's official support page</span>
            </li>
            <li className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span>Android Play Store: visit your platform's official support page</span>
            </li>
          </ul>
        </div>

        {/* Full policy sections */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {sections.map(({ title, body }) => (
            <div key={title} className="px-8 py-7">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{body}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Related:{" "}
            <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
            {" · "}
            <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
            {" · "}
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
