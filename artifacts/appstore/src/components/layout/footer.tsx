import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-green-50 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-green-200">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl px-3 py-2 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                <img
                  src="/digi-nexa-store-logo-transparent.png"
                  alt="Digi Nexa Store"
                  className="h-[52px] w-auto object-contain"
                />
              </div>
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
