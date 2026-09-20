"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ordersStorage } from "@/lib/storage/helpers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { STATUS_LABELS } from "@/lib/order-status";
import { OrderIcon, OrderStatusIcon } from "@/components/icons";

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
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-200/80 mb-5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xmart-primary to-blue-400 text-white text-2xl font-black flex items-center justify-center shadow-md shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-black text-xmart-text truncate">{user.name}</h1>
                            <p className="text-zinc-500 text-sm truncate">{user.email}</p>
                            {user.phone && <p className="text-zinc-500 text-sm">{user.phone}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center mb-5">
                        <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                            <div className="font-black text-lg sm:text-xl text-xmart-primary truncate">{orders.length}</div>
                            <div className="text-xs text-zinc-500 mt-0.5 font-medium">ออเดอร์ทั้งหมด</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                            <div className="font-black text-lg sm:text-xl text-green-600 truncate">{orders.filter(o => o.orderStatus === 'DELIVERED').length}</div>
                            <div className="text-xs text-zinc-500 mt-0.5 font-medium">จัดส่งแล้ว</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                            <div className="font-black text-lg sm:text-xl text-xmart-primary truncate">฿{orders.reduce((s, o) => o.orderStatus !== 'CANCELLED' ? s + o.totalPrice : s, 0).toLocaleString()}</div>
                            <div className="text-xs text-zinc-500 mt-0.5 font-medium">ยอดซื้อรวม</div>
                        </div>
                    </div>
                    <button onClick={handleLogout}
                        className="w-full min-h-[44px] border border-red-200 text-red-500 font-bold py-2.5 px-4 rounded-2xl hover:bg-red-50 transition-all text-sm cursor-pointer flex items-center justify-center">
                        ออกจากระบบ
                    </button>
                </div>

                {/* Order History */}
                <div>
                    <h2 className="text-base font-bold mb-4 text-xmart-text">ประวัติการสั่งซื้อ</h2>
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
                            <div className="flex justify-center mb-3 text-zinc-300"><OrderIcon className="w-12 h-12" /></div>
                            <p className="font-bold text-zinc-600 mb-1">ยังไม่มีประวัติการสั่งซื้อ</p>
                            <p className="text-sm text-zinc-400 mb-4">เริ่มช้อปปิ้งเพื่อดูประวัติที่นี่</p>
                            <Link href="/products" className="text-xmart-primary font-bold hover:underline text-sm">เลือกซื้อสินค้า →</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <div key={order.orderNumber} className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-zinc-200/80">
                                    <div className="flex justify-between items-start mb-2.5 gap-2">
                                        <div>
                                            <p className="font-black text-xmart-primary text-sm sm:text-base">{order.orderNumber}</p>
                                            <p className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            {order.orderStatus === 'CANCELLED' ? (
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                                    ยกเลิกแล้ว
                                                </span>
                                            ) : order.paymentStatus === 'PAID' ? (
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                    ชำระเงินแล้ว
                                                </span>
                                            ) : order.paymentMethod === 'PROMPTPAY' ? (
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                                                    รอชำระเงิน
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                                                    เงินสดปลายทาง
                                                </span>
                                            )}
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1 ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                                                <OrderStatusIcon status={order.orderStatus} className="w-3 h-3" />
                                                <span>{STATUS_LABELS[order.orderStatus]}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs sm:text-sm pt-1 border-t border-zinc-50">
                                        <p className="text-zinc-500">{order.items.length} รายการ</p>
                                        <p className="font-black text-xmart-primary text-sm sm:text-base">฿{order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    {order.paymentMethod === 'PROMPTPAY' && order.paymentStatus === 'PENDING' && order.orderStatus !== 'CANCELLED' ? (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <Link
                                                href={`/checkout/qr?orderNumber=${order.orderNumber}`}
                                                className="flex items-center justify-center min-h-[40px] text-center bg-[#0060df] hover:bg-[#0051bc] text-white font-bold py-2 px-3 rounded-xl text-xs sm:text-sm transition-all shadow-xs"
                                            >
                                                ชำระเงิน
                                            </Link>
                                            <Link
                                                href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                                                className="flex items-center justify-center min-h-[40px] text-center border border-zinc-200 text-zinc-700 font-bold py-2 px-3 rounded-xl hover:bg-zinc-50 transition-all text-xs sm:text-sm"
                                            >
                                                ดูรายละเอียด
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/track-order?orderNumber=${order.orderNumber}&phone=${order.customerPhone}`}
                                            className="mt-3 flex items-center justify-center min-h-[40px] text-center border border-xmart-primary/30 text-xmart-primary font-bold py-2 px-3 rounded-xl hover:bg-blue-50 transition-all text-xs sm:text-sm"
                                        >
                                            ดูรายละเอียด / ติดตาม
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
