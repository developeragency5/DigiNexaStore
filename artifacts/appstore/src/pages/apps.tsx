import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListApps, useListCategories, useGetNewApps, ListAppsParams } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Star, TrendingUp, Zap, Grid3x3, X,
  SlidersHorizontal, Smartphone
} from "lucide-react";

function parseParams(search: string) {
  const sp = new URLSearchParams(search);
  return {
    category: sp.get("category") || undefined,
    search: sp.get("search") || undefined,
    platform: (sp.get("platform") as any) || undefined,
    featured: sp.get("featured") === "true" ? true : undefined,
    trending: sp.get("trending") === "true" ? true : undefined,
    isNew: sp.get("new") === "true" ? true : undefined,
    appType: sp.get("appType") || "app",
  };
}

const collections = [
  { key: "all",      label: "All Apps",    icon: Grid3x3,   sub: "Browse every app",       color: "text-primary",     bg: "bg-primary/10",  chipColor: "from-primary/5 to-primary/10", border: "border-primary/20"  },
  { key: "featured", label: "Featured",    icon: Star,      sub: "Editor's top picks",      color: "text-amber-500",   bg: "bg-amber-50",    chipColor: "from-amber-50 to-amber-100/60", border: "border-amber-100" },
  { key: "trending", label: "Trending",    icon: TrendingUp, sub: "Most popular right now",  color: "text-orange-500",  bg: "bg-orange-50",   chipColor: "from-orange-50 to-orange-100/60", border: "border-orange-100" },
  { key: "new",      label: "New Releases", icon: Zap,       sub: "Fresh additions",         color: "text-blue-500",    bg: "bg-blue-50",     chipColor: "from-blue-50 to-blue-100/60", border: "border-blue-100"  },
];

export function Apps() {
  const [location] = useLocation();
  const [params, setParams] = useState<ListAppsParams & { appType?: string; trending?: boolean }>(
    () => parseParams(typeof window !== "undefined" ? window.location.search : "")
  );
  useEffect(() => { setParams(parseParams(window.location.search)); }, [location]);

  const [searchInput, setSearchInput] = useState(params.search || "");
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);

  const { data: listAppsData, isLoading: loadingList } = useListApps({ ...params, limit: 500 } as any);
  const { data: newAppsData, isLoading: loadingNew } = useGetNewApps(
    { appType: "app", limit: 500 } as any,
    { enabled: !!(params as any).isNew }
  );
  const apps = (params as any).isNew ? newAppsData : listAppsData;
  const isLoading = (params as any).isNew ? loadingNew : loadingList;

  const { data: categories } = useListCategories();
  const appCategories = categories?.filter((c: any) => c.type !== "game");

  const clearFilters = () => { setParams({ appType: "app" }); setSearchInput(""); };

  const activeCollection =
    params.featured ? "featured" :
    params.trending ? "trending" :
    (params as any).isNew ? "new" :
    "all";

  const setCollection = (key: string) => {
    setParams(p => ({
      ...p,
      featured: key === "featured" ? true : undefined,
      trending: key === "trending" ? true : undefined,
      isNew: key === "new" ? true : undefined,
      category: undefined,
      search: undefined,
    }));
    setSearchInput("");
  };

  const activeCol = collections.find(c => c.key === activeCollection) ?? collections[0];

  // Collection mode: no category/search active → games-style full-width layout
  const isCollectionMode = !params.category && !params.search;

  const pageTitle =
    params.search ? `Results for "${params.search}"` :
    params.category ? (appCategories?.find(c => c.slug === params.category)?.name || "Category") + " Apps" :
    activeCol.label === "All Apps" ? "All Apps" :
    activeCol.label;

  const AppGrid = ({ cols = 4 }: { cols?: number }) => (
    isLoading ? (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "xl:grid-cols-3"} gap-4`}>
        {Array.from({ length: cols === 4 ? 8 : 12 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
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
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "xl:grid-cols-3"} gap-4`}>
        {apps?.map(app => <AppCard key={app.id} app={app} />)}
      </div>
    )
  );

  /* ── COLLECTION MODE (same style as /games) ── */
  if (isCollectionMode) {
    return (
      <div className="bg-gray-50 min-h-screen">

        {/* Hero header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-12 w-12 ${activeCol.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                <activeCol.icon className={`h-6 w-6 ${activeCol.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${activeCol.color}`}>Apps</p>
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{pageTitle}</h1>
              </div>
            </div>
            <p className="text-gray-500 max-w-lg ml-16">{activeCol.sub} — hand-picked and curated for iOS & Android.</p>

            {/* Collection chips */}
            <div className="flex flex-wrap gap-2 mt-6 ml-16">
              {collections.map(col => {
                const active = col.key === activeCollection;
                return (
                  <button
                    key={col.key}
                    onClick={() => setCollection(col.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      active
                        ? `bg-gradient-to-b ${col.chipColor} ${col.border} ${col.color}`
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <col.icon className={`h-3.5 w-3.5 ${active ? col.color : "text-gray-400"}`} />
                    {col.label}
                  </button>
                );
              })}

              {/* Browse by category */}
              <button
                onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border bg-white text-gray-600 border-gray-200 hover:border-gray-300 transition-all"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                By Category
              </button>
            </div>

            {/* Inline category panel */}
            {showCategoryPanel && (
              <div className="mt-4 ml-16 flex flex-wrap gap-2">
                {appCategories?.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setParams(p => ({ ...p, category: cat.slug, featured: undefined, trending: undefined })); setShowCategoryPanel(false); }}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat.name} <span className="text-gray-400 text-xs ml-1">{cat.appCount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full-width grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {!isLoading && apps && (
            <p className="text-sm text-gray-400 mb-5">{apps.length} apps found</p>
          )}
          <AppGrid cols={4} />
        </div>
      </div>
    );
  }

  /* ── BROWSE MODE (category / search active) ── */
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{pageTitle}</h1>
              {!isLoading && <p className="text-gray-400 text-sm mt-0.5">{apps?.length || 0} apps found</p>}
            </div>
            <button onClick={clearFilters} className="shrink-0 flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors mt-1">
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          </div>

          {/* Platform chips */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-20 space-y-5">
              <form onSubmit={e => { e.preventDefault(); setParams(p => ({ ...p, search: searchInput || undefined })); }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="search" placeholder="Search apps..." value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
                  />
                </div>
              </form>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</p>
                <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
                  <button
                    onClick={() => setParams(p => ({ ...p, category: undefined }))}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors font-medium text-gray-600 hover:bg-gray-50"
                  >
                    ← All Collections
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

              <button onClick={clearFilters} className="w-full py-2 text-xs text-red-500 hover:text-red-700 font-semibold flex items-center justify-center gap-1.5 transition-colors">
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1 min-w-0">
            <AppGrid cols={3} />
          </main>
        </div>
      </div>
    </div>
  );
}
