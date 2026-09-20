"use client";

import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ordersStorage } from "@/lib/storage/helpers";
import { Order } from "@/types";
import { useTranslation, getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/i18n";
import { CheckCircleIcon, OrderStatusIcon, XCircleIcon, BanknoteIcon, ClockIcon, SearchIcon, SmartphoneIcon } from "@/components/icons";

function SuccessContent() {
    const { language, t } = useTranslation();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber") || "";
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (orderNumber) setOrder(ordersStorage.findByNumber(orderNumber) || null);
    }, [orderNumber]);

    const status = order?.orderStatus || 'PENDING';
    const isUnpaidPromptPay = order?.paymentMethod === 'PROMPTPAY' && order?.paymentStatus === 'PENDING' && status !== 'CANCELLED';

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black text-xmart-text mb-2">
                {language === 'en' ? 'Order Placed Successfully!' : 'สั่งซื้อสำเร็จ!'}
            </h1>
            <p className="text-zinc-400 mb-6 text-sm">
                {language === 'en'
                    ? 'Thank you for choosing X MART. We will process your order right away.'
                    : 'ขอบคุณที่ใช้บริการ X MART เราจะดำเนินการตามคำสั่งซื้อของคุณโดยเร็ว'}
            </p>

            {/* PromptPay Waiting for Payment Notice (Requirement 14) */}
            {isUnpaidPromptPay && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-left mb-6 space-y-1">
                    <p className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-amber-600" />
                        <span>{language === 'en' ? 'Waiting for Payment' : 'รอการชำระเงิน'}</span>
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                        {language === 'en'
                            ? 'Your order has been recorded. Please complete payment using the QR button below to start preparation and delivery.'
                            : 'คำสั่งซื้อได้รับการบันทึกเรียบร้อยแล้ว กรุณากดปุ่ม "ชำระเงิน" เพื่อเปิด QR Code สำหรับชำระเงินและเริ่มขั้นตอนจัดส่ง'}
                    </p>
                </div>
            )}

            <div className="bg-zinc-50 rounded-2xl p-5 text-left space-y-2.5 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Order Number' : 'หมายเลขออเดอร์'}</span>
                    <span className="font-black text-xmart-primary font-mono">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Order Status' : 'สถานะ'}</span>
                    <span className="font-bold text-xmart-primary inline-flex items-center gap-1.5">
                        <OrderStatusIcon status={status} className="w-4 h-4" />
                        <span>{getOrderStatusLabel(status, language)}</span>
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Payment' : 'การชำระเงิน'}</span>
                    <span className="font-bold">
                        {order?.paymentStatus === 'PAID' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><CheckCircleIcon className="w-4 h-4" /> <span>{language === 'en' ? 'Paid' : 'ชำระเงินแล้ว'}</span></span>
                        ) : order?.paymentStatus === 'FAILED' ? (
                            <span className="inline-flex items-center gap-1 text-red-500 font-bold"><XCircleIcon className="w-4 h-4" /> <span>{language === 'en' ? 'Payment Failed' : 'การชำระเงินไม่สำเร็จ'}</span></span>
                        ) : order?.paymentMethod === 'CASH' ? (
                            <span className="inline-flex items-center gap-1 text-zinc-700 font-bold"><BanknoteIcon className="w-4 h-4" /> <span>{language === 'en' ? 'Cash on Delivery' : 'เงินสดปลายทาง'}</span></span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold"><ClockIcon className="w-4 h-4" /> <span>{language === 'en' ? 'Waiting for Payment' : 'รอการชำระเงิน'}</span></span>
                        )}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Subtotal' : 'ยอดรวมสินค้า'}</span>
                    <span className="font-bold">฿{order?.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                    <span>{language === 'en' ? 'Shipping Fee' : 'ค่าจัดส่ง'}</span>
                    <span>{language === 'en' ? '฿0 (Free 🚚)' : '฿0 (ส่งฟรี 🚚)'}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 font-black text-xmart-primary">
                    <span>{language === 'en' ? 'Grand Total' : 'ยอดสุทธิ'}</span>
                    <span className="text-base">฿{order?.totalPrice.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Pay Now button for unpaid PromptPay order (Requirement 2 & 14) */}
                {isUnpaidPromptPay && (
                    <Link
                        href={`/checkout/qr?orderNumber=${orderNumber}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#0060df] text-white font-bold py-3.5 rounded-2xl hover:bg-[#0051bc] transition-all shadow-md active-scale cursor-pointer text-sm"
                    >
                        <SmartphoneIcon className="w-4 h-4" />
                        <span>{language === 'en' ? 'Pay Now' : 'ชำระเงิน'}</span>
                    </Link>
                )}
                <Link
                    href={`/track-order?orderNumber=${orderNumber}&phone=${order?.customerPhone || ''}`}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all shadow-md active-scale cursor-pointer text-sm ${isUnpaidPromptPay ? 'bg-zinc-800 text-white hover:bg-zinc-900' : 'bg-xmart-primary text-white hover:bg-xmart-primary-light'}`}
                >
                    <SearchIcon className="w-4 h-4" />
                    <span>{language === 'en' ? 'Track Your Order' : 'ติดตามสถานะออเดอร์'}</span>
                </Link>
                <Link
                    href="/"
                    className="w-full block text-center border border-zinc-200 text-zinc-700 font-bold py-3.5 rounded-2xl hover:bg-zinc-50 transition-all text-sm"
                >
                    {language === 'en' ? 'Back to Home' : 'กลับหน้าหลัก'}
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-xmart-bg">
            <Header />
            <main className="max-w-lg mx-auto px-4 py-10">
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">กำลังโหลด...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
