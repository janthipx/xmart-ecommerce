"use client";

import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ordersStorage } from "@/lib/storage/helpers";
import { Order } from "@/types";
import { STATUS_ICONS } from "@/lib/order-status";
import { useTranslation, getOrderStatusLabel, getPaymentStatusLabel } from "@/lib/i18n";

function SuccessContent() {
    const { language, t } = useTranslation();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber") || "";
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (orderNumber) setOrder(ordersStorage.findByNumber(orderNumber) || null);
    }, [orderNumber]);

    const status = order?.orderStatus || 'PENDING';

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-2xl font-black text-xmart-text mb-2">
                {language === 'en' ? 'Order Placed Successfully!' : 'สั่งซื้อสำเร็จ!'}
            </h1>
            <p className="text-zinc-400 mb-6 text-sm">
                {language === 'en'
                    ? 'Thank you for choosing X MART. We will process your order right away.'
                    : 'ขอบคุณที่ใช้บริการ X MART เราจะดำเนินการตามคำสั่งซื้อของคุณโดยเร็ว'}
            </p>

            <div className="bg-zinc-50 rounded-2xl p-5 text-left space-y-2.5 mb-6 text-sm">
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Order Number' : 'หมายเลขออเดอร์'}</span>
                    <span className="font-black text-xmart-primary font-mono">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Order Status' : 'สถานะ'}</span>
                    <span className="font-bold text-xmart-primary">
                        {STATUS_ICONS[status]} {getOrderStatusLabel(status, language)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Payment' : 'การชำระเงิน'}</span>
                    <span className="font-bold">
                        {order?.paymentStatus === 'PAID'
                            ? (language === 'en' ? '✅ Paid' : '✅ ชำระแล้ว')
                            : order?.paymentStatus === 'FAILED'
                                ? (language === 'en' ? '❌ Payment Failed' : '❌ การชำระเงินไม่สำเร็จ')
                                : order?.paymentMethod === 'CASH'
                                    ? (language === 'en' ? '💵 Cash on Delivery' : '💵 เงินสดปลายทาง')
                                    : (language === 'en' ? '⏳ PromptPay Pending' : '⏳ รอชำระ QR')}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500">{language === 'en' ? 'Subtotal' : 'ยอดรวมสินค้า'}</span>
                    <span className="font-bold">฿{order?.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                    <span>{language === 'en' ? 'Shipping Fee' : 'ค่าจัดส่ง'}</span>
                    <span>{language === 'en' ? '฿0 (Free)' : '฿0 (ส่งฟรี)'}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-2 font-black text-xmart-primary">
                    <span>{language === 'en' ? 'Grand Total' : 'ยอดสุทธิ'}</span>
                    <span className="text-base">฿{order?.totalPrice.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Link
                    href={`/track-order?orderNumber=${orderNumber}&phone=${order?.customerPhone || ''}`}
                    className="w-full block text-center bg-xmart-primary text-white font-bold py-3.5 rounded-2xl hover:bg-xmart-primary-light transition-all shadow-md active-scale cursor-pointer text-sm"
                >
                    🔍 {language === 'en' ? 'Track Your Order' : 'ติดตามสถานะออเดอร์'}
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
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">⏳ กำลังโหลด...</div>}>
                    <SuccessContent />
                </Suspense>
            </main>
        </div>
    );
}
