import { useGetFeaturedApps, useGetTrendingApps, useGetNewApps, useGetPopularGames, useListCategories, useGetAppsByCategory, useListApps, useGetStatsSummary } from "@workspace/api-client-react";
import { useState } from "react";
import { AppCard } from "@/components/app-card";
import { CategoryCard } from "@/components/category-card";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight, TrendingUp, Gamepad2, Smartphone, Star, Zap,
  Briefcase, HeartPulse, GraduationCap, Tv, MessageCircle,
  DollarSign, Camera, Map, Utensils, Music, Grid3x3, Sparkles, Flame
} from "lucide-react";

const quickCategories = [
  { label: "Games",          icon: Gamepad2,      href: "/games",                        color: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-100" },
  { label: "Productivity",   icon: Briefcase,      href: "/categories/productivity",       color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100" },
  { label: "Social",         icon: MessageCircle,  href: "/categories/social",             color: "text-sky-500",    bg: "bg-sky-50",     border: "border-sky-100" },
  { label: "Entertainment",  icon: Tv,             href: "/categories/entertainment",      color: "text-orange-500", bg: "bg-orange-50",  border: "border-orange-100" },
  { label: "Education",      icon: GraduationCap,  href: "/categories/education",          color: "text-indigo-500", bg: "bg-indigo-50",  border: "border-indigo-100" },
  { label: "Health",         icon: HeartPulse,     href: "/categories/health-fitness",    color: "text-rose-500",   bg: "bg-rose-50",    border: "border-rose-100" },
  { label: "Finance",        icon: DollarSign,     href: "/categories/finance",            color: "text-green-600",  bg: "bg-green-50",   border: "border-green-100" },
  { label: "Photography",    icon: Camera,         href: "/categories/photography",        color: "text-amber-500",  bg: "bg-amber-50",   border: "border-amber-100" },
  { label: "Music",          icon: Music,          href: "/categories/music",              color: "text-pink-500",   bg: "bg-pink-50",    border: "border-pink-100" },
  { label: "Travel",         icon: Map,            href: "/categories/travel",             color: "text-teal-500",   bg: "bg-teal-50",    border: "border-teal-100" },
  { label: "Food & Drink",   icon: Utensils,       href: "/categories/food-drink",         color: "text-red-500",    bg: "bg-red-50",     border: "border-red-100" },
  { label: "All Categories", icon: Grid3x3,        href: "/categories",                    color: "text-gray-600",   bg: "bg-gray-100",   border: "border-gray-200" },
];

function SectionHeader({ title, subtitle, viewAllHref }: { title: string; subtitle?: string; viewAllHref?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0 ml-4">
          See all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function AppGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[88px] rounded-2xl" />
      ))}
    </div>
  );
}

export function Home() {
  const { data: featuredApps, isLoading: loadingFeatured } = useGetFeaturedApps();
  const { data: trendingApps, isLoading: loadingTrending } = useGetTrendingApps();
  const { data: newApps, isLoading: loadingNew } = useGetNewApps({ appType: "app" as any, limit: 8 });
  const { data: popularGames, isLoading: loadingGames } = useGetPopularGames();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: productivityApps, isLoading: loadingProductivity } = useGetAppsByCategory("productivity", { limit: 8 } as any);
  const { data: studyApps, isLoading: loadingStudy } = useGetAppsByCategory("education", { limit: 8 } as any);
  const { data: fitnessApps, isLoading: loadingFitness } = useGetAppsByCategory("health-fitness", { limit: 8 } as any);
  const { data: aiApps, isLoading: loadingAi } = useListApps({ search: "AI", appType: "app", limit: 8 } as any);
  const { data: socialApps, isLoading: loadingSocial } = useGetAppsByCategory("social", { limit: 8 } as any);
  const { data: financeApps, isLoading: loadingFinance } = useGetAppsByCategory("finance", { limit: 8 } as any);
  const { data: stats } = useGetStatsSummary();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const appCategories = categories?.filter(c => (c as any).type !== "game").slice(0, 9);

  const fmt = (n?: number) => (n ?? 0).toLocaleString("en-US");

  const faqs = [
    {
      q: "What is Digi Nexa Store?",
      a: "Digi Nexa Store is a free app and game discovery platform. We aggregate publicly available information from the App Store and Google Play so you can browse, search and find new apps in one place — without installing anything on your device.",
    },
    {
      q: "Do you host or distribute the apps?",
      a: "No. We never host APK files or app binaries. Every download button takes you to the app's official listing on the App Store or Google Play, where you install the app safely from the original developer.",
    },
    {
      q: "Are the apps free?",
      a: "The vast majority of apps in our catalog are free to download. Some apps offer in-app purchases or subscriptions — pricing details are listed on each app page and on the official store listing.",
    },
    {
      q: "How do I find the best app for my needs?",
      a: "Use the search bar at the top, browse by category (Productivity, Education, Health & Fitness, etc.) or explore curated rows like Trending, Featured and AI Apps. Each app page links you straight to the official store to download.",
    },
    {
      q: "Are Digi Nexa Store listings updated?",
      a: "Yes. App information is regularly refreshed from the App Store and Google Play to keep titles, icons and descriptions current.",
    },
    {
      q: "Is Digi Nexa Store affiliated with Apple or Google?",
      a: "No. Digi Nexa Store is an independent discovery platform and is not affiliated with, endorsed by or sponsored by Apple Inc. or Google LLC.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(150deg, #f0fdf4 0%, #dcfce7 40%, #a7f3d0 75%, #6ee7b7 100%)" }}>

        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #14532d 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12 text-center">

          {/* Brand */}
          <div className="flex items-center justify-center gap-3 -mb-10">
            <img src="/digi-nexa-store-logo-transparent.png" alt="Digi Nexa Store" className="object-contain w-[420px] max-w-full h-auto drop-shadow-xl" />
          </div>

          {/* Tagline */}
          <p className="text-green-900/75 text-lg font-semibold tracking-wide mb-8">
            Discover curated apps and games
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchAutocomplete
              size="lg"
              placeholder="Search apps, games..."
              className="w-full"
            />
          </div>

          {/* Quick Category Pills */}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {quickCategories.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 text-green-900 border border-white/60 hover:bg-white/70 transition-all duration-150"
              >
                <cat.icon className="h-3 w-3 opacity-70" />
                {cat.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-700">{fmt(stats?.totalApps)}+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Apps tracked</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-700">{fmt(stats?.totalGames)}+</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Games tracked</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-700">{fmt(stats?.totalCategories)}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Categories</div>
            </div>
            <div className="px-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-700">iOS &amp; Android</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Both stores covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Apps Horizontal Scroll ── */}
      {(loadingFeatured || (featuredApps && featuredApps.length > 0)) && (
        <section className="bg-white border-b border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Featured
              </h2>
              <Link href="/apps?featured=true" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {loadingFeatured ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="w-[200px] h-[180px] rounded-2xl flex-shrink-0" />)}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                {featuredApps?.map(app => (
                  <AppCard key={app.id} app={app} variant="hero" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Trending Apps ── */}
        <section>
          <SectionHeader
            title="Trending Apps"
            subtitle="Most popular this week"
            viewAllHref="/apps?trending=true"
          />
          {loadingTrending ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingApps?.filter(a => (a as any).appType !== "game").slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Productivity Apps ── */}
        <section>
          <SectionHeader
            title="Productivity Apps"
            subtitle="Boost focus, organisation and daily efficiency"
            viewAllHref="/categories/productivity"
          />
          {loadingProductivity ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {productivityApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Study Apps ── */}
        <section>
          <SectionHeader
            title="Study Apps"
            subtitle="Learning tools for students and lifelong learners"
            viewAllHref="/categories/education"
          />
          {loadingStudy ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Fitness Apps ── */}
        <section>
          <SectionHeader
            title="Fitness Apps"
            subtitle="Workouts, tracking and a healthier routine"
            viewAllHref="/categories/health-fitness"
          />
          {loadingFitness ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fitnessApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── AI Apps ── */}
        <section>
          <SectionHeader
            title="AI Apps & Smart Tools"
            subtitle="AI-powered assistants for work, study and creativity"
            viewAllHref="/apps?search=AI"
          />
          {loadingAi ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Social Apps ── */}
        <section>
          <SectionHeader
            title="Social Apps"
            subtitle="Stay connected with friends, family and communities"
            viewAllHref="/categories/social"
          />
          {loadingSocial ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {socialApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Finance Apps ── */}
        <section>
          <SectionHeader
            title="Finance Apps"
            subtitle="Banking, budgeting and money management"
            viewAllHref="/categories/finance"
          />
          {loadingFinance ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {financeApps?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Browse by Category ── */}
        <section>
          <SectionHeader title="Browse by Category" viewAllHref="/categories" />
          {loadingCategories ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-[100px] rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {appCategories?.map(cat => <CategoryCard key={cat.id} category={cat} />)}
            </div>
          )}
        </section>

        {/* ── Latest Apps ── */}
        <section>
          <SectionHeader
            title="Latest Apps"
            subtitle="Fresh additions to our catalog"
            viewAllHref="/apps"
          />
          {loadingNew ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newApps?.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

        {/* ── Popular Games ── */}
        <section>
          <SectionHeader
            title="Popular Games"
            subtitle="Top-rated games for iOS & Android"
            viewAllHref="/games"
          />
          {loadingGames ? (
            <AppGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularGames?.slice(0, 8).map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── SEO Content / Discovery Guide ── */}
      <section className="bg-gradient-to-b from-green-50/40 to-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Explore Apps by Category
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              At Digi Nexa Store, we make it easy to explore apps across different
              categories. Whether you're looking for trending apps, productivity apps,
              study apps, or fitness apps, everything is organised for a smooth
              discovery experience.
            </p>
          </div>

          {/* Category cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <Link href="/apps?trending=true" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">Trending Apps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Discover the most trending apps gaining popularity right now —
                viral apps, fresh releases and what people are talking about.
              </p>
            </Link>

            <Link href="/categories/productivity" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Productivity Apps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Boost your efficiency with the best productivity apps designed for
                focus, task management and daily organisation.
              </p>
            </Link>

            <Link href="/categories/education" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900">Study Apps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Explore powerful study apps and learning tools that help students
                improve focus, manage time and achieve better results.
              </p>
            </Link>

            <Link href="/categories/health-fitness" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="h-5 w-5 text-rose-500" />
                <h3 className="font-bold text-gray-900">Fitness Apps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Stay active and healthy with top fitness apps for workouts,
                tracking progress and maintaining a balanced lifestyle.
              </p>
            </Link>

            <Link href="/apps?search=AI" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <h3 className="font-bold text-gray-900">AI Apps</h3>
              </div>
              <p className="text-sm text-gray-600">
                Explore modern AI apps and smart tools that help you work faster,
                study smarter and automate everyday tasks.
              </p>
            </Link>

            <Link href="/games" className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="h-5 w-5 text-violet-600" />
                <h3 className="font-bold text-gray-900">Games & Entertainment</h3>
              </div>
              <p className="text-sm text-gray-600">
                Find the best mobile games and entertainment apps to relax, have
                fun and enjoy your free time.
              </p>
            </Link>
          </div>

          {/* Long-form content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Best Apps for Daily Life
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Discover the best apps for daily use that simplify your routine.
                From managing tasks to improving focus and staying healthy, our
                collection includes top productivity apps, fitness apps and useful
                tools designed for everyday life.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AI Apps & Smart Tools
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore the latest AI apps and smart tools that are transforming how
                we work, study and create. From writing assistants to automation
                tools, find AI-powered productivity apps that save time and boost
                performance.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                New & Updated Apps
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stay ahead with newly released and recently updated apps. We
                regularly add new trending apps, study apps and fitness apps so you
                always have access to the latest tools and innovations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Apps for Every Need
              </h3>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-1.5">
                <li>• Want to stay focused? Try our <Link href="/categories/productivity" className="text-primary hover:underline">productivity apps</Link></li>
                <li>• Preparing for exams? Explore <Link href="/categories/education" className="text-primary hover:underline">study apps</Link></li>
                <li>• Looking to stay fit? Check out <Link href="/categories/health-fitness" className="text-primary hover:underline">fitness apps</Link></li>
                <li>• Want something new? Browse <Link href="/apps?trending=true" className="text-primary hover:underline">trending apps</Link></li>
              </ul>
            </div>

          </div>

          {/* Popular searches */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
              Popular Searches
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "best productivity apps", href: "/categories/productivity" },
                { label: "trending apps right now", href: "/apps?trending=true" },
                { label: "free study apps for students", href: "/categories/education" },
                { label: "top fitness apps for beginners", href: "/categories/health-fitness" },
                { label: "useful apps for android", href: "/apps?platform=android" },
                { label: "AI apps", href: "/apps?search=AI" },
              ].map(s => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:border-green-400 hover:text-green-700 transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Why Digi Nexa Store */}
          <div className="mt-14 pt-10 border-t border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              Why Use Digi Nexa Store
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-8">
              A simple, ad-light way to find your next favourite app — without the noise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Smartphone className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Both stores, one place</h4>
                <p className="text-sm text-gray-600">
                  Browse apps from the App Store and Google Play side by side, with direct links to install.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Zap className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Fast and lightweight</h4>
                <p className="text-sm text-gray-600">
                  No accounts, no installs, no clutter. Open the site, find an app, tap to install from the official store.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Organised by category</h4>
                <p className="text-sm text-gray-600">
                  Productivity, education, fitness, finance, social, games and more — all neatly grouped for quick discovery.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <TrendingUp className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Always fresh</h4>
                <p className="text-sm text-gray-600">
                  We regularly refresh app data so titles, descriptions and trending lists stay current.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Safe by design</h4>
                <p className="text-sm text-gray-600">
                  We never host APK files. Every install button takes you straight to the official Apple or Google listing.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <Grid3x3 className="h-5 w-5 text-green-700" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Free to use</h4>
                <p className="text-sm text-gray-600">
                  Digi Nexa Store is completely free. No paywalls, no subscriptions — just browse and discover.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-14 pt-10 border-t border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Quick answers about how Digi Nexa Store works.
            </p>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.q}
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-14 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Start Your App Discovery Journey
            </h3>
            <p className="text-sm text-gray-600 max-w-xl mx-auto mb-5">
              Find the perfect combination of trending apps, productivity apps,
              study apps and fitness apps — all in one place.
            </p>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Start Exploring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
