"use client";
import { Product, Order } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { productsStorage, ordersStorage } from "@/lib/storage/helpers";
import { getBestSellingProducts } from "@/lib/order-analytics";
import { useTranslation } from "@/lib/i18n";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FlameIcon, SparklesIcon } from "@/components/icons";

export function HomeProductsSection({ initialProducts }: { initialProducts: Product[] }) {
    const { language } = useTranslation();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        setProducts(productsStorage.getAll(initialProducts));
        setOrders(ordersStorage.getAll());

        const handleSync = () => {
            setOrders(ordersStorage.getAll());
            setProducts(productsStorage.getAll(initialProducts));
        };
        window.addEventListener('xmart_storage_sync', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('xmart_storage_sync', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [initialProducts]);

    // 1. Best Sellers for Two-Column Section (Exactly 4 items)
    const topBestSellers = useMemo(() => {
        const list = getBestSellingProducts(products, orders, 4);
        if (list.length >= 4) return list;
        // Fallback to top products if orders don't have enough data yet
        const existingIds = new Set(list.map(i => i.product.id));
        const fallbackProducts = products.filter(p => !existingIds.has(p.id) && p.status !== 'HIDDEN');
        const combined = [...list];
        for (const p of fallbackProducts) {
            if (combined.length >= 4) break;
            combined.push({
                product: p,
                totalSold: 10,
                revenue: p.price * 10,
                rank: combined.length + 1
            });
        }
        return combined;
    }, [products, orders]);

    // 2. Promotions
    const promotions = useMemo(() => {
        return products.filter(p => p.isPromotion && p.status !== 'HIDDEN').slice(0, 8);
    }, [products]);

    // 3. Recommended Products
    const recommended = useMemo(() => {
        return products.filter(p => ['cat1', 'cat2', 'cat3', 'cat5', 'cat8'].includes(p.categoryId) && !p.isPromotion).slice(0, 8);
    }, [products]);

    return (
        <div className="space-y-12">
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* TWO-COLUMN SECTION: LEFT = สินค้าขายดี (4 Cards) | RIGHT = โปรโมชั่น Banner */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column (Desktop 8 cols): สินค้าขายดี */}
                <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full shadow-xs">
                                <span>{language === 'en' ? 'Best Sellers' : 'สินค้าขายดี'}</span>
                            </div>
                            <Link
                                href="/best-selling"
                                className="text-xs sm:text-sm font-bold text-red-600 hover:underline flex items-center gap-1"
                            >
                                <span>{language === 'en' ? 'View all' : 'ดูทั้งหมด'}</span>
                                <span>→</span>
                            </Link>
                        </div>

                        {/* 4 Product Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                            {topBestSellers.map((item) => (
                                <ProductCard
                                    key={item.product.id}
                                    product={item.product}
                                    rank={item.rank}
                                    isBestSeller={true}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Desktop 4 cols): โปรโมชั่น Banner Card */}
                <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full shadow-xs">
                            <span>{language === 'en' ? 'Promotions' : 'โปรโมชั่น'}</span>
                        </div>
                        <Link
                            href="/promotions"
                            className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                            <span>{language === 'en' ? 'View all' : 'ดูทั้งหมด'}</span>
                            <span>→</span>
                        </Link>
                    </div>

                    {/* Promo Banner Card Matching Mockup */}
                    <div className="w-full flex-1 min-h-[340px] bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
                        {/* Decorative Circles */}
                        <div className="absolute right-[-20%] bottom-[-20%] w-48 h-48 border-[20px] border-white/15 rounded-full pointer-events-none"></div>
                        <div className="absolute left-[-15%] top-[-15%] w-36 h-36 border-[16px] border-white/15 rounded-full pointer-events-none"></div>

                        {/* Text Header */}
                        <div className="relative z-10">
                            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider bg-white/25 text-white px-3 py-1 rounded-full inline-block mb-3">
                                SPECIAL OFFER
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white drop-shadow-xs">
                                {language === 'en' ? 'Household Deals' : 'ของใช้ในบ้าน ลดพิเศษ'}
                            </h3>
                            <p className="text-xs sm:text-sm text-cyan-50 font-medium mt-1.5 drop-shadow-xs">
                                {language === 'en' ? 'Clean & Worthy for every household' : 'สะอาด คุ้มค่า ทุกครัวเรือน'}
                            </p>
                        </div>

                        {/* Center Graphic: SVG Household & Cleaning Visual */}
                        <div className="relative z-10 flex items-center justify-center my-4 py-2 select-none pointer-events-none">
                            <svg className="w-40 h-32 drop-shadow-lg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Detergent Bottle */}
                                <rect x="30" y="40" width="38" height="65" rx="8" fill="#FFFFFF" />
                                <rect x="42" y="24" width="14" height="18" rx="3" fill="#38BDF8" />
                                <rect x="40" y="18" width="18" height="8" rx="2" fill="#004bb5" />
                                <circle cx="49" cy="72" r="10" fill="#E0F2FE" />
                                <path d="M45 72 L48 75 L54 68" stroke="#004bb5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                                {/* Spray Bottle */}
                                <rect x="85" y="48" width="36" height="57" rx="7" fill="#F0F9FF" />
                                <path d="M96 28 H110 V48 H96 Z" fill="#38BDF8" />
                                <path d="M90 28 H120 L115 36 H96 Z" fill="#004bb5" />
                                <path d="M80 34 H92" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

                                {/* Sparkles */}
                                <path d="M135 25 L137 31 L143 33 L137 35 L135 41 L133 35 L127 33 L133 31 Z" fill="#FEF08A" />
                                <path d="M22 25 L23.5 29 L27.5 30.5 L23.5 32 L22 36 L20.5 32 L16.5 30.5 L20.5 29 Z" fill="#FFFFFF" />
                                <path d="M125 80 L126.5 83 L129.5 84.5 L126.5 86 L125 89 L123.5 86 L120.5 84.5 L123.5 83 Z" fill="#FEF08A" />
                            </svg>
                        </div>

                        {/* CTA Link */}
                        <div className="relative z-10">
                            <Link
                                href="/promotions"
                                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#004bb5] font-bold text-sm px-6 py-2.5 rounded-full shadow-md transition-all active:scale-98"
                            >
                                <span>{language === 'en' ? 'Shop now' : 'ช้อปเลย'}</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 2: สินค้าโปรโมชั่นพิเศษ (More Deals)                              */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {promotions.length > 0 && (
                <section className="bg-gradient-to-b from-red-50/50 to-transparent p-4 sm:p-6 rounded-3xl border border-red-100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded-full mb-1">
                                <FlameIcon className="w-3.5 h-3.5" />
                                <span>HOT DEALS & DISCOUNTS</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
                                <span>{language === 'en' ? 'Special Promotions' : 'สินค้าโปรโมชั่นพิเศษ'}</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                                {language === 'en' ? 'Exclusive discounts, free 24/7 delivery nationwide' : 'รวมสินค้าราคาพิเศษลดสูงสุด ส่งฟรีไม่มีขั้นต่ำ 24 ชม.'}
                            </p>
                        </div>
                        <Link
                            href="/promotions"
                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-red-600 bg-white hover:bg-red-50 border border-red-200 px-4 py-2 rounded-full transition-all shadow-2xs shrink-0 cursor-pointer"
                        >
                            <span>{language === 'en' ? 'View all' : 'ดูทั้งหมด'}</span>
                            <span>→</span>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {promotions.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* SECTION 3: สินค้าแนะนำสำหรับคุณ (Recommended)                             */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <section className="bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full mb-1">
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span>CURATED SELECTION</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
                            <span>{language === 'en' ? 'Recommended for You' : 'สินค้าแนะนำสำหรับคุณ'}</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                            {language === 'en' ? 'Handpicked quality products from top brands' : 'คัดสรรสินค้าคุณภาพ คุ้มค่า จากแบรนด์ชั้นนำ'}
                        </p>
                    </div>
                    <Link href="/products" className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0060df] hover:underline shrink-0">
                        <span>{language === 'en' ? 'View all' : 'ดูทั้งหมด'}</span>
                        <span>→</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {recommended.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
}
