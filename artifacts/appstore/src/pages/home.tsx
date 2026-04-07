import { useGetFeaturedApps, useGetTrendingApps, useGetNewApps, useGetPopularGames, useListCategories } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { CategoryCard } from "@/components/category-card";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight, TrendingUp, Gamepad2, Smartphone, Star, Zap,
  Briefcase, HeartPulse, GraduationCap, Tv, MessageCircle,
  DollarSign, Camera, Map, Utensils, Music, Grid3x3
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

  const appCategories = categories?.filter(c => (c as any).type !== "game").slice(0, 9);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(150deg, #bbf7d0 0%, #86efac 40%, #4ade80 75%, #22c55e 100%)" }}>

        {/* Subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #14532d 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-12 text-center">

          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <svg width="48" height="48" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <rect width="52" height="52" rx="13" fill="#16A34A"/>
              <circle cx="22" cy="27" r="10.5" stroke="white" strokeWidth="4.2" fill="none"/>
              <line x1="32.5" y1="16.5" x2="32.5" y2="39" stroke="white" strokeWidth="4.2" strokeLinecap="round"/>
              <line x1="22.5" y1="16.5" x2="32.5" y2="16.5" stroke="white" strokeWidth="4.2" strokeLinecap="round"/>
            </svg>
            <span className="text-4xl font-extrabold tracking-tight text-green-900">
              app<span className="text-primary">us</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-green-800/70 text-sm font-medium tracking-wide mb-8">
            Discover &amp; compare the best apps and games
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto drop-shadow-md">
            <SearchAutocomplete
              size="lg"
              placeholder="Search apps, games, developers..."
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
    </div>
  );
}
