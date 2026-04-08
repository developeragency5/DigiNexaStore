import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";

interface SearchAutocompleteProps {
  placeholder?: string;
  size?: "lg" | "md" | "sm";
  autoFocus?: boolean;
  onSearch?: (q: string) => void;
  className?: string;
  defaultValue?: string;
}

export function SearchAutocomplete({
  placeholder = "Search apps, games...",
  size = "md",
  autoFocus = false,
  onSearch,
  className = "",
  defaultValue = "",
}: SearchAutocompleteProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setQuery(defaultValue); }, [defaultValue]);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 60);
  }, [autoFocus]);

  const handleSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate(`/apps?search=${encodeURIComponent(trimmed)}`);
    }
  }, [navigate, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch(query);
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
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className={`absolute left-4 ${iconSize[size]} text-gray-400 pointer-events-none shrink-0 z-10`} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
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
    </div>
  );
}
