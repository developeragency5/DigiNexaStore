import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";

export function Blog() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Digi Nexa Store Blog
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">App Discovery Articles</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Articles about app discovery, mobile categories, and how to find apps on the Apple App Store and Google Play.
          </p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">New Articles Coming Soon</h2>
          <p className="text-gray-500 leading-relaxed max-w-md mx-auto mb-8">
            Our blog is currently being prepared. In the meantime, you can browse the full directory of
            apps and games on Digi Nexa Store.
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
