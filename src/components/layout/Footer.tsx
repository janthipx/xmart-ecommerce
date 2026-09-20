"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneIcon } from "@/components/icons";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
    const pathname = usePathname();
    const { t, language } = useTranslation();

    // Hide footer on admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="w-full bg-[#0a3863] text-white pt-10 pb-20 md:pb-8 mt-auto border-t border-[#0d477d]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
                    {/* Logo & Slogan */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0a3863] shadow-md shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                                X MART
                            </div>
                            <p className="text-xs text-blue-200/80 font-normal">
                                {t('footer.slogan')}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100/90 font-medium">
                        <Link href="/about" className="hover:text-white transition-colors">
                            {t('footer.about')}
                        </Link>
                        <Link href="/contact" className="hover:text-white transition-colors">
                            {t('footer.contact')}
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            {t('footer.privacy')}
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            {t('footer.terms')}
                        </Link>
                    </nav>

                    {/* Customer Service & Contact Info */}
                    <div className="text-center md:text-right text-xs text-blue-200/90 space-y-1">
                        <div className="font-semibold text-white flex items-center gap-1.5 justify-center md:justify-end">
                            <PhoneIcon className="w-4 h-4 text-blue-200" />
                            <span>{t('footer.customerService')}</span>
                        </div>
                        <div>{t('footer.lineInfo')}</div>
                    </div>
                </div>

                {/* Bottom Copyright & Admin Access */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/70 gap-3 text-center sm:text-left">
                    <p>{t('footer.subSlogan')}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-[11px] sm:text-xs">
                        <p>{t('footer.copyright')}</p>
                        <span className="hidden sm:inline text-blue-200/30" aria-hidden="true">•</span>
                        <Link
                            href="/admin/login"
                            className="text-blue-300/50 hover:text-blue-100 transition-colors text-[11px]"
                            title={language === 'en' ? 'Admin Portal' : 'สำหรับผู้ดูแลระบบ'}
                        >
                            {language === 'en' ? 'Admin Portal' : 'สำหรับผู้ดูแลระบบ'}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
