"use client";

import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import {
    AlertCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    BanknoteIcon,
    SmartphoneIcon,
    LockIcon,
    ZapIcon,
    XCircleIcon
} from "@/components/icons";

export default function TermsPage() {
    const { language, t } = useTranslation();

    const sections = [
        {
            id: "usage",
            title: language === 'en' ? '1. Acceptance & Use of Demo Website' : '1. การใช้งานเว็บไซต์และขอบเขตบริการ (Website Use)',
            content: language === 'en'
                ? 'By accessing and navigating the X MART website, you acknowledge and agree that this platform is an educational e-commerce demonstration project (Mini Project). It is designed to showcase modern front-end user experience, shopping cart dynamics, and simulated real-time order tracking without monetary liability.'
                : 'เมื่อท่านเข้าชมและใช้งานเว็บไซต์ X MART ถือว่าท่านรับทราบและยอมรับว่าแพลตฟอร์มนี้เป็นโครงการจำลองระบบพาณิชย์อิเล็กทรอนิกส์ (Mini Project เพื่อการศึกษาและสาธิต) ซึ่งถูกออกแบบมาเพื่อแสดงผลกระบวนการสั่งซื้อ การจัดการตะกร้าสินค้า และการติดตามสถานะออเดอร์แบบจำลอง โดยไม่มีผลผูกพันทางกฎหมายหรือภาระทางการเงินจริง',
        },
        {
            id: "ordering",
            title: language === 'en' ? '2. Ordering Goods & Basket Dynamics' : '2. การสั่งซื้อสินค้าและการจัดการตะกร้า (Ordering & Cart)',
            content: language === 'en'
                ? 'The terms governing product selection and checkout process are as follows:'
                : 'ข้อกำหนดเกี่ยวกับการเลือกซื้อสินค้าและการจัดการตะกร้าสินค้ามีดังนี้:',
            points: language === 'en' ? [
                'Guest & Member Checkout: Customers may place orders instantly as Guests without registration, or create a Member account to record order history.',
                'Minimum Quantity: The minimum quantity per item purchase is 1 piece.',
                'Unlimited Stock Rules: Items marked as unlimited stock (e.g. daily essentials) can be ordered in any quantity without hitting arbitrary caps.',
                'Basket Modification: Users can adjust quantities, add items, or remove products freely before completing the final checkout confirmation.',
            ] : [
                'สั่งซื้อได้ทั้ง Guest และ Member: ลูกค้าทั่วไปสามารถกรอกข้อมูลสั่งซื้อได้ทันทีโดยไม่ต้องลงทะเบียน หรือสมัครสมาชิกเพื่อบันทึกประวัติ',
                'จำนวนสั่งซื้อขั้นต่ำ: สั่งซื้อขั้นต่ำ 1 ชิ้นต่อรายการ',
                'สินค้าสต็อกไม่จำกัด (Unlimited Stock): สินค้าที่ระบุว่าสต็อกไม่จำกัด สามารถระบุจำนวนสั่งซื้อได้อิสระโดยไม่ถูกจำกัดเพดานสูงสุด',
                'การแก้ไขตะกร้าสินค้า: สามารถเพิ่ม ลบ หรือปรับเปลี่ยนจำนวนสินค้าในตะกร้าได้ตลอดเวลาก่อนกดยืนยันสั่งซื้อ',
            ],
        },
        {
            id: "order-lock",
            title: language === 'en' ? '3. Order Lock Policy After Confirmation' : '3. กฎการล็อกรายการสินค้าหลังยืนยันคำสั่งซื้อ (Order Lock)',
            content: language === 'en'
                ? 'Strict Immutability Rule: Once an order is confirmed and an Order Number (e.g. XM202609...) is generated, the order is locked.'
                : 'กฎการล็อกข้อมูลคำสั่งซื้อที่เข้มงวด: เมื่อคำสั่งซื้อได้รับการยืนยันและออกหมายเลขออเดอร์ (เช่น XM202609...) เรียบร้อยแล้ว รายการคำสั่งซื้อจะถูก "ล็อก" ทันที',
            points: language === 'en' ? [
                'No Item Modification: Product types, quantities, unit prices, and promotional price snapshots cannot be changed or edited after confirmation.',
                'Integrity Protection: This simulates standard enterprise fulfillment integrity where packing slips cannot fluctuate once registered.',
                'Order Recalculation: If changes are needed, the customer may cancel the pending order (if eligible) and create a new order.',
            ] : [
                'ห้ามแก้ไขรายการสินค้า: ไม่สามารถเพิ่ม ลด หรือเปลี่ยนชนิดสินค้า รวมถึงราคาต่อหน่วยหลังยืนยันออเดอร์แล้ว',
                'การคุ้มครองความถูกต้อง: เพื่อจำลองมาตรฐานระบบคลังสินค้าที่ใบจัดสินค้าต้องตรงกับยอดที่ยืนยัน',
                'หากต้องการเปลี่ยนแปลง: ลูกค้าสามารถกดยกเลิกออเดอร์เดิม (หากอยู่ในสถานะที่ยกเลิกได้) แล้วทำการสั่งซื้อใหม่',
            ],
        },
        {
            id: "payment",
            title: language === 'en' ? '4. Payment Methods (COD & Simulated QR)' : '4. วิธีการชำระเงิน (Payment Methods)',
            content: language === 'en'
                ? 'X MART supports two simulated payment workflows in this demo project:'
                : 'ระบบ X MART รองรับวิธีการชำระเงิน 2 รูปแบบในระบบจำลอง:',
            points: language === 'en' ? [
                'Cash on Delivery (COD): Pay cash directly upon simulated delivery. Order status is marked as "Pending Payment" until arrival.',
                'PromptPay QR Demo: A dynamic QR code is generated for mobile banking simulation. Users can click "Simulate Paid" or "Simulate Failed" to test both payment scenarios without real money being debited.',
                'No Credit Cards: In alignment with the Mini Project scope, no credit/debit card inputs are stored or accepted.',
            ] : [
                'เงินสดปลายทาง (Cash on Delivery - COD): ชำระเงินสดเมื่อสินค้าจัดส่งถึงมือ โดยออเดอร์จะแสดงสถานะ "รอชำระ" จนกว่าจะจัดส่งสำเร็จ',
                'PromptPay QR Demo: ระบบสร้าง QR Code จำลองสำหรับสแกนจ่าย โดยมีปุ่ม "จำลองชำระเงินสำเร็จ" และ "จำลองชำระเงินล้มเหลว" เพื่อทดสอบโฟลว์ ไม่มีการหักเงินจริงจากบัญชีธนาคาร',
                'ไม่รองรับบัตรเครดิต: เพื่อความปลอดภัยตามสโคป Mini Project จึงไม่มีการรับหรือบันทึกข้อมูลบัตรเครดิต/เดบิตใดๆ',
            ],
        },
        {
            id: "delivery",
            title: language === 'en' ? '5. Delivery Policy (Free Shipping No Minimum)' : '5. นโยบายการจัดส่งสินค้า (Free Shipping)',
            content: language === 'en'
                ? 'Delivery terms for every order in the X MART system:'
                : 'ข้อกำหนดเกี่ยวกับการจัดส่งสินค้าในระบบ X MART:',
            points: language === 'en' ? [
                'Free Shipping ฿0: Every single order enjoys 100% free delivery with no minimum basket spend required.',
                'Simulated Timeline: Orders advance through five delivery stages: PENDING → CONFIRMED → PREPARING → SHIPPING → DELIVERED.',
                'Driver Information: When an order reaches the SHIPPING status, designated delivery driver information (name and contact phone) is displayed for simulated coordination.',
            ] : [
                'ส่งฟรีทุกคำสั่งซื้อ ไม่มีขั้นต่ำ: ค่าจัดส่ง ฿0 ทุกออเดอร์ ไม่มียอดสั่งซื้อขั้นต่ำ',
                'การจำลองเวลาจัดส่ง: ออเดอร์จะเลื่อนสถานะ 5 ขั้นตอนอัตโนมัติ (รับคำสั่งซื้อ → ยืนยัน → เตรียมสินค้า → กำลังจัดส่ง → จัดส่งสำเร็จ)',
                'ข้อมูลผู้จัดส่ง: เมื่อเข้าสู่สถานะ "กำลังจัดส่ง" ระบบจะแสดงข้อมูลชื่อพนักงานขับรถและเบอร์ติดต่อจำลอง เพื่อให้ประสานงานได้เสมือนจริง',
            ],
        },
        {
            id: "cancellation",
            title: language === 'en' ? '6. Order Cancellation Policy' : '6. นโยบายการยกเลิกคำสั่งซื้อ (Order Cancellation)',
            content: language === 'en'
                ? 'Strict rules governing customer cancellation eligibility (Requirement 10):'
                : 'ข้อกำหนดในการยกเลิกคำสั่งซื้อของลูกค้า (ตามข้อกำหนด Requirement 10):',
            points: language === 'en' ? [
                'Eligible Cancellation Stages: Customers may cancel their order during PENDING, CONFIRMED, PREPARING, and SHIPPING.',
                'Confirmation Dialog: A safety confirmation dialog is prompted before executing the cancellation.',
                'Non-Cancellable Stages: Once an order enters DELIVERED, it is completed and cannot be cancelled. Already CANCELLED orders cannot be reopened.',
                'Immediate Freeze: Upon cancellation, the 5-minute auto progression timer halts permanently, and the order status is set to CANCELLED.',
            ] : [
                'สถานะที่อนุญาตให้ยกเลิกได้: ลูกค้าสามารถกดยกเลิกออเดอร์ได้ในสถานะ PENDING, CONFIRMED, PREPARING และ SHIPPING',
                'กล่องข้อความยืนยัน: ระบบจะมีกล่องยืนยัน (Confirmation Dialog) ให้กดยืนยันก่อนดำเนินการยกเลิกจริงเพื่อป้องกันความผิดพลาด',
                'สถานะที่ยกเลิกไม่ได้: เมื่อเข้าสู่สถานะ "จัดส่งสำเร็จ" (DELIVERED) จะไม่สามารถยกเลิกได้ และออเดอร์ที่ยกเลิกแล้ว (CANCELLED) ไม่สามารถกู้คืนได้',
                'หยุดการทำงานอัตโนมัติ: เมื่อยกเลิกสำเร็จ ระบบจับเวลานับถอยหลังจะหยุดทำงานถาวร และออเดอร์จะถูกบันทึกเป็นสถานะยกเลิก',
            ],
        },
        {
            id: "disclaimer",
            title: language === 'en' ? '7. Demo System Limitations & Disclaimer' : '7. ข้อจำกัดของระบบจำลองและการปฏิเสธความรับผิดชอบ (Disclaimer)',
            content: language === 'en'
                ? 'Please review these fundamental educational demo disclaimers:'
                : 'ข้อตกลงสำคัญเกี่ยวกับการสาธิตระบบ:',
            points: language === 'en' ? [
                'Simulated Commerce Only: No physical food, drinks, or consumer goods will be shipped or dispatched to physical addresses.',
                'No Real Financial Claims: No financial claims or chargebacks apply since no actual currency transactions occur.',
                'Client Storage Dependency: Data persistence relies on your browser localStorage. Clearing cache or using incognito may reset demo state.',
            ] : [
                'ไม่มีการจัดส่งสินค้าจริง: สินค้าทั้งหมดในระบบเป็นข้อมูลตัวอย่างเพื่อการทดสอบ (Mock Data) ไม่มีการจัดส่งของจริงไปยังที่อยู่ของท่าน',
                'ไม่มีการเรียกเก็บเงินจริง: ไม่มีความรับผิดทางแพ่งหรือการเรียกร้องค่าบริการใดๆ เนื่องจากไม่มีการทำธุรกรรมการเงินจริง',
                'ความคงอยู่ของข้อมูลขึ้นอยู่กับเบราว์เซอร์: ข้อมูลออเดอร์ถูกบันทึกในเครื่องของท่าน การล้างประวัติเบราว์เซอร์อาจทำให้ออเดอร์จำลองถูกรีเซ็ต',
            ],
        },
        {
            id: "conduct",
            title: language === 'en' ? '8. Appropriate Use' : '8. การใช้งานระบบอย่างเหมาะสม (Appropriate Use)',
            content: language === 'en'
                ? 'Users are requested to use this demo application for its intended learning and testing purposes. Do not submit sensitive personal passwords or actual financial credentials into demo text inputs.'
                : 'ขอความร่วมมือผู้ใช้งานทดสอบระบบตามวัตถุประสงค์เพื่อการเรียนรู้และทดสอบฟังก์ชัน ไม่ควรกรอกรหัสผ่านจริง บัตรประชาชนจริง หรือข้อมูลทางการเงินจริงลงในช่องกรอกข้อมูลจำลอง',
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
                        <span className="text-zinc-800 font-bold">{t('footer.terms')}</span>
                    </nav>
                </div>

                {/* Hero Header */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-br from-[#0a3863] via-xmart-primary to-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
                        <div className="max-w-2xl relative z-10 space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-blue-100 border border-white/20">
                                <LockIcon className="w-3.5 h-3.5 text-blue-200" />
                                {t('terms.badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                {t('terms.title')}
                            </h1>
                            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                                {t('terms.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Crucial Demo Notice Banner */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <AlertCircleIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="font-bold text-base text-amber-900">
                                {language === 'en' ? 'Educational Demo Notice' : 'ข้อตกลงการใช้งานระบบสาธิต (Demo Notice)'}
                            </h2>
                            <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                                {t('terms.demoNotice')}
                            </p>
                        </div>
                    </div>

                    {/* Terms Sections */}
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
                                ? 'Last Updated: September 2026 | Version: 1.0 (Demo Scope)'
                                : 'ปรับปรุงล่าสุด: กันยายน 2026 | เวอร์ชัน: 1.0 (สโคปจำลองการทดสอบ)'}
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/privacy"
                                className="text-xs font-bold text-xmart-primary hover:underline"
                            >
                                {t('footer.privacy')} →
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
