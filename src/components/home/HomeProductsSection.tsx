"use client";
import { Product, Order } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { productsStorage, ordersStorage } from "@/lib/storage/helpers";
import { getBestSellingProducts } from "@/lib/order-analytics";
import { useTranslation } from "@/lib/i18n";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export function HomeProductsSection({ initialProducts }: { initialProducts: Product[] }) {
    const { language, t } = useTranslation();
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

    // 1. Promotions (isPromotion === true)
    const promotions = useMemo(() => {
        return products.filter(p => p.isPromotion && p.status !== 'HIDDEN').slice(0, 8);
    }, [products]);

    // 2. Best Sellers from Single Source of Truth
    const bestSellerItems = useMemo(() => {
        return getBestSellingProducts(products, orders, 8);
    }, [products, orders]);

    // 3. Recommended Products
    const recommended = useMemo(() => {
        return products.filter(p => ['cat6', 'cat7', 'cat8', 'cat13'].includes(p.categoryId) && !p.isPromotion).slice(0, 8);
    }, [products]);

    return (
        <div className="space-y-12 px-4">
            {/* 1. สินค้าโปรโมชั่นพิเศษ (Special Promotions) */}
            {promotions.length > 0 && (
                <section className="bg-gradient-to-b from-red-50/60 to-transparent p-4 sm:p-6 rounded-3xl border border-red-100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded-full mb-1">
                                <span>🔥</span>
                                <span>HOT DEALS & DISCOUNTS</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
                                <span>{language === 'en' ? 'Special Promotions' : 'สินค้าโปรโมชั่นพิเศษ'}</span>
                            </h2>
                            <p className="text-sm text-zinc-500 mt-1">{language === 'en' ? 'Exclusive discounts, free 24/7 delivery nationwide' : 'รวมสินค้าราคาพิเศษลดสูงสุด ส่งฟรีไม่มีขั้นต่ำ 24 ชม.'}</p>
                        </div>
                        <Link
                            href="/promotions"
                            className="inline-flex items-center gap-1 text-sm font-bold text-red-600 bg-white hover:bg-red-50 border border-red-200 px-4 py-2 rounded-full transition-all shadow-2xs shrink-0 cursor-pointer"
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

            {/* 2. สินค้าขายดียอดนิยม (Best Sellers) */}
            <section className="bg-gradient-to-b from-amber-50/50 to-transparent p-4 sm:p-6 rounded-3xl border border-amber-100">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-1">
                            <span>⭐</span>
                            <span>TOP SALES LEADERBOARD</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
                            <span>{language === 'en' ? 'Best Selling Products' : 'สินค้าขายดียอดนิยม'}</span>
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">{language === 'en' ? 'Ranked by verified order volume in X MART' : 'จัดอันดับตามจำนวนคำสั่งซื้อจริงจากลูกค้าในระบบ X MART'}</p>
                    </div>
                    <Link
                        href="/best-selling"
                        className="inline-flex items-center gap-1 text-sm font-bold text-amber-800 bg-white hover:bg-amber-50 border border-amber-200 px-4 py-2 rounded-full transition-all shadow-2xs shrink-0 cursor-pointer"
                    >
                        <span>{language === 'en' ? 'View rankings' : 'ดูอันดับทั้งหมด'}</span>
                        <span>→</span>
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {bestSellerItems.map(item => (
                        <ProductCard
                            key={item.product.id}
                            product={item.product}
                            rank={item.rank}
                            isBestSeller={true}
                        />
                    ))}
                </div>
            </section>

            {/* 3. สินค้าแนะนำ (Recommended) */}
            <section className="bg-white/80 p-4 sm:p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full mb-1">
                            <span>✨</span>
                            <span>CURATED SELECTION</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 flex items-center gap-2">
                            <span>{language === 'en' ? 'Recommended for You' : 'สินค้าแนะนำสำหรับคุณ'}</span>
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">{language === 'en' ? 'Handpicked quality products from top brands' : 'คัดสรรสินค้าคุณภาพ คุ้มค่า จากแบรนด์ชั้นนำ'}</p>
                    </div>
                    <Link href="/products" className="inline-flex items-center gap-1 text-sm font-bold text-[#0060df] hover:underline shrink-0">
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
