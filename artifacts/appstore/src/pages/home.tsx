import { useState } from "react";
import { useGetFeaturedApps, useGetTrendingApps, useGetNewApps, useGetPopularGames, useListCategories, useGetStatsSummary } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { CategoryCard } from "@/components/category-card";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Search, TrendingUp, Gamepad2, Smartphone, Download, Star, ShieldCheck, RefreshCcw, Sparkles, BadgeCheck } from "lucide-react";

function SectionHeader({ title, subtitle, viewAllHref }: { title: string; subtitle?: string; viewAllHref?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
  const [navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subError, setSubError] = useState("");

  const { data: featuredApps, isLoading: loadingFeatured } = useGetFeaturedApps();
  const { data: trendingApps, isLoading: loadingTrending } = useGetTrendingApps();
  const { data: newApps, isLoading: loadingNew } = useGetNewApps({ appType: "app" as any, limit: 8 });
  const { data: popularGames, isLoading: loadingGames } = useGetPopularGames();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: stats } = useGetStatsSummary();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/apps?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const appCategories = categories?.filter(c => (c as any).type !== "game").slice(0, 9);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Smartphone className="h-3.5 w-3.5" /> AppVault — App & Game Discovery
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5">
              Discover the Best<br />
              <span className="text-primary">Apps & Games</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Hand-picked apps and games for iOS and Android. No junk, no spam — only the best of the best.
            </p>
            <form onSubmit={handleSearch} className="flex items-center max-w-lg mx-auto bg-white rounded-2xl border-2 border-gray-200 focus-within:border-primary/50 shadow-sm transition-all overflow-hidden">
              <Search className="h-5 w-5 text-gray-400 ml-4 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for apps, games, developers..."
                className="flex-1 py-3.5 px-3 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
              />
              <button type="submit" className="m-1.5 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shrink-0">
                Search
              </button>
            </form>
          </div>

          {/* Platform Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {[
              { icon: Download,   label: "Curated Apps",         color: "text-primary",    bg: "bg-primary/8"  },
              { icon: Gamepad2,   label: "Mobile Games",        color: "text-violet-600", bg: "bg-violet-50"  },
              { icon: Sparkles,   label: "Browse by Category",  color: "text-blue-600",   bg: "bg-blue-50"    },
              { icon: Smartphone, label: "iOS & Android",       color: "text-amber-600",  bg: "bg-amber-50"   },
              { icon: Star,       label: "Free to Explore",     color: "text-rose-500",   bg: "bg-rose-50"    },
            ].map(({ icon: Icon, label, color, bg }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold ${bg} ${color} border border-current/10`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Apps Horizontal Scroll */}
        {(loadingFeatured || (featuredApps && featuredApps.length > 0)) && (
          <div className="border-t border-gray-100 py-8 bg-gradient-to-b from-gray-50 to-gray-50/0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Featured Apps
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
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Trending Apps */}
        <section>
          <SectionHeader
            title="Trending Apps"
            subtitle="The most downloaded apps this week"
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

        {/* Categories Grid */}
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

        {/* Latest Apps */}
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

        {/* Popular Games */}
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

        {/* Features Banner */}
        <section className="rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-0">

            {/* Left — text + features */}
            <div className="flex-1 px-8 py-12 lg:px-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">AppVault Features</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7 max-w-md">
                AppVault is your go-to curated app directory. Discover hand-picked iOS &amp; Android apps and games, organised by category — no clutter, no guesswork.
              </p>
              <Link
                href="/apps"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm mb-10"
              >
                Explore Apps <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: BadgeCheck, label: "Expert Curated Content",    desc: "Every app is hand-picked by our team" },
                  { icon: ShieldCheck, label: "Safe & Trusted Picks",     desc: "No malware, no spam — only quality apps" },
                  { icon: Sparkles,    label: "18+ App Categories",       desc: "From Productivity to Action Games" },
                  { icon: Search,      label: "Free to Discover",         desc: "Browse and search at no cost, always" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3.5 border border-gray-100 shadow-sm">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — phone mockup */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 self-stretch px-16 min-w-[340px]">
              {/* Phone frame */}
              <div className="relative w-[200px] h-[400px] bg-gray-900 rounded-[32px] shadow-2xl border-4 border-gray-800 overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-900 rounded-b-xl z-10" />
                {/* Screen */}
                <div className="absolute inset-0 bg-white pt-6 flex flex-col overflow-hidden">
                  {/* Mini header */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-primary">
                    <div className="h-4 w-4 bg-white/30 rounded-md flex items-center justify-center">
                      <Smartphone className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-white text-[9px] font-bold tracking-wide">AppVault</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 px-2.5 py-2 space-y-2 overflow-hidden bg-gray-50">
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Featured</p>
                    {[
                      { color: "bg-red-400",    name: "Todoist",   cat: "Productivity", rating: "4.7" },
                      { color: "bg-blue-500",   name: "Discord",   cat: "Social",       rating: "4.8" },
                      { color: "bg-violet-500", name: "Genshin",   cat: "Action Games", rating: "4.5" },
                      { color: "bg-amber-400",  name: "Duolingo",  cat: "Education",    rating: "4.9" },
                    ].map(app => (
                      <div key={app.name} className="flex items-center gap-2 bg-white rounded-lg px-2 py-1.5 shadow-sm border border-gray-100">
                        <div className={`h-7 w-7 ${app.color} rounded-lg shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-bold text-gray-900 truncate">{app.name}</p>
                          <p className="text-[7px] text-gray-400">{app.cat}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="h-2 w-2 fill-amber-400 text-amber-400" />
                          <span className="text-[7px] text-gray-500">{app.rating}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest pt-1">Top Games</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { color: "bg-indigo-500", name: "PUBG" },
                        { color: "bg-green-500",  name: "Clash" },
                        { color: "bg-pink-500",   name: "Candy" },
                      ].map(g => (
                        <div key={g.name} className="flex flex-col items-center gap-1">
                          <div className={`h-10 w-10 ${g.color} rounded-xl`} />
                          <p className="text-[7px] text-gray-600 font-medium text-center">{g.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Newsletter */}
        <section className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay in the Loop</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">Get weekly roundups of the best new apps and games delivered straight to your inbox.</p>

          {subStatus === "success" ? (
            <div className="max-w-sm mx-auto flex flex-col items-center gap-2 py-4 px-6 bg-primary/5 border border-primary/20 rounded-2xl">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">You're subscribed!</p>
              <p className="text-xs text-gray-500">Thanks for signing up. Expect your first roundup soon.</p>
              <button
                onClick={() => { setSubStatus("idle"); setEmail(""); }}
                className="mt-1 text-xs text-primary font-semibold hover:underline"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubError("");
                const trimmed = email.trim();
                const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
                if (!trimmed) { setSubError("Please enter your email address."); return; }
                if (!valid)   { setSubError("Please enter a valid email address."); return; }
                setSubStatus("loading");
                setTimeout(() => {
                  setSubStatus("success");
                  setEmail("");
                }, 800);
              }}
              className="flex flex-col items-center gap-2 max-w-sm mx-auto"
            >
              <div className="flex gap-3 w-full">
                <input
                  type="text"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSubError(""); }}
                  placeholder="Enter your email"
                  disabled={subStatus === "loading"}
                  className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-white transition-colors ${
                    subError ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-primary/20"
                  } disabled:opacity-60`}
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2 shrink-0"
                >
                  {subStatus === "loading" ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                  ) : null}
                  {subStatus === "loading" ? "Subscribing…" : "Subscribe"}
                </button>
              </div>
              {subError && (
                <p className="text-xs text-red-500 self-start">{subError}</p>
              )}
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
