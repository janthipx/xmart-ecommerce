"use client";

import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/types";
import { productsStorage, categoriesStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { useTranslation, getCategoryName, getProductName } from "@/lib/i18n";
import Link from "next/link";
import { CategoryIcon, TagIcon, SearchIcon, RefreshCwIcon } from "@/components/icons";

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';
type PriceRangeOption = 'all' | '0-50' | '51-200' | '201-1000' | '1001-5000' | '5001+';

const categoryMeta: Record<string, { desc: string; descEn?: string; icon: string }> = {
    'เครื่องดื่ม': {
        desc: 'น้ำดื่ม น้ำอัดลม ชา กาแฟ นม และเครื่องดื่มหลากหลายชนิด',
        descEn: 'Drinking water, soft drinks, tea, coffee, milk, and various beverages',
        icon: 'beverages',
    },
    'อาหาร': {
        desc: 'อาหารแห้ง บะหมี่กึ่งสำเร็จรูป ข้าวสาร เครื่องปรุงรส และอาหารสำเร็จรูป',
        descEn: 'Dried food, instant noodles, rice, seasonings, and prepared meals',
        icon: 'food',
    },
    'ขนม': {
        desc: 'ขนมขบเคี้ยว มันฝรั่งทอดกรอบ ช็อกโกแลต บิสกิต และลูกอมแสนอร่อย',
        descEn: 'Snacks, potato chips, chocolates, biscuits, and confectionery',
        icon: 'snacks',
    },
    'ของใช้ส่วนตัว': {
        desc: 'สบู่ แชมพู ครีมนวด ยาสีฟัน แปรงสีฟัน และผลิตภัณฑ์ดูแลผิวกาย',
        descEn: 'Soap, shampoo, conditioner, toothpaste, toothbrushes, and personal care items',
        icon: 'personal-care',
    },
    'ของใช้ในบ้าน': {
        desc: 'ผงซักฟอก น้ำยาล้างจาน ปรับผ้านุ่ม กระดาษทิชชู และผลิตภัณฑ์ทำความสะอาด',
        descEn: 'Detergent, dish soap, fabric softeners, paper towels, and cleaning supplies',
        icon: 'home-care',
    },
    'เครื่องใช้ไฟฟ้า': {
        desc: 'โทรศัพท์มือถือ แท็บเล็ต หูฟัง ลำโพง Power Bank สายชาร์จ อุปกรณ์ไอที',
        descEn: 'Smartphones, tablets, headphones, power banks, chargers, and electronics',
        icon: 'electronics',
    },
    'แฟชั่น': {
        desc: 'เสื้อยืด กางเกงยีนส์ รองเท้า กระเป๋า หมวก และเครื่องแต่งกาย',
        descEn: 'T-shirts, jeans, shoes, bags, caps, and fashionable apparel',
        icon: 'fashion',
    },
    'สุขภาพและความงาม': {
        desc: 'สกินแคร์ เครื่องสำอาง อุปกรณ์ดูแลสุขภาพ วิตามิน และยาสามัญ',
        descEn: 'Skincare, cosmetics, health supplements, vitamins, and medical essentials',
        icon: 'health-beauty',
    },
    'แม่และเด็ก': {
        desc: 'ผ้าอ้อม นมผงเด็ก ขวดนม ของเล่นเด็ก และอุปกรณ์สำหรับเด็ก',
        descEn: 'Diapers, formula milk, bottles, baby toys, and maternal care',
        icon: 'mother-baby',
    },
    'เครื่องเขียนและสำนักงาน': {
        desc: 'ปากกา ดินสอ สมุด กระดาษ แฟ้ม และอุปกรณ์สำนักงานครบครัน',
        descEn: 'Pens, pencils, notebooks, copy paper, binders, and office essentials',
        icon: 'stationery',
    },
    'ยานยนต์': {
        desc: 'น้ำมันเครื่อง ยานพาหนะ อุปกรณ์ดูแลและอุปกรณ์เสริมในรถยนต์',
        descEn: 'Engine oil, motor vehicles, car care accessories, and parts',
        icon: 'automotive',
    },
    'สัตว์เลี้ยง': {
        desc: 'สัตว์เลี้ยงแท้ อาหารสุนัข อาหารแมว ทรายแมว และของดูแลสัตว์เลี้ยง',
        descEn: 'Live companion pets, pet food, cat litter, and pet accessories',
        icon: 'pets',
    },
    'กีฬาและกิจกรรมกลางแจ้ง': {
        desc: 'อุปกรณ์ออกกำลังกาย ลูกบอล เสื่อโยคะ กระบอกน้ำ อุปกรณ์ Camping',
        descEn: 'Fitness gear, balls, yoga mats, sports bottles, and camping equipment',
        icon: 'sports-outdoors',
    },
    'บ้านและสวน': {
        desc: 'เครื่องมือช่าง อุปกรณ์ทำสวน หลอดไฟ ปลั๊กพ่วง และอุปกรณ์จัดเก็บ',
        descEn: 'Hand tools, gardening tools, LED lights, extension cords, and home storage',
        icon: 'home-garden',
    },
    'อสังหาริมทรัพย์': {
        desc: 'บ้านเดี่ยว คอนโดมิเนียม ทาวน์โฮม ที่ดิน อาคารพาณิชย์ และโฮมออฟฟิศทำเลทอง',
        descEn: 'Single houses, condominiums, townhomes, land plots, and commercial properties',
        icon: 'real-estate',
    },
    'ของเล่น': {
        desc: 'LEGO ตัวต่อ บอร์ดเกม รถบังคับ ตุ๊กตา และของเล่นเสริมพัฒนาการ',
        descEn: 'LEGO bricks, board games, RC vehicles, plush toys, and educational games',
        icon: 'toys-games',
    },
    'ของสดและอาหารแช่แข็ง': {
        desc: 'เนื้อหมู เนื้อวัว ไก่สด อาหารทะเล ผัก ผลไม้ และอาหารแช่แข็งคุณภาพสูง',
        descEn: 'Pork, beef, fresh poultry, seafood, fresh produce, and premium frozen foods',
        icon: 'fresh-frozen',
    },
};

function ProductsContent() {
    const { language, t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    
    // In-category search state
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [pageSize, setPageSize] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Read category parameter
    const rawCategoryParam = searchParams.get('category') || searchParams.get('cat');
    const isAllSelected = !rawCategoryParam || rawCategoryParam === 'all' || rawCategoryParam === 'ทั้งหมด';
    const categoryParam = isAllSelected ? 'all' : rawCategoryParam;

    useEffect(() => {
        setProducts(productsStorage.getAll(mockProducts));
        setCategories(categoriesStorage.getAll(mockCategories));
    }, []);

    // Sync search input if query param changes
    useEffect(() => {
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    // Reset pagination when category, search, or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryParam, search, priceRange, sortBy, pageSize]);

    const matchedCategory = useMemo(() => {
        if (isAllSelected) return null;
        const normalized = categoryParam.trim().toLowerCase();
        return categories.find(c =>
            c.name.toLowerCase() === normalized ||
            (c.nameEn && c.nameEn.toLowerCase() === normalized) ||
            c.id.toLowerCase() === normalized
        ) || null;
    }, [categoryParam, categories, isAllSelected]);

    const isInvalidCategory = Boolean(!isAllSelected && categoryParam && !matchedCategory && categories.length > 0);

    const handleSelectCategory = (catName?: string) => {
        const params = new URLSearchParams();
        if (catName && catName !== 'all') {
            params.set('category', catName);
        } else if (catName === 'all') {
            params.set('category', 'all');
        }
        if (search) {
            params.set('q', search);
        }
        const qs = params.toString();
        router.push(qs ? `/products?${qs}` : '/products');
    };

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        if (isInvalidCategory) return [];

        let list = products.filter(p => {
            if (p.status === 'HIDDEN') return false;

            // Category filter
            if (matchedCategory && p.categoryId !== matchedCategory.id) {
                return false;
            }

            // Enhanced multi-attribute bilingual search: Name (TH/EN), Brand, SKU, Category, Description
            if (search.trim()) {
                const term = search.trim().toLowerCase();
                const matchName = p.name.toLowerCase().includes(term) || (p.nameTh && p.nameTh.toLowerCase().includes(term)) || (p.nameEn && p.nameEn.toLowerCase().includes(term));
                const matchBrand = (p.brand || '').toLowerCase().includes(term);
                const matchSku = p.sku.toLowerCase().includes(term);
                const matchCat = (p.category || '').toLowerCase().includes(term) || (p.categoryNameTh && p.categoryNameTh.toLowerCase().includes(term)) || (p.categoryNameEn && p.categoryNameEn.toLowerCase().includes(term));
                const matchDesc = p.description.toLowerCase().includes(term) || (p.descriptionTh && p.descriptionTh.toLowerCase().includes(term)) || (p.descriptionEn && p.descriptionEn.toLowerCase().includes(term));
                if (!matchName && !matchBrand && !matchSku && !matchCat && !matchDesc) return false;
            }

            // Price range filter
            if (priceRange === '0-50' && (p.price < 0 || p.price > 50)) return false;
            if (priceRange === '51-200' && (p.price < 51 || p.price > 200)) return false;
            if (priceRange === '201-1000' && (p.price < 201 || p.price > 1000)) return false;
            if (priceRange === '1001-5000' && (p.price < 1001 || p.price > 5000)) return false;
            if (priceRange === '5001+' && p.price <= 5000) return false;

            return true;
        });

        // Sorting
        if (sortBy === 'price-asc') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            list = [...list].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            list = [...list].sort((a, b) => {
                const nameA = getProductName(a, language);
                const nameB = getProductName(b, language);
                return nameA.localeCompare(nameB, language === 'en' ? 'en' : 'th');
            });
        }

        return list;
    }, [products, matchedCategory, search, priceRange, sortBy, isInvalidCategory, language]);

    // Paginated list
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredProducts.slice(start, start + pageSize);
    }, [filteredProducts, currentPage, pageSize]);

    // Category display details
    const activeCatName = matchedCategory ? getCategoryName(matchedCategory, language) : (language === 'en' ? 'All Products' : 'สินค้าทั้งหมด');
    const rawCatName = matchedCategory ? matchedCategory.name : 'สินค้าทั้งหมด';
    const activeMeta = categoryMeta[rawCatName] || {
        desc: 'สินค้าโชว์ห่วยคุณภาพครบครัน ส่งฟรีทุกออเดอร์ บริการตลอด 24 ชั่วโมง',
        descEn: 'Quality supermarket items, free shipping on all orders, open 24/7',
        icon: 'package',
    };
    const activeDesc = language === 'en' && activeMeta.descEn ? activeMeta.descEn : activeMeta.desc;

    if (isInvalidCategory) {
        return (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-zinc-100 max-w-lg mx-auto my-12">
                <div className="flex justify-center mb-4 text-zinc-300">
                    <TagIcon className="w-16 h-16" />
                </div>
                <h2 className="text-xl font-bold text-zinc-800 mb-2">
                    {language === 'en' ? 'Category Not Found' : 'ไม่พบหมวดหมู่สินค้า'}
                </h2>
                <p className="text-sm text-zinc-400 mb-6">
                    {language === 'en'
                        ? `Category "${categoryParam}" was not found or has been modified.`
                        : `หมวดหมู่ "${categoryParam}" ไม่มีในระบบ หรืออาจถูกปรับเปลี่ยนไปแล้ว`}
                </p>
                <button
                    onClick={() => handleSelectCategory(categories[0]?.name || 'เครื่องดื่ม')}
                    className="inline-flex items-center gap-2 bg-[#0060df] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0051bc] transition-all shadow-md text-sm cursor-pointer"
                >
                    <CategoryIcon icon="beverages" className="w-4 h-4 text-white" />
                    <span>{language === 'en' ? 'Browse All Categories' : 'ดูหมวดหมู่สินค้า'}</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* CATEGORY HERO BANNER (Soft Sky Blue Card Matching Mockup)                */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#d9ebfb] via-[#e2f1fd] to-[#d3e8fa] border border-[#bedcf6] p-6 sm:p-8">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-medium">
                            <Link href="/" className="hover:text-[#0060df] transition-colors">
                                {t('header.home')}
                            </Link>
                            <span>&gt;</span>
                            <span className="text-[#0a3863] font-semibold">
                                {activeCatName}
                            </span>
                        </nav>

                        {/* Title with outlined icon badge */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="w-12 h-12 rounded-xl bg-white/70 border border-[#0060df]/40 flex items-center justify-center text-[#0060df] shadow-2xs shrink-0">
                                <CategoryIcon icon={activeMeta.icon} name={rawCatName} className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-[#0a3863] tracking-tight">
                                {activeCatName}
                            </h1>
                        </div>

                        {/* Subtitle / Description */}
                        <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed pt-1">
                            {activeDesc}
                        </p>

                        {/* Total Count Pill Badge */}
                        <div className="pt-2">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white text-xs font-bold text-zinc-700 shadow-2xs border border-zinc-200/80">
                                {language === 'en' ? `Total ${filteredProducts.length} items` : `สินค้าทั้งหมด ${filteredProducts.length} รายการ`}
                            </span>
                        </div>
                    </div>

                    {/* Right Banner Composition Image */}
                    <div className="hidden md:flex items-center justify-end shrink-0 w-80 lg:w-96 relative">
                        <img
                            src="/banner_drinks.jpg"
                            alt="Category Banner"
                            className="w-full h-auto object-contain max-h-56 drop-shadow-md rounded-xl"
                        />
                    </div>
                </div>
            </section>

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* 2-COLUMN MAIN LAYOUT: SIDEBAR (LEFT) + PRODUCT GRID (RIGHT)             */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* LEFT SIDEBAR: FILTERS                                                 */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <aside className="w-full lg:w-60 shrink-0 bg-white rounded-xl border border-zinc-200/80 p-5 shadow-2xs space-y-6">
                    {/* Section 1: หมวดหมู่สินค้า */}
                    <div>
                        <h2 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                            {t('header.allCategories')}
                        </h2>
                        <div className="space-y-1">
                            {/* ทั้งหมด */}
                            <button
                                type="button"
                                onClick={() => handleSelectCategory('all')}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    isAllSelected
                                        ? 'bg-blue-50 text-[#0060df] font-bold shadow-2xs'
                                        : 'text-zinc-700 hover:bg-zinc-50'
                                }`}
                            >
                                <span className="text-base text-zinc-500">⊞</span>
                                <span>{t('common.all')}</span>
                            </button>

                            {/* รายการหมวดหมู่ */}
                            {categories.map(cat => {
                                const isSelected = matchedCategory?.id === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleSelectCategory(cat.name)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-50 text-[#0060df] font-bold shadow-2xs'
                                                : 'text-zinc-700 hover:bg-zinc-50'
                                        }`}
                                    >
                                        <span className="shrink-0"><CategoryIcon icon={cat.icon} slug={cat.slug} name={cat.name} className="w-4 h-4" /></span>
                                        <span>{getCategoryName(cat, language)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Section 2: ช่วงราคา (Radio buttons) */}
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 mb-3">
                            {language === 'en' ? 'Price Range' : 'ช่วงราคา'}
                        </h3>
                        <div className="space-y-2 text-xs text-zinc-700">
                            {[
                                { id: 'all', label: t('common.all') },
                                { id: '0-50', label: language === 'en' ? '0 - 50 THB' : '0 - 50 บาท' },
                                { id: '51-200', label: language === 'en' ? '51 - 200 THB' : '51 - 200 บาท' },
                                { id: '201-1000', label: language === 'en' ? '201 - 1,000 THB' : '201 - 1,000 บาท' },
                                { id: '1001-5000', label: language === 'en' ? '1,001 - 5,000 THB' : '1,001 - 5,000 บาท' },
                                { id: '5001+', label: language === 'en' ? '5,001+ THB' : '5,001 บาทขึ้นไป' },
                            ].map(item => (
                                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="price-range"
                                        checked={priceRange === item.id}
                                        onChange={() => setPriceRange(item.id as PriceRangeOption)}
                                        className="w-4 h-4 text-[#0060df] border-zinc-300 focus:ring-[#0060df] cursor-pointer"
                                    />
                                    <span className={priceRange === item.id ? 'font-bold text-[#0060df]' : 'font-medium'}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-zinc-100" />

                    {/* Section 4: เรียงตาม (Select dropdown) */}
                    <div>
                        <label htmlFor="sidebar-sort" className="text-sm font-bold text-zinc-900 mb-2 block">
                            {t('common.sort')}
                        </label>
                        <select
                            id="sidebar-sort"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortOption)}
                            className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-[#0060df] cursor-pointer"
                        >
                            <option value="default">{t('common.sortByPopular')}</option>
                            <option value="price-asc">{t('common.sortByPriceAsc')}</option>
                            <option value="price-desc">{t('common.sortByPriceDesc')}</option>
                            <option value="name-asc">{t('common.sortByName')}</option>
                        </select>
                    </div>
                </aside>

                {/* ───────────────────────────────────────────────────────────────────── */}
                {/* RIGHT MAIN CONTENT: PRODUCTS GRID & PAGINATION                        */}
                {/* ───────────────────────────────────────────────────────────────────── */}
                <div className="flex-1 w-full space-y-6">
                    {/* Active Search Query Filter Banner (From Header Search) */}
                    {search.trim() && (
                        <div className="flex items-center justify-between gap-3 p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-900 shadow-2xs">
                            <div className="flex items-center gap-2 flex-wrap">
                                <SearchIcon className="w-4 h-4 text-blue-700 shrink-0" />
                                <span>{language === 'en' ? 'Showing results for:' : 'ผลการค้นหาสำหรับ:'}</span>
                                <span className="font-black text-[#0060df] bg-white px-2 py-0.5 rounded-md border border-blue-200">
                                    "{search.trim()}"
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.push(categoryParam && categoryParam !== 'all' ? `/products?category=${encodeURIComponent(categoryParam)}` : '/products');
                                }}
                                className="text-xs font-bold text-blue-700 hover:text-white bg-white hover:bg-[#0060df] border border-blue-300 px-3 py-1 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
                            >
                                ✕ {language === 'en' ? 'Clear' : 'ล้างการค้นหา'}
                            </button>
                        </div>
                    )}

                    {/* Header Row: Title & Page Size Dropdown */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
                        <h2 className="text-lg sm:text-xl font-black text-zinc-900">
                            {language === 'en'
                                ? `Products in ${activeCatName} (${filteredProducts.length} items)`
                                : `สินค้าในหมวด ${activeCatName} (${filteredProducts.length} รายการ)`}
                        </h2>

                        <div className="flex items-center gap-2">
                            <label htmlFor="page-size-select" className="text-xs sm:text-sm text-zinc-500 font-medium hidden sm:inline">
                                {language === 'en' ? 'Show:' : 'แสดง:'}
                            </label>
                            <select
                                id="page-size-select"
                                value={pageSize}
                                onChange={e => setPageSize(Number(e.target.value))}
                                className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-zinc-700 shadow-2xs focus:outline-none focus:border-[#0060df] cursor-pointer min-h-[38px]"
                            >
                                <option value={12}>{language === 'en' ? 'Show: 12 items' : 'แสดง: 12 รายการ'}</option>
                                <option value={24}>{language === 'en' ? 'Show: 24 items' : 'แสดง: 24 รายการ'}</option>
                                <option value={48}>{language === 'en' ? 'Show: 48 items' : 'แสดง: 48 รายการ'}</option>
                                <option value={96}>{language === 'en' ? 'Show: 96 items' : 'แสดง: 96 รายการ'}</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid (2 Mobile, 3 Tablet, 4-5 Desktop) */}
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-xs border border-zinc-200/80 my-4">
                            <div className="flex justify-center mb-3 text-zinc-300">
                                <SearchIcon className="w-12 h-12" />
                            </div>
                            <h3 className="font-bold text-zinc-800 text-base mb-1">{t('products.noResults')}</h3>
                            <p className="text-xs text-zinc-400 mb-4">
                                {language === 'en' ? 'Try adjusting your filters or search terms.' : 'ลองปรับตัวกรองช่วงราคา หรือค้นหาด้วยคำอื่น'}
                            </p>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setPriceRange('all');
                                    setSortBy('default');
                                }}
                                className="inline-flex items-center gap-1.5 text-[#0060df] font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                                <RefreshCwIcon className="w-3.5 h-3.5 shrink-0" />
                                <span>{language === 'en' ? 'Clear all filters' : 'ล้างตัวกรองทั้งหมด'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-2.5 sm:gap-4">
                            {paginatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}

                    {/* Pagination Bar (Matching mockup: [<] [1] [2] [3] [4] [>]) */}
                    {totalPages > 1 && (
                        <div className="pt-6 pb-2 flex items-center justify-center gap-2">
                            {/* Prev Page Button */}
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

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                                const isActive = currentPage === pageNum;
                                return (
                                    <button
                                        key={pageNum}
                                        type="button"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-[#0060df] text-white shadow-xs'
                                                : 'text-zinc-600 hover:bg-zinc-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {/* Next Page Button */}
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

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">Loading...</div>}>
                    <ProductsContent />
                </Suspense>
            </main>
        </div>
    );
}
