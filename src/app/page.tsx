import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/home/CategoryNav";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { HomeProductsSection } from "@/components/home/HomeProductsSection";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full bg-gradient-to-r from-xmart-primary-dark via-xmart-primary to-xmart-primary-light text-white py-2 px-4 text-center text-xs font-semibold tracking-wide">
          🎉 ส่งฟรีทุกคำสั่งซื้อ ไม่มีขั้นต่ำ! สินค้าลดราคาสูงสุด 30% เปิดบริการ 24 ชั่วโมง
        </div>

        <div className="w-full max-w-7xl mx-auto fade-in pt-3 md:pt-6 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          <div className="mb-8">
            <div className="w-full min-h-[14rem] md:h-72 bg-gradient-to-br from-xmart-primary to-blue-500 rounded-3xl flex items-center justify-between p-6 sm:p-10 md:p-12 shadow-xl overflow-hidden relative group">
              <div className="z-10 text-white max-w-xl">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-200 block mb-2">⚡ ยินดีต้อนรับสู่ X MART</span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
                  X MART
                </h1>
                <p className="text-base sm:text-xl text-blue-100 font-medium mb-6 leading-snug">
                  ซูเปอร์มาร์เก็ต & ช้อปปิ้งออนไลน์ 24 ชม. ส่งฟรีทุกคำสั่งซื้อ ไม่มีขั้นต่ำ
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/products" className="inline-flex items-center gap-2 font-bold text-sm sm:text-base bg-white text-[#0060df] px-5 sm:px-6 py-3 rounded-full shadow-lg hover:bg-blue-50 transition-all min-h-[44px]">
                    ช้อปเลย →
                  </Link>
                  <Link href="/promotions" className="inline-flex items-center gap-2 font-bold text-sm sm:text-base bg-red-500 text-white px-5 sm:px-6 py-3 rounded-full hover:bg-red-600 transition-all shadow-lg min-h-[44px]">
                    🔥 โปรโมชั่นพิเศษ
                  </Link>
                  <Link href="/best-selling" className="inline-flex items-center gap-2 font-bold text-sm sm:text-base bg-white/20 text-white px-5 sm:px-6 py-3 rounded-full backdrop-blur-md hover:bg-white/30 transition-all min-h-[44px]">
                    ⭐ สินค้าขายดี
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block text-9xl opacity-25 group-hover:scale-110 transition-transform duration-700 select-none pr-6">🛒</div>
              <div className="absolute right-[-15%] top-[-30%] w-72 h-72 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
              <div className="absolute right-[15%] bottom-[-40%] w-56 h-56 border-[20px] border-white/10 rounded-full pointer-events-none"></div>
            </div>
          </div>

          {/* Category Nav Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900">หมวดหมู่สินค้า</h2>
              <p className="text-sm text-zinc-500 mt-0.5">เลือกชมสินค้าตามหมวดหมู่ที่คุณต้องการ (ครบทั้ง 17 หมวดหมู่)</p>
            </div>
            <Link href="/products" className="text-sm sm:text-base font-bold text-[#0060df] hover:underline flex items-center gap-1">
              <span>ดูทั้งหมด</span>
              <span>→</span>
            </Link>
          </div>
          <CategoryNav categories={mockCategories} />

          {/* Curated Products Sections */}
          <div className="mt-10">
            <HomeProductsSection initialProducts={mockProducts} />
          </div>
        </div>
      </main>
    </>
  );
}
