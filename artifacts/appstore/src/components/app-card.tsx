import { App } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Star } from "lucide-react";

interface AppCardProps {
  app: App;
  variant?: "default" | "compact" | "featured" | "hero";
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className={`flex items-center gap-0.5 ${size === "md" ? "text-sm" : "text-xs"}`}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className={`${size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} ${
            i <= full ? "fill-amber-400 text-amber-400" :
            i === full + 1 && half ? "fill-amber-200 text-amber-400" :
            "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function GetButton({ app, className }: { app: App; className: string }) {
  const [, navigate] = useLocation();
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/apps/${app.id}`); }}
      className={className}
    >
      {app.isFree ? "Get" : `$${app.price}`}
    </button>
  );
}

export function AppCard({ app, variant = "default" }: AppCardProps) {
  if (variant === "hero") {
    return (
      <Link href={`/apps/${app.id}`} className="block group flex-shrink-0 w-[200px]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden p-4 flex flex-col items-center text-center gap-3">
          <img
            src={app.iconUrl}
            alt={app.name}
            className="w-16 h-16 rounded-2xl shadow-sm object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
          />
          <div className="w-full space-y-1">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{app.shortDescription}</p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <StarRating rating={app.rating} />
              <span className="font-medium text-gray-700">{app.rating.toFixed(1)}</span>
            </div>
          </div>
          <GetButton
            app={app}
            className="w-full py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-semibold rounded-full transition-all duration-200"
          />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/apps/${app.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <img
          src={app.iconUrl}
          alt={app.name}
          className="w-12 h-12 rounded-xl shadow-sm object-cover flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{app.name}</h4>
          <p className="text-xs text-gray-500 line-clamp-1">{app.categoryName}</p>
          <StarRating rating={app.rating} />
        </div>
        <GetButton
          app={app}
          className="flex-shrink-0 px-4 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-semibold rounded-full transition-all duration-200"
        />
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/apps/${app.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/20 relative">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-2xl shadow-md border-4 border-white object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
            />
            {app.isFree && (
              <span className="absolute top-3 right-3 text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full">Free</span>
            )}
          </div>
          <div className="pt-10 pb-5 px-5 text-center">
            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{app.developer}</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <StarRating rating={app.rating} />
              <span className="text-xs font-medium text-gray-600">{app.rating.toFixed(1)}</span>
            </div>
            <GetButton
              app={app}
              className="mt-3 w-full py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/apps/${app.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-4">
        <img
          src={app.iconUrl}
          alt={app.name}
          className="w-16 h-16 rounded-2xl shadow-sm object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://img.icons8.com/color/96/smartphone.png"; }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{app.name}</h3>
          <p className="text-xs text-gray-500 line-clamp-1">{app.developer}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={app.rating} size="md" />
            <span className="text-xs font-medium text-gray-600">{app.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right space-y-1.5">
          <GetButton
            app={app}
            className="block px-5 py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm font-semibold rounded-full transition-all duration-200"
          />
          <p className="text-[10px] text-gray-400">{app.categoryName}</p>
        </div>
      </div>
    </Link>
  );
}
