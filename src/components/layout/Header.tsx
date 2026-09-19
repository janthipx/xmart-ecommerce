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
            {/* 1. TOP ANNOUNCEMENT & UTILITY BAR (Royal Blue) */}
            <div className="w-full bg-[#0060df] text-white text-xs py-2 px-3 sm:px-6 shadow-xs">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                    {/* Left: Service Hours & Free Shipping (Hidden on narrow mobile to prevent overlap) */}
                    <div className="hidden sm:flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4 text-blue-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{t('header.open24h')}</span>
                        <span className="opacity-40">|</span>
                        <span>{t('header.freeShipping')}</span>
                    </div>

                    {/* Mobile Left Fallback Badge */}
                    <div className="sm:hidden text-[11px] font-semibold text-blue-100 flex items-center gap-1">
                        <span>⚡ 24h Delivery</span>
                    </div>

                    {/* Right: Order Tracking, Help & Language Switcher */}
                    <div className="flex items-center gap-3 sm:gap-4 text-blue-100 font-medium text-xs">
                        <Link href="/track-order" className="flex items-center gap-1.5 hover:text-white transition-colors" aria-label={t('header.trackOrder')}>
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden xs:inline">{t('header.trackOrder')}</span>
                        </Link>
                        <button
                            onClick={() => setShowHelpModal(true)}
                            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                            aria-label={t('header.help')}
                        >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span className="hidden xs:inline">{t('header.help')}</span>
                        </button>

                        {/* Language Switcher TH | EN */}
                        <div className="flex items-center bg-blue-900/70 rounded-full p-0.5 border border-blue-300/40 text-[11px] font-bold">
                            <button
                                type="button"
                                onClick={() => setLanguage('th')}
                                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                                    language === 'th' ? 'bg-white text-[#0060df] shadow-xs' : 'text-blue-200 hover:text-white'
                                }`}
                                aria-label="สลับเป็นภาษาไทย"
                            >
                                TH
                            </button>
                            <span className="text-blue-300 text-[10px]">|</span>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                                    language === 'en' ? 'bg-white text-[#0060df] shadow-xs' : 'text-blue-200 hover:text-white'
                                }`}
                                aria-label="Switch to English"
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN HEADER (White Background) */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
                    {/* Top Row: Logo, Central Search (Desktop), and Actions */}
                    <div className="flex items-center justify-between gap-3 sm:gap-6">
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="X MART Home">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0060df] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl sm:text-2xl font-black text-[#0060df] tracking-tight leading-none">
                                    X MART
                                </span>
                                <span className="hidden sm:inline text-[11px] font-medium text-slate-500 mt-0.5">
                                    {t('header.supermarket')}
                                </span>
                            </div>
                        </Link>

                        {/* Central Search Bar (Visible on Tablet & Desktop: md+) */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto">
                            <div className="relative flex items-center w-full">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={t('header.searchPlaceholder')}
                                    className="w-full bg-zinc-50/90 hover:bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 pl-4 pr-12 text-sm text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#0060df] focus:ring-2 focus:ring-[#0060df]/15 outline-none transition-all min-h-[42px]"
                                    aria-label={t('common.search')}
                                />
                                <button
                                    type="submit"
                                    aria-label="Search"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-[#0060df] hover:bg-[#0051bc] text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer min-h-[32px]"
                                >
                                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                            {/* User Login/Account (Desktop & Tablet) */}
                            <Link
                                href={user ? '/account' : '/login'}
                                className="hidden md:flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-[#0060df] transition-colors py-1.5 px-2 rounded-lg hover:bg-zinc-50 min-h-[42px]"
                                aria-label={mounted && user ? user.name : t('header.login')}
                            >
                                {mounted && user ? (
                                    <div className="w-8 h-8 rounded-full bg-[#0060df] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <svg className="w-5 h-5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                )}
                                <span className="hidden lg:inline">
                                    {mounted && user ? user.name.split(' ')[0] : t('header.login')}
                                </span>
                            </Link>

                            {/* Shopping Cart Button */}
                            <Link
                                href="/cart"
                                aria-label={t('header.cart')}
                                className="relative p-2 text-zinc-700 hover:text-[#0060df] hover:bg-zinc-50 rounded-xl transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                            >
                                <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 flex min-w-[20px] h-5 items-center justify-center rounded-full bg-[#e60023] text-[11px] font-bold text-white px-1 shadow-sm ring-2 ring-white">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Hamburger Menu Button (Mobile & Tablet: < md) */}
                            <button
                                type="button"
                                onClick={() => setShowMobileMenu(v => !v)}
                                className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
                                aria-label="Toggle Menu"
                            >
                                <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                    {showMobileMenu ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Row (Full width, easy touch target on < md) */}
                    <div className="md:hidden mt-2.5">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative flex items-center w-full">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder={t('header.searchPlaceholder')}
                                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 pl-4 pr-11 text-sm text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#0060df] outline-none min-h-[42px]"
                                    aria-label={t('common.search')}
                                />
                                <button
                                    type="submit"
                                    aria-label="Search"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-[#0060df] text-white rounded-lg flex items-center justify-center min-h-[32px]"
                                >
                                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 3. SUB-NAVIGATION BAR (Visible on Desktop / md+) */}
                <div className="hidden md:block border-t border-zinc-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 py-2">
                        {/* Category Dropdown Button (Strict Requirement 5: Keep Category Button) */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowCategoryDropdown(v => !v)}
                                className="bg-[#0060df] hover:bg-[#0052be] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[42px]"
                                aria-expanded={showCategoryDropdown}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                                <span>{t('header.allCategories')}</span>
                                <svg className={`w-3.5 h-3.5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showCategoryDropdown && (
                                <div className="absolute left-0 mt-2 w-72 max-h-[480px] overflow-y-auto bg-white rounded-2xl shadow-xl border border-zinc-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <Link
                                        href="/products"
                                        onClick={() => setShowCategoryDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-800 hover:bg-blue-50 hover:text-[#0060df] transition-colors border-b border-zinc-100"
                                    >
                                        <span className="text-base">⊞</span>
                                        <span>{t('header.products')}</span>
                                    </Link>
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setShowCategoryDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-blue-50 hover:text-[#0060df] transition-colors"
                                        >
                                            <span className="text-base shrink-0">{cat.icon}</span>
                                            <span className="truncate">{getCategoryName(cat, language)}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-zinc-700 py-0.5">
                            <Link
                                href="/"
                                className={`py-1 shrink-0 hover:text-[#0060df] transition-colors ${pathname === '/' ? 'text-[#0060df] font-bold border-b-2 border-[#0060df]' : ''}`}
                            >
                                {t('header.home')}
                            </Link>
                            <Link
                                href="/products"
                                className={`py-1 shrink-0 hover:text-[#0060df] transition-colors ${pathname === '/products' ? 'text-[#0060df] font-bold border-b-2 border-[#0060df]' : ''}`}
                            >
                                {t('header.products')}
                            </Link>
                            <Link
                                href="/promotions"
                                className={`py-1 shrink-0 flex items-center gap-1.5 hover:text-[#e60023] transition-colors ${pathname === '/promotions' ? 'text-[#e60023] font-bold border-b-2 border-[#e60023]' : ''}`}
                            >
                                <span className="text-[#e60023]">🔥</span>
                                <span>{t('header.promotions')}</span>
                            </Link>
                            <Link
                                href="/best-selling"
                                className={`py-1 shrink-0 flex items-center gap-1.5 hover:text-[#0060df] transition-colors ${pathname === '/best-selling' ? 'text-[#0060df] font-bold border-b-2 border-[#0060df]' : ''}`}
                            >
                                <span className="text-amber-500">⭐</span>
                                <span>{t('header.bestSelling')}</span>
                            </Link>
                            <Link
                                href="/track-order"
                                className={`py-1 shrink-0 hover:text-[#0060df] transition-colors ${pathname === '/track-order' ? 'text-[#0060df] font-bold border-b-2 border-[#0060df]' : ''}`}
                            >
                                {t('header.trackOrder')}
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* 4. MOBILE NAVIGATION DRAWER (Slide down when showMobileMenu is true) */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-3 duration-200 shadow-xl">
                        {/* Account status in drawer */}
                        <div className="p-3 bg-zinc-50 rounded-2xl flex items-center justify-between border border-zinc-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-[#0060df] text-white flex items-center justify-center font-bold text-xs">
                                    {user ? user.name.charAt(0).toUpperCase() : '👤'}
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
                            <Link href="/" className="block px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                🏠 {t('header.home')}
                            </Link>
                            <Link href="/products" className="block px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-800 hover:bg-blue-50 hover:text-[#0060df]">
                                🛍️ {t('header.products')}
                            </Link>
                            <Link href="/promotions" className="block px-3 py-2.5 rounded-xl font-bold text-sm text-[#e60023] hover:bg-red-50">
                                🔥 {t('header.promotions')}
                            </Link>
                            <Link href="/best-selling" className="block px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-800 hover:bg-amber-50">
                                ⭐ {t('header.bestSelling')}
                            </Link>
                            <Link href="/track-order" className="block px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-800 hover:bg-blue-50">
                                📦 {t('header.trackOrder')}
                            </Link>
                        </div>

                        <hr className="border-zinc-100" />

                        {/* All Categories list */}
                        <div>
                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2">
                                {t('header.allCategories')} ({categories.length})
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                                        className="flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-blue-50 hover:text-[#0060df] transition-colors"
                                    >
                                        <span className="text-base shrink-0">{cat.icon}</span>
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
                                <span>💬</span>
                                <span>ศูนย์ช่วยเหลือ X MART</span>
                            </h3>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-500 font-bold cursor-pointer"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3 text-sm text-zinc-600">
                            <p className="font-semibold text-zinc-800">
                                ติดต่อฝ่ายบริการลูกค้า (เปิด 24 ชั่วโมง)
                            </p>
                            <div className="p-3.5 bg-blue-50 rounded-2xl space-y-2 text-xs text-[#0060df] font-medium">
                                <div>📞 โทร: 02-123-4567 หรือ 081-234-5678</div>
                                <div>💬 LINE Official: @xmart24hr</div>
                                <div>📧 อีเมล: support@xmart.com</div>
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
