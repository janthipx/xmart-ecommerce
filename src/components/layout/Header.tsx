"use client";

import Link from "next/link";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { mockCategories } from "@/data/categories";
import { Category } from "@/types";
import { categoriesStorage } from "@/lib/storage/helpers";
import { useTranslation, getCategoryName } from "@/lib/i18n";
import {
    CartIcon,
    UserIcon,
    SearchIcon,
    GlobeIcon,
    MenuIcon,
    XIcon,
    CategoryIcon,
    PhoneIcon,
    MailIcon,
    MessageSquareIcon
} from "@/components/icons";

export function Header() {
    const { language, setLanguage, t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const getTotalItems = useCartStore(s => s.getTotalItems);
    const user = useAuthStore(s => s.user);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        setCategories(categoriesStorage.getAll(mockCategories));
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setShowMobileMenu(false);
        setShowCategoryDropdown(false);
    }, [pathname]);

    const cartCount = mounted ? getTotalItems() : 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/products?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
            setShowMobileMenu(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full shadow-xs">
                {/* 1. TOP WHITE HEADER ROW (Matching Mockup) */}
                <div className="w-full bg-white border-b border-zinc-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
                        {/* Logo with Cart Icon and Tagline */}
                        <Link href="/" className="flex flex-col shrink-0 group select-none" aria-label="X MART Home">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl font-black text-[#0060df] tracking-tight leading-none group-hover:opacity-90 transition-opacity">
                                    X MART
                                </span>
                                <div className="text-[#0060df] flex items-center">
                                    <CartIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.3]" />
                                </div>
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold text-zinc-500 tracking-tight mt-0.5" suppressHydrationWarning>
                                {language === 'en' ? 'Food & essentials, all in one place' : 'ของกิน ของใช้ ครบจบที่เดียว'}
                            </span>
                        </Link>

                        {/* Central Pill Search Bar (Tablet & Desktop: md+) */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-6">
                            <div className="relative flex items-center w-full">
                                <div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
                                    <SearchIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={language === 'en' ? 'Search products by name, brand, or SKU...' : 'ค้นหาสินค้า ชื่อสินค้า แบรนด์ หรือ SKU...'}
                                    className="w-full bg-zinc-50/80 hover:bg-white border border-zinc-200 hover:border-zinc-300 focus:border-[#0060df] focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-full py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all shadow-2xs min-h-[44px]"
                                    aria-label={t('common.search')}
                                />
                            </div>
                        </form>

                        {/* Right Actions: Account, Cart, and Admin Button */}
                        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                            {/* User Account / Login */}
                            <Link
                                href={mounted && user ? '/account' : '/login'}
                                className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity py-1 min-h-[44px]"
                                aria-label={mounted && user ? user.name : t('header.login')}
                            >
                                <div className="text-zinc-700">
                                    <UserIcon className="w-6 h-6 stroke-[1.8]" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-xs sm:text-sm text-zinc-800 leading-tight">
                                        {mounted && user ? user.name.split(' ')[0] : (language === 'en' ? 'Sign In' : 'เข้าสู่ระบบ')}
                                    </span>
                                    <span className="text-[11px] text-zinc-500 leading-tight">
                                        {mounted && user ? (language === 'en' ? 'My Account' : 'บัญชีของฉัน') : (language === 'en' ? 'Register' : 'สมัครสมาชิก')}
                                    </span>
                                </div>
                            </Link>

                            {/* Shopping Cart with Badge */}
                            <Link
                                href="/cart"
                                aria-label={t('header.cart')}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity py-1 group min-h-[44px]"
                            >
                                <div className="relative text-zinc-700">
                                    <CartIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.8]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#e60023] text-[10px] font-black text-white px-1 shadow-sm">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden sm:inline font-bold text-xs sm:text-sm text-zinc-800 leading-tight">
                                    {language === 'en' ? 'Shopping Cart' : 'ตะกร้าสินค้า'}
                                </span>
                            </Link>

                            {/* Mobile Hamburger Menu Button (< md) */}
                            <button
                                type="button"
                                onClick={() => setShowMobileMenu(v => !v)}
                                className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                                aria-label="Toggle Menu"
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Row (< md) */}
                    <div className="md:hidden px-4 pb-2.5">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative flex items-center w-full">
                                <div className="absolute left-3 text-zinc-400 pointer-events-none flex items-center">
                                    <SearchIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={language === 'en' ? 'Search products, brands, or SKU...' : 'ค้นหาสินค้า ชื่อสินค้า แบรนด์ หรือ SKU...'}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-2.5 pl-9 pr-3 text-sm text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#0060df] outline-none min-h-[42px]"
                                    aria-label={t('common.search')}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* 2. SECONDARY NAVIGATION BAR (Dark Royal Blue Bar: Matching Mockup) */}
                <div className="w-full bg-[#004bb5] text-white shadow-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-1.5 gap-4">
                        {/* Left: Category Dropdown Button */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowCategoryDropdown(v => !v)}
                                className="bg-[#003d9b] hover:bg-[#003482] text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer min-h-[36px]"
                                aria-expanded={showCategoryDropdown}
                            >
                                <MenuIcon className="w-4 h-4" />
                                <span>{language === 'en' ? 'All Categories' : 'หมวดหมู่สินค้า'}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {showCategoryDropdown && (
                                <div className="absolute left-0 mt-2 w-72 max-h-[480px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-zinc-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <Link
                                        href="/products"
                                        onClick={() => setShowCategoryDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-bold text-zinc-800 hover:bg-blue-50 hover:text-[#0060df] transition-colors border-b border-zinc-100"
                                    >
                                        <span className="text-base">⊞</span>
                                        <span>{language === 'en' ? 'All Products' : 'สินค้าทั้งหมด'}</span>
                                    </Link>
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setShowCategoryDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-[#0060df] transition-colors"
                                        >
                                            <CategoryIcon icon={cat.icon} slug={cat.slug} name={cat.name} className="w-4 h-4 shrink-0 text-zinc-500" />
                                            <span className="truncate">{getCategoryName(cat, language)}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Center Navigation Links (Hidden on small screens, accessible in mobile menu) */}
                        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-bold text-white/95">
                            <Link
                                href="/"
                                className={`hover:text-white transition-colors py-1 ${pathname === '/' ? 'text-white underline underline-offset-4 decoration-2' : 'text-blue-100'}`}
                            >
                                {language === 'en' ? 'Home' : 'หน้าแรก'}
                            </Link>
                            <Link
                                href="/products"
                                className={`hover:text-white transition-colors py-1 ${pathname === '/products' ? 'text-white underline underline-offset-4 decoration-2' : 'text-blue-100'}`}
                            >
                                {language === 'en' ? 'Featured' : 'สินค้าแนะนำ'}
                            </Link>
                            <Link
                                href="/best-selling"
                                className={`hover:text-white transition-colors py-1 ${pathname === '/best-selling' ? 'text-white underline underline-offset-4 decoration-2' : 'text-blue-100'}`}
                            >
                                {language === 'en' ? 'Best Sellers' : 'สินค้าขายดี'}
                            </Link>
                            <Link
                                href="/promotions"
                                className={`hover:text-white transition-colors py-1 ${pathname === '/promotions' ? 'text-white underline underline-offset-4 decoration-2' : 'text-blue-100'}`}
                            >
                                {language === 'en' ? 'Promotions' : 'โปรโมชั่น'}
                            </Link>
                        </nav>

                        {/* Right: Language Switcher with Globe Icon */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                            <GlobeIcon className="w-4 h-4 text-blue-200" />
                            <button
                                type="button"
                                onClick={() => setLanguage('th')}
                                className={`transition-colors cursor-pointer ${language === 'th' ? 'text-white underline' : 'text-blue-200 hover:text-white'}`}
                                aria-label="Thai"
                            >
                                TH
                            </button>
                            <span className="text-blue-300/80">|</span>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`transition-colors cursor-pointer ${language === 'en' ? 'text-white underline' : 'text-blue-200 hover:text-white'}`}
                                aria-label="English"
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. MOBILE NAVIGATION DRAWER (< md) */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200 shadow-xl">
                        {/* Account status in drawer */}
                        <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between border border-zinc-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-[#0060df] text-white flex items-center justify-center font-bold text-xs">
                                    {user ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-zinc-900">{user ? user.name : (language === 'en' ? 'Guest Customer' : 'ผู้ใช้งานทั่วไป')}</div>
                                    <div className="text-xs text-zinc-500">{user ? user.email : (language === 'en' ? 'Sign in for quick order' : 'เข้าสู่ระบบเพื่อสั่งซื้อสะดวกรวดเร็ว')}</div>
                                </div>
                            </div>
                            <Link
                                href={user ? '/account' : '/login'}
                                className="text-xs font-bold text-[#0060df] bg-white border border-blue-200 px-3 py-1.5 rounded-lg shadow-2xs"
                            >
                                {user ? t('header.account') : t('header.login')}
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-1">
                            <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                <span>{language === 'en' ? 'Home' : 'หน้าแรก'}</span>
                            </Link>
                            <Link href="/products" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                <span>{language === 'en' ? 'Featured' : 'สินค้าแนะนำ'}</span>
                            </Link>
                            <Link href="/best-selling" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                <span>{language === 'en' ? 'Best Sellers' : 'สินค้าขายดี'}</span>
                            </Link>
                            <Link href="/promotions" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                <span>{language === 'en' ? 'Promotions' : 'โปรโมชั่น'}</span>
                            </Link>
                            <Link href="/track-order" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                <span>{language === 'en' ? 'Track Order' : 'ติดตามคำสั่งซื้อ'}</span>
                            </Link>
                        </div>

                        <hr className="border-zinc-100" />

                        {/* Categories List in Mobile Menu */}
                        <div>
                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2">
                                {language === 'en' ? 'All Categories' : 'หมวดหมู่สินค้า'} ({categories.length})
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-blue-50 hover:text-[#0060df] transition-colors"
                                    >
                                        <CategoryIcon icon={cat.icon} slug={cat.slug} name={cat.name} className="w-4 h-4 shrink-0 text-zinc-500" />
                                        <span className="truncate">{getCategoryName(cat, language)}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Help Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                            <h3 className="font-bold text-lg text-zinc-800 flex items-center gap-2">
                                <MessageSquareIcon className="w-5 h-5 text-blue-600" />
                                <span>ศูนย์ช่วยเหลือ X MART</span>
                            </h3>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-500 font-bold cursor-pointer"
                                aria-label="Close"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3 text-sm text-zinc-600">
                            <p className="font-semibold text-zinc-800">
                                ติดต่อฝ่ายบริการลูกค้า (เปิด 24 ชั่วโมง)
                            </p>
                            <div className="p-3.5 bg-blue-50 rounded-2xl space-y-2 text-xs text-[#0060df] font-medium">
                                <div className="flex items-center gap-1.5"><PhoneIcon className="w-3.5 h-3.5 shrink-0" /> <span>โทร: 02-123-4567 หรือ 081-234-5678</span></div>
                                <div className="flex items-center gap-1.5"><MessageSquareIcon className="w-3.5 h-3.5 shrink-0" /> <span>LINE Official: @xmart24hr</span></div>
                                <div className="flex items-center gap-1.5"><MailIcon className="w-3.5 h-3.5 shrink-0" /> <span>อีเมล: support@xmart.com</span></div>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                เราพร้อมให้บริการจัดส่งสินค้าถึงมือคุณอย่างรวดเร็ว ไม่มีขั้นต่ำ ส่งฟรีทุกออเดอร์ 24 ชั่วโมง!
                            </p>
                        </div>
                        <button
                            onClick={() => setShowHelpModal(false)}
                            className="mt-6 w-full bg-[#0060df] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#0051bc] transition-colors min-h-[44px] cursor-pointer"
                        >
                            เข้าใจแล้ว
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
