import { useGetPopularGames, useListApps } from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, TrendingUp, Star, Layers } from "lucide-react";
import { Link } from "wouter";

const genres = [
  { name: "Action", slug: "action-games", emoji: "⚔️", color: "from-red-50 to-red-100/60", border: "border-red-100", text: "text-red-600" },
  { name: "Puzzle", slug: "puzzle-games", emoji: "🧩", color: "from-violet-50 to-violet-100/60", border: "border-violet-100", text: "text-violet-600" },
  { name: "Strategy", slug: "strategy-games", emoji: "♟️", color: "from-emerald-50 to-emerald-100/60", border: "border-emerald-100", text: "text-emerald-600" },
  { name: "Sports", slug: "sports-games", emoji: "🏆", color: "from-amber-50 to-amber-100/60", border: "border-amber-100", text: "text-amber-600" },
  { name: "Racing", slug: "racing-games", emoji: "🏎️", color: "from-orange-50 to-orange-100/60", border: "border-orange-100", text: "text-orange-600" },
  { name: "Arcade", slug: "arcade-games", emoji: "🕹️", color: "from-pink-50 to-pink-100/60", border: "border-pink-100", text: "text-pink-600" },
  { name: "RPG", slug: "rpg-games", emoji: "🗡️", color: "from-indigo-50 to-indigo-100/60", border: "border-indigo-100", text: "text-indigo-600" },
  { name: "Casual", slug: "casual-games", emoji: "🎮", color: "from-teal-50 to-teal-100/60", border: "border-teal-100", text: "text-teal-600" },
];

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 leading-tight">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Games() {
  const { data: popularGames, isLoading: loadingPopular } = useGetPopularGames({ limit: 8 });
  const { data: allGames, isLoading: loadingAll } = useListApps({ appType: "game", limit: 20 } as any);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Clean hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Games</p>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Mobile Gaming Hub</h1>
            </div>
          </div>
          <p className="text-gray-500 max-w-lg ml-16">
            The best action, puzzle, strategy, and casual games for iOS and Android — curated and ranked.
          </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Genre Grid */}
        <section>
          <SectionHeader
            icon={<Layers className="h-4.5 w-4.5 text-primary" />}
            title="Browse by Genre"
            subtitle="Pick a category to explore"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {genres.map(genre => (
              <Link key={genre.slug} href={`/categories/${genre.slug}`}
                className={`bg-gradient-to-b ${genre.color} border ${genre.border} rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
                <span className="text-2xl leading-none">{genre.emoji}</span>
                <span className={`text-xs font-bold ${genre.text} group-hover:scale-105 transition-transform`}>{genre.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Games */}
        <section>
          <SectionHeader
            icon={<TrendingUp className="h-4.5 w-4.5 text-primary" />}
            title="Popular Games"
            subtitle="Most downloaded right now"
          />
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
          <SectionHeader
            icon={<Star className="h-4.5 w-4.5 text-primary" />}
            title="All Games"
            subtitle="Every game in our catalog"
          />
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
