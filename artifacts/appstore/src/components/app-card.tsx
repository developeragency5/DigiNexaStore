import { App } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Star, Download, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AppCardProps {
  app: App;
  variant?: "default" | "compact" | "featured";
}

export function AppCard({ app, variant = "default" }: AppCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/apps/${app.id}`} className="block group">
        <Card className="overflow-hidden border-border/50 bg-card transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
          <div className="aspect-[2/1] relative bg-muted overflow-hidden">
            {app.screenshotUrls?.[0] ? (
              <img 
                src={app.screenshotUrls[0]} 
                alt={`${app.name} screenshot`} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
              <img 
                src={app.iconUrl} 
                alt={app.name} 
                className="w-16 h-16 rounded-xl shadow-md border-2 border-white/10"
              />
              <div className="flex-1 text-white">
                <h3 className="font-bold text-xl line-clamp-1">{app.name}</h3>
                <p className="text-white/80 text-sm line-clamp-1">{app.developer}</p>
              </div>
            </div>
            {app.isFree && (
              <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-none">
                Free
              </Badge>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/apps/${app.id}`} className="block group">
        <Card className="border-border/50 hover:bg-muted/50 transition-colors p-3 flex gap-4 items-center">
          <img 
            src={app.iconUrl} 
            alt={app.name} 
            className="w-14 h-14 rounded-xl shadow-sm object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{app.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{app.categoryName}</p>
            <div className="flex items-center gap-3 mt-1 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                {app.rating.toFixed(1)}
              </span>
              <span>{app.isFree ? "Free" : `$${app.price}`}</span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/apps/${app.id}`} className="block group h-full">
      <Card className="h-full border-border/50 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col bg-card">
        <CardContent className="p-5 flex flex-col h-full gap-4">
          <div className="flex items-start gap-4">
            <img 
              src={app.iconUrl} 
              alt={app.name} 
              className="w-16 h-16 rounded-2xl shadow-sm object-cover group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {app.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{app.developer}</p>
            </div>
          </div>
          
          <p className="text-sm text-foreground/80 line-clamp-2 mt-1 flex-1">
            {app.shortDescription}
          </p>
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
            <Badge variant="secondary" className="font-medium bg-secondary text-secondary-foreground hover:bg-secondary">
              {app.categoryName}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              {app.rating.toFixed(1)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
