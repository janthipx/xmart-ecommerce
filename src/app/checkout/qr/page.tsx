"use client";

import { Header } from "@/components/layout/Header";
import { ordersStorage, notificationsStorage } from "@/lib/storage/helpers";
import { generatePromptPayQrDataUrl } from "@/lib/promptpay";
import { useTranslation } from "@/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Order } from "@/types";
import Link from "next/link";
import { FlaskConicalIcon, CheckIcon, XIcon, ClockIcon, RefreshCwIcon, SmartphoneIcon } from "@/components/icons";

function QrContent() {
    const { language, t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderNumber = searchParams.get('orderNumber') || '';

    const [order, setOrder] = useState<Order | null>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
    const [generatingQr, setGeneratingQr] = useState(true);
    const [paymentFlowState, setPaymentFlowState] = useState<'PENDING' | 'CHECKING' | 'PAID' | 'FAILED'>('PENDING');
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15-minute countdown (Requirement 11)

    useEffect(() => {
        if (!orderNumber) return;
        const found = ordersStorage.findByNumber(orderNumber);
        if (found) {
            setOrder(found);
            if (found.orderStatus === 'CANCELLED') {
                setPaymentFlowState('FAILED');
            } else if (found.paymentStatus === 'PAID') {
                setPaymentFlowState('PAID');
            } else {
                setPaymentFlowState('PENDING');
            }

            // Generate authentic PromptPay QR code with dynamic amount from existing order snapshot (Requirement 4 & 15)
            generatePromptPayQrDataUrl('0812345678', found.totalPrice)
                .then(url => {
                    setQrCodeDataUrl(url);
                    setGeneratingQr(false);
                })
                .catch(err => {
                    console.error('Failed to generate PromptPay QR:', err);
                    setGeneratingQr(false);
                });
        }
    }, [orderNumber]);

    // 15-minute countdown interval (Requirement 11)
    useEffect(() => {
        if (paymentFlowState !== 'PENDING') return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [paymentFlowState]);

    const handleRefreshQr = () => {
        setTimeLeft(15 * 60);
        setGeneratingQr(true);
        if (order) {
            generatePromptPayQrDataUrl('0812345678', order.totalPrice)
                .then(url => {
                    setQrCodeDataUrl(url);
                    setGeneratingQr(false);
                })
                .catch(() => setGeneratingQr(false));
        }
    };

    // Flow: Customer confirms payment -> Mark as PAID (Requirement 5)
    const handleSimulatePaySuccess = async () => {
        if (!order || order.orderStatus === 'CANCELLED') return;
        setPaymentFlowState('CHECKING');
        setLoadingMessage(language === 'en' ? 'Verifying payment...' : 'กำลังตรวจสอบการชำระเงิน...');

        await new Promise(r => setTimeout(r, 1200));

        const nowIso = new Date().toISOString();
        // Mark as PAID and advance order to CONFIRMED (Requirement 5 & 6)
        ordersStorage.update(order.orderNumber, {
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            paidAt: nowIso,
            statusUpdatedAt: nowIso,
            updatedAt: nowIso,
        });

        notificationsStorage.add({
            title: language === 'en' ? 'Payment Received' : 'ชำระเงินสำเร็จ',
            message: language === 'en'
                ? `Order #${order.orderNumber} paid via PromptPay QR`
                : `ออเดอร์ #${order.orderNumber} ชำระเงินผ่าน PromptPay QR เรียบร้อยแล้ว`,
            type: 'PAYMENT',
            orderNumber: order.orderNumber,
        });

        const refreshed = ordersStorage.findByNumber(order.orderNumber);
        setOrder(refreshed || null);
        setPaymentFlowState('PAID');

        setTimeout(() => {
            router.push(`/order-success?orderNumber=${order.orderNumber}`);
        }, 1200);
    };

    // Flow: Customer chooses Pay Later (Requirement 1, 2, 14)
    const handlePayLater = () => {
        if (!order) return;
        router.push(`/order-success?orderNumber=${order.orderNumber}`);
    };

    // Demo Flow: Simulate Payment Failure
    const handleSimulatePayFailed = async () => {
        if (!order) return;
        setPaymentFlowState('CHECKING');
        setLoadingMessage(language === 'en' ? 'Simulating bank decline...' : 'กำลังจำลองการปฏิเสธยอดชำระเงิน...');

        await new Promise(r => setTimeout(r, 1000));

        ordersStorage.update(order.orderNumber, {
            paymentStatus: 'FAILED',
            statusUpdatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        notificationsStorage.add({
            title: language === 'en' ? 'Payment Failed' : 'การชำระเงินไม่สำเร็จ',
            message: language === 'en'
                ? `Order #${order.orderNumber} payment could not be processed`
                : `ออเดอร์ #${order.orderNumber} การชำระเงินไม่สำเร็จ`,
            type: 'PAYMENT',
            orderNumber: order.orderNumber,
        });

        const refreshed = ordersStorage.findByNumber(order.orderNumber);
        setOrder(refreshed || null);
        setPaymentFlowState('FAILED');
    };

    // Cancel order flow: Order Status = CANCELLED, Payment Status = FAILED
    const handleCancelOrder = async () => {
        if (!order) return;
        if (!confirm(language === 'en' ? `Cancel order #${order.orderNumber}?` : `ยืนยันการยกเลิกคำสั่งซื้อ #${order.orderNumber}?`)) return;
        setPaymentFlowState('CHECKING');
        setLoadingMessage(language === 'en' ? 'Cancelling order...' : 'กำลังยกเลิกคำสั่งซื้อ...');

        await new Promise(r => setTimeout(r, 800));

        ordersStorage.update(order.orderNumber, {
            orderStatus: 'CANCELLED',
            paymentStatus: 'FAILED',
            statusUpdatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        notificationsStorage.add({
            title: language === 'en' ? 'Order Cancelled' : 'ยกเลิกออเดอร์แล้ว',
            message: language === 'en'
                ? `Order #${order.orderNumber} has been cancelled`
                : `ออเดอร์ #${order.orderNumber} ถูกยกเลิกเรียบร้อยแล้ว`,
            type: 'ORDER',
            orderNumber: order.orderNumber,
        });

        const refreshed = ordersStorage.findByNumber(order.orderNumber);
        setOrder(refreshed || null);
        setPaymentFlowState('FAILED');
    };

    const isOrderCancelled = order?.orderStatus === 'CANCELLED';

    return (
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-zinc-100 text-center max-w-md mx-auto w-full">
            {/* Header branding */}
            <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#0060df] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    XM
                </div>
                <span className="text-xl font-black text-[#0060df] tracking-tight">X MART</span>
            </div>

            {/* ORDER CANCELLED / FAILED VIEW */}
            {(paymentFlowState === 'FAILED' || isOrderCancelled) ? (
                <div className="py-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <XIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-red-600 mb-1">
                        {language === 'en' ? 'Payment Failed' : 'การชำระเงินไม่สำเร็จ'}
                    </h2>
                    <p className="text-xs text-zinc-500 mb-4">
                        {isOrderCancelled
                            ? (language === 'en' ? 'This order has been cancelled and cannot be paid.' : 'คำสั่งซื้อนี้ถูกยกเลิกแล้ว ไม่สามารถดำเนินการชำระเงินได้')
                            : (language === 'en' ? 'The payment was not completed or was declined.' : 'ระบบไม่สามารถดำเนินการชำระเงินได้ หรือการทำรายการถูกปฏิเสธ')}
                    </p>

                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left text-xs text-zinc-600 mb-6 space-y-1.5">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">{language === 'en' ? 'Order Number:' : 'หมายเลขออเดอร์:'}</span>
                            <span className="font-mono font-bold text-zinc-800">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">{language === 'en' ? 'Order Status:' : 'สถานะคำสั่งซื้อ:'}</span>
                            <span className="font-bold text-red-600">
                                {isOrderCancelled ? (language === 'en' ? 'CANCELLED' : 'ยกเลิกแล้ว') : (language === 'en' ? 'PENDING' : 'รอการยืนยัน')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">{language === 'en' ? 'Payment Status:' : 'สถานะการชำระเงิน:'}</span>
                            <span className="font-bold text-red-600">
                                {language === 'en' ? 'FAILED' : 'ไม่สำเร็จ'}
                            </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-zinc-200">
                            <span className="text-zinc-400">{language === 'en' ? 'Amount:' : 'ยอดชำระ:'}</span>
                            <span className="font-black text-zinc-800">฿{order?.totalPrice.toLocaleString() || '0.00'}</span>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {!isOrderCancelled && (
                            <button
                                onClick={() => setPaymentFlowState('PENDING')}
                                className="w-full bg-[#0060df] hover:bg-[#0051bc] text-white font-bold py-3 rounded-xl transition-all active-scale text-xs shadow-md cursor-pointer"
                            >
                                {language === 'en' ? 'Try PromptPay QR Again' : 'ลองสแกน QR ใหม่อีกครั้ง'}
                            </button>
                        )}
                        <Link
                            href={`/track-order?orderNumber=${orderNumber}&phone=${order?.customerPhone || ''}`}
                            className="block w-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold py-3 rounded-xl transition-all text-xs"
                        >
                            {language === 'en' ? 'View Order Tracking' : 'ไปที่หน้าติดตามคำสั่งซื้อ'}
                        </Link>
                        <Link
                            href="/products"
                            className="block text-xs text-zinc-400 hover:text-zinc-600 pt-1"
                        >
                            {language === 'en' ? 'Return to Shop' : 'กลับไปเลือกซื้อสินค้า'}
                        </Link>
                    </div>
                </div>
            ) : paymentFlowState === 'CHECKING' ? (
                /* CHECKING STATE */
                <div className="py-12 animate-in fade-in duration-150">
                    <div className="w-12 h-12 border-4 border-[#0060df]/30 border-t-[#0060df] rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-base font-bold text-zinc-800 mb-1">
                        {language === 'en' ? 'Verifying Payment...' : 'กำลังตรวจสอบการชำระเงิน...'}
                    </h3>
                    <p className="text-xs text-zinc-400">{loadingMessage}</p>
                </div>
            ) : paymentFlowState === 'PAID' ? (
                /* PAID STATE */
                <div className="py-8 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                        ✓
                    </div>
                    <h2 className="text-xl font-bold text-emerald-600 mb-1">
                        {language === 'en' ? 'Payment Successful!' : 'ชำระเงินสำเร็จแล้ว!'}
                    </h2>
                    <p className="text-xs text-zinc-500 mb-2">
                        {language === 'en' ? 'Redirecting to confirmation...' : 'ระบบได้รับการชำระเงินแล้ว กำลังนำท่านไปยังหน้ายืนยัน...'}
                    </p>
                    <div className="text-xs font-mono text-zinc-400">Order #{orderNumber}</div>
                </div>
            ) : (
                /* PENDING PROMPTPAY QR VIEW */
                <>
                    <h1 className="text-lg sm:text-xl font-bold text-zinc-900 mb-0.5">
                        {language === 'en' ? 'PromptPay QR Payment' : 'ชำระเงินผ่าน PromptPay QR'}
                    </h1>
                    <p className="text-zinc-500 text-xs mb-3">
                        {language === 'en' ? 'Order Number' : 'หมายเลขคำสั่งซื้อ'}: <span className="font-mono font-bold text-zinc-800">#{orderNumber}</span>
                    </p>

                    {/* Authentic PromptPay Header Card */}
                    <div className="bg-gradient-to-b from-[#003b7a] to-[#002752] text-white rounded-2xl p-3 sm:p-4 mb-3 shadow-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-blue-400/20 text-xs">
                            <span className="font-bold tracking-wider text-blue-200 uppercase">PromptPay</span>
                            <span className="text-[11px] bg-blue-500/30 px-2 py-0.5 rounded text-blue-100 font-mono">TH QR Payment</span>
                        </div>
                        <div className="pt-2 text-center">
                            <div className="text-[11px] text-blue-200 mb-0.5">{language === 'en' ? 'Amount Due' : 'ยอดชำระ'}</div>
                            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                ฿{order?.totalPrice ? order.totalPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                            </div>
                            <div className="text-[10px] text-blue-300 mt-0.5">X MART Supermarket (Demo Biller)</div>
                        </div>
                    </div>

                    {/* 15-Minute Countdown Timer (Requirement 11) */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 mb-3 bg-zinc-50 py-1.5 px-3 rounded-xl border border-zinc-200/80">
                        <ClockIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{language === 'en' ? 'QR Code expires in:' : 'QR Code มีอายุการใช้งาน:'}</span>
                        <span className={`font-mono font-bold ${timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-zinc-800'}`}>
                            {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')} นาที
                        </span>
                    </div>

                    {/* QR Code Expired Warning with Retry Button (Requirement 11) */}
                    {timeLeft === 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center mb-3">
                            <p className="font-bold text-amber-800 text-xs sm:text-sm">
                                {language === 'en' ? 'QR Code Expired' : 'QR Code หมดอายุการใช้งานแล้ว'}
                            </p>
                            <p className="text-[11px] text-amber-700 mt-1 leading-snug">
                                {language === 'en'
                                    ? `Order #${orderNumber} is still saved. Click below to reopen QR for the same order.`
                                    : `คำสั่งซื้อ #${orderNumber} ยังคงอยู่ สามารถกดปุ่มด้านล่างเพื่อเปิด QR Code เดิมสำหรับชำระเงินได้`}
                            </p>
                            <button
                                onClick={handleRefreshQr}
                                className="mt-2.5 inline-flex items-center gap-1.5 bg-[#0060df] hover:bg-[#0051bc] text-white font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer active-scale"
                            >
                                <RefreshCwIcon className="w-3.5 h-3.5" />
                                <span>{language === 'en' ? 'Pay Again' : 'ชำระเงินอีกครั้ง'}</span>
                            </button>
                        </div>
                    )}

                    {/* Dynamic PromptPay QR Code Canvas/Image */}
                    <div className={`mx-auto w-48 h-48 sm:w-60 sm:h-60 max-w-full bg-white border-2 rounded-2xl p-2.5 mb-3 shadow-inner flex items-center justify-center relative transition-opacity ${timeLeft === 0 ? 'opacity-30 border-zinc-300' : 'border-zinc-200'}`}>
                        {generatingQr ? (
                            <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs">{language === 'en' ? 'Generating QR...' : 'กำลังสร้าง QR Code...'}</span>
                            </div>
                        ) : qrCodeDataUrl ? (
                            <img
                                src={qrCodeDataUrl}
                                alt="PromptPay QR Code"
                                className="w-full h-full object-contain select-none"
                            />
                        ) : (
                            <div className="text-xs text-red-500">Error generating QR</div>
                        )}
                    </div>

                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                        {language === 'en'
                            ? 'Open any Thai mobile banking app and scan this QR to pay.'
                            : 'เปิดแอปธนาคารของท่านและสแกน QR Code เพื่อชำระเงิน'}
                    </p>

                    {/* Demo Simulation Notice */}
                    <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 mb-4 text-left">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs sm:text-sm mb-1">
                            <FlaskConicalIcon className="w-4 h-4 text-amber-700" />
                            <span>{language === 'en' ? 'Demo Payment Simulation' : 'ระบบจำลองการชำระเงิน (Demo)'}</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-snug">
                            {language === 'en'
                                ? 'Offline demo mode: No actual funds will be transferred. Use the buttons below to confirm payment or choose to pay later.'
                                : 'โหมดทดสอบ: ไม่มีการตัดเงินจริง ท่านสามารถกดยืนยันการชำระเงินเพื่อทดสอบ หรือกดชำระภายหลังเพื่อกลับมาจ่ายในภายหลัง'}
                        </p>
                    </div>

                    {/* Action buttons (Requirement 1, 2, 5) */}
                    <div className="space-y-2.5">
                        <button
                            onClick={handleSimulatePaySuccess}
                            disabled={timeLeft === 0}
                            className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all active-scale text-xs sm:text-sm shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <CheckIcon className="w-4 h-4" />
                            <span>{language === 'en' ? 'Confirm Payment' : 'ยืนยันการชำระเงิน'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handlePayLater}
                            className="w-full min-h-[44px] border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold py-2.5 px-4 rounded-xl transition-all active-scale text-xs sm:text-sm cursor-pointer flex items-center justify-center"
                        >
                            {language === 'en' ? 'Pay Later' : 'ชำระภายหลัง'}
                        </button>

                        <button
                            onClick={handleCancelOrder}
                            className="w-full min-h-[42px] bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-500 font-medium py-2 px-3 rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center"
                        >
                            {language === 'en' ? 'Cancel This Order' : 'ยกเลิกคำสั่งซื้อนี้'}
                        </button>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm text-zinc-500">
                        <Link
                            href={`/track-order?orderNumber=${orderNumber}&phone=${order?.customerPhone || ''}`}
                            className="hover:text-zinc-700 underline font-medium"
                        >
                            {language === 'en' ? 'Track Order' : 'ติดตามสถานะคำสั่งซื้อ'}
                        </Link>
                        <Link href="/products" className="hover:text-zinc-700 font-medium">
                            {language === 'en' ? 'Back to Shop' : 'กลับไปเลือกซื้อสินค้า'}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function QrPaymentPage() {
    return (
        <div className="min-h-screen bg-xmart-bg pb-16">
            <Header />
            <main className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
                <Suspense fallback={<div className="text-center py-20 text-zinc-400">กำลังโหลด...</div>}>
                    <QrContent />
                </Suspense>
            </main>
        </div>
    );
}
