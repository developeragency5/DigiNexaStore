import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";

const ARTICLES = [
  {
    slug: "how-to-find-trustworthy-apps",
    title: "How to find trustworthy apps in 2026",
    summary:
      "Five practical checks that help US shoppers separate well-built mobile apps from low-quality knock-offs on the official Apple App Store and Google Play.",
    readMins: 6,
  },
  {
    slug: "ios-vs-android-discovery",
    title: "iOS vs Android — how app discovery actually differs",
    summary:
      "An editorial walk-through of the differences between Apple App Store ranking signals and Google Play ranking signals, written for non-technical readers.",
    readMins: 7,
  },
  {
    slug: "category-guide-productivity",
    title: "Category guide: productivity apps worth your time",
    summary:
      "Our editors break down the productivity category into note-takers, task managers, calendar tools and focus timers, with notes on what to look for in each group.",
    readMins: 5,
  },
  {
    slug: "category-guide-health-fitness",
    title: "Category guide: health and fitness apps",
    summary:
      "How to read store ratings, in-app-purchase models and privacy disclosures on health and fitness apps before you install one on iPhone or Android.",
    readMins: 6,
  },
  {
    slug: "free-vs-paid-apps",
    title: "Free, freemium and paid — what those labels really mean",
    summary:
      "A short editorial guide to the three main monetisation models you will see across the directory, written so you know what to expect before you tap install.",
    readMins: 4,
  },
  {
    slug: "in-app-purchases-explained",
    title: "In-app purchases, explained for everyday shoppers",
    summary:
      "Why two apps with the same install price can cost very different amounts to actually use, and how to check the in-app purchase list on the official store first.",
    readMins: 5,
  },
];

export function Blog() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Digi Nexa Store Editorial
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">App Discovery Articles</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Editorial articles about how to find, evaluate and install apps on the official Apple App Store and Google Play, written by the Digi Nexa Store team.
          </p>
        </div>
      </div>

      {/* Articles list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <article
              key={a.slug}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-3">
                <BookOpen className="h-3 w-3" />
                <span>Editorial · {a.readMins} min read</span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">{a.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-5 flex-1">{a.summary}</p>
              <Link
                href="/apps"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                Browse the directory <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Browse the full directory</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            All editorial articles link back to the directory of curated iOS and Android apps. Browse by category or open the full list.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              Browse Apps <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
