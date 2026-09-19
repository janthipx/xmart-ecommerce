"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ordersStorage } from "@/lib/storage/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import Link from "next/link";
import { STATUS_LABELS, STATUS_ICONS } from "@/lib/order-status";

export default function AccountPage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) { router.replace('/login'); return; }
        if (user.role === 'ADMIN') { router.replace('/admin'); return; }

        const refreshOrders = () => {
            const all = ordersStorage.getAll();
            setOrders(all.filter(o => o.customerId === user.id));
        };

        refreshOrders();

        window.addEventListener('xmart_storage_sync', refreshOrders);
        window.addEventListener('storage', refreshOrders);
        return () => {
            window.removeEventListener('xmart_storage_sync', refreshOrders);
            window.removeEventListener('storage', refreshOrders);
        };
    }, [user, router]);

    if (!user) return null;

    const handleLogout = () => { logout(); router.push('/'); };

    return (
        <div className="min-h-screen bg-xmart-bg pb-24">
            <Header />
            <main className="max-w-2xl mx-auto px-4 py-6">
                {/* Profile */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xmart-primary to-blue-400 text-white text-2xl font-black flex items-center justify-center shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-xmart-text">{user.name}</h1>
                            <p className="text-zinc-400 text-sm">{user.email}</p>
                            {user.phone && <p className="text-zinc-400 text-sm">{user.phone}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center mb-5">
                        <div className="bg-zinc-50 rounded-2xl p-3">
                            <div className="font-black text-xl text-xmart-primary">{orders.length}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">ออเดอร์ทั้งหมด</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3">
                            <div className="font-black text-xl text-green-500">{orders.filter(o => o.orderStatus === 'DELIVERED').length}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">จัดส่งแล้ว</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3">
                            <div className="font-black text-xl text-xmart-primary">฿{orders.reduce((s, o) => o.orderStatus !== 'CANCELLED' ? s + o.totalPrice : s, 0)}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">ยอดซื้อรวม</div>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full border border-red-200 text-red-500 font-bold py-3 rounded-2xl hover:bg-red-50 transition-all text-sm">
                        ออกจากระบบ
                    </button>
                </div>

                {/* Order History */}
                <div>
                    <h2 className="text-base font-bold mb-4 text-xmart-text">ประวัติการสั่งซื้อ</h2>
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
                            <div className="text-5xl mb-3">📋</div>
                            <p className="font-bold text-zinc-600 mb-1">ยังไม่มีประวัติการสั่งซื้อ</p>
                            <p className="text-sm text-zinc-400 mb-4">เริ่มช้อปปิ้งเพื่อดูประวัติที่นี่</p>
                            <Link href="/products" className="text-xmart-primary font-bold hover:underline text-sm">เลือกซื้อสินค้า →</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <div key={order.orderNumber} className="bg-white rounded-3xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <div>
                                            <p className="font-black text-xmart-primary text-sm">{order.orderNumber}</p>
                                            <p className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                                            {STATUS_ICONS[order.orderStatus]} {STATUS_LABELS[order.orderStatus]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-zinc-500">{order.items.length} รายการ</p>
                                        <p className="font-black text-xmart-primary">฿{order.totalPrice}</p>
                                    </div>
                                    <Link href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                                        className="mt-3 block text-center border border-xmart-primary/30 text-xmart-primary font-bold py-2 rounded-xl hover:bg-blue-50 transition-all text-xs">
                                        ดูรายละเอียด / ติดตาม
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
