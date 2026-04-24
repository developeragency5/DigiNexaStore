import { Link } from "wouter";
import { Shield, Star, Users, CheckCircle2, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Shield,
    color: "text-green-600",
    bg: "bg-green-50",
    title: "All in One Place",
    desc: "Digi Nexa Store aggregates publicly available app information from the official iOS and Android app stores in one organised directory, so you can browse and compare without switching between stores.",
  },
  {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Organised by Category",
    desc: "Thousands of apps and games are grouped across 18 categories so you can browse Productivity, Education, Health & Fitness, Games and more without scrolling endless lists.",
  },
  {
    icon: CheckCircle2,
    color: "text-teal-500",
    bg: "bg-teal-50",
    title: "Free to Explore",
    desc: "No account, no subscription, no hidden fees. Browse the full directory completely free, anytime, from any device.",
  },
  {
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-50",
    title: "Safe by Design",
    desc: "We never host APK files or app installers. Every install button takes you straight to the official iOS or Android store listing from the original developer.",
  },
];

const stats = [
  { value: "4,565+", label: "Apps & Games Listed" },
  { value: "18", label: "Categories Covered" },
  { value: "iOS & Android", label: "Both Stores Aggregated" },
];

const facts = [
  "App data aggregated from the official iOS & Android app stores",
  "Direct links to official store listings",
  "No APK or installer files hosted on our servers",
  "Listings refreshed regularly to keep data current",
  "iOS and Android coverage in one place",
  "Free to use, no account required",
];

export function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            App Discovery Made<br className="hidden sm:block" />
            <span className="text-primary"> Simple and Honest</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Digi Nexa Store is a free, independent app discovery directory. We aggregate publicly available
            information from the official iOS and Android app stores so you can browse, search and find apps and
            games in one organised place — then install them directly from the official store.
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

      {/* What we are / what we are not */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Digi Nexa Store gathers publicly available metadata — app names, icons, screenshots, descriptions,
              developer information, category and pricing — from the official iOS and Android app stores, and
              presents it in a clean, searchable directory.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When you find an app you'd like to try, the install button takes you to the app's official
              listing on the iOS App Store or the Android Play Store. We do not host the apps themselves and we never
              distribute installer files.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {facts.map(item => (
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

        {/* What we are not */}
        <div className="mb-20 bg-gray-50 border border-gray-100 rounded-3xl p-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">What We Are Not</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To set clear expectations:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><span className="text-primary font-bold">·</span> We are not a platform operator or app developer. We are an independent third-party directory and are not affiliated with, endorsed by, or sponsored by any platform operator.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">·</span> We do not host APK files, IPA files or any app installers. All downloads happen on the official iOS or Android app store.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">·</span> We do not write professional editorial reviews. App descriptions shown on Digi Nexa Store come from the publishers' official store listings.</li>
            <li className="flex gap-2"><span className="text-primary font-bold">·</span> We do not guarantee that app information is fully up to date. Always check the official store listing before installing or purchasing.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Start Exploring</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Browse our directory of 4,500+ apps and games organised across 18 categories.
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
