"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, notificationsStorage } from "@/lib/storage/helpers";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import {
    STATUS_STEPS,
    STATUS_LABELS,
    canCancelOrder,
    getAdjustedCreatedAtForStatus,
} from "@/lib/order-status";
import {
    RefreshCwIcon,
    OrderIcon,
    OrderStatusIcon,
    ExternalLinkIcon,
    BanknoteIcon,
    SmartphoneIcon,
    ArrowRightIcon,
    XCircleIcon,
    CheckCircleIcon
} from "@/components/icons";
import { mockDrivers } from "@/data/drivers";

const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

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

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Order | null>(null);

    const reload = () => setOrders(ordersStorage.getAll());
    useEffect(() => {
        reload();
        const handleSync = () => reload();
        window.addEventListener('xmart_storage_sync', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('xmart_storage_sync', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    const filtered = orders.filter(o => {
        const matchFilter = filter === 'ALL' || o.orderStatus === filter;
        const matchSearch = !search || o.orderNumber.includes(search) || o.customerName.includes(search) || o.customerPhone.includes(search);
        return matchFilter && matchSearch;
    });

    const handleAdvance = (orderNumber: string, current: OrderStatus) => {
        const next = NEXT_STATUS[current];
        if (!next) return;
        const targetOrder = orders.find(o => o.orderNumber === orderNumber);
        if (!targetOrder) return;

        // Requirement 6 & 7: Payment Gate
        // For PromptPay orders, if paymentStatus is PENDING, disallow advancing to PREPARING, SHIPPING, DELIVERED
        if (targetOrder.paymentMethod === 'PROMPTPAY' && targetOrder.paymentStatus === 'PENDING') {
            if (['PREPARING', 'SHIPPING', 'DELIVERED'].includes(next) || next === 'CONFIRMED') {
                alert('ไม่สามารถดำเนินการต่อได้ เนื่องจากยังไม่ได้ชำระเงิน');
                return;
            }
        }

        const now = new Date().toISOString();
        const patch: Partial<Order> = {
            orderStatus: next,
            createdAt: getAdjustedCreatedAtForStatus(next),
            statusUpdatedAt: now,
            updatedAt: now,
        };
        if (next === 'SHIPPING' && !targetOrder?.delivery?.driverName) {
            patch.delivery = {
                driverName: 'สมชาย มาเร็ว',
                driverPhone: '0812345678',
                status: 'SHIPPING',
            };
        }
        ordersStorage.update(orderNumber, patch);
        notificationsStorage.add({
            title: `อัปเดตสถานะ: ${STATUS_LABELS[next]}`,
            message: `ออเดอร์ #${orderNumber}`,
            type: 'ORDER',
            orderNumber,
        });
        reload();
        if (selected?.orderNumber === orderNumber) {
            setSelected({ ...selected, ...patch, orderStatus: next });
        }
    };

    const handleCancel = (orderNumber: string) => {
        const target = orders.find(o => o.orderNumber === orderNumber);
        if (!target || !canCancelOrder(target.orderStatus)) {
            alert('คำสั่งซื้อจัดส่งสำเร็จแล้วหรือไม่สามารถยกเลิกได้');
            return;
        }
        if (!confirm(`ยืนยันยกเลิกออเดอร์ #${orderNumber}?`)) return;
        const now = new Date().toISOString();
        ordersStorage.update(orderNumber, {
            orderStatus: 'CANCELLED',
            statusUpdatedAt: now,
            updatedAt: now,
        });
        notificationsStorage.add({
            title: 'ยกเลิกออเดอร์แล้ว',
            message: `ออเดอร์ #${orderNumber} ถูกยกเลิกเรียบร้อยแล้ว`,
            type: 'ORDER',
            orderNumber,
        });
        reload();
        if (selected?.orderNumber === orderNumber) {
            setSelected({ ...selected, orderStatus: 'CANCELLED', statusUpdatedAt: now, updatedAt: now });
        }
    };

    const handleAssignDriverQuick = (orderNumber: string, driverId: string) => {
        const driver = mockDrivers.find(d => d.id === driverId);
        if (!driver) return;
        const now = new Date().toISOString();
        const patch: Partial<Order> = {
            delivery: {
                driverName: driver.name,
                driverPhone: driver.phone,
                status: selected?.orderStatus === 'SHIPPING' ? 'SHIPPING' : (selected?.delivery?.status || 'ASSIGNED'),
            },
            statusUpdatedAt: now,
            updatedAt: now,
        };
        ordersStorage.update(orderNumber, patch);
        notificationsStorage.add({
            title: 'กำหนดคนขับสำเร็จ',
            message: `ออเดอร์ #${orderNumber} มอบหมายให้ ${driver.name}`,
            type: 'ORDER',
            orderNumber,
        });
        reload();
        if (selected?.orderNumber === orderNumber) {
            setSelected({ ...selected, ...patch });
        }
    };

    const handleResetDemo = () => {
        if (!confirm('ยืนยันรีเซ็ตข้อมูล Mock Orders ให้เริ่มต้นใหม่?')) return;
        ordersStorage.reset();
        setSelected(null);
        reload();
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="ค้นหา Order # / ชื่อ / เบอร์โทร"
                        className="flex-1 min-w-48 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary min-h-[44px]" />
                    <button onClick={handleResetDemo}
                        className="text-xs text-zinc-500 hover:text-xmart-primary border border-zinc-200 rounded-xl px-3.5 py-2.5 bg-white transition-all shadow-xs flex items-center gap-1.5 font-bold min-h-[44px]">
                        <RefreshCwIcon className="w-3.5 h-3.5" />
                        <span>รีเซ็ต Demo Orders</span>
                    </button>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {(['ALL', ...STATUSES] as const).map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === s ? 'bg-xmart-primary text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                            {s === 'ALL' ? (
                                <span className="inline-flex items-center gap-1"><OrderIcon className="w-3.5 h-3.5" /> ทั้งหมด</span>
                            ) : (
                                <span className="inline-flex items-center gap-1"><OrderStatusIcon status={s} className="w-3.5 h-3.5" /> {STATUS_LABELS[s]}</span>
                            )} ({s === 'ALL' ? orders.length : orders.filter(o => o.orderStatus === s).length})
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-[1fr_380px] gap-4">
                    {/* List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                        {filtered.length === 0 ? (
                            <div className="p-12 text-center text-zinc-400">
                                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-zinc-300">
                                    <OrderIcon className="w-10 h-10" />
                                </div>
                                <p className="font-bold">ไม่พบออเดอร์</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100">
                                {filtered.map(o => (
                                    <div key={o.orderNumber} onClick={() => setSelected(o)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-zinc-50 ${selected?.orderNumber === o.orderNumber ? 'bg-blue-50/50 border-l-4 border-l-xmart-primary' : ''}`}>
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <div>
                                                <p className="font-black text-xmart-primary text-sm">{o.orderNumber}</p>
                                                <p className="text-xs text-zinc-500">{o.customerName} • {o.customerPhone}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 inline-flex items-center gap-1 ${STATUS_COLORS[o.orderStatus]}`}>
                                                <OrderStatusIcon status={o.orderStatus} className="w-3 h-3" />
                                                <span>{STATUS_LABELS[o.orderStatus]}</span>
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-zinc-400">{new Date(o.createdAt).toLocaleString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="font-black text-xmart-primary">฿{o.totalPrice}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail */}
                    {selected && (
                        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 h-fit sticky top-20">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-xmart-primary">{selected.orderNumber}</p>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${STATUS_COLORS[selected.orderStatus]}`}>
                                        <OrderStatusIcon status={selected.orderStatus} className="w-3.5 h-3.5" />
                                        <span>{STATUS_LABELS[selected.orderStatus]}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/orders/${selected.orderNumber}`} className="text-[11px] font-bold text-xmart-primary hover:underline inline-flex items-center gap-1">
                                        <span>เปิดหน้าเต็ม</span>
                                        <ExternalLinkIcon className="w-3 h-3" />
                                    </Link>
                                    <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-600 text-lg leading-none">×</button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm mb-4">
                                <div><p className="text-xs text-zinc-400">ผู้รับ</p><p className="font-bold">{selected.customerName}</p><p className="text-zinc-500">{selected.customerPhone}</p></div>
                                <div><p className="text-xs text-zinc-400">ที่อยู่</p><p className="font-medium text-xs leading-relaxed">{selected.address} {selected.subdistrict} {selected.district} {selected.province} {selected.postalCode}</p></div>
                                <div><p className="text-xs text-zinc-400">ชำระ</p>
                                    <p className="font-bold flex items-center gap-1.5 flex-wrap">
                                        {selected.paymentMethod === 'CASH' ? (
                                            <span className="inline-flex items-center gap-1"><BanknoteIcon className="w-4 h-4 text-emerald-600" /> เงินสด</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1"><SmartphoneIcon className="w-4 h-4 text-blue-600" /> QR</span>
                                        )} —
                                        <span className={(selected.paymentStatus === 'PAID' || (selected.paymentMethod === 'CASH' && selected.orderStatus === 'DELIVERED')) ? ' text-green-600' : ' text-orange-500'}>
                                            {(selected.paymentStatus === 'PAID' || (selected.paymentMethod === 'CASH' && selected.orderStatus === 'DELIVERED')) ? ' ชำระแล้ว' : ' รอชำระ'}
                                        </span>
                                    </p>
                                </div>
                                {selected.paymentMethod === 'PROMPTPAY' && selected.paymentStatus === 'PENDING' && selected.orderStatus !== 'CANCELLED' && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800">
                                        <p className="font-bold">รอการชำระเงิน (PromptPay QR)</p>
                                        <p className="text-[11px] mt-0.5 text-amber-700">ไม่สามารถดำเนินการต่อได้ เนื่องจากยังไม่ได้ชำระเงิน</p>
                                    </div>
                                )}
                                {!['CANCELLED', 'DELIVERED'].includes(selected.orderStatus) && (
                                    <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200/80 space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-purple-900">กำหนดพนักงานจัดส่ง</span>
                                            {selected.delivery?.driverPhone && (
                                                <a href={`tel:${selected.delivery.driverPhone}`} className="text-green-700 font-bold hover:underline text-[11px]">
                                                    โทร {selected.delivery.driverPhone}
                                                </a>
                                            )}
                                        </div>
                                        <select
                                            value={mockDrivers.find(d => d.name === selected.delivery?.driverName)?.id || mockDrivers[0].id}
                                            onChange={e => handleAssignDriverQuick(selected.orderNumber, e.target.value)}
                                            className="w-full bg-white border border-purple-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 focus:outline-none"
                                        >
                                            {mockDrivers.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.name} ({d.phone})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-3 mb-4">
                                {selected.items.map(i => (
                                    <div key={i.id} className="flex justify-between text-xs py-1.5">
                                        <span>{i.quantity}× {i.productName}</span>
                                        <span className="font-bold">฿{i.priceAtTimeOfOrder * i.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-black text-xmart-primary mt-2 pt-2 border-t">
                                    <span>ยอดสุทธิ</span><span>฿{selected.totalPrice}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                {NEXT_STATUS[selected.orderStatus] && (
                                    <button onClick={() => handleAdvance(selected.orderNumber, selected.orderStatus)}
                                        className="w-full bg-xmart-primary text-white font-bold py-2.5 rounded-xl hover:bg-xmart-primary-light transition-all text-sm active-scale inline-flex items-center justify-center gap-2 min-h-[44px]">
                                        <ArrowRightIcon className="w-4 h-4" />
                                        <span>ปรับสถานะเป็น:</span>
                                        <OrderStatusIcon status={NEXT_STATUS[selected.orderStatus]!} className="w-4 h-4" />
                                        <span>{STATUS_LABELS[NEXT_STATUS[selected.orderStatus]!]}</span>
                                    </button>
                                )}
                                
                                {canCancelOrder(selected.orderStatus) && (
                                    <button onClick={() => handleCancel(selected.orderNumber)}
                                        className="w-full border border-red-200 text-red-500 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all text-sm active-scale inline-flex items-center justify-center gap-2 min-h-[44px]">
                                        <XCircleIcon className="w-4 h-4" />
                                        <span>ยกเลิกออเดอร์</span>
                                    </button>
                                )}

                                {selected.orderStatus === 'DELIVERED' && (
                                    <p className="text-center text-green-600 font-bold text-sm py-2 inline-flex items-center justify-center gap-1.5 w-full">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        <span>จัดส่งสำเร็จแล้ว</span>
                                    </p>
                                )}

                                {selected.orderStatus === 'CANCELLED' && (
                                    <p className="text-center text-red-500 font-bold text-sm py-2 inline-flex items-center justify-center gap-1.5 w-full">
                                        <XCircleIcon className="w-4 h-4" />
                                        <span>ออเดอร์ถูกยกเลิกแล้ว (ถาวร)</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
