import { useState } from "react";
import { useListApps, useListCategories, ListAppsParams } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export function Apps() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [params, setParams] = useState<ListAppsParams>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    platform: (searchParams.get('platform') as any) || undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    trending: searchParams.get('trending') === 'true' ? true : undefined,
  });

  const [searchInput, setSearchInput] = useState(params.search || "");

  const { data: apps, isLoading } = useListApps(params);
  const { data: categories } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(p => ({ ...p, search: searchInput || undefined }));
  };

  const clearFilters = () => {
    setParams({});
    setSearchInput("");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Catalog</h1>
            <p className="text-muted-foreground text-sm">Discover the perfect app for your needs.</p>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search apps..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              {(Object.keys(params).length > 0) && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Platform</Label>
              <RadioGroup 
                value={params.platform || "all"} 
                onValueChange={(val) => setParams(p => ({ ...p, platform: val === "all" ? undefined : val as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="r-all" />
                  <Label htmlFor="r-all" className="cursor-pointer">All Platforms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ios" id="r-ios" />
                  <Label htmlFor="r-ios" className="cursor-pointer">iOS Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="android" id="r-android" />
                  <Label htmlFor="r-android" className="cursor-pointer">Android Only</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</Label>
              <div className="space-y-2">
                <button
                  className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${!params.category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => setParams(p => ({ ...p, category: undefined }))}
                >
                  All Categories
                </button>
                {categories?.map(cat => (
                  <button
                    key={cat.id}
                    className={`block w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${params.category === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setParams(p => ({ ...p, category: cat.slug }))}
                  >
                    {cat.name}
                    <span className="float-right text-xs opacity-50">{cat.appCount}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Collections</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${params.featured ? 'bg-primary border-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                  onClick={() => setParams(p => ({ ...p, featured: p.featured ? undefined : true }))}
                >
                  Featured
                </button>
                <button
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${params.trending ? 'bg-accent border-accent text-accent-foreground' : 'bg-background hover:bg-muted'}`}
                  onClick={() => setParams(p => ({ ...p, trending: p.trending ? undefined : true }))}
                >
                  Trending
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="text-muted-foreground text-sm font-medium">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <span>Showing {apps?.length || 0} results</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sort by:</span>
              <select className="bg-transparent font-medium outline-none">
                <option>Recommended</option>
                <option>Highest Rated</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-xl" />
              ))}
            </div>
          ) : apps?.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold">No apps found</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                We couldn't find any apps matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <Button variant="outline" className="mt-6" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {apps?.map(app => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
