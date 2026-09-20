"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, productsStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { useEffect, useState, useMemo } from "react";
import { Order, Product } from "@/types";
import { getBestSellingProducts } from "@/lib/order-analytics";
import {
    CalendarIcon,
    CoinsIcon,
    OrderIcon,
    CheckCircleIcon,
    BarChartIcon,
    BanknoteIcon,
    SmartphoneIcon,
    TrophyIcon
} from "@/components/icons";
import Link from "next/link";

type TimeRangeOption = 'today' | '7days' | '30days' | 'custom';

export default function AdminReportsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Timeframe filter state: Requirement 13 (Today, Last 7 Days, Last 30 Days, Custom Date Range)
    const [timeRange, setTimeRange] = useState<TimeRangeOption>('7days');
    const [customStartDate, setCustomStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 14);
        return d.toISOString().split('T')[0];
    });
    const [customEndDate, setCustomEndDate] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });

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

    // Filter orders by selected timeframe
    const filteredOrders = useMemo(() => {
        const now = new Date();
        const todayStr = now.toDateString();

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);

            if (timeRange === 'today') {
                return orderDate.toDateString() === todayStr;
            }
            if (timeRange === '7days') {
                const diffMs = now.getTime() - orderDate.getTime();
                return diffMs <= 7 * 24 * 60 * 60 * 1000 && diffMs >= 0;
            }
            if (timeRange === '30days') {
                const diffMs = now.getTime() - orderDate.getTime();
                return diffMs <= 30 * 24 * 60 * 60 * 1000 && diffMs >= 0;
            }
            if (timeRange === 'custom') {
                const start = new Date(customStartDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(customEndDate);
                end.setHours(23, 59, 59, 999);
                return orderDate.getTime() >= start.getTime() && orderDate.getTime() <= end.getTime();
            }
            return true;
        });
    }, [orders, timeRange, customStartDate, customEndDate]);

    const validOrders = filteredOrders.filter(o => o.orderStatus !== 'CANCELLED');
    const totalRevenue = validOrders.reduce((s, o) => s + o.totalPrice, 0);
    const avgOrder = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // Single source of truth ranking for the selected timeframe
    const ranking = useMemo(() => {
        return getBestSellingProducts(products, filteredOrders, 10);
    }, [products, filteredOrders]);

    // Payment method breakdown
    const cashOrders = validOrders.filter(o => o.paymentMethod === 'CASH').length;
    const qrOrders = validOrders.filter(o => o.paymentMethod === 'PROMPTPAY').length;
    const paidRevenue = filteredOrders.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.totalPrice, 0);

    return (
        <AdminLayout>
            <div className="space-y-5">
                {/* Timeframe Filter Bar (Requirement 13: Today, Last 7 Days, Last 30 Days, Custom) */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-xmart-primary" />
                        <h2 className="font-black text-sm text-zinc-800">ช่วงเวลาแสดงรายงาน:</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'today', label: 'วันนี้ (Today)' },
                            { id: '7days', label: '7 วันล่าสุด' },
                            { id: '30days', label: '30 วันล่าสุด' },
                            { id: 'custom', label: 'กำหนดเอง' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setTimeRange(tab.id as TimeRangeOption)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    timeRange === tab.id
                                        ? 'bg-xmart-primary text-white shadow-xs'
                                        : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {timeRange === 'custom' && (
                        <div className="w-full flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-100 text-xs">
                            <span className="text-zinc-500 font-bold">จาก:</span>
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={e => setCustomStartDate(e.target.value)}
                                className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-xmart-primary"
                            />
                            <span className="text-zinc-500 font-bold">ถึง:</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={e => setCustomEndDate(e.target.value)}
                                className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-xmart-primary"
                            />
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'ยอดขายในช่วงนี้', value: `฿${totalRevenue.toLocaleString()}`, icon: <CoinsIcon className="w-8 h-8 text-green-600" />, color: 'text-green-600' },
                        { label: 'ออเดอร์ในช่วงนี้', value: filteredOrders.length, icon: <OrderIcon className="w-8 h-8 text-blue-600" />, color: 'text-blue-600' },
                        { label: 'ออเดอร์จัดส่งสำเร็จ', value: filteredOrders.filter(o => o.orderStatus === 'DELIVERED').length, icon: <CheckCircleIcon className="w-8 h-8 text-green-600" />, color: 'text-green-600' },
                        { label: 'ออเดอร์เฉลี่ย', value: `฿${avgOrder}`, icon: <BarChartIcon className="w-8 h-8 text-purple-600" />, color: 'text-purple-600' },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 text-center">
                            <div className="mb-2 flex items-center justify-center">{s.icon}</div>
                            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                    <h2 className="font-bold mb-4 text-zinc-900 text-sm sm:text-base">วิธีชำระเงินในช่วงเวลาที่เลือก</h2>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-50 rounded-2xl p-4">
                            <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center text-emerald-600">
                                <BanknoteIcon className="w-7 h-7" />
                            </div>
                            <div className="font-black text-2xl text-zinc-800">{cashOrders}</div>
                            <div className="text-xs text-zinc-500">เงินสด (COD)</div>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-4">
                            <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center text-blue-600">
                                <SmartphoneIcon className="w-7 h-7" />
                            </div>
                            <div className="font-black text-2xl text-zinc-800">{qrOrders}</div>
                            <div className="text-xs text-zinc-500">QR PromptPay</div>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-4">
                            <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center text-green-600">
                                <CheckCircleIcon className="w-7 h-7" />
                            </div>
                            <div className="font-black text-2xl text-green-600">฿{paidRevenue.toLocaleString()}</div>
                            <div className="text-xs text-zinc-500">ชำระแล้ว</div>
                        </div>
                    </div>
                </div>

                {/* Product ranking */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold flex items-center gap-1.5 text-zinc-900">
                                <span>สินค้าขายดี 10 อันดับแรก</span>
                                <TrophyIcon className="w-5 h-5 text-amber-500" />
                            </h2>
                            <p className="text-xs text-zinc-400">คำนวณจากยอดสั่งซื้อสะสมจริงในช่วงเวลาที่เลือก</p>
                        </div>
                        <Link
                            href="/admin/analytics"
                            className="text-xs font-bold text-xmart-primary hover:underline bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full"
                        >
                            ดู Analytics ละเอียด →
                        </Link>
                    </div>
                    {ranking.length === 0 ? (
                        <div className="p-10 text-center text-zinc-400">
                            <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-zinc-300">
                                <BarChartIcon className="w-10 h-10" />
                            </div>
                            <p className="font-bold">ยังไม่มีข้อมูลการขายในช่วงนี้</p>
                            <p className="text-sm mt-1">ลองเปลี่ยนช่วงเวลาเพื่อดูข้อมูล</p>
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
                                        <p className="font-bold text-sm line-clamp-1 text-zinc-900">{item.product.name}</p>
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
