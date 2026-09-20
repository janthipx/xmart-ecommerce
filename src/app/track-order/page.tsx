"use client";

import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ordersStorage, notificationsStorage } from "@/lib/storage/helpers";
import { Order } from "@/types";
import {
    calculateOrderStatus,
    STATUS_STEPS,
    STATUS_LABELS,
    STATUS_ICONS,
} from "@/lib/order-status";
import {
    useTranslation,
    getOrderStatusLabel,
    getPaymentStatusLabel,
    getOrderItemName,
} from "@/lib/i18n";
import { SearchIcon, HelpCircleIcon, XCircleIcon, OrderStatusIcon, CheckIcon, CheckCircleIcon, TruckIcon, PhoneIcon, BanknoteIcon, SmartphoneIcon, ClockIcon, LockIcon } from "@/components/icons";

function TrackForm() {
    const { language, t } = useTranslation();
    const searchParams = useSearchParams();
    const initialOrderNumber = searchParams.get('orderNumber') || '';
    const initialPhone = searchParams.get('phone') || '';

    const [form, setForm] = useState({
        orderNumber: initialOrderNumber,
        phone: initialPhone,
    });
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    // Initial search if query params provided
    useEffect(() => {
        if (initialOrderNumber.trim()) {
            const found = ordersStorage.findByNumber(initialOrderNumber.trim());
            if (found && (!initialPhone.trim() || found.customerPhone === initialPhone.trim())) {
                setOrder(found);
                setForm({ orderNumber: found.orderNumber, phone: found.customerPhone });
            }
        }
    }, [initialOrderNumber, initialPhone]);

    // Background polling every 60,000 ms (1 minute) with cleanup
    useEffect(() => {
        if (!order?.orderNumber) return;

        const checkAndSync = () => {
            const latest = ordersStorage.findByNumber(order.orderNumber);
            if (!latest) return;

            // Advance status according to schedule if active
            if (latest.orderStatus !== 'CANCELLED' && latest.orderStatus !== 'DELIVERED') {
                const calc = calculateOrderStatus(latest, Date.now());
                if (calc.currentStatus !== latest.orderStatus) {
                    const patch: Partial<Order> = {
                        orderStatus: calc.currentStatus,
                        statusUpdatedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    if (calc.isShipping && !latest.delivery?.driverName) {
                        patch.delivery = {
                            driverName: 'สมชาย มาเร็ว',
                            driverPhone: '0812345678',
                            status: 'SHIPPING',
                        };
                    }
                    ordersStorage.update(latest.orderNumber, patch);
                    notificationsStorage.add({
                        title: `อัปเดตสถานะ: ${STATUS_LABELS[calc.currentStatus]}`,
                        message: `ออเดอร์ #${latest.orderNumber}`,
                        type: 'ORDER',
                        orderNumber: latest.orderNumber,
                    });
                    setOrder(prev => prev ? { ...prev, ...patch, orderStatus: calc.currentStatus } : null);
                    return;
                }
            }

            setOrder(prev => {
                if (!prev) return latest;
                if (prev.orderStatus !== latest.orderStatus || prev.paymentStatus !== latest.paymentStatus || prev.updatedAt !== latest.updatedAt) {
                    return latest;
                }
                return prev;
            });
        };

        // Check immediately
        checkAndSync();

        // 60,000 ms background polling interval
        const pollInterval = setInterval(checkAndSync, 60000);

        // Immediate event synchronization
        const handleCustomSync = () => checkAndSync();
        window.addEventListener('xmart_storage_sync', handleCustomSync);
        window.addEventListener('storage', handleCustomSync);

        // Cleanup interval and event listeners on unmount
        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('xmart_storage_sync', handleCustomSync);
            window.removeEventListener('storage', handleCustomSync);
        };
    }, [order?.orderNumber]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);
        setCancelConfirm(false);

        const found = ordersStorage.findByNumber(form.orderNumber.trim());
        if (!found || (form.phone.trim() && found.customerPhone !== form.phone.trim())) {
            setError(language === 'en'
                ? 'Order not found. Please check the order number and phone number.'
                : 'ไม่พบคำสั่งซื้อ กรุณาตรวจสอบหมายเลขออเดอร์และเบอร์โทรศัพท์');
        } else {
            setOrder(found);
            if (!form.phone.trim()) setForm(f => ({ ...f, phone: found.customerPhone }));
        }
    };

    const handleCancel = async () => {
        if (!order) return;
        setCancelling(true);
        await new Promise(r => setTimeout(r, 400));

        // Requirement 9 & 12: When cancelled, orderStatus = 'CANCELLED' and paymentStatus = 'FAILED'
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

        const updated = ordersStorage.findByNumber(order.orderNumber);
        setOrder(updated || null);
        setCancelConfirm(false);
        setCancelling(false);
    };

    const calc = order ? calculateOrderStatus(order, Date.now()) : null;
    const currentStatus = order?.orderStatus || calc?.currentStatus || 'PENDING';
    const isCancelled = currentStatus === 'CANCELLED';
    const isShipping = currentStatus === 'SHIPPING';
    const isDelivered = currentStatus === 'DELIVERED';
    const canCancel = calc?.canCancel ?? false;

    const currentIdx = STATUS_STEPS.indexOf(currentStatus);

    const driverName = order?.delivery?.driverName || (language === 'en' ? 'Somchai Marew' : 'สมชาย มาเร็ว');
    const driverPhone = order?.delivery?.driverPhone || '0812345678';

    return (
        <>
            <form onSubmit={handleSearch} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm mb-5">
                <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3.5">
                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1.5">
                            {language === 'en' ? 'Order Number' : 'หมายเลขคำสั่งซื้อ'}
                        </label>
                        <input
                            required
                            value={form.orderNumber}
                            onChange={e => setForm({ ...form, orderNumber: e.target.value })}
                            placeholder={language === 'en' ? 'e.g. XM20260914001' : 'เช่น XM20260914001'}
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary min-h-[44px]"
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1.5">
                            {language === 'en' ? 'Phone Number (Optional)' : 'เบอร์โทรศัพท์ (ถ้ามี)'}
                        </label>
                        <input
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="08XXXXXXXX"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary min-h-[44px]"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-[#0060df] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#0051bc] transition-all active-scale text-sm sm:text-base min-h-[44px] cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                            <SearchIcon className="w-4 h-4" />
                            <span>{t('track.searchBtn')}</span>
                        </button>
                    </div>
                </div>
                <p className="text-xs text-zinc-400 mt-3 flex items-center gap-1 flex-wrap">
                    <HelpCircleIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{language === 'en' ? 'Quick demo test:' : 'ตัวอย่างทดสอบ:'}</span>{' '}
                    <button type="button" onClick={() => { setForm({ orderNumber: 'XM20260914003', phone: '0856667788' }); }} className="font-mono text-zinc-700 font-bold underline hover:text-xmart-primary">XM20260914003</button> (PENDING),{' '}
                    <button type="button" onClick={() => { setForm({ orderNumber: 'XM20260914002', phone: '0891112233' }); }} className="font-mono text-zinc-700 font-bold underline hover:text-xmart-primary">XM20260914002</button> (PREPARING),{' '}
                    <button type="button" onClick={() => { setForm({ orderNumber: 'XM20260914001', phone: '0812345678' }); }} className="font-mono text-zinc-700 font-bold underline hover:text-xmart-primary">XM20260914001</button> (SHIPPING)
                </p>
            </form>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-2xl font-bold text-center mb-5 text-sm border border-red-100">
                    {error}
                </div>
            )}

            {order && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm">
                    {/* Header bar without countdown/timer */}
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-5 pb-4 border-b border-zinc-100">
                        <div>
                            <p className="text-xs text-zinc-400 mb-0.5">{language === 'en' ? 'Order Number' : 'หมายเลขออเดอร์'}</p>
                            <h2 className="text-lg font-black text-xmart-primary">{order.orderNumber}</h2>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            isCancelled
                                ? 'bg-red-100 text-red-600'
                                : isDelivered
                                    ? 'bg-green-100 text-green-700'
                                    : isShipping
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-blue-100 text-blue-700'
                        }`}>
                            {isCancelled ? (
                                <>
                                    <XCircleIcon className="w-4 h-4 text-red-600" />
                                    <span>{language === 'en' ? 'Order Cancelled' : 'ยกเลิกคำสั่งซื้อแล้ว'}</span>
                                </>
                            ) : (
                                <>
                                    <OrderStatusIcon status={currentStatus} className="w-4 h-4" />
                                    <span>{getOrderStatusLabel(currentStatus, language)}</span>
                                </>
                            )}
                        </span>
                    </div>

                    {/* Timeline Progression: PENDING -> CONFIRMED -> PREPARING -> SHIPPING -> DELIVERED */}
                    {!isCancelled && (
                        <div className="mb-6">
                            <h3 className="font-bold text-sm mb-4">{language === 'en' ? 'Order Progression' : 'ลำดับสถานะการสั่งซื้อ'}</h3>
                            <div className="space-y-3">
                                {STATUS_STEPS.map((step, idx) => {
                                    const done = idx <= currentIdx;
                                    const current = idx === currentIdx;
                                    return (
                                        <div key={step} className={`flex items-center gap-3 ${done ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all ${
                                                current
                                                    ? 'bg-xmart-primary text-white shadow-md shadow-blue-300 ring-4 ring-xmart-primary/20 scale-105'
                                                    : done
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-zinc-100 text-zinc-400'
                                            }`}>
                                                {done && !current ? <CheckIcon className="w-4 h-4" /> : <OrderStatusIcon status={step} className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-bold ${current ? 'text-xmart-primary font-black' : done ? 'text-green-700' : 'text-zinc-400'}`}>
                                                    {getOrderStatusLabel(step, language)}
                                                </p>
                                            </div>
                                            {current && (
                                                <span className="text-[10px] bg-xmart-primary text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                                                    {language === 'en' ? 'Current Status' : 'สถานะปัจจุบัน'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Driver info: DISPLAYED ONLY WHEN orderStatus === 'SHIPPING' */}
                    {isShipping && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                    <TruckIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">
                                        {language === 'en' ? 'Driver is delivering your items' : 'พนักงานจัดส่งกำลังนำส่งสินค้า'}
                                    </p>
                                    <p className="font-black text-zinc-900 text-sm">{driverName}</p>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        {language === 'en' ? 'Phone:' : 'เบอร์โทร:'} {driverPhone}
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`tel:${driverPhone}`}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all active-scale text-xs sm:text-sm shadow-md shadow-green-600/20 min-h-[44px]"
                            >
                                <PhoneIcon className="w-4 h-4" />
                                <span>{language === 'en' ? 'Call Driver' : 'โทรหาคนขับ'}</span>
                            </a>
                        </div>
                    )}

                    {/* Customer info */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-5 text-sm">
                        <div className="bg-zinc-50 rounded-xl p-3">
                            <p className="text-xs text-zinc-400 mb-0.5">{language === 'en' ? 'Recipient' : 'ผู้รับ'}</p>
                            <p className="font-bold">{order.customerName}</p>
                            <p className="text-zinc-500">{order.customerPhone}</p>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-3">
                            <p className="text-xs text-zinc-400 mb-0.5">{language === 'en' ? 'Delivery Address' : 'ที่อยู่จัดส่ง'}</p>
                            <p className="font-bold text-xs leading-relaxed">
                                {order.address} {order.subdistrict} {order.district} {order.province} {order.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* Payment Status Box (Requirement 2, 9, 12) */}
                    <div className="bg-zinc-50 rounded-xl p-3.5 mb-3 text-sm flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <p className="text-xs text-zinc-400 mb-0.5">{language === 'en' ? 'Payment Method' : 'การชำระเงิน'}</p>
                            <p className="font-bold">
                                {order.paymentMethod === 'CASH' ? (
                                    <span className="inline-flex items-center gap-1.5"><BanknoteIcon className="w-4 h-4 text-zinc-600" /> <span>{language === 'en' ? 'Cash on Delivery (COD)' : 'เงินสดปลายทาง'}</span></span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5"><SmartphoneIcon className="w-4 h-4 text-blue-600" /> <span>{language === 'en' ? 'PromptPay QR' : 'QR PromptPay'}</span></span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {isCancelled || order.paymentStatus === 'FAILED' ? (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 inline-flex items-center gap-1">
                                    <XCircleIcon className="w-3.5 h-3.5" />
                                    <span>{language === 'en' ? 'Payment Failed' : 'การชำระเงินไม่สำเร็จ'}</span>
                                </span>
                            ) : order.paymentStatus === 'PAID' ? (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1">
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    <span>{language === 'en' ? 'Paid' : 'ชำระเงินแล้ว'}</span>
                                </span>
                            ) : (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 inline-flex items-center gap-1">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    <span>{language === 'en' ? 'Waiting for Payment' : 'รอการชำระเงิน'}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Unpaid PromptPay Callout with Pay Now Button (Requirement 2 & 12) */}
                    {order.paymentMethod === 'PROMPTPAY' && order.paymentStatus === 'PENDING' && !isCancelled && (
                        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 mb-5 text-left flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-0.5">
                                <p className="font-bold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
                                    <ClockIcon className="w-4 h-4 text-amber-600" />
                                    <span>{language === 'en' ? 'Waiting for Payment' : 'รอการชำระเงิน'}</span>
                                </p>
                                <p className="text-xs text-amber-800">
                                    {language === 'en'
                                        ? 'Please complete payment via QR Code to proceed with preparation and delivery.'
                                        : 'กรุณากดชำระเงินเพื่อเปิด QR Code และเริ่มการจัดเตรียม/จัดส่งสินค้า'}
                                </p>
                            </div>
                            <Link
                                href={`/checkout/qr?orderNumber=${order.orderNumber}`}
                                className="inline-flex items-center gap-1.5 bg-[#0060df] hover:bg-[#0051bc] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all active-scale cursor-pointer min-h-[44px]"
                            >
                                <SmartphoneIcon className="w-4 h-4" />
                                <span>{language === 'en' ? 'Pay Now' : 'ชำระเงิน'}</span>
                            </Link>
                        </div>
                    )}

                    {/* Items */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-sm">{language === 'en' ? 'Order Items' : 'รายการสินค้า'}</h3>
                            <span className="text-[11px] text-zinc-400 font-medium inline-flex items-center gap-1">
                                <LockIcon className="w-3 h-3" />
                                <span>{language === 'en' ? 'Order locked' : 'ไม่อนุญาตให้แก้ไข'}</span>
                            </span>
                        </div>
                        <ul className="divide-y divide-zinc-100">
                            {order.items.map(item => (
                                <li key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                                    <div className="flex gap-2 items-center">
                                        <span className="bg-zinc-100 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg">
                                            {item.quantity}
                                        </span>
                                        <span className="font-medium text-zinc-800">
                                            {getOrderItemName(item, language)}
                                        </span>
                                    </div>
                                    <span className="font-bold">฿{(item.priceAtTimeOfOrder * item.quantity).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-zinc-50 rounded-2xl p-4 mb-5">
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>{language === 'en' ? 'Subtotal' : 'ยอดรวมสินค้า'}</span>
                            <span>฿{order.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-green-600 font-bold mb-2">
                            <span>{language === 'en' ? 'Shipping Fee' : 'ค่าจัดส่ง'}</span>
                            <span>{language === 'en' ? '฿0 (Free 🚚)' : '฿0 (ส่งฟรี 🚚)'}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-200 pt-2">
                            <span className="font-bold text-zinc-800 text-sm">{language === 'en' ? 'Total Amount' : 'ยอดสุทธิ'}</span>
                            <span className="text-2xl font-black text-xmart-primary">฿{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Cancellation Actions */}
                    {canCancel && !cancelConfirm && !isCancelled && (
                        <div className="pt-2">
                            <button
                                onClick={() => setCancelConfirm(true)}
                                className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-50 transition-all text-sm active-scale cursor-pointer inline-flex items-center justify-center gap-1.5"
                            >
                                <XCircleIcon className="w-4 h-4" />
                                <span>{t('track.cancelBtn')}</span>
                            </button>
                            <p className="text-[11px] text-zinc-400 text-center mt-2">
                                {language === 'en'
                                    ? 'Order can be cancelled prior to final delivery (PENDING, CONFIRMED, PREPARING, SHIPPING)'
                                    : 'สามารถยกเลิกคำสั่งซื้อได้ทุกสถานะก่อนสินค้าถึงมือผู้รับ'}
                            </p>
                        </div>
                    )}

                    {/* Non-cancelable notice for DELIVERED */}
                    {isDelivered && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                            <p className="text-green-700 font-bold text-sm inline-flex items-center justify-center gap-1.5">
                                <CheckCircleIcon className="w-4 h-4" />
                                <span>{language === 'en' ? 'Delivered Successfully' : 'จัดส่งสำเร็จ'}</span>
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                {language === 'en' ? 'Thank you for shopping with X MART' : 'ขอบคุณที่ใช้บริการ X MART ซูเปอร์มาร์เก็ตออนไลน์ 24 ชม.'}
                            </p>
                        </div>
                    )}

                    {/* Cancel confirmation dialog */}
                    {cancelConfirm && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                            <p className="font-bold text-red-700 mb-2 text-sm">
                                {language === 'en' ? 'Confirm Cancellation?' : 'ยืนยันการยกเลิกคำสั่งซื้อนี้?'}
                            </p>
                            <p className="text-xs text-red-500 mb-4">
                                {language === 'en'
                                    ? 'Once cancelled, this cannot be undone. Payment status will be set to Failed.'
                                    : 'เมื่อยกเลิกแล้วจะไม่สามารถกู้คืนได้ และสถานะการชำระเงินจะถูกปรับเป็นไม่สำเร็จ'}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setCancelConfirm(false)}
                                    className="flex-1 border border-zinc-200 bg-white text-zinc-700 font-bold py-2.5 rounded-xl hover:bg-zinc-50 transition-all text-sm cursor-pointer"
                                >
                                    {language === 'en' ? 'Keep Order' : 'ไม่ยกเลิก'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-all text-sm disabled:opacity-60 cursor-pointer"
                                >
                                    {cancelling ? (language === 'en' ? 'Cancelling...' : 'กำลังยกเลิก...') : (language === 'en' ? 'Confirm Cancel' : 'ยืนยันยกเลิก')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Permanently Cancelled Message */}
                    {isCancelled && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center mt-2">
                            <p className="text-red-600 font-bold text-sm inline-flex items-center justify-center gap-1.5">
                                <XCircleIcon className="w-4 h-4" />
                                <span>{language === 'en' ? 'Order Cancelled — Payment Failed' : 'คำสั่งซื้อนี้ถูกยกเลิกแล้ว — การชำระเงินไม่สำเร็จ'}</span>
                            </p>
                            <p className="text-xs text-red-400 mt-1">
                                {language === 'en' ? 'To purchase items, please place a new order.' : 'หากต้องการซื้อสินค้า กรุณาสร้างคำสั่งซื้อใหม่'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default function TrackOrderPage() {
    const { language, t } = useTranslation();

    return (
        <div className="min-h-screen bg-xmart-bg pb-24">
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-6">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-xmart-text">{t('track.title')}</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        {language === 'en' ? 'Real-time order tracking without login' : 'ตรวจสอบสถานะคำสั่งซื้อ ไม่ต้องเข้าสู่ระบบ'}
                    </p>
                </div>
                <Suspense fallback={<div className="text-center p-8 text-zinc-400">กำลังโหลด...</div>}>
                    <TrackForm />
                </Suspense>
            </main>
        </div>
    );
}
