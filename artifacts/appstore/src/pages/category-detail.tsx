import { useParams, Link } from "wouter";
import { useGetAppsByCategory, useListCategories, getGetAppsByCategoryQueryKey } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Layers } from "lucide-react";
import {
  Gamepad2, Music, Camera, Briefcase, GraduationCap, HeartPulse,
  ShoppingBag, Compass, MessageCircle, Map, Zap, DollarSign, Utensils,
  Puzzle, Trophy, Swords, Car, Star
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "gamepad": Gamepad2, "music": Music, "camera": Camera, "briefcase": Briefcase,
  "graduation-cap": GraduationCap, "heart-pulse": HeartPulse, "shopping-bag": ShoppingBag,
  "compass": Compass, "message-circle": MessageCircle, "map": Map, "zap": Zap,
  "dollar-sign": DollarSign, "utensils": Utensils, "puzzle": Puzzle, "trophy": Trophy,
  "chess": Swords, "car": Car, "joystick": Gamepad2, "sword": Swords, "star": Star,
};

export function CategoryDetail() {
  const { slug } = useParams();
  const categorySlug = slug || "";

  const { data: categories } = useListCategories();
  const category = categories?.find(c => c.slug === categorySlug);
  const Icon = category ? (iconMap[category.iconName] || Layers) : Layers;
  const isGameGenre = categorySlug.endsWith("-games");
  const backHref = isGameGenre ? "/games" : "/categories";
  const backLabel = isGameGenre ? "Mobile Gaming Hub" : "All Categories";

  const { data: apps, isLoading } = useGetAppsByCategory(categorySlug, undefined, {
    query: {
      enabled: !!categorySlug,
      queryKey: getGetAppsByCategoryQueryKey(categorySlug)
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4" /> {backLabel}
          </Link>
          <div className="flex items-start gap-5">
            {category ? (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <Icon className="h-8 w-8" />
              </div>
            ) : (
              <Skeleton className="w-16 h-16 rounded-2xl" />
            )}
            <div>
              {category ? (
                <>
                  <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
                  <p className="text-gray-500 mt-1">{category.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">{apps?.length || category.appCount} apps</p>
                </>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-64" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
          </div>
        ) : apps?.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No apps yet</h3>
            <p className="text-gray-500 text-sm mt-2">We're adding apps to this category soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {apps?.map(app => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  );
}
