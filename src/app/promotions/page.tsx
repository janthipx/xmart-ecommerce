"use client";

import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { productsStorage, categoriesStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import Link from "next/link";
import { FlameIcon, SparklesIcon, TagIcon, CategoryIcon, RefreshCwIcon } from "@/components/icons";

type SortOption = 'discount-desc' | 'price-asc' | 'price-desc' | 'name-asc';
type DiscountFilter = 'all' | '20plus' | '10-19' | 'under10';

function PromotionsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [categories, setCategories] = useState<Category[]>(mockCategories);

    // Filters
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [selectedCatId, setSelectedCatId] = useState<string>(searchParams.get('category') || 'all');
    const [discountFilter, setDiscountFilter] = useState<DiscountFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('discount-desc');
    const [pageSize, setPageSize] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setProducts(productsStorage.getAll(mockProducts));
        setCategories(categoriesStorage.getAll(mockCategories));
    }, []);

    // Sync search input if query param changes
    useEffect(() => {
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCatId, search, discountFilter, sortBy, pageSize]);

    // Calculate promotion items
    const promoProducts = useMemo(() => {
        return products.filter(p => p.isPromotion && p.status !== 'HIDDEN');
    }, [products]);

    // Count promotions per category
    const catPromoCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const p of promoProducts) {
            counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
        }
        return counts;
    }, [promoProducts]);

    const handleSelectCategory = (catId: string) => {
        setSelectedCatId(catId);
        const params = new URLSearchParams();
        if (catId !== 'all') {
            params.set('category', catId);
        }
        if (search) {
            params.set('q', search);
        }
        const qs = params.toString();
        router.push(qs ? `/promotions?${qs}` : '/promotions');
    };

    // Filter & Sort
    const filteredPromotions = useMemo(() => {
        let list = promoProducts.filter(p => {
            // Category filter
            if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) {
                return false;
            }

            // Search query
            if (search.trim()) {
                const term = search.trim().toLowerCase();
                const matchName = p.name.toLowerCase().includes(term);
                const matchBrand = (p.brand || '').toLowerCase().includes(term);
                const matchSku = p.sku.toLowerCase().includes(term);
                const matchLabel = (p.promotionLabel || '').toLowerCase().includes(term);
                if (!matchName && !matchBrand && !matchSku && !matchLabel) return false;
            }

            // Discount filter
            if (p.originalPrice && p.price < p.originalPrice) {
                const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                if (discountFilter === '20plus' && discountPercent < 20) return false;
                if (discountFilter === '10-19' && (discountPercent < 10 || discountPercent >= 20)) return false;
                if (discountFilter === 'under10' && discountPercent >= 10) return false;
            }

            return true;
        });

        // Sorting
        if (sortBy === 'discount-desc') {
            list = [...list].sort((a, b) => {
                const discA = (a.originalPrice && a.originalPrice > a.price) ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
                const discB = (b.originalPrice && b.originalPrice > b.price) ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
                return discB - discA;
            });
        } else if (sortBy === 'price-asc') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            list = [...list].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'th'));
        }

        return list;
    }, [promoProducts, selectedCatId, search, discountFilter, sortBy]);

    // Paginated list
    const totalPages = Math.max(1, Math.ceil(filteredPromotions.length / pageSize));
    const paginatedPromotions = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPromotions.slice(start, start + pageSize);
    }, [filteredPromotions, currentPage, pageSize]);

    return (
        <div className="space-y-6">
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* PROMOTIONS HERO BANNER                                                    */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-10 shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-red-100 font-medium">
                            <Link href="/" className="hover:text-white transition-colors">
                                หน้าแรก
                            </Link>
                            <span>&gt;</span>
                            <span className="text-white font-bold">
                                โปรโมชั่นพิเศษ
                            </span>
                        </nav>

                        {/* Title with badge */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner shrink-0">
                                <FlameIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-red-50">
                                    Special Discount Deals
                                </span>
                                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
                                    โปรโมชั่น & สินค้าราคาพิเศษ
                                </h1>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-red-100 font-medium leading-relaxed">
                            รวมดีลเด็ดลดแรงทุกหมวดหมู่ ประหยัดคุ้มค่าทุกการสั่งซื้อ ของแท้ 100% ส่งฟรีไม่มีขั้นต่ำตลอด 24 ชั่วโมง
                        </p>

                        {/* Total Count Pill Badge */}
                        <div className="pt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-red-700 shadow-sm">
                                <SparklesIcon className="w-3.5 h-3.5 text-red-600" />
                                <span>มีสินค้าโปรโมชั่น {promoProducts.length} รายการ</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 text-xs font-semibold text-white backdrop-blur-xs">
                                <span>ส่งฟรี 🚚 ทุกออเดอร์</span>
                            </span>
                        </div>
                    </div>

                    {/* Right Banner Graphic */}
                    <div className="hidden md:flex items-center justify-center shrink-0 opacity-40 pr-6 select-none text-white">
                        <TagIcon className="w-24 h-24" />
                    </div>
                </div>

                {/* Decorative background circles */}
                <div className="absolute right-[-5%] top-[-30%] w-72 h-72 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
                <div className="absolute left-[30%] bottom-[-50%] w-60 h-60 border-[20px] border-white/10 rounded-full pointer-events-none"></div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* MAIN CONTENT: FILTERS SIDEBAR + PROMOTION GRID                            */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* LEFT SIDEBAR: FILTERS                                                 */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-6">
                    {/* Section 1: หมวดหมู่สินค้าที่มีโปรโมชั่น */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-zinc-900">
                                หมวดหมู่สินค้า
                            </h2>
                            <span className="text-[11px] text-zinc-400 font-medium">
                                {promoProducts.length} ดีล
                            </span>
                        </div>
                        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                            {/* ทั้งหมด */}
                            <button
                                type="button"
                                onClick={() => handleSelectCategory('all')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCatId === 'all'
                                        ? 'bg-red-50 text-red-600 font-bold shadow-xs'
                                        : 'text-zinc-700 hover:bg-zinc-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <FlameIcon className="w-3.5 h-3.5 text-red-500" />
                                    <span>ทุกหมวดหมู่</span>
                                </span>
                                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-bold">
                                    {promoProducts.length}
                                </span>
                            </button>

                            {/* แต่ละหมวดหมู่ */}
                            {categories.map(cat => {
                                const count = catPromoCounts[cat.id] || 0;
                                if (count === 0) return null; // แสดงเฉพาะหมวดที่มีโปรโมชั่น
                                const isSelected = selectedCatId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleSelectCategory(cat.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-red-50 text-red-600 font-bold shadow-xs'
                                                : 'text-zinc-700 hover:bg-zinc-50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2 truncate">
                                            <span className="shrink-0"><CategoryIcon icon={cat.icon} slug={cat.slug} name={cat.name} className="w-3.5 h-3.5 text-zinc-500" /></span>
                                            <span className="truncate">{cat.name}</span>
                                        </span>
                                        <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-bold shrink-0">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Section 3: ระดับส่วนลด */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 mb-3">
                            ระดับส่วนลด
                        </h3>
                        <div className="space-y-2 text-xs text-zinc-700">
                            {[
                                { id: 'all', label: 'ส่วนลดทั้งหมด' },
                                { id: '20plus', label: 'ลด 20% ขึ้นไป' },
                                { id: '10-19', label: 'ลด 10% - 19%' },
                                { id: 'under10', label: 'ลดต่ำกว่า 10%' },
                            ].map(item => (
                                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="discount-filter"
                                        checked={discountFilter === item.id}
                                        onChange={() => setDiscountFilter(item.id as DiscountFilter)}
                                        className="w-4 h-4 text-red-600 border-zinc-300 focus:ring-red-500 cursor-pointer"
                                    />
                                    <span className={discountFilter === item.id ? 'font-bold text-red-600' : 'font-medium'}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Section 4: เรียงตาม */}
                    <div>
                        <label htmlFor="promo-sort" className="text-sm font-bold text-zinc-900 mb-2 block">
                            เรียงตาม
                        </label>
                        <select
                            id="promo-sort"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                            <option value="discount-desc">ส่วนลดสูงสุด (%)</option>
                            <option value="price-asc">ราคา: ต่ำ → สูง</option>
                            <option value="price-desc">ราคา: สูง → ต่ำ</option>
                            <option value="name-asc">ชื่อสินค้า (ก-ฮ)</option>
                        </select>
                    </div>
                </aside>

                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* RIGHT MAIN CONTENT: PRODUCTS GRID & PAGINATION                        */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <div className="flex-1 w-full space-y-6">
                    {/* Header Row: Result Count & Page Size Dropdown */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <span>รายการสินค้าโปรโมชั่น</span>
                                <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full">
                                    {filteredPromotions.length} รายการ
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                สินค้าลดราคาพิเศษ ราคาส่วนลดถูกคำนวณและปรับเข้าสู่ตะกร้าโดยอัตโนมัติ
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="promo-page-size" className="text-xs text-zinc-500 font-medium hidden sm:inline">
                                แสดง:
                            </label>
                            <select
                                id="promo-page-size"
                                value={pageSize}
                                onChange={e => setPageSize(Number(e.target.value))}
                                className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                                <option value={12}>แสดง: 12 รายการ</option>
                                <option value={24}>แสดง: 24 รายการ</option>
                                <option value={48}>แสดง: 48 รายการ</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filteredPromotions.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-zinc-200/80 my-4">
                            <div className="flex justify-center mb-3 text-zinc-300">
                                <TagIcon className="w-12 h-12" />
                            </div>
                            <h3 className="font-bold text-zinc-800 text-base mb-1">ไม่พบสินค้าโปรโมชั่นที่ตรงกับเงื่อนไข</h3>
                            <p className="text-xs text-zinc-400 mb-4">ลองปรับตัวกรองหมวดหมู่ ระดับส่วนลด หรือค้นหาด้วยคำอื่น</p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCatId('all');
                                    setDiscountFilter('all');
                                    setSortBy('discount-desc');
                                }}
                                className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                            >
                                <RefreshCwIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>ล้างตัวกรองทั้งหมด</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                            {paginatedPromotions.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="pt-6 pb-2 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className={`w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                                    currentPage === 1
                                        ? 'text-zinc-300 border-zinc-100 cursor-not-allowed'
                                        : 'text-zinc-600 hover:bg-zinc-50'
                                }`}
                                aria-label="หน้าก่อนหน้า"
                            >
                                &lt;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                const isActive = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-red-600 text-white shadow-xs'
                                                : 'text-zinc-600 hover:bg-zinc-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className={`w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-xs transition-colors cursor-pointer ${
                                    currentPage === totalPages
                                        ? 'text-zinc-300 border-zinc-100 cursor-not-allowed'
                                        : 'text-zinc-600 hover:bg-zinc-50'
                                }`}
                                aria-label="หน้าถัดไป"
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PromotionsPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">กำลังโหลดโปรโมชั่น...</div>}>
                    <PromotionsContent />
                </Suspense>
            </main>
        </div>
    );
}
