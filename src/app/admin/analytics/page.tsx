"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ordersStorage, productsStorage, categoriesStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { useEffect, useState, useMemo } from "react";
import { Order, Category, Product } from "@/types";
import { getBestSellingProducts, BestSellingItem } from "@/lib/order-analytics";
import Link from "next/link";

type TimeRangeOption = 'today' | '7days' | '30days' | 'custom';

interface CategorySales {
    id: string;
    name: string;
    icon: string;
    revenue: number;
    itemsSold: number;
    percentage: number;
}

interface TimeSlotStat {
    label: string;
    range: string;
    icon: string;
    count: number;
    revenue: number;
}

interface DayStat {
    dayName: string;
    count: number;
    revenue: number;
}

export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Timeframe filter state per Requirement 14
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
        setCategories(categoriesStorage.getAll(mockCategories));
        setProducts(productsStorage.getAll(mockProducts));

        // Real-time sync listener
        const handleSync = () => {
            setOrders(ordersStorage.getAll());
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

    const nonCancelledOrders = useMemo(() => {
        return filteredOrders.filter(o => o.orderStatus !== 'CANCELLED');
    }, [filteredOrders]);

    // 1. Total Sales
    const totalSales = nonCancelledOrders.reduce((sum, o) => sum + o.totalPrice, 0);

    // 2. Total Orders & Breakdown
    const totalOrders = filteredOrders.length;
    const deliveredCount = filteredOrders.filter(o => o.orderStatus === 'DELIVERED').length;
    const activeCount = filteredOrders.filter(o => ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'].includes(o.orderStatus)).length;
    const cancelledCount = filteredOrders.filter(o => o.orderStatus === 'CANCELLED').length;

    // 3. Sales by Date timeline
    const numDays = timeRange === 'today' ? 1 : timeRange === '7days' ? 7 : timeRange === '30days' ? 14 : 7;
    const salesByDate = useMemo(() => {
        return Array.from({ length: numDays }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (numDays - 1 - i));
            const dateStr = d.toDateString();
            const dayOrders = nonCancelledOrders.filter(o => new Date(o.createdAt).toDateString() === dateStr);
            return {
                rawDate: d,
                dateLabel: d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' }),
                count: dayOrders.length,
                revenue: dayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
            };
        });
    }, [nonCancelledOrders, numDays]);

    const maxDayRevenue = Math.max(...salesByDate.map(d => d.revenue), 1);

    // 4. Sales by Category
    const salesByCategory: CategorySales[] = useMemo(() => {
        const categoryMap = new Map<string, { revenue: number; itemsSold: number }>();
        categories.forEach(c => categoryMap.set(c.id, { revenue: 0, itemsSold: 0 }));

        nonCancelledOrders.forEach(order => {
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                const catId = product?.categoryId || 'cat1';
                const current = categoryMap.get(catId) || { revenue: 0, itemsSold: 0 };
                categoryMap.set(catId, {
                    revenue: current.revenue + (item.priceAtTimeOfOrder * item.quantity),
                    itemsSold: current.itemsSold + item.quantity,
                });
            });
        });

        const totalCategoryRevenue = Array.from(categoryMap.values()).reduce((s, v) => s + v.revenue, 0) || 1;
        return categories.map(cat => {
            const stat = categoryMap.get(cat.id) || { revenue: 0, itemsSold: 0 };
            return {
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                revenue: stat.revenue,
                itemsSold: stat.itemsSold,
                percentage: Math.round((stat.revenue / totalCategoryRevenue) * 100),
            };
        }).sort((a, b) => b.revenue - a.revenue);
    }, [categories, products, nonCancelledOrders]);

    // 5. Peak Order Time (Hours analysis)
    const timeSlots: TimeSlotStat[] = useMemo(() => {
        const slots: TimeSlotStat[] = [
            { label: 'ช่วงเช้า', range: '06:00 - 10:59', icon: '🌅', count: 0, revenue: 0 },
            { label: 'ช่วงเที่ยง (มื้อกลางวัน)', range: '11:00 - 13:59', icon: '☀️', count: 0, revenue: 0 },
            { label: 'ช่วงบ่าย', range: '14:00 - 16:59', icon: '☕', count: 0, revenue: 0 },
            { label: 'ช่วงเย็น (หลังเลิกงาน)', range: '17:00 - 20:59', icon: '🌆', count: 0, revenue: 0 },
            { label: 'ช่วงดึก', range: '21:00 - 05:59', icon: '🌙', count: 0, revenue: 0 },
        ];

        nonCancelledOrders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            let slotIndex = 4; // 21:00 - 05:59
            if (hour >= 6 && hour < 11) slotIndex = 0;
            else if (hour >= 11 && hour < 14) slotIndex = 1;
            else if (hour >= 14 && hour < 17) slotIndex = 2;
            else if (hour >= 17 && hour < 21) slotIndex = 3;

            slots[slotIndex].count += 1;
            slots[slotIndex].revenue += order.totalPrice;
        });

        return slots;
    }, [nonCancelledOrders]);

    const peakTimeSlot = [...timeSlots].sort((a, b) => b.count - a.count)[0];

    // 6. Peak Order Day (Days of week analysis)
    const dayStats: DayStat[] = useMemo(() => {
        const DAY_NAMES = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        const stats: DayStat[] = DAY_NAMES.map(dayName => ({ dayName, count: 0, revenue: 0 }));

        nonCancelledOrders.forEach(order => {
            const dayIndex = new Date(order.createdAt).getDay();
            stats[dayIndex].count += 1;
            stats[dayIndex].revenue += order.totalPrice;
        });

        return stats;
    }, [nonCancelledOrders]);

    const peakDay = [...dayStats].sort((a, b) => b.count - a.count)[0];

    // 7. Best Selling Products during filtered timeframe
    const bestSellingItems: BestSellingItem[] = useMemo(() => {
        return getBestSellingProducts(products, filteredOrders, 6);
    }, [products, filteredOrders]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header with Title and Real-time Badge */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h1 className="text-xl font-black text-zinc-900">Order Analytics (สถิติคำสั่งซื้อ)</h1>
                        <p className="text-xs text-zinc-500 mt-0.5">วิเคราะห์ข้อมูลยอดขายและพฤติกรรมการสั่งซื้อแบบ Real-time</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Real-time Order Sync
                    </span>
                </div>

                {/* Timeframe Filter Controls per Requirement 14 */}
                <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="font-bold text-zinc-500 mr-1.5">ช่วงเวลา:</span>
                        <button
                            type="button"
                            onClick={() => setTimeRange('today')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                timeRange === 'today'
                                    ? 'bg-xmart-primary text-white shadow-xs'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                            }`}
                        >
                            วันนี้
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('7days')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                timeRange === '7days'
                                    ? 'bg-xmart-primary text-white shadow-xs'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                            }`}
                        >
                            7 วันล่าสุด
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('30days')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                timeRange === '30days'
                                    ? 'bg-xmart-primary text-white shadow-xs'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                            }`}
                        >
                            30 วันล่าสุด
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('custom')}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                timeRange === 'custom'
                                    ? 'bg-xmart-primary text-white shadow-xs'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                            }`}
                        >
                            📅 กำหนดช่วงวัน
                        </button>
                    </div>

                    {/* Custom Date Inputs if selected */}
                    {timeRange === 'custom' && (
                        <div className="flex items-center gap-2 text-xs">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={e => setCustomStartDate(e.target.value)}
                                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs bg-zinc-50"
                            />
                            <span className="text-zinc-400">ถึง</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={e => setCustomEndDate(e.target.value)}
                                className="border border-zinc-200 rounded-lg px-2 py-1 text-xs bg-zinc-50"
                            />
                        </div>
                    )}
                </div>

                {/* 1. Total Sales & 2. Total Orders Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">💰</span>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">ยอดสุทธิ</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-zinc-900 mb-0.5">฿{totalSales.toLocaleString()}</div>
                        <div className="text-xs text-zinc-500 font-bold">1. Total Sales (ยอดขายรวม)</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">📋</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">ทั้งหมด</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-zinc-900 mb-0.5">{totalOrders}</div>
                        <div className="text-xs text-zinc-500 font-bold">2. Total Orders (ออเดอร์)</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 border-l-4 border-l-orange-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{peakTimeSlot?.icon || '⏰'}</span>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">ชั่วโมงเร่งด่วน</span>
                        </div>
                        <div className="text-lg md:text-xl font-black text-zinc-900 mb-0.5 truncate">{peakTimeSlot?.label}</div>
                        <div className="text-xs text-zinc-500 font-bold">Peak Order Time ({peakTimeSlot?.range})</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">📅</span>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">วันยอดนิยม</span>
                        </div>
                        <div className="text-lg md:text-xl font-black text-zinc-900 mb-0.5 truncate">{peakDay?.dayName}</div>
                        <div className="text-xs text-zinc-500 font-bold">Peak Order Day ({peakDay?.count} ออเดอร์)</div>
                    </div>
                </div>

                {/* Status Breakdown Summary */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-blue-600">กำลังดำเนินการ (Active)</span>
                        <div className="text-xl font-black text-blue-700">{activeCount}</div>
                    </div>
                    <div className="bg-green-50/60 border border-green-100 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-green-600">จัดส่งสำเร็จ (Delivered)</span>
                        <div className="text-xl font-black text-green-700">{deliveredCount}</div>
                    </div>
                    <div className="bg-red-50/60 border border-red-100 rounded-xl p-3 text-center">
                        <span className="text-xs font-bold text-red-500">ยกเลิก (Cancelled)</span>
                        <div className="text-xl font-black text-red-600">{cancelledCount}</div>
                    </div>
                </div>

                {/* 3. Sales by Date Chart */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                    <div className="flex justify-between items-center mb-5">
                        <div>
                            <h2 className="font-bold text-zinc-900 text-sm md:text-base">3. Sales Timeline (ยอดขายตามช่วงเวลา)</h2>
                            <p className="text-xs text-zinc-400">เปรียบเทียบยอดขายในแต่ละวัน</p>
                        </div>
                        <span className="text-xs font-bold text-xmart-primary bg-blue-50 px-3 py-1 rounded-full">
                            ยอดรวมช่วงนี้: ฿{salesByDate.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-end gap-2 h-40 pt-4 border-b border-zinc-100 pb-2 overflow-x-auto">
                        {salesByDate.map((d, i) => (
                            <div key={i} className="flex-1 min-w-[40px] flex flex-col items-center gap-1.5 h-full justify-end group">
                                <span className="text-[10px] text-zinc-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {d.revenue > 0 ? `฿${d.revenue}` : ''}
                                </span>
                                <div className="w-full bg-blue-100 rounded-xl relative overflow-hidden transition-all duration-300 group-hover:brightness-95"
                                    style={{ height: `${Math.max(12, (d.revenue / maxDayRevenue) * 100)}px` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-xmart-primary to-blue-400 rounded-xl"></div>
                                </div>
                                <span className="text-[10px] text-zinc-500 font-medium text-center leading-tight truncate w-full">{d.dateLabel}</span>
                                <span className="text-[9px] text-zinc-400 font-bold">{d.count} ออเดอร์</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Sales by Category & Best Selling Products */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sales by Category */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-zinc-900 text-sm md:text-base">4. Sales by Category (ยอดขายตามหมวดหมู่)</h2>
                            <span className="text-xs text-zinc-400">{salesByCategory.length} หมวดหมู่</span>
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                            {salesByCategory.map(cat => (
                                <div key={cat.id} className="space-y-1.5">
                                    <div className="flex justify-between text-xs items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{cat.icon}</span>
                                            <span className="font-bold text-zinc-800">{cat.name}</span>
                                            <span className="text-[10px] text-zinc-400">({cat.itemsSold} ชิ้น)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-xmart-primary">฿{cat.revenue.toLocaleString()}</span>
                                            <span className="text-[10px] text-zinc-400 font-bold w-9 text-right">{cat.percentage}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-xmart-primary to-blue-400 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(2, cat.percentage)}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best Selling Products during filtered timeframe */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="font-bold text-zinc-900 text-sm md:text-base">🏆 สินค้าขายดี (Best Sellers)</h2>
                                <p className="text-xs text-zinc-400">คำนวณจากคำสั่งซื้อในช่วงเวลาที่เลือก</p>
                            </div>
                            <Link href="/admin/reports" className="text-xs font-bold text-xmart-primary hover:underline">
                                ดูรายงานเต็ม →
                            </Link>
                        </div>

                        {bestSellingItems.length === 0 ? (
                            <div className="p-8 text-center text-zinc-400">
                                <div className="text-4xl mb-2">📊</div>
                                <p className="text-xs font-bold">ยังไม่มีข้อมูลการขายในช่วงนี้</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100">
                                {bestSellingItems.map((item, idx) => (
                                    <div key={item.product.id} className="flex items-center gap-3 py-2.5">
                                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                            idx === 0 ? 'bg-amber-100 text-amber-800' :
                                            idx === 1 ? 'bg-zinc-200 text-zinc-700' :
                                            idx === 2 ? 'bg-amber-700/20 text-amber-900' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                            #{item.rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs line-clamp-1 text-zinc-800">{item.product.name}</p>
                                            <p className="text-[10px] text-zinc-400">{item.totalSold} ชิ้นที่ขายได้</p>
                                        </div>
                                        <div className="font-black text-xmart-primary text-xs shrink-0">
                                            ฿{item.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Peak Order Time & 6. Peak Order Day Breakdown */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Peak Time Breakdown */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                        <h2 className="font-bold text-zinc-900 text-sm md:text-base mb-3">5. Peak Order Time (ช่วงเวลาสั่งซื้อ)</h2>
                        <div className="space-y-2.5">
                            {timeSlots.map(slot => {
                                const isPeak = slot.label === peakTimeSlot?.label && slot.count > 0;
                                return (
                                    <div key={slot.label} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${isPeak ? 'bg-orange-50/70 border-orange-200' : 'bg-zinc-50/50 border-zinc-100'}`}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-lg">{slot.icon}</span>
                                            <div>
                                                <span className="font-bold text-zinc-800 block">{slot.label}</span>
                                                <span className="text-[10px] text-zinc-400">{slot.range}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-zinc-900 block">{slot.count} ออเดอร์</span>
                                            <span className="text-[10px] text-zinc-500 font-medium">฿{slot.revenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Peak Day of Week Breakdown */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                        <h2 className="font-bold text-zinc-900 text-sm md:text-base mb-3">6. Peak Order Day (วันในสัปดาห์)</h2>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {dayStats.map((d, i) => {
                                const isPeak = d.dayName === peakDay?.dayName && d.count > 0;
                                const shortName = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'][i];
                                return (
                                    <div key={d.dayName} className={`p-2 rounded-xl border transition-colors ${isPeak ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-300' : 'bg-zinc-50 border-zinc-100'}`}>
                                        <span className={`text-[10px] font-bold block ${isPeak ? 'text-purple-700' : 'text-zinc-500'}`}>{shortName}</span>
                                        <span className={`text-base font-black block mt-0.5 ${isPeak ? 'text-purple-700' : 'text-zinc-800'}`}>{d.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
