import { Link } from "wouter";
import { Shield, Star, Users, CheckCircle2, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Shield,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "Curated, Not Crawled",
    desc: "Every app on Digi Nexa Store is reviewed by a real person. We never auto-import junk or bloatware — only apps that genuinely deserve your attention make the cut.",
  },
  {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Quality Over Quantity",
    desc: "We'd rather list 4,000 truly excellent apps than 500,000 mediocre ones. Our strict editorial standards mean you can trust every recommendation.",
  },
  {
    icon: CheckCircle2,
    color: "text-teal-500",
    bg: "bg-teal-50",
    title: "Free to Explore",
    desc: "No account, no subscription, no hidden fees. Browse thousands of curated apps and games across 21 categories — completely free, anytime, from any device.",
  },
  {
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-50",
    title: "Built for Real People",
    desc: "No affiliate bias, no pay-to-play placements. Digi Nexa Store is designed for users who want honest recommendations — not ads disguised as reviews.",
  },
];

const stats = [
  { value: "4,565+", label: "Curated Apps & Games" },
  { value: "21", label: "Categories Covered" },
  { value: "0", label: "Paid Placements" },
];

export function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            The App Store for People Who<br className="hidden sm:block" />
            <span className="text-primary"> Care About Quality</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Digi Nexa Store was built out of frustration. The major app stores are overrun with clones, low-effort cash-grabs, and misleading ratings.
            We set out to build the directory we always wished existed — curated, honest, and actually useful.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-primary mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe great apps can genuinely improve your life — but finding them shouldn't require wading through thousands of mediocre
              alternatives. Digi Nexa Store is our answer to that problem.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every app in our directory has been downloaded, tested, and evaluated by our editorial team.
              We look at design, performance, usefulness, and privacy — not just download counts or star averages that can be gamed.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Real editors, real reviews",
              "Privacy-first picks",
              "No fake reviews",
              "Updated every week",
              "iOS & Android coverage",
              "Free to use, always",
            ].map(item => (
              <div key={item} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className={`h-11 w-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Start Discovering Better Apps</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Explore our hand-picked collection of apps and games across 18 categories.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/apps" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors">
              Browse Apps <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/categories" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors">
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
