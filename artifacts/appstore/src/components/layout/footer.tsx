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
              A free app discovery platform. Browse iOS and Android apps and games organised by category — all linking directly to official stores.
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

        {/* Contact & compliance block (visible to AdScan + users) */}
        <div className="py-6 border-b border-green-200 space-y-2">
          <p className="text-xs text-gray-500 leading-relaxed max-w-5xl">
            <span className="font-semibold text-gray-700">Contact:</span>{" "}
            <a href="mailto:support@diginexastore.com" className="text-green-700 hover:underline">support@diginexastore.com</a>
            {" "}· By email only — we respond within two US business days.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-5xl">
            <span className="font-semibold text-gray-700">Refund Policy:</span>{" "}
            <Link href="/no-purchase-policy" className="text-green-700 hover:underline">Refund Policy</Link>
            {" "}— we do not sell apps; refunds are handled by the official iOS or Android app store under their policies.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-5xl">
            <span className="font-semibold text-gray-700">Privacy &amp; Tracking:</span>{" "}
            We use third-party advertising and analytics services — see our{" "}
            <Link href="/privacy-policy" className="text-green-700 hover:underline">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/cookie-policy" className="text-green-700 hover:underline">Cookie Policy</Link>.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-5xl pt-2">
            <span className="font-semibold text-gray-500">Disclaimer:</span> Digi Nexa Store is an independent app discovery platform, not affiliated with any platform operator or app developer. All app names, logos, and trademarks are the property of their respective owners. Store buttons direct users to official third-party stores — we do not sell, host, or process payments for any application. App information is provided for informational purposes only and may not reflect current store listings.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Digi Nexa Store. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-gray-700 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
