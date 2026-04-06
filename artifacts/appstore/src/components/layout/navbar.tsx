import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Smartphone, Search, Menu, ChevronDown, ArrowRight,
  Gamepad2, Grid3x3, Star, TrendingUp, Zap,
  Music, Camera, Briefcase, GraduationCap, HeartPulse,
  Tv, MessageCircle, DollarSign, Map, Utensils
} from "lucide-react";
import { SearchAutocomplete } from "@/components/search-autocomplete";

const appCategoryLinks = [
  { name: "Productivity", slug: "productivity", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Health & Fitness", slug: "health-fitness", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-50" },
  { name: "Education", slug: "education", icon: GraduationCap, color: "text-violet-500", bg: "bg-violet-50" },
  { name: "Entertainment", slug: "entertainment", icon: Tv, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Music", slug: "music", icon: Music, color: "text-pink-500", bg: "bg-pink-50" },
  { name: "Finance", slug: "finance", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
  { name: "Photography", slug: "photography", icon: Camera, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Social", slug: "social", icon: MessageCircle, color: "text-sky-500", bg: "bg-sky-50" },
  { name: "Travel", slug: "travel", icon: Map, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "Food & Drink", slug: "food-drink", icon: Utensils, color: "text-red-500", bg: "bg-red-50" },
];

const gameCategoryLinks = [
  { name: "Action", slug: "action-games", emoji: "⚔️" },
  { name: "Puzzle", slug: "puzzle-games", emoji: "🧩" },
  { name: "Strategy", slug: "strategy-games", emoji: "♟️" },
  { name: "Sports", slug: "sports-games", emoji: "🏆" },
  { name: "Racing", slug: "racing-games", emoji: "🏎️" },
  { name: "Arcade", slug: "arcade-games", emoji: "🕹️" },
  { name: "RPG", slug: "rpg-games", emoji: "🗡️" },
  { name: "Casual", slug: "casual-games", emoji: "🎮" },
];

const appsCollectionLinks = [
  { href: "/apps", icon: Grid3x3, label: "All Apps", sub: "Browse every app", color: "text-primary", bg: "bg-primary/10" },
  { href: "/apps?featured=true", icon: Star, label: "Featured", sub: "Editor's top picks", color: "text-amber-500", bg: "bg-amber-50" },
  { href: "/apps?trending=true", icon: TrendingUp, label: "Trending", sub: "Most popular now", color: "text-orange-500", bg: "bg-orange-50" },
  { href: "/apps?new=true", icon: Zap, label: "Latest", sub: "Fresh additions", color: "text-blue-500", bg: "bg-blue-50" },
];

export function Navbar() {
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const open = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };
  const close = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-4">

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 shrink-0 group cursor-pointer"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform shrink-0">
                <rect width="32" height="32" rx="8" fill="#16A34A"/>
                {/* Bowl — full circle, stroke only */}
                <circle cx="13.5" cy="16.5" r="6.5" stroke="white" strokeWidth="2.6" fill="none"/>
                {/* Stem — vertical, right edge of bowl */}
                <line x1="20" y1="10" x2="20" y2="24" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
                {/* Ear — horizontal tick connecting stem top to bowl */}
                <line x1="14" y1="10" x2="20" y2="10" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
              </svg>
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">app<span className="text-primary">us</span></span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 ml-4 flex-1">

              {/* ── Apps ── */}
              <div className="relative" onMouseEnter={() => open("apps")} onMouseLeave={close}>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "apps" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Apps <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "apps" ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === "apps" && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[460px] bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden"
                    onMouseEnter={() => open("apps")} onMouseLeave={close}
                  >
                    <div className="grid grid-cols-2 gap-0">
                      {/* Left: Collections */}
                      <div className="p-4 border-r border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Collections</p>
                        <div className="space-y-1">
                          {appsCollectionLinks.map(item => (
                            <Link key={item.label} href={item.href}
                              className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                              <div className={`h-8 w-8 ${item.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors leading-tight">{item.label}</p>
                                <p className="text-xs text-gray-400 leading-tight">{item.sub}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Right: Categories */}
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</p>
                        <div className="space-y-0.5">
                          {appCategoryLinks.slice(0, 6).map(cat => (
                            <Link key={cat.slug} href={`/categories/${cat.slug}`}
                              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
                              <div className={`h-6 w-6 ${cat.bg} rounded-md flex items-center justify-center shrink-0`}>
                                <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors font-medium">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                        <Link href="/categories" className="mt-3 flex items-center gap-1 px-2 text-xs font-semibold text-primary hover:underline">
                          All categories <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Games ── */}
              <div className="relative" onMouseEnter={() => open("games")} onMouseLeave={close}>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "games" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Games <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "games" ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === "games" && (
                  <div
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-gray-100 p-4 z-50"
                    onMouseEnter={() => open("games")} onMouseLeave={close}
                  >
                    <Link href="/games" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors mb-4 group">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">All Games</p>
                        <p className="text-xs text-gray-400">Browse every game</p>
                      </div>
                    </Link>

                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Browse by Genre</p>
                    <div className="grid grid-cols-2 gap-1">
                      {gameCategoryLinks.map(cat => (
                        <Link key={cat.slug} href={`/categories/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group">
                          <span className="text-base leading-none">{cat.emoji}</span>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Categories ── */}
              <div className="relative" onMouseEnter={() => open("categories")} onMouseLeave={close}>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "categories" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "categories" ? "rotate-180" : ""}`} />
                </button>

                {openDropdown === "categories" && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-gray-100 p-4 z-50"
                    onMouseEnter={() => open("categories")} onMouseLeave={close}
                  >
                    <Link href="/categories" className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mb-4 group">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Grid3x3 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">Browse All Categories</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>

                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Apps</p>
                        {appCategoryLinks.map(cat => (
                          <Link key={cat.slug} href={`/categories/${cat.slug}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className={`h-5 w-5 ${cat.bg} rounded-md flex items-center justify-center shrink-0`}>
                              <cat.icon className={`h-3 w-3 ${cat.color}`} />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors truncate">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Games</p>
                        {gameCategoryLinks.map(cat => (
                          <Link key={cat.slug} href={`/categories/${cat.slug}`}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
                            <span className="text-sm leading-none w-5 text-center">{cat.emoji}</span>
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-1 ml-auto">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => navigate("/apps")}><Search className="h-5 w-5" /></button>
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <span className="text-lg leading-none">✕</span> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-2 pb-1">Apps</p>
              {[
                { href: "/apps", label: "All Apps" },
                { href: "/apps?featured=true", label: "Featured Apps" },
                { href: "/apps?trending=true", label: "Trending Apps" },
              ].map(link => (
                <Link key={link.href + link.label} href={link.href} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">{link.label}</Link>
              ))}

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1">Games</p>
              <Link href="/games" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">All Games</Link>
              {gameCategoryLinks.slice(0, 4).map(cat => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">{cat.emoji} {cat.name}</Link>
              ))}

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1">Categories</p>
              <Link href="/categories" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Browse All Categories</Link>
              {appCategoryLinks.slice(0, 5).map(cat => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">
                  <div className={`h-5 w-5 ${cat.bg} rounded-md flex items-center justify-center`}>
                    <cat.icon className={`h-3 w-3 ${cat.color}`} />
                  </div>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      <div className="h-[60px]" />
    </>
  );
}
