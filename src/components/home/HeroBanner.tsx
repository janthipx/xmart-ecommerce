"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TruckIcon, ShieldCheckIcon, LockIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n";

export function HeroBanner() {
    const { language } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            badge: language === 'en' ? "Free delivery 24/7" : "ส่งฟรี! 24 ชั่วโมง",
            title: language === 'en' ? "No Minimum" : "ไม่มีขั้นต่ำ",
            subtitle: language === 'en' ? "Easy shopping, complete catalog, fast delivery" : "ช้อปง่าย สินค้าครบ จัดส่งรวดเร็ว",
            ctaText: language === 'en' ? "Shop Now" : "ช้อปเลย",
            ctaLink: "/products",
            variant: "truck",
        },
        {
            badge: language === 'en' ? "Weekly Hot Deals" : "ดีลเด็ดประจำสัปดาห์",
            title: language === 'en' ? "Up to 30% OFF" : "ลดสูงสุด 30%",
            subtitle: language === 'en' ? "Special promotions, save big on every order" : "โปรโมชั่นพิเศษ ประหยัดคุ้มค่าทุกคำสั่งซื้อ",
            ctaText: language === 'en' ? "View Promotions" : "ดูโปรโมชั่น",
            ctaLink: "/promotions",
            variant: "promo",
        },
        {
            badge: language === 'en' ? "Quality Guaranteed" : "การันตีคุณภาพ",
            title: language === 'en' ? "Best Sellers" : "สินค้าขายดี",
            subtitle: language === 'en' ? "Selected from verified top orders, satisfaction guaranteed" : "คัดสรรจากยอดสั่งซื้อจริง การันตีความพึงพอใจ",
            ctaText: language === 'en' ? "View Best Sellers" : "ดูสินค้าขายดี",
            ctaLink: "/best-selling",
            variant: "bestseller",
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const slide = slides[currentSlide];

    return (
        <section className="w-full mb-8">
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* MAIN HERO CAROUSEL CARD                                                   */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <div className="relative w-full min-h-[280px] sm:min-h-[320px] md:h-[340px] rounded-3xl bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 shadow-md overflow-hidden flex items-center p-6 sm:p-10 md:p-12">
                {/* Decorative background circles */}
                <div className="absolute right-[-10%] top-[-25%] w-72 h-72 border-[30px] border-white/15 rounded-full pointer-events-none"></div>
                <div className="absolute right-[25%] bottom-[-35%] w-60 h-60 border-[24px] border-white/15 rounded-full pointer-events-none"></div>
                <div className="absolute left-[35%] top-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-xl text-white">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-white/95 text-[#004bb5] text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-xs mb-3">
                        <span>{slide.badge}</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xs mb-2">
                        {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base md:text-lg text-white/95 font-medium leading-relaxed drop-shadow-xs mb-6">
                        {slide.subtitle}
                    </p>

                    {/* CTA Button */}
                    <Link
                        href={slide.ctaLink}
                        className="inline-flex items-center gap-2 bg-[#002f77] hover:bg-[#002257] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full shadow-lg transition-all active:scale-98"
                    >
                        <span>{slide.ctaText}</span>
                        <span>→</span>
                    </Link>
                </div>

                {/* Right Visual Graphic (Delivery Truck & Groceries Illustration) */}
                <div className="hidden md:flex absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10 items-center justify-center select-none pointer-events-none">
                    {slide.variant === 'truck' && (
                        <div className="relative w-72 h-56 flex items-center justify-center">
                            {/* Speed lines */}
                            <div className="absolute -left-6 top-1/3 flex flex-col gap-2 opacity-60">
                                <div className="w-12 h-1 bg-white rounded-full"></div>
                                <div className="w-8 h-1 bg-white rounded-full ml-3"></div>
                                <div className="w-10 h-1 bg-white rounded-full"></div>
                            </div>

                            {/* Styled Delivery Truck SVG */}
                            <svg className="w-64 h-48 drop-shadow-2xl" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Truck Body (Back Cargo Box) */}
                                <rect x="20" y="30" width="130" height="85" rx="8" fill="#FFFFFF" />
                                <rect x="25" y="35" width="120" height="75" rx="6" fill="#F0F7FF" />
                                
                                {/* X MART Logo text on truck */}
                                <rect x="40" y="52" width="90" height="32" rx="6" fill="#004bb5" />
                                <text x="85" y="74" fill="#FFFFFF" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">X MART</text>
                                
                                {/* Truck Cabin */}
                                <path d="M150 55 H185 L205 85 V115 H150 Z" fill="#FFFFFF" />
                                <path d="M155 60 H182 L198 83 H155 Z" fill="#38BDF8" />
                                
                                {/* Headlight */}
                                <rect x="200" y="95" width="6" height="10" rx="2" fill="#FBBF24" />
                                
                                {/* Chassis */}
                                <rect x="25" y="112" width="175" height="8" rx="3" fill="#1E293B" />
                                
                                {/* Wheels */}
                                <circle cx="65" cy="120" r="18" fill="#1E293B" />
                                <circle cx="65" cy="120" r="10" fill="#94A3B8" />
                                <circle cx="65" cy="120" r="4" fill="#FFFFFF" />

                                <circle cx="170" cy="120" r="18" fill="#1E293B" />
                                <circle cx="170" cy="120" r="10" fill="#94A3B8" />
                                <circle cx="170" cy="120" r="4" fill="#FFFFFF" />

                                {/* Floating Parcels on Truck Top */}
                                <rect x="80" y="12" width="26" height="20" rx="3" fill="#F59E0B" />
                                <line x1="93" y1="12" x2="93" y2="32" stroke="#FFFFFF" strokeWidth="2" />
                                <line x1="80" y1="22" x2="106" y2="22" stroke="#FFFFFF" strokeWidth="2" />

                                <rect x="108" y="18" width="22" height="15" rx="3" fill="#10B981" />
                            </svg>
                        </div>
                    )}

                    {slide.variant === 'promo' && (
                        <div className="relative w-64 h-52 flex items-center justify-center">
                            <div className="w-44 h-44 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center p-4 shadow-xl">
                                <span className="text-4xl font-black text-white mb-1">30%</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">DISCOUNT DEALS</span>
                            </div>
                        </div>
                    )}

                    {slide.variant === 'bestseller' && (
                        <div className="relative w-64 h-52 flex items-center justify-center">
                            <div className="w-44 h-44 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex flex-col items-center justify-center p-4 shadow-xl">
                                <span className="text-4xl font-black text-amber-200 mb-1">#1</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">TOP RANKINGS</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Left/Right Slide Arrows */}
                <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous slide"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20 active:scale-95"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next slide"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20 active:scale-95"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>

                {/* Bottom Pagination Dots */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                                currentSlide === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════════════════ */}
            {/* 3 SERVICE CARDS DIRECTLY UNDER BANNER                                     */}
            {/* ═════════════════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {/* 1. ส่งฟรี 24 ชั่วโมง */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-[#004bb5] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <TruckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-[15px] leading-snug">
                            {language === 'en' ? 'Free delivery 24/7' : 'ส่งฟรี 24 ชั่วโมง'}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                            {language === 'en' ? 'No minimum' : 'ไม่มีขั้นต่ำ'}
                        </p>
                    </div>
                </div>

                {/* 2. สินค้าคุณภาพ */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-[#004bb5] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <ShieldCheckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-[15px] leading-snug">
                            {language === 'en' ? 'Quality Products' : 'สินค้าคุณภาพ'}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                            {language === 'en' ? 'Selected from leading brands' : 'คัดสรรจากแบรนด์ชั้นนำ'}
                        </p>
                    </div>
                </div>

                {/* 3. ชำระเงินปลอดภัย */}
                <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-[#004bb5] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <LockIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-900 text-sm sm:text-[15px] leading-snug">
                            {language === 'en' ? 'Secure Payment' : 'ชำระเงินปลอดภัย'}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                            {language === 'en' ? 'PromptPay & Cash on Delivery' : 'พร้อมเพย์ & ชำระเงินปลายทาง'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
