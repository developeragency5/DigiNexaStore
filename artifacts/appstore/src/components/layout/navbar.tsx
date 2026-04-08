import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Menu, ChevronDown, ArrowRight, X,
  Gamepad2, Grid3x3, Star, TrendingUp, Zap,
  Music, Camera, Briefcase, GraduationCap, HeartPulse,
  Tv, MessageCircle, DollarSign, Map, Utensils
} from "lucide-react";

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
  const [navQuery, setNavQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileSearchOpen(false);
  }, [location]);

  const open = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };
  const close = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navQuery.trim();
    if (q) {
      navigate(`/apps?search=${encodeURIComponent(q)}`);
      setNavQuery("");
      navInputRef.current?.blur();
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = navQuery.trim();
    if (q) {
      navigate(`/apps?search=${encodeURIComponent(q)}`);
      setNavQuery("");
      setMobileSearchOpen(false);
    }
  };

  const openMobileSearch = () => {
    setMobileSearchOpen(true);
    setMobileOpen(false);
    setTimeout(() => mobileInputRef.current?.focus(), 80);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.06)]"
            : "bg-white border-b border-gray-100/80"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-3">

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 shrink-0 group cursor-pointer"
            >
              <img src="/logo-mark.png" alt="App US logo" width="36" height="36" className="group-hover:scale-105 transition-transform shrink-0 object-contain" />
              <span className="font-bold text-xl tracking-tight text-gray-900">App <span className="text-primary relative top-0.5">US</span></span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 ml-2">

              {/* ── Apps ── */}
              <div className="relative" onMouseEnter={() => open("apps")} onMouseLeave={close}>
                <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "apps" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Apps <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "apps" ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === "apps" && (
                  <div className="absolute top-full left-0 mt-2 w-[460px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)] z-50 overflow-hidden" onMouseEnter={() => open("apps")} onMouseLeave={close}>
                    <div className="grid grid-cols-2 gap-0">
                      <div className="p-4 border-r border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Collections</p>
                        <div className="space-y-0.5">
                          {appsCollectionLinks.map(item => (
                            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                              <div className={`h-8 w-8 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
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
                      <div className="p-4">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Categories</p>
                        <div className="space-y-0.5">
                          {appCategoryLinks.slice(0, 6).map(cat => (
                            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors group">
                              <div className={`h-6 w-6 ${cat.bg} rounded-lg flex items-center justify-center shrink-0`}>
                                <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors font-medium">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                        <Link href="/categories" className="mt-2.5 flex items-center gap-1 px-2.5 text-xs font-semibold text-primary hover:underline">
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
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)] p-4 z-50" onMouseEnter={() => open("games")} onMouseLeave={close}>
                    <Link href="/games" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors mb-4 group">
                      <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">All Games</p>
                        <p className="text-xs text-gray-400">Browse every game</p>
                      </div>
                    </Link>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Browse by Genre</p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {gameCategoryLinks.map(cat => (
                        <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group">
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
                  <div className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)] p-4 z-50" onMouseEnter={() => open("categories")} onMouseLeave={close}>
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
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Apps</p>
                        {appCategoryLinks.map(cat => (
                          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
                            <div className={`h-5 w-5 ${cat.bg} rounded-md flex items-center justify-center shrink-0`}>
                              <cat.icon className={`h-3 w-3 ${cat.color}`} />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors truncate">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">Games</p>
                        {gameCategoryLinks.map(cat => (
                          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
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

            {/* ── Desktop Search Bar ── */}
            <form onSubmit={handleNavSearch} className="hidden md:flex items-center ml-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  ref={navInputRef}
                  type="text"
                  value={navQuery}
                  onChange={e => setNavQuery(e.target.value)}
                  placeholder="Search apps & games..."
                  className="pl-9 pr-8 py-2 w-56 xl:w-72 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all duration-200"
                />
                {navQuery && (
                  <button
                    type="button"
                    onClick={() => { setNavQuery(""); navInputRef.current?.focus(); }}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-1 ml-auto">
              <button
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={openMobileSearch}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => { setMobileOpen(!mobileOpen); setMobileSearchOpen(false); }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3">
            <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={navQuery}
                  onChange={e => setNavQuery(e.target.value)}
                  placeholder="Search apps & games..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all"
                />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shrink-0">
                Search
              </button>
              <button type="button" onClick={() => { setMobileSearchOpen(false); setNavQuery(""); }} className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && !mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-2 pb-1">Apps</p>
              {[
                { href: "/apps", label: "All Apps" },
                { href: "/apps?featured=true", label: "Featured Apps" },
                { href: "/apps?trending=true", label: "Trending Apps" },
              ].map(link => (
                <Link key={link.href + link.label} href={link.href} className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">{link.label}</Link>
              ))}

              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1">Games</p>
              <Link href="/games" className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">All Games</Link>
              {gameCategoryLinks.slice(0, 4).map(cat => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">{cat.emoji} {cat.name}</Link>
              ))}

              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pt-4 pb-1">Categories</p>
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
