import { Link } from "wouter";
import { Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-foreground">
                AppInMe
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover the best apps for iOS and Android. Curated lists, in-depth reviews, and detailed metrics.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/apps" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Apps</Link></li>
              <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/apps?featured=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">Featured</Link></li>
              <li><Link href="/apps?trending=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">Trending</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">For Developers</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Submit App</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Advertising</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Access</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Developer Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AppInMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
