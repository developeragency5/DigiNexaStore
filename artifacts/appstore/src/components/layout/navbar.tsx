import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Smartphone, Search, X, Menu, ChevronDown,
  Gamepad2, Grid3x3, Star, TrendingUp, Zap,
  Music, Camera, Briefcase, GraduationCap, HeartPulse,
  ShoppingBag, MessageCircle, DollarSign, Map, Utensils
} from "lucide-react";

const appCategoryLinks = [
  { name: "Productivity", slug: "productivity", icon: Briefcase },
  { name: "Health & Fitness", slug: "health-fitness", icon: HeartPulse },
  { name: "Education", slug: "education", icon: GraduationCap },
  { name: "Photography", slug: "photography", icon: Camera },
  { name: "Music", slug: "music", icon: Music },
  { name: "Finance", slug: "finance", icon: DollarSign },
  { name: "Shopping", slug: "shopping", icon: ShoppingBag },
  { name: "Social", slug: "social", icon: MessageCircle },
  { name: "Travel", slug: "travel", icon: Map },
  { name: "Food & Drink", slug: "food-drink", icon: Utensils },
];

const gameCategoryLinks = [
  { name: "Action", slug: "action-games" },
  { name: "Puzzle", slug: "puzzle-games" },
  { name: "Strategy", slug: "strategy-games" },
  { name: "Sports", slug: "sports-games" },
  { name: "Racing", slug: "racing-games" },
  { name: "Arcade", slug: "arcade-games" },
  { name: "RPG", slug: "rpg-games" },
  { name: "Casual", slug: "casual-games" },
];

export function Navbar() {
  const [location, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  const handleMouseEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/apps?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? "shadow-[0_2px_16px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[60px] gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Smartphone className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                App<span className="text-primary">Vault</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5 ml-4 flex-1">
              {/* Apps */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("apps")} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "apps" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Apps <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "apps" ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === "apps" && (
                  <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50" onMouseEnter={() => handleMouseEnter("apps")} onMouseLeave={handleMouseLeave}>
                    <div className="px-3 pt-1 pb-1.5"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Discover</p></div>
                    {[
                      { href: "/apps", icon: <Star className="h-3.5 w-3.5 text-primary" />, label: "All Apps", bg: "bg-primary/10" },
                      { href: "/apps?featured=true", icon: <Star className="h-3.5 w-3.5 text-amber-500" />, label: "Featured", bg: "bg-amber-50" },
                      { href: "/apps?trending=true", icon: <TrendingUp className="h-3.5 w-3.5 text-orange-500" />, label: "Trending Now", bg: "bg-orange-50" },
                      { href: "/apps", icon: <Zap className="h-3.5 w-3.5 text-blue-500" />, label: "New Releases", bg: "bg-blue-50" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <div className={`h-7 w-7 ${item.bg} rounded-lg flex items-center justify-center`}>{item.icon}</div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                      <div className="px-3 pb-1"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Categories</p></div>
                      {appCategoryLinks.slice(0, 5).map(cat => (
                        <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                          <cat.icon className="h-3.5 w-3.5 text-gray-400" /> {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Games */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("games")} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "games" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Games <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "games" ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === "games" && (
                  <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50" onMouseEnter={() => handleMouseEnter("games")} onMouseLeave={handleMouseLeave}>
                    <div className="px-3 pt-1 pb-1.5"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Browse Games</p></div>
                    <Link href="/games" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      <div className="h-7 w-7 bg-primary/10 rounded-lg flex items-center justify-center"><Gamepad2 className="h-3.5 w-3.5 text-primary" /></div>
                      <span className="font-medium">All Games</span>
                    </Link>
                    <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                      <div className="px-3 pb-1"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Genres</p></div>
                      {gameCategoryLinks.map(cat => (
                        <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">{cat.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="relative" onMouseEnter={() => handleMouseEnter("categories")} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${openDropdown === "categories" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === "categories" ? "rotate-180" : ""}`} />
                </button>
                {openDropdown === "categories" && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50" onMouseEnter={() => handleMouseEnter("categories")} onMouseLeave={handleMouseLeave}>
                    <div className="px-3 pt-1 pb-1.5"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">All Categories</p></div>
                    <Link href="/categories" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
                      <Grid3x3 className="h-4 w-4" /> View All Categories
                    </Link>
                    <div className="border-t border-gray-100 mt-1.5 pt-1.5 grid grid-cols-2">
                      {appCategoryLinks.map(cat => (
                        <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors truncate">{cat.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center ml-auto">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input ref={searchInputRef} type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search apps, games..." className="pl-9 pr-4 py-2 w-64 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all" />
                  </div>
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"><X className="h-4 w-4" /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 pl-3 pr-5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-500 transition-colors">
                  <Search className="h-4 w-4" /> Search apps, games...
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-1 ml-auto">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => navigate("/apps")}><Search className="h-5 w-5" /></button>
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <form onSubmit={(e) => { e.preventDefault(); if(searchQuery.trim()) { navigate(`/apps?search=${encodeURIComponent(searchQuery.trim())}`); setMobileOpen(false); setSearchQuery(""); } }} className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search apps, games..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </form>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 pt-2">Apps</p>
              <Link href="/apps" className="block px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-xl">All Apps</Link>
              <Link href="/apps?featured=true" className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">Featured Apps</Link>
              <Link href="/apps?trending=true" className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">Trending Apps</Link>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 pt-3">Games</p>
              <Link href="/games" className="block px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-xl">All Games</Link>
              {gameCategoryLinks.slice(0, 4).map(cat => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl">{cat.name} Games</Link>
              ))}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 pt-3">Browse</p>
              <Link href="/categories" className="block px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 rounded-xl">All Categories</Link>
            </div>
          </div>
        )}
      </header>
      <div className="h-[60px]" />
    </>
  );
}
