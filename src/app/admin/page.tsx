"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, usersStorage, productsStorage, categoriesStorage, resetAllDemoData } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { useEffect, useState } from "react";
import { Order } from "@/types";
import { STATUS_LABELS, STATUS_ICONS } from "@/lib/order-status";

interface Stats {
    todayRevenue: number;
    todayOrders: number;
    totalProducts: number;
    totalMembers: number;
    shippingOrders: number;
    pendingOrders: number;
    recentOrders: Order[];
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
    return (
        <div className={`bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 ${color}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ข้อมูลวันนี้</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 mb-0.5">{value}</div>
            <div className="text-sm text-zinc-500 font-medium">{label}</div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        const orders = ordersStorage.getAll();
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);

        setStats({
            todayRevenue: todayOrders.filter(o => o.orderStatus !== 'CANCELLED').reduce((s, o) => s + o.totalPrice, 0),
            todayOrders: todayOrders.length,
            totalProducts: productsStorage.getAll(mockProducts).filter(p => p.status !== 'HIDDEN').length,
            totalMembers: usersStorage.getAll().length,
            shippingOrders: orders.filter(o => o.orderStatus === 'SHIPPING').length,
            pendingOrders: orders.filter(o => o.orderStatus === 'PENDING').length,
            recentOrders: orders.slice(0, 5),
        });
    }, []);

    const handleReset = async () => {
        if (!confirm('⚠️ รีเซ็ตข้อมูลทั้งหมดใน Demo? Cart, Orders, Users และ Products จะถูกล้าง')) return;
        setResetting(true);
        await new Promise(r => setTimeout(r, 500));
        resetAllDemoData(mockProducts, mockCategories);
        setResetting(false);
        alert('✅ รีเซ็ตข้อมูล Demo เรียบร้อยแล้ว');
        window.location.reload();
    };


    return (
        <AdminLayout>
            {!stats ? (
                <div className="flex items-center justify-center min-h-64 text-zinc-400">⏳ กำลังโหลด...</div>
            ) : (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <StatCard icon="💰" label="ยอดขายวันนี้" value={`฿${stats.todayRevenue.toLocaleString()}`} color="border-l-4 border-l-green-400" />
                        <StatCard icon="📋" label="ออเดอร์วันนี้" value={stats.todayOrders} color="border-l-4 border-l-blue-400" />
                        <StatCard icon="🛍️" label="สินค้าทั้งหมด" value={stats.totalProducts} color="border-l-4 border-l-purple-400" />
                        <StatCard icon="👥" label="สมาชิก" value={stats.totalMembers} color="border-l-4 border-l-orange-400" />
                        <StatCard icon="🚚" label="กำลังจัดส่ง" value={stats.shippingOrders} color="border-l-4 border-l-yellow-400" />
                    </div>

                    {/* Alerts */}
                    {stats.pendingOrders > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⏳</span>
                                <div>
                                    <p className="font-bold text-orange-800">มี {stats.pendingOrders} ออเดอร์รอดำเนินการ</p>
                                    <p className="text-xs text-orange-600">กรุณาไปยืนยันออเดอร์</p>
                                </div>
                            </div>
                            <a href="/admin/orders" className="text-sm font-bold text-orange-600 border border-orange-300 px-4 py-2 rounded-xl hover:bg-orange-100 transition-all shrink-0">
                                จัดการ
                            </a>
                        </div>
                    )}

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
                            <h2 className="font-bold text-zinc-800">ออเดอร์ล่าสุด</h2>
                            <a href="/admin/orders" className="text-sm text-xmart-primary font-bold hover:underline">ดูทั้งหมด →</a>
                        </div>
                        {stats.recentOrders.length === 0 ? (
                            <div className="p-10 text-center text-zinc-400">
                                <div className="text-5xl mb-3">📋</div>
                                <p className="font-bold">ยังไม่มีออเดอร์</p>
                                <p className="text-sm mt-1">ออเดอร์จะปรากฏที่นี่เมื่อลูกค้าสั่งซื้อ</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-zinc-50">
                                        <tr>
                                            {['Order #', 'ลูกค้า', 'ยอด', 'สถานะ', 'วันที่'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {stats.recentOrders.map(o => (
                                            <tr key={o.orderNumber} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-4 py-3 font-black text-xmart-primary text-xs">{o.orderNumber}</td>
                                                <td className="px-4 py-3 font-medium text-xs">{o.customerName}</td>
                                                <td className="px-4 py-3 font-bold">฿{o.totalPrice}</td>
                                                <td className="px-4 py-3 text-xs">{STATUS_ICONS[o.orderStatus]} {STATUS_LABELS[o.orderStatus]}</td>
                                                <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(o.createdAt).toLocaleDateString('th-TH')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Reset Demo */}
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <h3 className="font-bold text-red-800 mb-1">⚠️ Reset Demo Data</h3>
                        <p className="text-sm text-red-600 mb-4">ล้างข้อมูล Demo ทั้งหมด (Cart, Orders, Users) และโหลด Mock Data กลับ เพื่อเริ่ม Demo ใหม่</p>
                        <button onClick={handleReset} disabled={resetting}
                            className="bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-red-600 transition-all active-scale disabled:opacity-60 text-sm">
                            {resetting ? '⏳ กำลังรีเซ็ต...' : '🔄 Reset Demo Data'}
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
