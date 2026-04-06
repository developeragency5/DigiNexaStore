import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X, Smartphone, Gamepad2, TrendingUp, ArrowUpRight } from "lucide-react";
import { useListApps } from "@workspace/api-client-react";

interface SearchAutocompleteProps {
  placeholder?: string;
  size?: "lg" | "md" | "sm";
  autoFocus?: boolean;
  onSearch?: (q: string) => void;
  className?: string;
  defaultValue?: string;
}

export function SearchAutocomplete({
  placeholder = "Search apps, games, developers...",
  size = "md",
  autoFocus = false,
  onSearch,
  className = "",
  defaultValue = "",
}: SearchAutocompleteProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: allApps } = useListApps({ limit: 500 } as any);

  useEffect(() => { setQuery(defaultValue); }, [defaultValue]);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 60);
  }, [autoFocus]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions = query.trim().length >= 1
    ? (allApps ?? [])
        .filter(app => {
          const q = query.toLowerCase();
          return (
            app.name?.toLowerCase().includes(q) ||
            (app as any).developer?.toLowerCase().includes(q) ||
            (app as any).category?.toLowerCase().includes(q)
          );
        })
        .slice(0, 7)
    : [];

  const trendingApps = (allApps ?? [])
    .filter(a => (a as any).isTrending || (a as any).isFeatured)
    .slice(0, 5);

  const handleSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/apps?search=${encodeURIComponent(trimmed)}`);
    }
  }, [navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") setOpen(false);
  };

  const sizeClasses = {
    lg: "py-4 pl-5 pr-16 text-base",
    md: "py-3 pl-4 pr-12 text-sm",
    sm: "py-2 pl-3 pr-10 text-sm",
  };

  const iconSize = {
    lg: "h-5 w-5",
    md: "h-4 w-4",
    sm: "h-4 w-4",
  };

  const btnClasses = {
    lg: "px-6 py-3 text-sm font-semibold",
    md: "px-4 py-2 text-sm font-medium",
    sm: "px-3 py-1.5 text-xs font-medium",
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className={`absolute left-4 ${iconSize[size]} text-gray-400 pointer-events-none shrink-0 z-10`} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full ${sizeClasses[size]} pl-10
            bg-white border-2 border-gray-200 rounded-2xl
            focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10
            text-gray-900 placeholder:text-gray-400
            transition-all shadow-sm
            [&::-webkit-search-cancel-button]:hidden
          `}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-[100px] p-1.5 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSearch(query)}
          className={`absolute right-2 ${btnClasses[size]} bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-95 transition-all shrink-0`}
        >
          Search
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] z-50 overflow-hidden">
          {suggestions.length > 0 ? (
            <>
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Results</p>
              </div>
              {suggestions.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onMouseDown={() => navigate(`/apps/${app.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={(app as any).iconUrl}
                    alt={app.name}
                    className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-sm"
                    onError={e => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{app.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {(app as any).developer || (app as any).category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {(app as any).appType === "game"
                      ? <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded-md"><Gamepad2 className="h-3 w-3" />Game</span>
                      : <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 bg-primary/10 text-primary rounded-md"><Smartphone className="h-3 w-3" />App</span>
                    }
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-300" />
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <button
                  onMouseDown={() => handleSearch(query)}
                  className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search all results for "{query}"
                </button>
              </div>
            </>
          ) : query.trim().length >= 1 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No results for <strong>"{query}"</strong></p>
              <p className="text-xs text-gray-400 mt-1">Try a different name or browse by category</p>
            </div>
          ) : trendingApps.length > 0 ? (
            <>
              <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trending Now</p>
              </div>
              {trendingApps.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onMouseDown={() => navigate(`/apps/${app.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <img
                    src={(app as any).iconUrl}
                    alt={app.name}
                    className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-sm"
                    onError={e => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{app.name}</p>
                    <p className="text-xs text-gray-400 truncate">{(app as any).developer || (app as any).category}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                </button>
              ))}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
