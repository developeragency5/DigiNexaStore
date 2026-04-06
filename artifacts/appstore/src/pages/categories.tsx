import { useListCategories } from "@workspace/api-client-react";
import { CategoryCard } from "@/components/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3x3, Gamepad2 } from "lucide-react";

export function Categories() {
  const { data: categories, isLoading } = useListCategories();

  const appCategories = categories?.filter((c: any) => c.type !== "game");
  const gameCategories = categories?.filter((c: any) => c.type === "game");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Grid3x3 className="h-3.5 w-3.5" /> All Categories
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Browse by Category</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Explore {categories?.length || "all"} categories to find the perfect app or game for every aspect of your life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* App Categories */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Grid3x3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">App Categories</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-[112px] rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {appCategories?.map(category => <CategoryCard key={category.id} category={category} />)}
            </div>
          )}
        </section>

        {/* Game Categories */}
        {(isLoading || (gameCategories && gameCategories.length > 0)) && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Game Genres</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[112px] rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gameCategories?.map(category => <CategoryCard key={category.id} category={category} />)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
