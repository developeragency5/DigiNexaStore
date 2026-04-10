import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-green-50 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-green-200">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group hover:opacity-90 transition-opacity">
              <img
                src="/digi-nexa-store-logo-transparent.png"
                alt="Digi Nexa Store"
                className="h-[80px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              The internet's most curated app directory. Discover the best iOS and Android apps and games, hand-picked by experts.
            </p>
            <p className="text-xs leading-relaxed text-gray-400 max-w-xs">
              Digi Nexa Store is a free discovery platform. We do not sell apps or process payments.
              All purchases occur on official third-party app stores.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "All Apps", href: "/apps" },
                { label: "All Games", href: "/games" },
                { label: "Featured Apps", href: "/apps?featured=true" },
                { label: "Trending", href: "/apps?trending=true" },
                { label: "Latest", href: "/apps?new=true" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-gray-900 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: "Productivity", href: "/categories/productivity" },
                { label: "Health & Fitness", href: "/categories/health-fitness" },
                { label: "Education", href: "/categories/education" },
                { label: "Finance", href: "/categories/finance" },
                { label: "Action Games", href: "/categories/action-games" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-gray-900 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-gray-900 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Cookie Policy", href: "/cookie-policy" },
                { label: "CA Privacy Rights", href: "/ccpa-privacy-rights" },
                { label: "Advertising", href: "/advertising-disclosure" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "No-Purchase Policy", href: "/no-purchase-policy" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-gray-900 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-8 border-b border-green-200">
          <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">Disclaimer</h5>
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl">
            Digi Nexa Store is an independent app discovery and information platform. We are not affiliated with, endorsed by, or in any way officially connected to Apple Inc., Google LLC, or any app developer listed on this site. All app names, logos, trademarks, and brand identities are the property of their respective owners.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl mt-2">
            The "Download on the App Store" and "Get it on Google Play" buttons on this site direct users to the respective official third-party stores. Digi Nexa Store does not sell, distribute, host, or process payments for any application. All transactions and downloads are handled solely by Apple App Store and Google Play Store under their respective terms and conditions.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl mt-2">
            App ratings, descriptions, pricing, and availability displayed on this site are provided for informational purposes only and may not reflect current information on the respective stores. Digi Nexa Store makes no warranties regarding the accuracy, completeness, or reliability of any app information and accepts no liability for any loss or damage arising from reliance on content published here.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm">© {new Date().getFullYear()} Digi Nexa Store. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">
              Digi Nexa Store is an independent app discovery platform. Not affiliated with Apple Inc. or Google LLC.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-gray-900 transition-colors">Cookies</Link>
            <Link href="/ccpa-privacy-rights" className="hover:text-gray-900 transition-colors">CA Privacy Rights</Link>
            <Link href="/advertising-disclosure" className="hover:text-gray-900 transition-colors">Ad Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
