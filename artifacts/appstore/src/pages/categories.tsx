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

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Grid3x3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Browse</p>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">All Categories</h1>
            </div>
          </div>
          <p className="text-gray-500 mt-3 ml-16 max-w-lg">
            {categories?.length || "18"} categories spanning apps and games — find the perfect fit for every part of your day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* App Categories */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <Grid3x3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">App Categories</h2>
              <p className="text-sm text-gray-400 leading-tight">{appCategories?.length || 10} categories</p>
            </div>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Gamepad2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">Game Genres</h2>
                <p className="text-sm text-gray-400 leading-tight">{gameCategories?.length || 8} genres</p>
              </div>
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
