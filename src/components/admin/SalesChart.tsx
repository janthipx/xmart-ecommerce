"use client";

import { useState, useMemo, useEffect } from "react";
import { Order } from "@/types";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { CoinsIcon, OrderIcon, TrendingUpIcon, BarChartIcon } from "@/components/icons";

interface SalesChartProps {
    orders: Order[];
}

type TimeRange = 'today' | '7days' | '30days';
type ChartType = 'bar' | 'line';

interface ChartPoint {
    date: string;
    shortDate: string;
    sales: number;
    orders: number;
}

export function SalesChart({ orders }: SalesChartProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('7days');
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Calculate aggregated sales data from real orders based on selected timeframe
    const { chartData, totalSales, ordersCount, avgOrderValue } = useMemo(() => {
        const now = new Date();
        const validOrders = orders.filter(o => o.orderStatus !== 'CANCELLED');

        // 1. TODAY (00:00 - 24:00 divided into 6 time intervals)
        if (timeRange === 'today') {
            const todayStr = now.toDateString();
            const buckets: { label: string; shortLabel: string; startH: number; endH: number; sales: number; count: number }[] = [
                { label: '00:00 - 04:00', shortLabel: '00:00', startH: 0, endH: 4, sales: 0, count: 0 },
                { label: '04:00 - 08:00', shortLabel: '04:00', startH: 4, endH: 8, sales: 0, count: 0 },
                { label: '08:00 - 12:00', shortLabel: '08:00', startH: 8, endH: 12, sales: 0, count: 0 },
                { label: '12:00 - 16:00', shortLabel: '12:00', startH: 12, endH: 16, sales: 0, count: 0 },
                { label: '16:00 - 20:00', shortLabel: '16:00', startH: 16, endH: 20, sales: 0, count: 0 },
                { label: '20:00 - 24:00', shortLabel: '20:00', startH: 20, endH: 24, sales: 0, count: 0 },
            ];

            let sumSales = 0;
            let sumOrders = 0;

            for (const order of validOrders) {
                const orderDate = new Date(order.createdAt);
                if (orderDate.toDateString() === todayStr) {
                    const hour = orderDate.getHours();
                    const bucket = buckets.find(b => hour >= b.startH && hour < b.endH);
                    if (bucket) {
                        bucket.sales += order.totalPrice;
                        bucket.count += 1;
                    }
                    sumSales += order.totalPrice;
                    sumOrders += 1;
                }
            }

            const aov = sumOrders > 0 ? Math.round(sumSales / sumOrders) : 0;
            return {
                chartData: buckets.map(b => ({
                    date: b.label,
                    shortDate: b.shortLabel,
                    sales: b.sales,
                    orders: b.count,
                })),
                totalSales: sumSales,
                ordersCount: sumOrders,
                avgOrderValue: aov,
            };
        }

        const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
        const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

        // 2. LAST 7 DAYS
        if (timeRange === '7days') {
            const daysMap = new Map<string, { label: string; shortLabel: string; sales: number; count: number }>();

            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const dayName = thaiDays[d.getDay()];
                const dayNum = d.getDate();
                const monthName = thaiMonths[d.getMonth()];
                daysMap.set(key, {
                    label: `${dayName} ${dayNum} ${monthName}`,
                    shortLabel: `${dayName} ${dayNum}`,
                    sales: 0,
                    count: 0,
                });
            }

            let sumSales = 0;
            let sumOrders = 0;

            for (const order of validOrders) {
                const orderDate = new Date(order.createdAt);
                const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
                const item = daysMap.get(key);
                if (item) {
                    item.sales += order.totalPrice;
                    item.count += 1;
                    sumSales += order.totalPrice;
                    sumOrders += 1;
                }
            }

            const aov = sumOrders > 0 ? Math.round(sumSales / sumOrders) : 0;
            return {
                chartData: Array.from(daysMap.values()).map(v => ({
                    date: v.label,
                    shortDate: v.shortLabel,
                    sales: v.sales,
                    orders: v.count,
                })),
                totalSales: sumSales,
                ordersCount: sumOrders,
                avgOrderValue: aov,
            };
        }

        // 3. LAST 30 DAYS
        const daysMap = new Map<string, { label: string; shortLabel: string; sales: number; count: number }>();

        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const dayNum = d.getDate();
            const monthName = thaiMonths[d.getMonth()];
            daysMap.set(key, {
                label: `${dayNum} ${monthName}`,
                shortLabel: `${dayNum}/${d.getMonth() + 1}`,
                sales: 0,
                count: 0,
            });
        }

        let sumSales = 0;
        let sumOrders = 0;

        for (const order of validOrders) {
            const orderDate = new Date(order.createdAt);
            const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
            const item = daysMap.get(key);
            if (item) {
                item.sales += order.totalPrice;
                item.count += 1;
                sumSales += order.totalPrice;
                sumOrders += 1;
            }
        }

        const aov = sumOrders > 0 ? Math.round(sumSales / sumOrders) : 0;
        return {
            chartData: Array.from(daysMap.values()).map(v => ({
                date: v.label,
                shortDate: v.shortLabel,
                sales: v.sales,
                orders: v.count,
            })),
            totalSales: sumSales,
            ordersCount: sumOrders,
            avgOrderValue: aov,
        };
    }, [orders, timeRange]);

    // Custom Tooltip component for Recharts
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartPoint }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-zinc-200 rounded-xl p-3 shadow-lg text-xs min-w-[140px]">
                    <div className="font-bold text-zinc-800 mb-1.5">{data.date}</div>
                    <div className="flex items-center justify-between gap-3 text-emerald-600 font-bold">
                        <span>ยอดขาย:</span>
                        <span>฿{Number(data.sales).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-zinc-500 mt-0.5 font-medium">
                        <span>คำสั่งซื้อ:</span>
                        <span>{data.orders} รายการ</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 sm:p-6">
            {/* Header with Title and Filter Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-100">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-blue-50 text-xmart-primary flex items-center justify-center shrink-0">
                            <BarChartIcon className="w-5 h-5" />
                        </span>
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-zinc-900 leading-tight">
                                ยอดขาย (Sales Overview)
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                กราฟและสรุปยอดขายจากคำสั่งซื้อจริงในระบบ X MART
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Timeframe Filter Buttons */}
                    <div className="inline-flex bg-zinc-100 p-1 rounded-xl text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setTimeRange('today')}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                timeRange === 'today'
                                    ? 'bg-white text-xmart-primary shadow-xs'
                                    : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                        >
                            วันนี้
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('7days')}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                timeRange === '7days'
                                    ? 'bg-white text-xmart-primary shadow-xs'
                                    : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                        >
                            7 วัน
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeRange('30days')}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                timeRange === '30days'
                                    ? 'bg-white text-xmart-primary shadow-xs'
                                    : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                        >
                            30 วัน
                        </button>
                    </div>

                    {/* Chart Type Toggle (Bar / Line) */}
                    <div className="inline-flex bg-zinc-100 p-1 rounded-xl text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setChartType('bar')}
                            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                chartType === 'bar'
                                    ? 'bg-white text-xmart-primary shadow-xs'
                                    : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                            title="กราฟแท่ง (Bar Chart)"
                        >
                            กราฟแท่ง
                        </button>
                        <button
                            type="button"
                            onClick={() => setChartType('line')}
                            className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                                chartType === 'line'
                                    ? 'bg-white text-xmart-primary shadow-xs'
                                    : 'text-zinc-500 hover:text-zinc-800'
                            }`}
                            title="กราฟเส้น (Line Chart)"
                        >
                            กราฟเส้น
                        </button>
                    </div>
                </div>
            </div>

            {/* 3 Summary Cards Above Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {/* 1. ยอดขายรวม */}
                <div className="bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100/90 rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                            ยอดขายรวม
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                            <CoinsIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                        ฿{totalSales.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                        คำนวณจากออเดอร์ที่ไม่ถูกยกเลิก
                    </div>
                </div>

                {/* 2. จำนวนคำสั่งซื้อ */}
                <div className="bg-gradient-to-br from-blue-50/60 to-white border border-blue-100/90 rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                            จำนวนคำสั่งซื้อ
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center">
                            <OrderIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                        {ordersCount.toLocaleString()} <span className="text-sm font-bold text-zinc-500">รายการ</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                        ในช่วงเวลาที่เลือก
                    </div>
                </div>

                {/* 3. ยอดเฉลี่ยต่อคำสั่งซื้อ */}
                <div className="bg-gradient-to-br from-purple-50/60 to-white border border-purple-100/90 rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                            ยอดเฉลี่ยต่อคำสั่งซื้อ
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-purple-700 flex items-center justify-center">
                            <TrendingUpIcon className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                        ฿{avgOrderValue.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                        ยอดซื้อเฉลี่ยต่อบิล (AOV)
                    </div>
                </div>
            </div>

            {/* Chart Canvas Area */}
            <div className="w-full min-w-0">
                {!mounted ? (
                    <div className="h-[280px] flex items-center justify-center text-xs text-zinc-400">
                        กำลังเตรียมกราฟ...
                    </div>
                ) : ordersCount === 0 && totalSales === 0 ? (
                    /* Empty State: Requirement 10 */
                    <div className="h-[280px] flex flex-col items-center justify-center text-center p-6 bg-zinc-50/60 rounded-2xl border border-dashed border-zinc-200">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
                            <BarChartIcon className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-zinc-700 text-sm">ยังไม่มีข้อมูลยอดขาย</p>
                        <p className="text-xs text-zinc-400 mt-1">
                            ไม่มีคำสั่งซื้อที่เกิดขึ้นในช่วงเวลานี้ (ลองเลือกช่วงเวลาอื่น เช่น 7 วัน หรือ 30 วัน)
                        </p>
                    </div>
                ) : (
                    /* Recharts Visualization */
                    <div className="h-[280px] sm:h-[310px] w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'bar' ? (
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="shortDate"
                                        tickLine={false}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        tickFormatter={(v: number) => (v >= 1000 ? `฿${v / 1000}k` : `฿${v}`)}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="sales"
                                        fill="#0F52BA"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={44}
                                    />
                                </BarChart>
                            ) : (
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="shortDate"
                                        tickLine={false}
                                        axisLine={{ stroke: '#e2e8f0' }}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11 }}
                                        tickFormatter={(v: number) => (v >= 1000 ? `฿${v / 1000}k` : `฿${v}`)}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#0F52BA"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#0F52BA', strokeWidth: 2, stroke: '#ffffff' }}
                                        activeDot={{ r: 6, fill: '#0F52BA' }}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </section>
    );
}
