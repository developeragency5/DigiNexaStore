import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { BackButton } from "@/components/ui/back-button";
import { useLocation } from "wouter";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const showBack = location !== "/";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      {/* Sticky back bar — shown on every page except home */}
      {showBack && (
        <div className="sticky top-[60px] z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <BackButton />
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
