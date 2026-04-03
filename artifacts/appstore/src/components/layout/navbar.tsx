import { Link } from "wouter";
import { Search, Compass, Grid, Menu, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-foreground">
              AppInMe
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/apps" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Compass className="h-4 w-4" />
              Discover
            </Link>
            <Link href="/categories" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Grid className="h-4 w-4" />
              Categories
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm hidden md:flex items-center relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search apps..."
              className="flex h-9 w-full rounded-md border border-input bg-muted/50 px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Button variant="outline" className="hidden md:flex">Log in</Button>
          <Button className="hidden md:flex">Sign up</Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
