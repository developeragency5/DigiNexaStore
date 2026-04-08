import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo-mark.png" alt="App US logo" width="36" height="36" className="object-contain" />
              <span className="font-bold text-lg text-white">App <span className="text-primary relative top-0.5">US</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              The internet's most curated app directory. Discover the best iOS and Android apps and games, hand-picked by experts.
            </p>
            <p className="text-xs leading-relaxed text-gray-600 max-w-xs">
              App US is a free discovery platform. We do not sell apps or process payments.
              All purchases occur on official third-party app stores.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "All Apps", href: "/apps" },
                { label: "All Games", href: "/games" },
                { label: "Featured Apps", href: "/apps?featured=true" },
                { label: "Trending", href: "/apps?trending=true" },
                { label: "Latest", href: "/apps?new=true" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: "Productivity", href: "/categories/productivity" },
                { label: "Health & Fitness", href: "/categories/health-fitness" },
                { label: "Education", href: "/categories/education" },
                { label: "Finance", href: "/categories/finance" },
                { label: "Action Games", href: "/categories/action-games" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
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
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm">© {new Date().getFullYear()} App US. All rights reserved.</p>
            <p className="text-xs text-gray-600 mt-1">
              App US is an independent app discovery platform. Not affiliated with Apple Inc. or Google LLC.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
            <Link href="/ccpa-privacy-rights" className="hover:text-white transition-colors">CA Privacy Rights</Link>
            <Link href="/advertising-disclosure" className="hover:text-white transition-colors">Ad Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
