import { Link } from "wouter";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Who This Notice Applies To",
    body: `This California Privacy Rights Notice ("Notice") applies solely to visitors, users, and others who reside in the State of California ("consumers" or "you"). It supplements our general Privacy Policy and is provided pursuant to the California Consumer Privacy Act of 2018 ("CCPA") and the California Privacy Rights Act of 2020 ("CPRA").

Any terms defined in the CCPA/CPRA have the same meaning when used in this Notice.`,
  },
  {
    title: "2. Categories of Personal Information We Collect",
    body: `In the past 12 months, AppVault has collected the following categories of personal information from California consumers:

• Identifiers — such as IP addresses, browser fingerprints, and email addresses (if voluntarily provided via our newsletter).
• Internet or other electronic network activity — including browsing history on AppVault, search queries, pages viewed, and interaction data.
• Inferences — derived from the above to understand your app preferences, device type, and general interests.
• Commercial information — we do not collect purchase history because AppVault does not process any purchases; all transactions occur on third-party app stores.
• Geolocation data — approximate location inferred from IP address (country/region level only; we do not collect precise GPS data).

We do NOT collect Social Security numbers, financial account information, health information, biometric data, or the contents of private communications.`,
  },
  {
    title: "3. Sources of Personal Information",
    body: `We collect personal information from:
• You directly — when you submit your email address to our newsletter, or when you contact us.
• Automatically — through cookies, pixel tags, and server logs when you visit AppVault.
• Advertising networks — our digital advertising partners may set cookies or similar technologies on your device to serve interest-based advertisements. See our Advertising Disclosure for details.`,
  },
  {
    title: "4. Purposes for Collecting Personal Information",
    body: `We collect personal information for the following business purposes:
• Operating and improving the AppVault platform
• Sending requested newsletters and updates
• Measuring site performance and analytics
• Detecting and preventing fraud or abuse
• Serving interest-based advertisements through our advertising network partners
• Complying with applicable laws and regulations`,
  },
  {
    title: "5. Sharing of Personal Information",
    body: `In the past 12 months, AppVault has shared the following categories of personal information with third parties for business purposes:

• Identifiers and internet activity — shared with analytics and advertising technology providers to deliver and measure advertising.

AppVault does NOT "sell" personal information for monetary compensation. However, under the CCPA's broad definition of "sale" and "sharing," our use of advertising cookies and pixels to serve targeted advertising MAY constitute sharing of personal information with third parties for cross-context behavioural advertising purposes.

You have the right to opt out of this sharing. See Section 7 below.`,
  },
  {
    title: "6. Your Rights as a California Resident",
    body: `Under the CCPA and CPRA, you have the following rights:

Right to Know
You may request that we disclose: (a) the categories of personal information we have collected about you; (b) the categories of sources; (c) our business purpose for collecting or sharing it; (d) the categories of third parties with whom we share it; and (e) the specific pieces of personal information we have collected.

Right to Delete
You may request that we delete personal information we have collected from you, subject to certain exceptions (e.g., information we need to complete a transaction, comply with a legal obligation, or exercise free speech).

Right to Correct
You may request that we correct inaccurate personal information we maintain about you.

Right to Opt Out of Sale / Sharing
You may opt out of the sale or sharing of your personal information for cross-context behavioural advertising. See our opt-out instructions in Section 7.

Right to Limit Use of Sensitive Personal Information
We do not collect sensitive personal information as defined by the CPRA.

Right to Non-Discrimination
We will not discriminate against you for exercising your CCPA/CPRA rights. We will not deny you services, charge different prices, or provide a lesser quality of service because you exercised your rights.`,
  },
  {
    title: "7. How to Opt Out of Sharing for Advertising",
    body: `To opt out of the sharing of your personal information for interest-based advertising:

Browser-Level Opt-Out
Most modern browsers support the Global Privacy Control (GPC) signal. Enabling GPC in your browser instructs AppVault and our advertising partners to stop sharing your data for targeted advertising automatically.

Industry Opt-Out Tools
• Digital Advertising Alliance: optout.aboutads.info
• Network Advertising Initiative: optout.networkadvertising.org

Cookie Management
Use our cookie preference controls (available in the Cookie Policy page) to withdraw consent for non-essential cookies.

If you use multiple browsers or devices, you will need to opt out on each one separately.`,
  },
  {
    title: "8. How to Submit a CCPA Request",
    body: `To exercise your Right to Know, Delete, or Correct, please contact us by:

Email: hello@appvault.app
Subject line: "California Privacy Rights Request"

Please include your full name, the email address associated with your account (if any), and a description of the right you wish to exercise. We will acknowledge your request within 10 business days and respond within 45 calendar days. If we need more time, we will notify you of the reason and extension period (up to 90 days total).

We will verify your identity before processing your request. Because AppVault does not require user accounts, identity verification may be limited to email confirmation.`,
  },
  {
    title: "9. Authorised Agent",
    body: `You may designate an authorised agent to submit a CCPA request on your behalf. To do so, provide written authorisation signed by you and the agent, or a valid power of attorney. We may still contact you directly to verify your identity.`,
  },
  {
    title: "10. Contact for California Privacy Inquiries",
    body: `If you have questions about this Notice or your California privacy rights:

Email: hello@appvault.app
Subject: "CCPA Inquiry"
AppVault, Inc.

Last Updated: April 6, 2025`,
  },
];

export function CcpaPrivacyRights() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-extrabold text-gray-900">California Privacy Rights</h1>
          </div>
          <p className="text-gray-500 mb-1">Last updated: April 6, 2025 · Applies to: California Residents</p>
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              This notice supplements our{" "}
              <Link href="/privacy-policy" className="text-primary underline">Privacy Policy</Link>{" "}
              and provides California residents with rights under the California Consumer Privacy Act (CCPA)
              and California Privacy Rights Act (CPRA).
            </p>
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Related:{" "}
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
            {" · "}
            <Link href="/advertising-disclosure" className="text-primary hover:underline">Advertising Disclosure</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
