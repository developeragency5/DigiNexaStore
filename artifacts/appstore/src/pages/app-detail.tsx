import { useParams, Link } from "wouter";
import { useGetApp, useListApps, getGetAppQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Share, ChevronLeft, Apple, Play, Globe, Shield, Clock } from "lucide-react";
import { AppCard } from "@/components/app-card";
import { format } from "date-fns";

export function AppDetail() {
  const { id } = useParams();
  const appId = id ? parseInt(id, 10) : 0;
  
  const { data: app, isLoading } = useGetApp(appId, {
    query: {
      enabled: !!appId,
      queryKey: getGetAppQueryKey(appId)
    }
  });

  // Fetch related apps in the same category
  const { data: relatedApps, isLoading: loadingRelated } = useListApps(
    { category: app?.categorySlug, limit: 4 },
    { query: { enabled: !!app?.categorySlug } }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-3xl shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-48 mt-4" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">App not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The app you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/apps">Browse Apps</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <div className="border-b bg-card/50 backdrop-blur-md sticky top-16 z-40 hidden md:block">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-4">
            <img src={app.iconUrl} alt={app.name} className="w-8 h-8 rounded-md" />
            <span className="font-semibold">{app.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">{app.isFree ? "Free" : `$${app.price}`}</span>
            <Button size="sm" className="rounded-full px-6">Get App</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link href="/apps" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to apps
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-12">
          <img 
            src={app.iconUrl} 
            alt={`${app.name} icon`} 
            className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] shadow-xl border border-border/50 shrink-0"
          />
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="bg-secondary/50">{app.categoryName}</Badge>
              {app.featured && <Badge className="bg-primary text-primary-foreground border-none">Featured</Badge>}
              {app.trending && <Badge className="bg-accent text-accent-foreground border-none">Trending</Badge>}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground leading-tight">
              {app.name}
            </h1>
            <p className="text-xl text-primary font-medium mb-4">{app.developer}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">{app.rating.toFixed(1)}</span>
                <div className="flex text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <span className="ml-1">({app.reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="h-5 w-5" />
                <span className="font-medium text-foreground">{app.downloadCount.toLocaleString()}+</span>
                <span>Downloads</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {app.appStoreUrl && (
                <Button size="lg" className="rounded-full px-8 h-14 flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <Apple className="h-6 w-6" />
                  <div className="text-left flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase opacity-80 font-medium">Download on the</span>
                    <span className="text-base font-bold">App Store</span>
                  </div>
                </Button>
              )}
              {app.playStoreUrl && (
                <Button size="lg" className="rounded-full px-8 h-14 flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                  <Play className="h-5 w-5 fill-current" />
                  <div className="text-left flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase opacity-80 font-medium">GET IT ON</span>
                    <span className="text-base font-bold">Google Play</span>
                  </div>
                </Button>
              )}
              {!app.appStoreUrl && !app.playStoreUrl && (
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold">
                  {app.isFree ? "Download Free" : `Buy for $${app.price}`}
                </Button>
              )}
              <Button size="icon" variant="outline" className="h-14 w-14 rounded-full">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Screenshots */}
        {app.screenshotUrls && app.screenshotUrls.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory scrollbar-hide">
              {app.screenshotUrls.map((url, i) => (
                <div key={i} className="shrink-0 snap-center">
                  <img 
                    src={url} 
                    alt={`Screenshot ${i+1}`} 
                    className="h-96 md:h-[500px] w-auto rounded-2xl border border-border shadow-md object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">About this app</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-foreground/90">
                {app.fullDescription ? (
                  <div dangerouslySetInnerHTML={{__html: app.fullDescription.replace(/\n/g, '<br/>')}} />
                ) : (
                  <p>{app.description}</p>
                )}
              </div>
            </section>

            {app.releaseNotes && (
              <section>
                <h2 className="text-2xl font-bold mb-4">What's New</h2>
                <div className="bg-muted/40 rounded-2xl p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Version {app.version || "Latest"}</span>
                    <span className="text-sm text-muted-foreground">
                      {app.updatedAt ? format(new Date(app.updatedAt), "MMMM d, yyyy") : "Recently updated"}
                    </span>
                  </div>
                  <p className="text-foreground/80">{app.releaseNotes}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border shadow-sm">
              <h3 className="font-bold text-lg mb-4">Information</h3>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Provider</dt>
                  <dd className="font-medium text-right text-primary">{app.developer}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Size</dt>
                  <dd className="font-medium text-right">{app.size || "Varies by device"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium text-right">{app.categoryName}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Compatibility</dt>
                  <dd className="font-medium text-right max-w-[120px] truncate">{app.requirements || "Varies by device"}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Age Rating</dt>
                  <dd className="font-medium text-right">4+</dd>
                </div>
              </dl>

              <div className="mt-6 space-y-3">
                {app.website && (
                  <a href={app.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-primary hover:underline">
                    <Globe className="h-4 w-4" /> Developer Website
                  </a>
                )}
                {app.privacyPolicyUrl && (
                  <a href={app.privacyPolicyUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-medium text-primary hover:underline">
                    <Shield className="h-4 w-4" /> Privacy Policy
                  </a>
                )}
              </div>
            </div>

            {app.tags && app.tags.length > 0 && (
              <div>
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="font-normal text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Apps */}
        {(!loadingRelated && relatedApps && relatedApps.length > 1) && (
          <div className="mt-20 pt-10 border-t">
            <h2 className="text-2xl font-bold mb-6">More from {app.categoryName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedApps.filter(a => a.id !== app.id).slice(0, 3).map(relatedApp => (
                <AppCard key={relatedApp.id} app={relatedApp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
