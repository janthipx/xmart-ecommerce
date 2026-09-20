"use client";

import { Category } from "@/types";
import { useTranslation, getCategoryName } from "@/lib/i18n";
import Link from "next/link";
import { CategoryIcon } from "@/components/icons";

export function CategoryNav({ categories }: { categories: Category[] }) {
    const { language } = useTranslation();

    // Prioritize 10 prominent categories for the 2-row x 5-column showcase grid
    const targetOrder = [
        'cat1',  // อาหาร
        'cat17', // ของสดและอาหารแช่แข็ง
        'cat2',  // เครื่องดื่ม
        'cat3',  // ขนม
        'cat5',  // ของใช้ในบ้าน
        'cat8',  // สุขภาพและความงาม
        'cat4',  // ของใช้ส่วนตัว
        'cat9',  // แม่และเด็ก
        'cat6',  // เครื่องใช้ไฟฟ้า
        'cat7',  // แฟชั่น
    ];

    const displayCategories = targetOrder
        .map(id => categories.find(c => c.id === id))
        .filter((c): c is Category => c !== undefined);

    // Fallback if less than 10 found
    const finalCategories = displayCategories.length >= 10
        ? displayCategories
        : categories.slice(0, 10);

    return (
        <section className="w-full mb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900">
                        {language === 'en' ? 'Product Categories' : 'หมวดหมู่สินค้า'}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 hidden sm:block">
                        {language === 'en' ? 'Explore curated goods from all departments' : 'เลือกชมสินค้าตามหมวดหมู่ที่คุณต้องการ'}
                    </p>
                </div>
                <Link
                    href="/products"
                    className="text-xs sm:text-sm font-bold text-[#0060df] hover:underline flex items-center gap-1 shrink-0"
                >
                    <span>{language === 'en' ? 'View all' : 'ดูทั้งหมด'}</span>
                    <span>→</span>
                </Link>
            </div>

            {/* 10 Category Grid matching mockup (5 columns on desktop, 3 on tablet, 2 on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                {finalCategories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="bg-white border border-zinc-200/90 hover:border-blue-300 hover:bg-blue-50/30 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center transition-all shadow-2xs hover:shadow-md group cursor-pointer"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50/80 rounded-full flex items-center justify-center mb-2.5 text-[#004bb5] group-hover:scale-110 transition-transform">
                            <CategoryIcon icon={cat.icon} slug={cat.slug} name={cat.name} className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-zinc-800 truncate max-w-full text-center leading-snug group-hover:text-[#0060df]">
                            {getCategoryName(cat, language)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
