import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Home } from "@/pages/home";
import { Apps } from "@/pages/apps";
import { Games } from "@/pages/games";
import { AppDetail } from "@/pages/app-detail";
import { Categories } from "@/pages/categories";
import { CategoryDetail } from "@/pages/category-detail";
import { About } from "@/pages/about";
import { Blog } from "@/pages/blog";
import { Contact } from "@/pages/contact";
import { PrivacyPolicy } from "@/pages/privacy-policy";
import { TermsOfService } from "@/pages/terms-of-service";
import { CookiePolicy } from "@/pages/cookie-policy";
import { MainLayout } from "@/components/layout/main-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/apps" component={Apps} />
        <Route path="/apps/:id" component={AppDetail} />
        <Route path="/games" component={Games} />
        <Route path="/categories" component={Categories} />
        <Route path="/categories/:slug" component={CategoryDetail} />
        <Route path="/about" component={About} />
        <Route path="/blog" component={Blog} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
