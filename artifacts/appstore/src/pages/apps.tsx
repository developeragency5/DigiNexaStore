import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useListApps, useListCategories, useGetNewApps, ListAppsParams } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Star, TrendingUp, Zap, Grid3x3, X,
  SlidersHorizontal, Gamepad2, Globe
} from "lucide-react";

function parseParams(search: string) {
  const sp = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const hasSearch = !!sp.get("search");
  return {
    category: sp.get("category") || undefined,
    search: sp.get("search") || undefined,
    featured: sp.get("featured") === "true" ? true : undefined,
    trending: sp.get("trending") === "true" ? true : undefined,
    isNew: sp.get("new") === "true" ? true : undefined,
    // When searching, default to all types unless explicitly set
    appType: sp.get("appType") || (hasSearch ? undefined : "app"),
  };
}

/** Wrap matched portion of text in <strong> */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-bold text-gray-900">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

/** Single Google-style search result row */
function SearchResultItem({ app, query }: { app: any; query: string }) {
  const [, navigate] = useLocation();
  const slug = app.id;
  const displayUrl = `appvault.app/apps/${slug}`;
  const isGame = app.appType === "game";
  return (
    <div className="py-5 border-b border-gray-100 last:border-0 group">
      {/* Breadcrumb / URL row */}
      <div className="flex items-center gap-2 mb-1.5">
        {app.iconUrl ? (
          <img
            src={app.iconUrl}
            alt=""
            className="h-4 w-4 rounded-sm object-cover shrink-0"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        )}
        <span className="text-xs text-gray-500 truncate">{displayUrl}</span>
        {isGame && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-100 shrink-0">Game</span>
        )}
      </div>

      {/* Title — large blue link */}
      <button
        onClick={() => navigate(`/apps/${slug}`)}
        className="text-left"
      >
        <h3 className="text-lg font-normal text-blue-700 group-hover:underline leading-snug mb-1">
          <HighlightMatch text={app.name} query={query} />
          {" "}
          <span className="font-normal text-blue-700">- Free Download</span>
        </h3>
      </button>

      {/* Description */}
      {app.shortDescription && (
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mb-2">
          <HighlightMatch text={app.shortDescription} query={query} />
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        {app.rating > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {Number(app.rating).toFixed(1)}
          </span>
        )}
        {app.developer && (
          <span className="text-xs text-gray-400">{app.developer}</span>
        )}
        {app.categoryName && (
          <span className="text-xs text-gray-400">{app.categoryName}</span>
        )}
      </div>
    </div>
  );
}

const collections = [
  { key: "all",      label: "All Apps", icon: Grid3x3,   sub: "Browse every app",       color: "text-primary",    bg: "bg-primary/10",  chipColor: "from-primary/5 to-primary/10",    border: "border-primary/20"  },
  { key: "featured", label: "Featured", icon: Star,       sub: "Editor's top picks",     color: "text-amber-500",  bg: "bg-amber-50",    chipColor: "from-amber-50 to-amber-100/60",   border: "border-amber-100"   },
  { key: "trending", label: "Trending", icon: TrendingUp, sub: "Most popular right now", color: "text-orange-500", bg: "bg-orange-50",   chipColor: "from-orange-50 to-orange-100/60", border: "border-orange-100"  },
  { key: "new",      label: "Latest",   icon: Zap,        sub: "Fresh additions",        color: "text-blue-500",   bg: "bg-blue-50",     chipColor: "from-blue-50 to-blue-100/60",     border: "border-blue-100"    },
  { key: "games",    label: "Games",    icon: Gamepad2,   sub: "Browse all games",       color: "text-violet-600", bg: "bg-violet-50",   chipColor: "from-violet-50 to-violet-100/60", border: "border-violet-100"  },
];

export function Apps() {
  const [location] = useLocation();
  const search = useSearch();
  const [params, setParams] = useState<ListAppsParams & { appType?: string; trending?: boolean }>(
    () => parseParams(search || (typeof window !== "undefined" ? window.location.search : ""))
  );
  useEffect(() => { setParams(parseParams(search)); }, [search]);

  const [searchInput, setSearchInput] = useState(params.search || "");
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);

  const isGames = (params as any).appType === "game";

  const activeCollection =
    isGames ? "games" :
    params.featured ? "featured" :
    params.trending ? "trending" :
    (params as any).isNew ? "new" :
    "all";

  const isCollectionModeEarly = !params.category && !params.search;

  const { data: allItemsData, isLoading: loadingAllItems } = useListApps({ limit: 500 } as any);
  const { data: listAppsData, isLoading: loadingList } = useListApps({ ...params, limit: 500 } as any);
  const { data: newAppsData, isLoading: loadingNew } = useGetNewApps(
    { appType: "app", limit: 500 } as any,
    { enabled: !!(params as any).isNew }
  );

  const isAllAppsMode = activeCollection === "all" && isCollectionModeEarly;
  const apps = isAllAppsMode ? allItemsData : (params as any).isNew ? newAppsData : listAppsData;
  const isLoading = isAllAppsMode ? loadingAllItems : (params as any).isNew ? loadingNew : loadingList;

  const { data: categories } = useListCategories();
  const appCategories = categories?.filter((c: any) => c.type !== "game");

  const liveCounts = allItemsData
    ? allItemsData.reduce<Record<string, number>>((acc, app) => {
        const slug = (app as any).categorySlug;
        if (slug && !slug.endsWith("-games")) acc[slug] = (acc[slug] || 0) + 1;
        return acc;
      }, {})
    : null;

  const clearFilters = () => { setParams({ appType: "app" }); setSearchInput(""); };

  const setCollection = (key: string) => {
    setParams(p => ({
      ...p,
      appType: key === "games" ? "game" : "app",
      featured: key === "featured" ? true : undefined,
      trending: key === "trending" ? true : undefined,
      isNew: key === "new" ? true : undefined,
      category: undefined,
      search: undefined,
    }));
    setSearchInput("");
  };

  const activeCol = collections.find(c => c.key === activeCollection) ?? collections[0];
  const isCollectionMode = isCollectionModeEarly;

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

  /* ── SEARCH ENGINE RESULTS PAGE ── */
  if (params.search) {
    const query = params.search;

    return (
      <div className="bg-white min-h-screen">

        {/* Sticky search bar header */}
        <div className="border-b border-gray-200 bg-white py-3 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 shrink-0 font-bold text-xl tracking-tight text-gray-900"
            >
              App<span className="text-primary">Vault</span>
            </button>
            <div className="flex-1">
              <SearchAutocomplete
                size="sm"
                defaultValue={query}
                placeholder="Search apps, games..."
                onSearch={(q) => setParams(p => ({ ...p, search: q }))}
              />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="max-w-3xl mx-auto mt-3 flex items-center gap-1 pl-[calc(2rem+1px)] overflow-x-auto">
            {[
              { label: "All",   key: null },
              { label: "Apps",  key: "app" },
              { label: "Games", key: "game" },
            ].map(tab => {
              const currentType = (params as any).appType ?? null;
              const active = tab.key === currentType;
              return (
                <button
                  key={tab.label}
                  onClick={() => setParams(p => ({ ...p, appType: tab.key ?? undefined }))}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">

          {isLoading ? (
            <div className="space-y-6 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2 py-4 border-b border-gray-100">
                  <Skeleton className="h-3 w-48 rounded" />
                  <Skeleton className="h-6 w-80 rounded" />
                  <Skeleton className="h-4 w-full max-w-lg rounded" />
                  <Skeleton className="h-4 w-64 rounded" />
                </div>
              ))}
            </div>
          ) : !apps || apps.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-base mb-1">
                No results for <strong className="text-gray-700">"{query}"</strong>
              </p>
              <p className="text-gray-400 text-sm mb-6">Try a different search term or browse by category.</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Browse All Apps
              </button>
            </div>
          ) : (
            <>
              {/* Result count */}
              <p className="text-xs text-gray-400 mb-1 pt-2">
                About {apps.length} result{apps.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-gray-600">"{query}"</span>
              </p>

              {/* Result list */}
              <div>
                {apps.map(app => (
                  <SearchResultItem
                    key={app.id}
                    app={app as any}
                    query={query}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ── COLLECTION MODE ── */
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
                const chipClass = `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active
                    ? `bg-gradient-to-b ${col.chipColor} ${col.border} ${col.color}`
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`;
                return (
                  <button key={col.key} onClick={() => setCollection(col.key)} className={chipClass}>
                    <col.icon className={`h-3.5 w-3.5 ${active ? col.color : "text-gray-400"}`} />
                    {col.label}
                  </button>
                );
              })}

              <button
                onClick={() => setShowCategoryPanel(!showCategoryPanel)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border bg-white text-gray-600 border-gray-200 hover:border-gray-300 transition-all"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                By Category
              </button>
            </div>

            {showCategoryPanel && (
              <div className="mt-4 ml-16 flex flex-wrap gap-2">
                {appCategories?.map(cat => {
                  const count = liveCounts ? (liveCounts[cat.slug] ?? 0) : cat.appCount;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setParams(p => ({ ...p, category: cat.slug, featured: undefined, trending: undefined, isNew: undefined })); setShowCategoryPanel(false); }}
                      className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                    >
                      {cat.name} <span className="text-gray-400 text-xs ml-1">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {activeCollection === "all" && !isLoading && apps ? (
            (() => {
              const grouped: Record<string, { name: string; slug: string; items: typeof apps }> = {};
              apps.forEach(app => {
                const slug = (app as any).categorySlug || "other";
                const name = (app as any).categoryName || "Other";
                if (!grouped[slug]) grouped[slug] = { name, slug, items: [] };
                grouped[slug].items.push(app);
              });
              const allSections = Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
              const appSections  = allSections.filter(s => !s.slug.endsWith("-games"));
              const gameSections = allSections.filter(s =>  s.slug.endsWith("-games"));
              const totalGames   = gameSections.reduce((n, s) => n + s.items.length, 0);

              const SeeAllBtn = ({ slug, isGame }: { slug: string; isGame: boolean }) => (
                <button
                  onClick={() => setParams(p => ({
                    ...p,
                    category: slug,
                    appType: isGame ? "game" : "app",
                    featured: undefined, trending: undefined, isNew: undefined,
                  }))}
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                  See all →
                </button>
              );

              return (
                <div className="space-y-12">
                  <p className="text-sm text-gray-400">
                    {apps.length} apps & games — {apps.length - totalGames} apps across {appSections.length} categories · {totalGames} games across {gameSections.length} genres
                  </p>

                  {appSections.map(section => (
                    <div key={section.slug}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">{section.name}</h2>
                          <p className="text-xs text-gray-400 mt-0.5">{section.items.length} apps</p>
                        </div>
                        <SeeAllBtn slug={section.slug} isGame={false} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {section.items.map(app => <AppCard key={app.id} app={app} />)}
                      </div>
                    </div>
                  ))}

                  {gameSections.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                            <Gamepad2 className="h-5 w-5 text-violet-600" /> Games
                          </h2>
                          <p className="text-xs text-gray-400 mt-0.5">{totalGames} games across {gameSections.length} genres</p>
                        </div>
                        <button onClick={() => setCollection("games")} className="text-sm font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                          Browse all games →
                        </button>
                      </div>

                      <div className="space-y-10 pl-4 border-l-2 border-violet-100">
                        {gameSections.map(section => {
                          const genreName = section.name.replace(/ Games$/i, "");
                          return (
                            <div key={section.slug}>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-base font-bold text-gray-800">{genreName}</h3>
                                  <p className="text-xs text-gray-400 mt-0.5">{section.items.length} games</p>
                                </div>
                                <SeeAllBtn slug={section.slug} isGame={true} />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {section.items.map(app => <AppCard key={app.id} app={app} />)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            (() => {
              if (isLoading) return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
                </div>
              );
              if (!apps || apps.length === 0) return (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                  <Search className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-gray-900">No results found</h3>
                  <p className="text-gray-400 text-sm mt-1.5 max-w-xs mx-auto">Try a different filter.</p>
                  <button onClick={clearFilters} className="mt-5 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">Clear Filters</button>
                </div>
              );
              const grouped: Record<string, { name: string; slug: string; items: typeof apps }> = {};
              apps.forEach(app => {
                const slug = (app as any).categorySlug || "other";
                const name = (app as any).categoryName || "Other";
                if (!grouped[slug]) grouped[slug] = { name, slug, items: [] };
                grouped[slug].items.push(app);
              });
              const sections = Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
              const label = isGames ? "games" : "apps";
              return (
                <div className="space-y-12">
                  <p className="text-sm text-gray-400">
                    {apps.length} {label} across {sections.length} {isGames ? "genres" : "categories"}
                  </p>
                  {sections.map(section => {
                    const displayName = isGames
                      ? section.name.replace(/ Games$/i, "")
                      : section.name;
                    return (
                      <div key={section.slug}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">{displayName}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{section.items.length} {label}</p>
                          </div>
                          <button
                            onClick={() => setParams(p => ({
                              ...p,
                              category: section.slug,
                              appType: isGames ? "game" : "app",
                              featured: undefined, trending: undefined, isNew: undefined,
                            }))}
                            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            See all →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {section.items.map(app => <AppCard key={app.id} app={app} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      </div>
    );
  }

  /* ── BROWSE MODE (category active) ── */
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
                    onClick={() => { setParams({ appType: "app" }); setSearchInput(""); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors font-medium text-gray-600 hover:bg-gray-50"
                  >
                    ← All Collections
                  </button>
                  {appCategories?.map(cat => {
                    const count = liveCounts ? (liveCounts[cat.slug] ?? 0) : cat.appCount;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setParams(p => ({ ...p, category: cat.slug, search: undefined, featured: undefined, trending: undefined, isNew: undefined }));
                          setSearchInput("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${params.category === cat.slug ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-400">{count}</span>
                      </button>
                    );
                  })}
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
