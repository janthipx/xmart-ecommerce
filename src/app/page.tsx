import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryNav } from "@/components/home/CategoryNav";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { HomeProductsSection } from "@/components/home/HomeProductsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto fade-in pt-4 sm:pt-6 pb-20 md:pb-14 px-4 sm:px-6 lg:px-8">
          {/* Hero Banner with 4 Service Cards */}
          <HeroBanner />

          {/* 10 Category Grid with Header & View All */}
          <CategoryNav categories={mockCategories} />

          {/* Curated Products Section: Two-Column Showcase + More Deals */}
          <HomeProductsSection initialProducts={mockProducts} />
        </div>
      </main>
    </div>
  );
}
