"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, productsStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { useEffect, useState, useMemo } from "react";
import { Order, Product } from "@/types";
import { getBestSellingProducts } from "@/lib/order-analytics";

export default function AdminReportsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setOrders(ordersStorage.getAll());
        setProducts(productsStorage.getAll(mockProducts));

        const handleSync = () => {
            setOrders(ordersStorage.getAll());
            setProducts(productsStorage.getAll(mockProducts));
        };
        window.addEventListener('xmart_storage_sync', handleSync);
        window.addEventListener('storage', handleSync);
        return () => {
            window.removeEventListener('xmart_storage_sync', handleSync);
            window.removeEventListener('storage', handleSync);
        };
    }, []);

    const validOrders = orders.filter(o => o.orderStatus !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((s, o) => s + o.totalPrice, 0);
    const avgOrder = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // Single source of truth ranking
    const ranking = useMemo(() => {
        return getBestSellingProducts(products, orders, 10);
    }, [products, orders]);

    // Payment method breakdown
    const cashOrders = validOrders.filter(o => o.paymentMethod === 'CASH').length;
    const qrOrders = validOrders.filter(o => o.paymentMethod === 'PROMPTPAY').length;
    const paidRevenue = orders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.totalPrice, 0);

    return (
        <AdminLayout>
            <div className="space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'ยอดขายรวม', value: `฿${totalRevenue.toLocaleString()}`, icon: '💰', color: 'text-green-600' },
                        { label: 'ออเดอร์ทั้งหมด', value: orders.length, icon: '📋', color: 'text-blue-600' },
                        { label: 'ออเดอร์สำเร็จ', value: orders.filter(o => o.orderStatus === 'DELIVERED').length, icon: '🎉', color: 'text-green-600' },
                        { label: 'ออเดอร์เฉลี่ย', value: `฿${avgOrder}`, icon: '📊', color: 'text-purple-600' },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 text-center">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                    <h2 className="font-bold mb-4">วิธีชำระเงิน</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-50 rounded-2xl p-4">
                            <div className="text-3xl mb-1">💵</div>
                            <div className="font-black text-2xl">{cashOrders}</div>
                            <div className="text-xs text-zinc-500">เงินสด</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-4">
                            <div className="text-3xl mb-1">📱</div>
                            <div className="font-black text-2xl">{qrOrders}</div>
                            <div className="text-xs text-zinc-500">QR PromptPay</div>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-4">
                            <div className="text-3xl mb-1">✅</div>
                            <div className="font-black text-2xl text-green-600">฿{paidRevenue.toLocaleString()}</div>
                            <div className="text-xs text-zinc-500">ชำระแล้ว</div>
                        </div>
                    </div>
                </div>

                {/* Product ranking */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold">สินค้าขายดี 10 อันดับแรก 🏆</h2>
                            <p className="text-xs text-zinc-400">คำนวณจากยอดสั่งซื้อสะสมจริงในระบบ</p>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                            Top Sales
                        </span>
                    </div>
                    {ranking.length === 0 ? (
                        <div className="p-10 text-center text-zinc-400">
                            <div className="text-5xl mb-3">📊</div>
                            <p className="font-bold">ยังไม่มีข้อมูลการขาย</p>
                            <p className="text-sm mt-1">จะปรากฏหลังมีออเดอร์แรก</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100">
                            {ranking.map((item, i) => (
                                <div key={item.product.id} className="flex items-center gap-4 p-4">
                                    <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                                        i === 0 ? 'bg-amber-100 text-amber-800' :
                                        i === 1 ? 'bg-zinc-200 text-zinc-700' :
                                        i === 2 ? 'bg-amber-700/20 text-amber-900' : 'bg-zinc-50 text-zinc-500'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm line-clamp-1">{item.product.name}</p>
                                        <p className="text-zinc-400 text-xs">{item.totalSold} ชิ้น • SKU: {item.product.sku}</p>
                                    </div>
                                    <div className="font-black text-xmart-primary text-sm shrink-0">฿{item.revenue.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
