"use client";

import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import {
    LockIcon,
    AlertCircleIcon,
    CheckCircleIcon,
    ZapIcon,
    RefreshCwIcon
} from "@/components/icons";

export default function PrivacyPage() {
    const { language, t } = useTranslation();

    const sections = [
        {
            id: "overview",
            title: language === 'en' ? '1. Scope & Demo Architecture Overview' : '1. ขอบเขตและโครงสร้างระบบจำลอง (Demo Scope)',
            content: language === 'en'
                ? 'X MART is an educational e-commerce demonstration project (Mini Project). It is designed to illustrate modern web ordering workflows without utilizing a production server database or real financial processing.'
                : 'ระบบ X MART เป็นโครงการจำลองระบบสั่งซื้อสินค้าออนไลน์ (Mini Project) ที่สร้างขึ้นเพื่อสาธิตกระบวนการทำงานของระบบ E-Commerce ยุคใหม่ โดยทำงานบนเบราว์เซอร์ของผู้ใช้ทั้งหมด และไม่มีการเชื่อมต่อกับฐานข้อมูลเซิร์ฟเวอร์ภายนอก (No Database Server)',
        },
        {
            id: "data-collected",
            title: language === 'en' ? '2. Information Stored Locally in Demo' : '2. ข้อมูลที่ระบบเก็บและใช้งานใน Demo',
            content: language === 'en'
                ? 'During the demo experience, user-entered inputs are stored solely inside your local browser storage (localStorage / sessionStorage). These include:'
                : 'ในการทดสอบใช้งานระบบจำลอง ข้อมูลที่ผู้ใช้กรอกจะถูกบันทึกไว้ในหน่วยความจำของเบราว์เซอร์ (Web Storage) ในอุปกรณ์ของคุณเท่านั้น ได้แก่:',
            points: language === 'en' ? [
                'Member Account Information: Full name, demo email, phone number, and simulated password hash for registered demo accounts.',
                'Order Details: Selected products, order numbers (e.g. XM202609...), timestamps, order status, and total purchase amounts.',
                'Shipping Information: Recipient name, contact phone number, and delivery address entered on the Checkout page.',
                'Cart State: Item quantities, selected product IDs, and calculated subtotals.',
            ] : [
                'ข้อมูลบัญชีสมาชิก: ชื่อ-นามสกุล, อีเมลจำลอง, เบอร์โทรศัพท์ และรหัสผ่านที่ใช้ทดสอบเข้าสู่ระบบ',
                'ข้อมูลการสั่งซื้อ: รายการสินค้า, หมายเลขออเดอร์ (เช่น XM202609...), ยอดรวม, วิธีชำระเงิน และสถานะการจัดส่ง',
                'ข้อมูลที่ใช้ในการจัดส่ง: ชื่อผู้รับ, เบอร์โทรศัพท์ติดต่อ และที่อยู่จัดส่งที่กรอกในหน้า Checkout',
                'ข้อมูลตะกร้าสินค้า: จำนวนสินค้าและรายการสินค้าที่เลือกไว้ในเซสชันปัจจุบัน',
            ],
        },
        {
            id: "localstorage-use",
            title: language === 'en' ? '3. Browser LocalStorage Implementation' : '3. การใช้ Local Storage ในระบบ Demo',
            content: language === 'en'
                ? 'This website utilizes the HTML5 Web Storage API (localStorage and sessionStorage) to retain your demo session, cart items, order tracking history, and language preference across page reloads. No tracking cookies or advertising tracking scripts are embedded.'
                : 'เว็บไซต์นี้ใช้เทคโนโลยี HTML5 Web Storage API (LocalStorage และ SessionStore) เพื่อให้ระบบสามารถจำลองสถานะตะกร้าสินค้า ประวัติคำสั่งซื้อ และภาษาที่เลือกได้อย่างต่อเนื่อง แม้ผู้ใช้จะรีเฟรชหน้าจอ (F5) โดยไม่มีการฝังคุกกี้ติดตามโฆษณา (Tracking Cookies) ใดๆ ทั้งสิ้น',
        },
        {
            id: "purpose",
            title: language === 'en' ? '4. Purpose of Data Processing' : '4. วัตถุประสงค์ในการใช้ข้อมูล',
            content: language === 'en'
                ? 'Data entered into X MART is processed strictly for the functional simulation of:'
                : 'ข้อมูลที่กรอกในระบบ X MART ถูกประมวลผลบนเครื่องของคุณเพื่อวัตถุประสงค์ในการจำลองฟังก์ชันดังต่อไปนี้เท่านั้น:',
            points: language === 'en' ? [
                'Displaying shopping basket calculations and simulated checkout totals.',
                'Generating unique order numbers and simulating 5-minute auto order progression.',
                'Enabling guest and member order lookup via the track-order page.',
                'Rendering sales statistics in the local demo admin dashboard.',
            ] : [
                'คำนวณราคาสินค้าในตะกร้าและประมวลผลหน้า Checkout จำลอง',
                'สร้างหมายเลขคำสั่งซื้อเฉพาะ และจำลองการเลื่อนสถานะคำสั่งซื้ออัตโนมัติทุก 5 นาที',
                'เปิดให้ลูกค้าทั่วไป (Guest) และสมาชิกสามารถค้นหาและติดตามสถานะออเดอร์ในหน้า /track-order',
                'แสดงผลสถิติคำสั่งซื้อในหน้าแดชบอร์ดผู้ดูแลระบบจำลอง (/admin)',
            ],
        },
        {
            id: "security-boundaries",
            title: language === 'en' ? '5. Security Boundaries & Limitations' : '5. ขอบเขตความปลอดภัยและข้อจำกัดของระบบ Demo',
            content: language === 'en'
                ? 'Important Disclosures regarding system architecture:'
                : 'ข้อชี้แจงสำคัญเกี่ยวกับความปลอดภัยและขอบเขตเชิงเทคนิค:',
            points: language === 'en' ? [
                'No Production Database: There is no relational or NoSQL database running on an external server for this demo.',
                'Zero Network Data Transmission: Your personal or simulated payment inputs are not sent over the network to any third-party payment gateway or analytics cloud.',
                'Client-Side Isolation: Because all records reside in your browser, other internet users cannot view your local cart or private demo orders unless they use your physical device.',
            ] : [
                'ไม่มีฐานข้อมูลจริง (No Production Database): ระบบนี้เป็น Mini Project ที่ไม่มีการเชื่อมต่อฐานข้อมูลภายนอก',
                'ไม่มีการส่งข้อมูลออกนอกเครื่อง: ข้อมูลและแบบฟอร์มทั้งหมดทำงานในเบราว์เซอร์ของคุณ ไม่มีการส่งข้อมูลบัตรเครดิตหรือข้อมูลส่วนตัวไปยังเซิร์ฟเวอร์ภายนอก',
                'ความเป็นส่วนตัวระดับเครื่อง: ข้อมูลที่ท่านทดสอบสั่งซื้อจะแสดงผลเฉพาะในเบราว์เซอร์ของอุปกรณ์ท่านเท่านั้น ผู้อื่นบนอินเทอร์เน็ตไม่สามารถเข้าถึงได้',
            ],
        },
        {
            id: "third-party",
            title: language === 'en' ? '6. Third-Party Disclosure Policy' : '6. การเปิดเผยข้อมูลแก่บุคคลภายนอก',
            content: language === 'en'
                ? 'X MART does not sell, trade, rent, or transfer any user data to outside parties, advertisers, or third-party marketing networks under any circumstances.'
                : 'ระบบ X MART ไม่มีการขาย แลกเปลี่ยน เผยแพร่ หรือส่งต่อข้อมูลของผู้ใช้ไปยังบุคคลภายนอก บริษัทโฆษณา หรือเครือข่ายการตลาดใดๆ ทั้งสิ้น',
        },
        {
            id: "user-rights",
            title: language === 'en' ? '7. User Rights & Data Control' : '7. สิทธิและการควบคุมข้อมูลของผู้ใช้งาน',
            content: language === 'en'
                ? 'As a user of this client-side demo, you possess 100% control over your data at all times:'
                : 'ในฐานะผู้ใช้งานระบบจำลองนี้ ท่านมีสิทธิและอำนาจควบคุมข้อมูลทั้งหมดในเครื่องของท่านได้ 100% ตลอดเวลา:',
            points: language === 'en' ? [
                'Instant Reset: You can click "Reset Demo Data" on the admin page to wipe all generated orders and restore initial defaults.',
                'Browser Cache Clearing: You can clear your browser localStorage and site cache at any time to delete all local X MART records permanently.',
                'No Permanent Profile: Closing or clearing private/incognito browsing windows instantly removes all demo session traces.',
            ] : [
                'รีเซ็ตข้อมูลได้ทันที: สามารถกดปุ่ม "Reset Demo Data" ในหน้าผู้ดูแลระบบเพื่อล้างออเดอร์จำลองทั้งหมดและเริ่มใหม่',
                'ล้างข้อมูลผ่านเบราว์เซอร์: สามารถลบข้อมูลได้ตลอดเวลาโดยการล้างแคชหรือ LocalStorage ในการตั้งค่าเบราว์เซอร์ของท่าน',
                'ไม่ผูกมัดถาวร: หากเปิดในโหมดไม่ระบุตัวตน (Incognito) ข้อมูลทั้งหมดจะถูกลบทันทีเมื่อปิดหน้าต่างเบราว์เซอร์',
            ],
        },
        {
            id: "contact-privacy",
            title: language === 'en' ? '8. Privacy Inquiries & Contact' : '8. การติดต่อเกี่ยวกับความเป็นส่วนตัว',
            content: language === 'en'
                ? 'For questions, feedback, or inquiries regarding the technical architecture and privacy practices of this demo, please reach out via our demo contact channels at support@xmart.com or telephone 02-123-4567.'
                : 'หากท่านมีข้อสงสัยหรือคำถามเพิ่มเติมเกี่ยวกับนโยบายความเป็นส่วนตัวและสถาปัตยกรรมของโครงการจำลองนี้ สามารถติดต่อทีมผู้พัฒนาได้ทาง support@xmart.com หรือศูนย์บริการลูกค้าจำลอง 02-123-4567',
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
                        <span className="text-zinc-800 font-bold">{t('footer.privacy')}</span>
                    </nav>
                </div>

                {/* Hero Header */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-br from-[#0a3863] via-xmart-primary to-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
                        <div className="max-w-2xl relative z-10 space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-blue-100 border border-white/20">
                                <LockIcon className="w-3.5 h-3.5 text-blue-200" />
                                {t('privacy.badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                {t('privacy.title')}
                            </h1>
                            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                                {t('privacy.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Crucial Demo Notice Banner */}
                    <div className="bg-blue-50/70 border border-blue-200/80 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-xmart-primary flex items-center justify-center shrink-0">
                            <AlertCircleIcon className="w-6 h-6 text-xmart-primary" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-bold text-base text-blue-900">
                                {language === 'en' ? 'Technical Architecture Disclosure' : 'ข้อควรทราบเกี่ยวกับระบบจำลอง (Architecture Disclosure)'}
                            </h2>
                            <p className="text-xs sm:text-sm text-blue-800/90 leading-relaxed">
                                {t('privacy.demoNotice')}
                            </p>
                        </div>
                    </div>

                    {/* Policy Sections */}
                    <div className="space-y-6">
                        {sections.map(section => (
                            <div
                                key={section.id}
                                className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-100 shadow-sm space-y-3"
                            >
                                <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                                    {section.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                    {section.content}
                                </p>
                                {section.points && (
                                    <ul className="space-y-2 pt-1">
                                        {section.points.map((pt, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-xmart-primary mt-2 shrink-0" />
                                                <span>{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-200 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-zinc-500">
                            {language === 'en'
                                ? 'Effective Date: September 2026 | Version: 1.0 (Demo Scope)'
                                : 'วันที่มีผลบังคับใช้: กันยายน 2026 | เวอร์ชัน: 1.0 (สโคปจำลองการทดสอบ)'}
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/terms"
                                className="text-xs font-bold text-xmart-primary hover:underline"
                            >
                                {t('footer.terms')} →
                            </Link>
                            <Link
                                href="/contact"
                                className="text-xs font-bold text-zinc-600 hover:text-zinc-900"
                            >
                                {t('footer.contact')}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
