import { useState, useEffect } from "react";
import { useListApps, useListCategories, ListAppsParams } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const sortOptions = [
  { label: "Most Downloaded", value: "downloads" },
  { label: "Highest Rated", value: "rating" },
  { label: "Newest First", value: "newest" },
];

export function Apps() {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

  const [params, setParams] = useState<ListAppsParams & { appType?: string; trending?: boolean }>({
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    platform: (searchParams.get("platform") as any) || undefined,
    featured: searchParams.get("featured") === "true" ? true : undefined,
    trending: searchParams.get("trending") === "true" ? true : undefined,
    appType: searchParams.get("appType") || "app",
  });

  const [searchInput, setSearchInput] = useState(params.search || "");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: apps, isLoading } = useListApps(params as any);
  const { data: categories } = useListCategories();

  const appCategories = categories?.filter((c: any) => c.type !== "game");

  const clearFilters = () => {
    setParams({ appType: "app" });
    setSearchInput("");
  };

  const activeFilterCount = [params.category, params.featured, params.trending, params.platform].filter(Boolean).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {params.search ? `Results for "${params.search}"` :
               params.featured ? "Featured Apps" :
               params.trending ? "Trending Apps" :
               params.category ? `${appCategories?.find(c => c.slug === params.category)?.name || "Category"} Apps` :
               "All Apps"}
            </h1>
            {!isLoading && <p className="text-gray-500 text-sm mt-1">{apps?.length || 0} apps found</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center bg-primary text-white text-xs rounded-full font-bold">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-64 shrink-0 space-y-6`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
              {/* Search */}
              <div>
                <form onSubmit={(e) => { e.preventDefault(); setParams(p => ({ ...p, search: searchInput || undefined })); }}>
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

              {/* Platform */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</h3>
                <div className="space-y-1">
                  {[{ label: "All Platforms", value: "" }, { label: "iOS Only", value: "ios" }, { label: "Android Only", value: "android" }].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setParams(p => ({ ...p, platform: opt.value || undefined }))}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${(params.platform || "") === opt.value ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Collections</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Featured", key: "featured" },
                    { label: "Trending", key: "trending" },
                  ].map(col => (
                    <button
                      key={col.key}
                      onClick={() => setParams(p => ({ ...p, [col.key]: (p as any)[col.key] ? undefined : true }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${(params as any)[col.key] ? "bg-primary text-white border-primary" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-0.5 max-h-72 overflow-y-auto">
                  <button
                    onClick={() => setParams(p => ({ ...p, category: undefined }))}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${!params.category ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>All Categories</span>
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
                <button onClick={clearFilters} className="w-full py-2 text-sm text-red-500 hover:text-red-700 font-medium flex items-center justify-center gap-1.5 transition-colors">
                  <X className="h-4 w-4" /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
              </div>
            ) : apps?.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No apps found</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Try adjusting your search or clearing some filters to see more results.</p>
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
