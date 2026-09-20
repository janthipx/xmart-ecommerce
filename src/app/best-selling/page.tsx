"use client";

import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category, Order } from "@/types";
import { productsStorage, categoriesStorage, ordersStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { getBestSellingProducts, BestSellingItem } from "@/lib/order-analytics";
import Link from "next/link";
import { TrophyIcon, StarIcon, BarChartIcon, CategoryIcon, RefreshCwIcon } from "@/components/icons";

type SortOption = 'rank-asc' | 'sold-desc' | 'price-asc' | 'price-desc' | 'name-asc';
type RankFilter = 'all' | 'top10' | 'top20' | 'top50';

function BestSellingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>(mockCategories);

    // Filters
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [selectedCatId, setSelectedCatId] = useState<string>(searchParams.get('category') || 'all');
    const [rankFilter, setRankFilter] = useState<RankFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('rank-asc');
    const [pageSize, setPageSize] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        setProducts(productsStorage.getAll(mockProducts));
        setOrders(ordersStorage.getAll());
        setCategories(categoriesStorage.getAll(mockCategories));

        // Real-time listener for order updates
        const handleSync = () => {
            setOrders(ordersStorage.getAll());
            setProducts(productsStorage.getAll(mockProducts));
        };
        window.addEventListener('xmart_storage_sync', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('xmart_storage_sync', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    // Sync search input if query param changes
    useEffect(() => {
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCatId, search, rankFilter, sortBy, pageSize]);

    // Compute best selling items using Single Source of Truth
    const allBestSellers = useMemo(() => {
        return getBestSellingProducts(products, orders);
    }, [products, orders]);

    // Count best sellers per category
    const catCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const item of allBestSellers) {
            counts[item.product.categoryId] = (counts[item.product.categoryId] || 0) + 1;
        }
        return counts;
    }, [allBestSellers]);

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
        router.push(qs ? `/best-selling?${qs}` : '/best-selling');
    };

    // Filter & Sort
    const filteredBestSellers = useMemo(() => {
        let list = allBestSellers.filter(item => {
            const p = item.product;

            // Category filter
            if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) {
                return false;
            }

            // Rank filter
            if (rankFilter === 'top10' && item.rank > 10) return false;
            if (rankFilter === 'top20' && item.rank > 20) return false;
            if (rankFilter === 'top50' && item.rank > 50) return false;

            // Search query
            if (search.trim()) {
                const term = search.trim().toLowerCase();
                const matchName = p.name.toLowerCase().includes(term);
                const matchBrand = (p.brand || '').toLowerCase().includes(term);
                const matchSku = p.sku.toLowerCase().includes(term);
                if (!matchName && !matchBrand && !matchSku) return false;
            }

            return true;
        });

        // Sorting
        if (sortBy === 'rank-asc' || sortBy === 'sold-desc') {
            list = [...list].sort((a, b) => a.rank - b.rank);
        } else if (sortBy === 'price-asc') {
            list = [...list].sort((a, b) => a.product.price - b.product.price);
        } else if (sortBy === 'price-desc') {
            list = [...list].sort((a, b) => b.product.price - a.product.price);
        } else if (sortBy === 'name-asc') {
            list = [...list].sort((a, b) => a.product.name.localeCompare(b.product.name, 'th'));
        }

        return list;
    }, [allBestSellers, selectedCatId, rankFilter, search, sortBy]);

    // Paginated list
    const totalPages = Math.max(1, Math.ceil(filteredBestSellers.length / pageSize));
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredBestSellers.slice(start, start + pageSize);
    }, [filteredBestSellers, currentPage, pageSize]);

    return (
        <div className="space-y-6">
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* BEST SELLING HERO BANNER                                                  */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 sm:p-10 shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-amber-100 font-medium">
                            <Link href="/" className="hover:text-white transition-colors">
                                หน้าแรก
                            </Link>
                            <span>&gt;</span>
                            <span className="text-white font-bold">
                                สินค้าขายดี
                            </span>
                        </nav>

                        {/* Title with icon */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner shrink-0">
                                <TrophyIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-amber-50">
                                    Official Sales Leaderboard
                                </span>
                                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
                                    สินค้าขายดีประจำ X MART
                                </h1>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                            จัดอันดับตามจำนวนชิ้นที่ลูกค้าสั่งซื้อจริงในระบบ อัปเดตทุกคำสั่งซื้อ การันตีความนิยมและคุณภาพ
                        </p>

                        {/* Total Count Pill Badge */}
                        <div className="pt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-amber-800 shadow-sm">
                                <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                                <span>มีสินค้าติดอันดับขายดี {allBestSellers.length} รายการ</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 text-xs font-semibold text-white backdrop-blur-xs">
                                <BarChartIcon className="w-3.5 h-3.5 text-white" />
                                <span>อัปเดตจากคำสั่งซื้อจริง</span>
                            </span>
                        </div>
                    </div>

                    {/* Right Banner Graphic */}
                    <div className="hidden md:flex items-center justify-center shrink-0 opacity-40 pr-6 select-none text-white">
                        <TrophyIcon className="w-24 h-24" />
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute right-[-5%] top-[-30%] w-72 h-72 border-[30px] border-white/10 rounded-full pointer-events-none"></div>
                <div className="absolute left-[30%] bottom-[-50%] w-60 h-60 border-[20px] border-white/10 rounded-full pointer-events-none"></div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* MAIN CONTENT: FILTERS SIDEBAR + BEST SELLERS GRID                        */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* LEFT SIDEBAR: FILTERS                                                 */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-6">
                    {/* Section 1: อันดับ (Ranking Filter) */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 mb-3">
                            อันดับยอดขาย
                        </h3>
                        <div className="space-y-2 text-xs text-zinc-700">
                            {[
                                { id: 'all', label: 'สินค้าขายดีทั้งหมด' },
                                { id: 'top10', label: 'Top 10 ยอดนิยม' },
                                { id: 'top20', label: 'Top 20 อันดับแรก' },
                                { id: 'top50', label: 'Top 50 อันดับแรก' },
                            ].map(item => (
                                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="rank-filter"
                                        checked={rankFilter === item.id}
                                        onChange={() => setRankFilter(item.id as RankFilter)}
                                        className="w-4 h-4 text-amber-500 border-zinc-300 focus:ring-amber-400 cursor-pointer"
                                    />
                                    <span className={rankFilter === item.id ? 'font-bold text-amber-700' : 'font-medium'}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Section 3: หมวดหมู่สินค้า */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-zinc-900">
                                หมวดหมู่สินค้า
                            </h2>
                            <span className="text-[11px] text-zinc-400 font-medium">
                                {allBestSellers.length} รายการ
                            </span>
                        </div>
                        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                            {/* ทั้งหมด */}
                            <button
                                type="button"
                                onClick={() => handleSelectCategory('all')}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCatId === 'all'
                                        ? 'bg-amber-50 text-amber-700 font-bold shadow-xs'
                                        : 'text-zinc-700 hover:bg-zinc-50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                                    <span>ทุกหมวดหมู่</span>
                                </span>
                                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full font-bold">
                                    {allBestSellers.length}
                                </span>
                            </button>

                            {/* แต่ละหมวดหมู่ */}
                            {categories.map(cat => {
                                const count = catCounts[cat.id] || 0;
                                if (count === 0) return null;
                                const isSelected = selectedCatId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleSelectCategory(cat.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-amber-50 text-amber-700 font-bold shadow-xs'
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

                    {/* Section 4: เรียงตาม */}
                    <div>
                        <label htmlFor="bestseller-sort" className="text-sm font-bold text-zinc-900 mb-2 block">
                            เรียงตาม
                        </label>
                        <select
                            id="bestseller-sort"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                            <option value="rank-asc">อันดับยอดขาย (#1 ก่อน)</option>
                            <option value="price-asc">ราคา: ต่ำ → สูง</option>
                            <option value="price-desc">ราคา: สูง → ต่ำ</option>
                            <option value="name-asc">ชื่อสินค้า (ก-ฮ)</option>
                        </select>
                    </div>
                </aside>

                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* RIGHT MAIN CONTENT: BEST SELLERS GRID & PAGINATION                    */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <div className="flex-1 w-full space-y-6">
                    {/* Header Row: Result Count & Page Size Dropdown */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <span>รายการสินค้าขายดี</span>
                                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                                    {filteredBestSellers.length} รายการ
                                </span>
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                สินค้าที่มีจำนวนการสั่งซื้อสะสมสูงสุดในระบบ X MART
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="bestseller-page-size" className="text-xs text-zinc-500 font-medium hidden sm:inline">
                                แสดง:
                            </label>
                            <select
                                id="bestseller-page-size"
                                value={pageSize}
                                onChange={e => setPageSize(Number(e.target.value))}
                                className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                                <option value={12}>แสดง: 12 รายการ</option>
                                <option value={24}>แสดง: 24 รายการ</option>
                                <option value={48}>แสดง: 48 รายการ</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid with Ranks */}
                    {filteredBestSellers.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-zinc-200/80 my-4">
                            <div className="flex justify-center mb-3 text-zinc-300">
                                <StarIcon className="w-12 h-12" />
                            </div>
                            <h3 className="font-bold text-zinc-800 text-base mb-1">ไม่พบสินค้าขายดีที่ตรงกับเงื่อนไข</h3>
                            <p className="text-xs text-zinc-400 mb-4">ลองปรับตัวกรองหมวดหมู่ ระดับอันดับ หรือค้นหาด้วยคำอื่น</p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedCatId('all');
                                    setRankFilter('all');
                                    setSortBy('rank-asc');
                                }}
                                className="inline-flex items-center gap-1.5 text-amber-700 font-bold text-xs bg-amber-50 px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                                <RefreshCwIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>ล้างตัวกรองทั้งหมด</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                            {paginatedItems.map(item => (
                                <ProductCard
                                    key={item.product.id}
                                    product={item.product}
                                    rank={item.rank}
                                    isBestSeller={true}
                                />
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
                                                ? 'bg-amber-500 text-white shadow-xs'
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

export default function BestSellingPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">กำลังโหลดสินค้าขายดี...</div>}>
                    <BestSellingContent />
                </Suspense>
            </main>
        </div>
    );
}
