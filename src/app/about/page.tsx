"use client";

import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import {
    ClockIcon,
    TruckIcon,
    UserCheckIcon,
    SmartphoneIcon,
    CartIcon,
    ShoppingBagIcon,
    ArrowRightIcon,
    ZapIcon,
    CheckCircleIcon,
    AlertCircleIcon
} from "@/components/icons";

export default function AboutPage() {
    const { language, t } = useTranslation();

    const features = [
        {
            icon: <ClockIcon className="w-6 h-6 text-blue-600" />,
            title: t('about.feature1Title'),
            desc: t('about.feature1Desc'),
        },
        {
            icon: <TruckIcon className="w-6 h-6 text-green-600" />,
            title: t('about.feature2Title'),
            desc: t('about.feature2Desc'),
            isFreeShipping: true,
        },
        {
            icon: <UserCheckIcon className="w-6 h-6 text-purple-600" />,
            title: t('about.feature3Title'),
            desc: t('about.feature3Desc'),
        },
        {
            icon: <ShoppingBagIcon className="w-6 h-6 text-amber-600" />,
            title: t('about.feature4Title'),
            desc: t('about.feature4Desc'),
        },
        {
            icon: <SmartphoneIcon className="w-6 h-6 text-indigo-600" />,
            title: t('about.feature5Title'),
            desc: t('about.feature5Desc'),
        },
        {
            icon: <CartIcon className="w-6 h-6 text-rose-600" />,
            title: t('about.feature6Title'),
            desc: t('about.feature6Desc'),
        },
    ];

    const steps = [
        {
            step: "01",
            title: language === 'en' ? 'Explore Products' : 'เลือกสินค้าที่ต้องการ',
            desc: language === 'en'
                ? 'Browse over 200+ essential household goods across 17 curated categories.'
                : 'ค้นหาและเลือกสินค้าอุปโภคบริโภคจำเป็นกว่า 200+ รายการจาก 17 หมวดหมู่',
        },
        {
            step: "02",
            title: language === 'en' ? 'Quick Checkout' : 'สั่งซื้อง่าย ไม่ต้องสมัครสมาชิก',
            desc: language === 'en'
                ? 'Order immediately as a Guest with just name, phone, and delivery address.'
                : 'ลูกค้าทั่วไปสั่งซื้อได้ทันทีเพียงกรอกชื่อ เบอร์โทร และที่อยู่จัดส่ง หรือล็อกอินสมาชิก',
        },
        {
            step: "03",
            title: language === 'en' ? 'Flexible Payment' : 'เลือกวิธีชำระเงิน',
            desc: language === 'en'
                ? 'Choose Cash on Delivery (COD) or simulated PromptPay QR instant scan.'
                : 'รองรับทั้งชำระเงินสดปลายทาง (COD) และจำลองสแกน QR PromptPay',
        },
        {
            step: "04",
            title: language === 'en' ? 'Live Order Tracking' : 'ติดตามสถานะแบบ Real-time',
            desc: language === 'en'
                ? 'Track your order progress step-by-step with real-time countdown timers.'
                : 'ติดตามสถานะคำสั่งซื้อแบบนาทีต่อนาที พร้อมเวลานับถอยหลังและข้อมูลคนขับ',
        },
    ];

    return (
        <div className="min-h-screen bg-xmart-bg flex flex-col">
            <Header />

            <main className="flex-1 w-full">
                {/* Breadcrumb */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
                    <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <Link href="/" className="hover:text-xmart-primary transition-colors">
                            {language === 'en' ? 'Home' : 'หน้าแรก'}
                        </Link>
                        <span>/</span>
                        <span className="text-zinc-800 font-bold">{t('footer.about')}</span>
                    </nav>
                </div>

                {/* Hero Banner */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-br from-[#0a3863] via-xmart-primary to-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
                        <div className="max-w-2xl relative z-10 space-y-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-blue-100 border border-white/20">
                                <ZapIcon className="w-3.5 h-3.5 text-amber-300" />
                                {t('about.badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                {t('about.title')}
                            </h1>
                            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                                {t('about.subtitle')}
                            </p>
                            <div className="pt-2 flex flex-wrap gap-3 items-center">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 bg-white text-xmart-primary font-bold px-6 py-3 rounded-full hover:bg-blue-50 transition-all shadow-md text-sm active-scale"
                                >
                                    <span>{language === 'en' ? 'Start Shopping' : 'เลือกซื้อสินค้าเลย'}</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                                <span className="inline-flex items-center gap-1.5 text-xs text-blue-100 font-bold px-3 py-2 rounded-full bg-white/10 border border-white/20">
                                    <span>{language === 'en' ? 'Free Shipping 🚚 on all orders' : 'ส่งฟรี 🚚 ทุกคำสั่งซื้อ'}</span>
                                </span>
                            </div>
                        </div>

                        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                    {/* Story / Intro Section */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-100 shadow-sm">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-block">
                                <span className="text-xs font-bold uppercase tracking-wider text-xmart-primary bg-blue-50 px-3 py-1 rounded-full">
                                    {language === 'en' ? 'Our Vision' : 'วิสัยทัศน์ของเรา'}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-snug">
                                {t('about.introTitle')}
                            </h2>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                                {t('about.introDesc')}
                            </p>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                                {language === 'en'
                                    ? 'We believe everyday convenience should be seamless. With zero delivery fee barriers and no forced registration, X MART empowers everyone to purchase what they need with instant clarity and real-time order transparency.'
                                    : 'เราเชื่อมั่นว่าความสะดวกสบายในการซื้อของใช้ประจำวันควรเป็นเรื่องง่ายที่สุด ไม่มีค่าจัดส่งมาเป็นอุปสรรค และไม่จำเป็นต้องยุ่งยากกับการลงทะเบียน X MART พร้อมให้บริการทุกคนอย่างโปร่งใส พร้อมระบบติดตามสถานะคำสั่งซื้อแบบเรียลไทม์'}
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div>
                        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
                                {language === 'en' ? 'Why Choose X MART?' : 'จุดเด่นที่ทำให้ลูกค้าไว้วางใจ X MART'}
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                {language === 'en'
                                    ? 'Designed with high reliability, instant responsiveness, and customer-first simplicity.'
                                    : 'ออกแบบโดยคำนึงถึงความสะดวก รวดเร็ว และความพึงพอใจสูงสุดของลูกค้าเป็นสำคัญ'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {features.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow space-y-3"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-base text-zinc-900 flex items-center gap-1.5">
                                        <span>{item.title}</span>
                                        {item.isFreeShipping && <span>🚚</span>}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works Steps */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-100 shadow-sm">
                        <div className="max-w-xl mb-8 space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-xmart-primary bg-blue-50 px-3 py-1 rounded-full">
                                {language === 'en' ? 'Simple 4-Step Process' : 'ขั้นตอนการสั่งซื้อง่ายๆ 4 ขั้นตอน'}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
                                {language === 'en' ? 'How X MART Works' : 'สั่งซื้อง่าย ได้ของไว อุ่นใจทุกขั้นตอน'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {steps.map((s, i) => (
                                <div
                                    key={i}
                                    className="bg-zinc-50/60 rounded-2xl p-5 border border-zinc-100 space-y-2 relative"
                                >
                                    <div className="text-3xl font-black text-xmart-primary/30">
                                        {s.step}
                                    </div>
                                    <h4 className="font-bold text-sm text-zinc-800">
                                        {s.title}
                                    </h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Demo Mini-Project Disclosure Card */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <AlertCircleIcon className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <h3 className="font-black text-base text-amber-950 flex items-center gap-2">
                                <span>{t('about.demoNoticeTitle')}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                                    Mock Showcase
                                </span>
                            </h3>
                            <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                                {t('about.demoNoticeDesc')}
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="shrink-0 bg-white border border-amber-300 text-amber-900 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-amber-100 transition-colors"
                        >
                            {language === 'en' ? 'Contact Demo' : 'ติดต่อสอบถาม'}
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
