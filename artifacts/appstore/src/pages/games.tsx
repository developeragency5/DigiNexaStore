import { useGetPopularGames, useListApps } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, TrendingUp, Star, Zap } from "lucide-react";
import { Link } from "wouter";

const genres = [
  { name: "Action", slug: "action-games", color: "#EF4444", emoji: "⚔️" },
  { name: "Puzzle", slug: "puzzle-games", color: "#8B5CF6", emoji: "🧩" },
  { name: "Strategy", slug: "strategy-games", color: "#10B981", emoji: "♟️" },
  { name: "Sports", slug: "sports-games", color: "#F59E0B", emoji: "🏆" },
  { name: "Racing", slug: "racing-games", color: "#F97316", emoji: "🏎️" },
  { name: "Arcade", slug: "arcade-games", color: "#EC4899", emoji: "🕹️" },
  { name: "RPG", slug: "rpg-games", color: "#6366F1", emoji: "⚔️" },
  { name: "Casual", slug: "casual-games", color: "#14B8A6", emoji: "🎮" },
];

export function Games() {
  const { data: popularGames, isLoading: loadingPopular } = useGetPopularGames({ limit: 8 });
  const { data: allGames, isLoading: loadingAll } = useListApps({ appType: "game", limit: 20 } as any);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Gamepad2 className="h-3.5 w-3.5" /> Mobile Gaming Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Discover <span className="text-primary">Top Games</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            The best action, puzzle, strategy, and casual games for iOS and Android — curated and ranked.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Browse by Genre */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Genre</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {genres.map(genre => (
              <Link key={genre.slug} href={`/categories/${genre.slug}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex flex-col items-center text-center gap-2 group">
                <span className="text-2xl">{genre.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-primary transition-colors">{genre.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Games */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-500" /> Popular Games
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">Most downloaded games right now</p>
            </div>
          </div>
          {loadingPopular ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularGames?.map(game => <AppCard key={game.id} app={game} />)}
            </div>
          )}
        </section>

        {/* All Games */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" /> All Games
            </h2>
          </div>
          {loadingAll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allGames?.map(game => <AppCard key={game.id} app={game} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
