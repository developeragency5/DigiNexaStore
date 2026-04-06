import { Link } from "wouter";
import { Megaphone } from "lucide-react";

const sections = [
  {
    title: "1. Overview",
    body: `appus ("we", "us", "our") is a free app discovery platform. To keep appus free for everyone, we display digital advertisements. This Advertising Disclosure explains: (a) that advertising appears on our site; (b) how interest-based advertising works; (c) what data is collected by our advertising technology partners; and (d) how you can control or opt out of targeted advertising.

This disclosure is provided to comply with digital advertising transparency standards and applicable privacy regulations including the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR), and self-regulatory guidelines for interest-based advertising.`,
  },
  {
    title: "2. Types of Advertising on appus",
    body: `appus may display:

Contextual Advertisements
Ads based on the content of the page you are viewing — for example, ads for productivity tools on productivity app pages. These do not rely on your personal browsing history.

Interest-Based Advertisements (IBA)
Also known as behavioural advertising or targeted advertising. These ads are served based on your inferred interests, past browsing activity, and demographic signals. We use advertising technology provided by third-party digital advertising networks to deliver IBA.

Conversion Tracking
When a user clicks an advertisement and later completes an action (such as installing an app), our advertising technology partners use tracking signals to measure this conversion event. This helps us understand which advertisements are effective.`,
  },
  {
    title: "3. How Interest-Based Advertising Works",
    body: `When you visit appus, our advertising technology partners may place cookies, pixel tags, or similar tracking technologies on your device. These technologies may:

• Record that you visited specific pages on appus
• Associate your browser or device with interest categories
• Combine data collected here with data collected from other websites you visit
• Use this data to serve you relevant advertisements on appus and on other websites across the internet

This data is processed by advertising technology platforms operating as independent controllers. Their data practices are governed by their own privacy policies. We require all advertising partners to comply with applicable privacy laws and industry self-regulatory guidelines.`,
  },
  {
    title: "4. Universal Event Tracking & Conversion Pixels",
    body: `appus uses conversion tracking technology provided by our digital advertising partners. This technology:

• Tracks when users arrive at appus from an advertisement
• Records specific actions taken after clicking an ad (e.g., navigating to an app detail page)
• Uses first-party and third-party cookies and URL parameters to attribute conversions

The data collected via conversion tracking may include:
• URL of the page visited
• Timestamp and session information
• Hashed email address (if provided voluntarily, e.g., newsletter sign-up)
• Browser and device identifiers

Conversion tracking data is used solely for measuring and optimising the performance of our paid advertising campaigns.`,
  },
  {
    title: "5. Third-Party Advertising Technology Partners",
    body: `We work with digital advertising technology providers who may collect data as described in this disclosure. Each partner operates under its own privacy policy. We do not directly share your name, email address, or any directly identifying information with advertising networks without your explicit consent.

Our partners may include companies that operate programmatic advertising platforms, search advertising networks, and analytics services. These companies may participate in industry self-regulatory programs for interest-based advertising.

You can find opt-out tools for participating advertising networks at:
• Digital Advertising Alliance (DAA): optout.aboutads.info
• Network Advertising Initiative (NAI): optout.networkadvertising.org
• European Interactive Digital Advertising Alliance: youronlinechoices.eu`,
  },
  {
    title: "6. Affiliate Links",
    body: `Some links on appus may be affiliate links. This means that if you click a link and subsequently make a purchase or take an action on a third-party platform, appus may receive a referral fee or commission at no additional cost to you.

Affiliate links are not clearly labelled in every instance because the existence of an affiliate relationship does not influence the inclusion, ranking, or description of any app listed on appus. Our editorial decisions are independent of commercial relationships.

We disclose this practice in accordance with the Federal Trade Commission (FTC) endorsement guidelines.`,
  },
  {
    title: "7. Do Not Track & Global Privacy Control",
    body: `appus does not currently respond to browser "Do Not Track" (DNT) signals because there is no universal standard for interpreting these signals.

However, we do honour the Global Privacy Control (GPC) signal. If your browser or extension sends a GPC signal, we will treat it as a request to opt out of the sale or sharing of your personal information for cross-context behavioural advertising.`,
  },
  {
    title: "8. Your Opt-Out Options",
    body: `You have several ways to limit interest-based advertising:

1. Industry opt-out tools — Use the DAA or NAI opt-out portals listed in Section 5 above.
2. Global Privacy Control (GPC) — Enable GPC in your browser (see globalprivacycontrol.org).
3. Cookie preferences — Use the cookie controls described in our Cookie Policy to disable non-essential cookies.
4. Browser privacy settings — Most browsers allow you to block third-party cookies, which limits behavioural tracking.

Note: Opting out does not mean you will see fewer advertisements — it means the ads you see will be less targeted to your interests. You will still see contextual advertisements based on the page content.`,
  },
  {
    title: "9. Children's Advertising",
    body: `appus does not knowingly serve targeted advertisements to children under the age of 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information and halt any targeted advertising directed to that individual.`,
  },
  {
    title: "10. Contact Us",
    body: `If you have questions about advertising on appus or this Advertising Disclosure:

Email: hello@appus.net
Subject: "Advertising Disclosure Inquiry"
appus, Inc.

Last Updated: April 6, 2025`,
  },
];

export function AdvertisingDisclosure() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Legal
          </span>
          <div className="flex items-center gap-3 mb-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-extrabold text-gray-900">Advertising Disclosure</h1>
          </div>
          <p className="text-gray-500 mb-1">Last updated: April 6, 2025</p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            appus is supported by digital advertising. This disclosure explains how advertising works on
            our platform, what data may be collected by advertising technology partners, and how you can
            control targeted advertising.
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
            <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
            {" · "}
            <Link href="/ccpa-privacy-rights" className="text-primary hover:underline">California Privacy Rights</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
