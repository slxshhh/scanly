import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Hero } from "./Hero";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 selection:bg-pink-200 selection:text-pink-900">
      <Header />
      
      <main className="flex flex-col">
        <Hero />
        
        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto w-full px-6 -mt-16 relative z-10">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-pink-500/10 p-8 md:p-12 min-h-[600px]">
            {children}
          </div>
        </div>
      </main>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
