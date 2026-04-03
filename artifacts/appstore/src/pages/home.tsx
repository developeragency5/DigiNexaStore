import { 
  useGetFeaturedApps, 
  useGetTrendingApps, 
  useGetNewApps, 
  useListCategories,
  useGetStatsSummary 
} from "@workspace/api-client-react";
import { AppCard } from "@/components/app-card";
import { CategoryCard } from "@/components/category-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, ShieldCheck, Search, Bell } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function Home() {
  const { data: featuredApps, isLoading: loadingFeatured } = useGetFeaturedApps();
  const { data: trendingApps, isLoading: loadingTrending } = useGetTrendingApps();
  const { data: newApps, isLoading: loadingNew } = useGetNewApps();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: stats } = useGetStatsSummary();
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/3 opacity-30">
          <div className="h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                <span className="text-foreground">Discover what's next</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                The absolute best apps. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Curated for you.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AppVault cuts through the noise of millions of apps to find the beautiful, 
                functional, and transformational tools that deserve a place on your device.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold" asChild>
                  <Link href="/apps">Browse Catalog</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold" asChild>
                  <Link href="/categories">View Categories</Link>
                </Button>
              </div>
              
              {stats && (
                <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground font-medium">
                  <div>
                    <span className="block text-2xl font-bold text-foreground">{stats.totalApps.toLocaleString()}</span>
                    Curated Apps
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-foreground">{stats.totalCategories.toLocaleString()}</span>
                    Categories
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-foreground">{stats.totalDownloads.toLocaleString()}+</span>
                    Downloads
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:ml-auto w-full max-w-lg">
              <div className="bg-card rounded-3xl p-6 shadow-2xl border border-border/50 relative">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur opacity-50 -z-10"></div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    App of the Day
                  </h3>
                </div>
                {loadingFeatured ? (
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                ) : featuredApps?.[0] ? (
                  <AppCard app={featuredApps[0]} variant="featured" />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Row */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Star className="h-8 w-8 text-primary" />
                Featured Collections
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">Handpicked essentials for your daily routine.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/apps?featured=true">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured 
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)
              : featuredApps?.slice(1, 9).map(app => (
                  <AppCard key={app.id} app={app} variant="compact" />
                ))
            }
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-accent" />
                Trending Now
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">The apps everyone is talking about this week.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/apps?trending=true">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {loadingTrending
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[280px] rounded-xl" />)
              : trendingApps?.slice(0, 4).map(app => (
                  <AppCard key={app.id} app={app} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Browse by Category
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">Find exactly what you need, perfectly categorized.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/categories">
                All categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {loadingCategories
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-xl" />)
              : categories?.slice(0, 6).map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))
            }
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Zap className="h-8 w-8 text-primary" />
                Fresh Drops
              </h2>
              <p className="text-muted-foreground mt-2 text-lg">The newest additions to our catalog.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingNew
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[280px] rounded-xl" />)
              : newApps?.slice(0, 3).map(app => (
                  <AppCard key={app.id} app={app} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Why AppVault */}
      <section className="py-20 md:py-28 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Why AppVault?</h2>
            <p className="text-lg text-muted-foreground">We do the hard work so you get only the best apps on your phone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Human Curated</h3>
              <p className="text-muted-foreground leading-relaxed">Every app is hand-reviewed by our expert team. No spam, no malware, no junk — only apps that earn their place.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Smart Discovery</h3>
              <p className="text-muted-foreground leading-relaxed">Find apps you've never heard of but will love instantly. Our discovery engine surfaces hidden gems across every category.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Always Fresh</h3>
              <p className="text-muted-foreground leading-relaxed">New apps added daily. Our catalog stays current so you're always discovering what's trending and what's next.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              <span>Weekly app roundups, delivered</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Never miss a great app again
            </h2>
            <p className="text-lg text-muted-foreground">
              Get our weekly digest of the best new and trending apps — handpicked and delivered straight to your inbox.
            </p>
            <form 
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                data-testid="input-newsletter-email"
                className="flex-1 flex h-12 w-full rounded-full border border-input bg-background px-5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button type="submit" size="lg" className="rounded-full h-12 px-8 font-semibold" data-testid="button-newsletter-subscribe">
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
