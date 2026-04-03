import { useParams, Link } from "wouter";
import { useGetAppsByCategory, useListCategories, getGetAppsByCategoryQueryKey } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, SlidersHorizontal, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CategoryDetail() {
  const { slug } = useParams();
  const categorySlug = slug || "";

  // Get category details to show header
  const { data: categories } = useListCategories();
  const category = categories?.find(c => c.slug === categorySlug);

  const { data: apps, isLoading } = useGetAppsByCategory(categorySlug, undefined, {
    query: {
      enabled: !!categorySlug,
      queryKey: getGetAppsByCategoryQueryKey(categorySlug)
    }
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link href="/categories" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to categories
      </Link>

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-12 bg-card p-8 rounded-3xl border shadow-sm">
        <div>
          {category ? (
            <>
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: category.color }}
                >
                  <Layers className="h-6 w-6" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {category.name} Apps
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            </>
          ) : (
            <Skeleton className="h-12 w-64 mb-4" />
          )}
        </div>
        
        <div className="bg-muted px-6 py-4 rounded-2xl text-center min-w-[120px]">
          <div className="text-3xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : apps?.length || 0}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Apps</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">All {category?.name} Apps</h2>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      ) : apps?.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed">
          <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold">No apps found</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            We haven't added any apps to this category yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps?.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
