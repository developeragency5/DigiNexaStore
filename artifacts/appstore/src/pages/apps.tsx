import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListApps, useListCategories, ListAppsParams } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Star, TrendingUp, Zap, Grid3x3, X, SlidersHorizontal } from "lucide-react";

function parseParams(search: string) {
  const sp = new URLSearchParams(search);
  return {
    category: sp.get("category") || undefined,
    search: sp.get("search") || undefined,
    platform: (sp.get("platform") as any) || undefined,
    featured: sp.get("featured") === "true" ? true : undefined,
    trending: sp.get("trending") === "true" ? true : undefined,
    appType: sp.get("appType") || "app",
  };
}

export function Apps() {
  const [location] = useLocation();
  const [params, setParams] = useState<ListAppsParams & { appType?: string; trending?: boolean }>(
    () => parseParams(typeof window !== "undefined" ? window.location.search : "")
  );
  useEffect(() => { setParams(parseParams(window.location.search)); }, [location]);

  const [searchInput, setSearchInput] = useState(params.search || "");
  const [showFilters, setShowFilters] = useState(false);

  const { data: apps, isLoading } = useListApps(params as any);
  const { data: categories } = useListCategories();
  const appCategories = categories?.filter((c: any) => c.type !== "game");

  const clearFilters = () => { setParams({ appType: "app" }); setSearchInput(""); };
  const activeFilterCount = [params.category, params.featured, params.trending, params.platform].filter(Boolean).length;

  const pageTitle =
    params.search ? `Results for "${params.search}"` :
    params.featured ? "Featured Apps" :
    params.trending ? "Trending Apps" :
    params.category ? (appCategories?.find(c => c.slug === params.category)?.name || "Category") + " Apps" :
    "All Apps";

  const collections = [
    { key: "all", label: "All Apps", icon: Grid3x3 },
    { key: "featured", label: "Featured", icon: Star },
    { key: "trending", label: "Trending", icon: TrendingUp },
    { key: "new", label: "New", icon: Zap },
  ];

  const activeCollection =
    params.featured ? "featured" :
    params.trending ? "trending" :
    "all";

  const setCollection = (key: string) => {
    setParams(p => ({
      ...p,
      featured: key === "featured" ? true : undefined,
      trending: key === "trending" ? true : undefined,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{pageTitle}</h1>
              {!isLoading && (
                <p className="text-gray-400 text-sm mt-0.5">{apps?.length || 0} apps found</p>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors mt-1">
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Collection pills */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
              {collections.map(col => {
                const active = col.key === activeCollection;
                return (
                  <button
                    key={col.key}
                    onClick={() => setCollection(col.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <col.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                    {col.label}
                  </button>
                );
              })}
            </div>

            {/* Platform pills */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {[{ label: "All", value: "" }, { label: "iOS", value: "ios" }, { label: "Android", value: "android" }].map(opt => {
                const active = (params.platform || "") === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setParams(p => ({ ...p, platform: opt.value || undefined }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Categories
              {params.category && <span className="h-2 w-2 rounded-full bg-primary" />}
            </button>
          </div>

          {/* Mobile search */}
          <form
            onSubmit={e => { e.preventDefault(); setParams(p => ({ ...p, search: searchInput || undefined })); }}
            className="mt-3 lg:hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search apps..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block w-52 shrink-0`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-20 space-y-5">
              {/* Search */}
              <form onSubmit={e => { e.preventDefault(); setParams(p => ({ ...p, search: searchInput || undefined })); }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search apps..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
                  />
                </div>
              </form>

              {/* Categories */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</p>
                <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
                  <button
                    onClick={() => setParams(p => ({ ...p, category: undefined }))}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors font-medium ${!params.category ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    All Categories
                  </button>
                  {appCategories?.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setParams(p => ({ ...p, category: cat.slug }))}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${params.category === cat.slug ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400">{cat.appCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="w-full py-2 text-xs text-red-500 hover:text-red-700 font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <X className="h-3.5 w-3.5" /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
              </div>
            ) : apps?.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Search className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                <h3 className="text-base font-bold text-gray-900">No apps found</h3>
                <p className="text-gray-400 text-sm mt-1.5 max-w-xs mx-auto">Try adjusting your filters or search term.</p>
                <button onClick={clearFilters} className="mt-5 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {apps?.map(app => <AppCard key={app.id} app={app} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
