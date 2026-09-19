"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, notificationsStorage } from "@/lib/storage/helpers";
import { useEffect, useState, use } from "react";
import { Order, OrderStatus } from "@/types";
import {
    STATUS_STEPS,
    STATUS_LABELS,
    STATUS_ICONS,
    canCancelOrder,
    calculateOrderStatus,
    getAdjustedCreatedAtForStatus,
} from "@/lib/order-status";
import Link from "next/link";

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: 'bg-orange-100 text-orange-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-yellow-100 text-yellow-700',
    SHIPPING: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-600',
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: 'CONFIRMED',
    CONFIRMED: 'PREPARING',
    PREPARING: 'SHIPPING',
    SHIPPING: 'DELIVERED',
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [now, setNow] = useState(Date.now());
    const [cancelling, setCancelling] = useState(false);

    // 1-second live clock
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load and sync order
    const loadOrder = () => {
        const found = ordersStorage.findByNumber(orderId) ||
                      ordersStorage.getAll().find(o => o.orderNumber.toLowerCase() === orderId.toLowerCase());
        setOrder(found || null);
    };

    useEffect(() => {
        loadOrder();
        const handleSync = () => loadOrder();
        window.addEventListener('xmart_storage_sync', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('xmart_storage_sync', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, [orderId]);

    if (!order) {
        return (
            <AdminLayout>
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm max-w-lg mx-auto my-8">
                    <div className="text-5xl mb-3">🔍</div>
                    <h2 className="text-lg font-bold text-zinc-700 mb-2">ไม่พบคำสั่งซื้อ #{orderId}</h2>
                    <p className="text-xs text-zinc-400 mb-5">กรุณาตรวจสอบหมายเลขคำสั่งซื้ออีกครั้ง</p>
                    <Link href="/admin/orders" className="bg-xmart-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-xmart-primary-light transition-all">
                        ← กลับหน้ารายการออเดอร์
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    const calc = calculateOrderStatus(order, now);
    const currentStatus = calc.currentStatus;
    const isShipping = currentStatus === 'SHIPPING';
    const isDelivered = currentStatus === 'DELIVERED';
    const isCancelled = currentStatus === 'CANCELLED';
    const canCancel = calc.canCancel;

    const handleAdvance = () => {
        const next = NEXT_STATUS[currentStatus];
        if (!next) return;
        const nowIso = new Date().toISOString();
        const patch: Partial<Order> = {
            orderStatus: next,
            createdAt: getAdjustedCreatedAtForStatus(next),
            statusUpdatedAt: nowIso,
            updatedAt: nowIso,
        };
        if (next === 'SHIPPING' && !order.delivery?.driverName) {
            patch.delivery = {
                driverName: 'สมชาย มาเร็ว',
                driverPhone: '0812345678',
                status: 'SHIPPING',
            };
        }
        ordersStorage.update(order.orderNumber, patch);
        notificationsStorage.add({
            title: `อัปเดตสถานะ: ${STATUS_LABELS[next]}`,
            message: `ออเดอร์ #${order.orderNumber}`,
            type: 'ORDER',
            orderNumber: order.orderNumber,
        });
        loadOrder();
    };

    const handleCancel = async () => {
        if (!canCancelOrder(currentStatus)) {
            alert('คำสั่งซื้อจัดส่งสำเร็จแล้วหรือไม่สามารถยกเลิกได้');
            return;
        }
        if (!confirm(`ยืนยันยกเลิกคำสั่งซื้อ #${order.orderNumber}?`)) return;
        setCancelling(true);
        const nowIso = new Date().toISOString();
        ordersStorage.update(order.orderNumber, {
            orderStatus: 'CANCELLED',
            statusUpdatedAt: nowIso,
            updatedAt: nowIso,
        });
        notificationsStorage.add({
            title: 'ยกเลิกออเดอร์แล้ว ❌',
            message: `ออเดอร์ #${order.orderNumber} ถูกยกเลิกเรียบร้อยแล้ว`,
            type: 'ORDER',
            orderNumber: order.orderNumber,
        });
        loadOrder();
        setCancelling(false);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-5">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-3">
                    <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-xmart-primary">
                        ← กลับหน้ารายการออเดอร์
                    </Link>
                    <span className="text-xs text-zinc-400 font-medium">
                        สร้างเมื่อ: {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-zinc-100">
                        <div>
                            <p className="text-xs text-zinc-400 mb-0.5">หมายเลขออเดอร์</p>
                            <h1 className="text-xl font-black text-xmart-primary">{order.orderNumber}</h1>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_COLORS[currentStatus]}`}>
                            {STATUS_ICONS[currentStatus]} {STATUS_LABELS[currentStatus]}
                        </span>
                    </div>

                    {/* 5-Min Real-time Timer banner */}
                    {!isDelivered && !isCancelled && calc.nextStatus && (
                        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 my-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-xmart-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                                    ⏱️
                                </div>
                                <div>
                                    <p className="text-[11px] text-blue-700 font-bold uppercase tracking-wider">ระบบจำลองเปลี่ยนสถานะอัตโนมัติ (ทุก 5 นาที)</p>
                                    <p className="text-sm font-black text-zinc-900">
                                        สถานะถัดไปใน <span className="font-mono text-xmart-primary text-base font-black bg-white px-2 py-0.5 rounded-lg border border-blue-200">{calc.formattedRemaining} นาที</span>
                                    </p>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        เป้าหมายถัดไป: {STATUS_ICONS[calc.nextStatus]} {STATUS_LABELS[calc.nextStatus]}
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-white px-3 py-1.5 rounded-xl border border-blue-200">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                ซิงค์เวลาจริง
                            </span>
                        </div>
                    )}

                    {/* Timeline */}
                    {!isCancelled && (
                        <div className="my-6">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-3">ลำดับสถานะการจัดส่ง</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {STATUS_STEPS.map((step, idx) => {
                                    const done = idx <= calc.stepIndex;
                                    const isCurrent = idx === calc.stepIndex;
                                    return (
                                        <div key={step} className={`p-3 rounded-2xl border transition-all text-center ${
                                            isCurrent
                                                ? 'bg-blue-50 border-xmart-primary shadow-xs ring-2 ring-xmart-primary/10'
                                                : done
                                                ? 'bg-green-50/60 border-green-200'
                                                : 'bg-zinc-50 border-zinc-100 opacity-50'
                                        }`}>
                                            <div className="text-xl mb-1">{done && !isCurrent ? '✓' : STATUS_ICONS[step]}</div>
                                            <p className={`text-xs font-bold ${isCurrent ? 'text-xmart-primary font-black' : done ? 'text-green-700' : 'text-zinc-400'}`}>
                                                {STATUS_LABELS[step]}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Driver Card */}
                    {isShipping && (
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 my-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg">
                                    🛵
                                </div>
                                <div>
                                    <p className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">พนักงานจัดส่ง</p>
                                    <p className="font-black text-zinc-900 text-sm">{order.delivery?.driverName || 'สมชาย มาเร็ว'}</p>
                                    <p className="text-xs text-zinc-500 font-medium">เบอร์โทร: {order.delivery?.driverPhone || '0812345678'}</p>
                                </div>
                            </div>
                            <a href={`tel:${order.delivery?.driverPhone || '0812345678'}`}
                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs">
                                <span>📞</span> โทรหาคนขับ
                            </a>
                        </div>
                    )}

                    {/* Customer & Address details */}
                    <div className="grid sm:grid-cols-2 gap-4 my-5">
                        <div className="bg-zinc-50 rounded-2xl p-4 text-xs space-y-1">
                            <p className="text-zinc-400 font-bold uppercase tracking-wider">ข้อมูลผู้รับ</p>
                            <p className="font-bold text-sm text-zinc-800">{order.customerName}</p>
                            <p className="text-zinc-500 font-medium">เบอร์โทร: {order.customerPhone}</p>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-4 text-xs space-y-1">
                            <p className="text-zinc-400 font-bold uppercase tracking-wider">ที่อยู่จัดส่ง</p>
                            <p className="font-medium text-zinc-800 leading-relaxed">
                                {order.address} {order.subdistrict} {order.district} {order.province} {order.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="bg-zinc-50 rounded-2xl p-4 mb-5 text-xs flex justify-between items-center">
                        <div>
                            <p className="text-zinc-400 font-bold uppercase tracking-wider mb-0.5">การชำระเงิน</p>
                            <p className="font-bold text-sm">
                                {order.paymentMethod === 'CASH' ? '💵 เงินสดปลายทาง (COD)' : '📱 QR PromptPay'}
                            </p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                            {order.paymentStatus === 'PAID' ? '✅ ชำระแล้ว' : '⏳ รอชำระ'}
                        </span>
                    </div>

                    {/* Items table */}
                    <div className="mb-5">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">รายการสินค้า (ล็อกรายการแล้ว)</h3>
                            <span className="text-[11px] text-zinc-400">🔒 ล็อก</span>
                        </div>
                        <div className="divide-y divide-zinc-100">
                            {order.items.map(item => (
                                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-zinc-100 text-zinc-700 font-bold w-6 h-6 flex items-center justify-center rounded-lg">
                                            {item.quantity}
                                        </span>
                                        <span className="font-medium text-zinc-800">{item.productName}</span>
                                    </div>
                                    <span className="font-bold text-zinc-800">฿{item.priceAtTimeOfOrder * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-zinc-200 mt-3 pt-3 flex justify-between items-center text-sm font-black text-xmart-primary">
                            <span>ยอดสุทธิ (ส่งฟรี ฿0)</span>
                            <span className="text-xl">฿{order.totalPrice}</span>
                        </div>
                    </div>

                    {/* Actions & Rules */}
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                        {NEXT_STATUS[currentStatus] && (
                            <button
                                onClick={handleAdvance}
                                className="w-full bg-xmart-primary text-white font-bold py-3 rounded-2xl hover:bg-xmart-primary-light transition-all text-sm active-scale shadow-sm"
                            >
                                ➡️ ปรับสถานะเป็น: {STATUS_ICONS[NEXT_STATUS[currentStatus]!]} {STATUS_LABELS[NEXT_STATUS[currentStatus]!]}
                            </button>
                        )}

                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="w-full border border-red-200 text-red-500 font-bold py-2.5 rounded-2xl hover:bg-red-50 transition-all text-xs active-scale disabled:opacity-50"
                            >
                                {cancelling ? 'กำลังยกเลิก...' : '❌ ยกเลิกคำสั่งซื้อ'}
                            </button>
                        )}


                        {isDelivered && (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center text-xs text-green-700 font-bold">
                                🎉 จัดส่งสำเร็จ
                            </div>
                        )}

                        {isCancelled && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center text-xs text-red-600 font-bold">
                                ❌ ออเดอร์ถูกยกเลิกแล้ว (ถาวร)
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
