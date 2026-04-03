import { useListCategories, useGetStatsSummary } from "@workspace/api-client-react";
import { CategoryCard } from "@/components/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";

export function Categories() {
  const { data: categories, isLoading } = useListCategories();
  const { data: stats } = useGetStatsSummary();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <Layers className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          Explore Categories
        </h1>
        <p className="text-xl text-muted-foreground">
          Browse through {stats?.totalCategories || 'all'} carefully curated categories to find the perfect app for every aspect of your life.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
