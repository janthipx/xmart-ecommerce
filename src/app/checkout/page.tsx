"use client";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ordersStorage, notificationsStorage } from "@/lib/storage/helpers";
import { Order, OrderItem, PaymentMethod } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { mockDrivers } from "@/data/drivers";
import { mockBranches } from "@/data/branches";
import { CartIcon, BanknoteIcon, SmartphoneIcon } from "@/components/icons";

function generateOrderNumber() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = String(Math.floor(Math.random() * 900) + 100);
    const existing = ordersStorage.getAll();
    const seq = String(existing.length + 1).padStart(3, '0');
    return `XM${y}${m}${d}${seq}`;
}

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        province: '',
        district: '',
        subdistrict: '',
        postalCode: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-xmart-bg">
                <Header />
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <div className="flex justify-center mb-4 text-zinc-300"><CartIcon className="w-16 h-16" /></div>
                    <h1 className="text-xl font-bold mb-2">ตะกร้าว่างเปล่า</h1>
                    <p className="text-zinc-400 mb-5 text-sm">ไม่มีสินค้าในตะกร้า</p>
                    <Link href="/products" className="text-xmart-primary font-bold hover:underline">กลับเลือกสินค้า</Link>
                </div>
            </div>
        );
    }

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
        if (!form.phone.trim() || !/^0\d{8,9}$/.test(form.phone.trim())) newErrors.phone = 'กรุณากรอกเบอร์โทรให้ถูกต้อง (เริ่มด้วย 0)';
        if (!form.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่';
        if (!form.province.trim()) newErrors.province = 'กรุณากรอกจังหวัด';
        if (!form.district.trim()) newErrors.district = 'กรุณากรอกเขต/อำเภอ';
        if (!form.subdistrict.trim()) newErrors.subdistrict = 'กรุณากรอกแขวง/ตำบล';
        if (!form.postalCode.trim() || !/^\d{5}$/.test(form.postalCode)) newErrors.postalCode = 'รหัสไปรษณีย์ต้องเป็น 5 หลัก';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));

        const orderNumber = generateOrderNumber();
        const driver = mockDrivers[0];
        const branch = mockBranches[0];
        const now = new Date().toISOString();

        const order: Order = {
            orderNumber,
            customerId: user?.id,
            customerName: form.name.trim(),
            customerPhone: form.phone.trim(),
            address: form.address.trim(),
            province: form.province.trim(),
            district: form.district.trim(),
            subdistrict: form.subdistrict.trim(),
            postalCode: form.postalCode,
            items: items.map(i => ({
                id: `oi-${i.product.id}-${Date.now()}`,
                productId: i.product.id,
                productName: i.product.name,
                productNameTh: i.product.nameTh || i.product.name,
                productNameEn: i.product.nameEn || i.product.name,
                productImage: i.product.image,
                priceAtTimeOfOrder: i.product.price,
                quantity: i.quantity,
            })),
            totalPrice: getTotalPrice(),
            shippingFee: 0,
            paymentMethod,
            paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
            orderStatus: 'PENDING',
            statusUpdatedAt: now,
            delivery: {
                driverName: driver.name,
                driverPhone: driver.phone,
                status: 'PENDING',
            },
            branchId: branch.id,
            createdAt: now,
            updatedAt: now,
        };

        ordersStorage.add(order);
        notificationsStorage.add({
            title: 'สั่งซื้อสำเร็จ!',
            message: `ออเดอร์ #${orderNumber} ได้รับการบันทึกแล้ว`,
            type: 'ORDER',
            orderNumber,
        });

        clearCart();
        setLoading(false);

        if (paymentMethod === 'PROMPTPAY') {
            router.push(`/checkout/qr?orderNumber=${orderNumber}`);
        } else {
            router.push(`/order-success?orderNumber=${orderNumber}`);
        }
    };

    const field = (key: keyof typeof form, label: string, placeholder: string, type = 'text', pattern?: string) => (
        <div>
            <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1.5">{label}</label>
            <input type={type} pattern={pattern} value={form[key]}
                onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
                placeholder={placeholder}
                className={`w-full bg-zinc-50/80 border rounded-xl px-4 py-3 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary focus:ring-1 focus:ring-xmart-primary min-h-[44px] transition-colors ${errors[key] ? 'border-red-400 bg-red-50' : 'border-zinc-300'}`} />
            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-xmart-bg pb-24">
            <Header />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 grid md:grid-cols-[1fr_360px] gap-8 items-start">
                {/* Form */}
                <section>
                    <h1 className="text-2xl sm:text-3xl font-black mb-6 text-zinc-900">รายละเอียดการจัดส่ง</h1>
                    <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-zinc-200/80 space-y-4">
                        {field('name', 'ชื่อ-นามสกุล ผู้รับ *', 'ชื่อ นามสกุล')}
                        {field('phone', 'เบอร์โทรศัพท์ *', '08XXXXXXXX', 'tel')}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-zinc-800 mb-1.5">ที่อยู่จัดส่ง *</label>
                            <textarea value={form.address}
                                onChange={e => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
                                rows={2} placeholder="บ้านเลขที่ ซอย ถนน อาคาร หรือจุดสังเกต"
                                className={`w-full bg-zinc-50/80 border rounded-xl px-4 py-3 text-sm sm:text-base resize-none focus:bg-white focus:outline-none focus:border-xmart-primary focus:ring-1 focus:ring-xmart-primary transition-colors ${errors.address ? 'border-red-400 bg-red-50' : 'border-zinc-300'}`} />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {field('province', 'จังหวัด *', 'จังหวัด')}
                            {field('district', 'เขต/อำเภอ *', 'เขต/อำเภอ')}
                            {field('subdistrict', 'แขวง/ตำบล *', 'แขวง/ตำบล')}
                            {field('postalCode', 'รหัสไปรษณีย์ *', '5 หลัก', 'text', '[0-9]{5}')}
                        </div>

                        {/* Payment */}
                        <div className="pt-3 border-t border-zinc-100">
                            <h3 className="font-bold text-sm sm:text-base text-zinc-900 mb-3">วิธีชำระเงิน</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(['CASH', 'PROMPTPAY'] as const).map(method => (
                                    <label key={method} className={`border-2 rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-xmart-primary bg-blue-50/60 shadow-xs' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                                        <input type="radio" name="payment" value={method} checked={paymentMethod === method}
                                            onChange={() => setPaymentMethod(method)} className="hidden" />
                                        <span className="text-3xl sm:text-4xl text-blue-600 flex items-center justify-center">{method === 'CASH' ? <BanknoteIcon className="w-8 h-8" /> : <SmartphoneIcon className="w-8 h-8" />}</span>
                                        <span className="text-xs sm:text-sm font-bold text-center text-zinc-800">{method === 'CASH' ? 'เงินสดปลายทาง' : 'QR / PromptPay'}</span>
                                        {method === 'PROMPTPAY' && <span className="text-[11px] text-xmart-primary font-bold bg-blue-100/70 px-2 py-0.5 rounded-full">จ่ายก่อนได้สิทธิ์ก่อน</span>}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </section>

                {/* Summary */}
                <aside>
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-zinc-200/80 sticky top-24">
                        <h2 className="text-lg font-black text-zinc-900 mb-4">สรุปออเดอร์</h2>
                        <ul className="divide-y divide-zinc-100 mb-4 max-h-56 overflow-y-auto scrollbar-none">
                            {items.map(item => (
                                <li key={item.product.id} className="py-2.5 flex justify-between items-center gap-2 text-sm">
                                    <div className="flex gap-2 items-center min-w-0">
                                        <span className="bg-xmart-primary/10 text-xmart-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-md shrink-0">{item.quantity}</span>
                                        <span className="text-xs sm:text-sm font-medium text-zinc-800 line-clamp-1">{item.product.name}</span>
                                    </div>
                                    <span className="font-bold text-xs sm:text-sm text-zinc-900 shrink-0">฿{item.product.price * item.quantity}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="py-3 border-t border-zinc-100 space-y-2 text-sm">
                            <div className="flex justify-between text-zinc-600"><span>ยอดรวมสินค้า (Subtotal)</span><span className="font-semibold text-zinc-800">฿{getTotalPrice().toLocaleString()}</span></div>
                            <div className="flex justify-between text-emerald-600 font-bold"><span>ค่าจัดส่ง (Shipping)</span><span>฿0 (ส่งฟรี 🚚)</span></div>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-zinc-200 mb-5">
                            <span className="font-bold text-zinc-900 text-base">ยอดสุทธิ (Grand Total)</span>
                            <span className="text-2xl sm:text-3xl font-black text-xmart-primary">฿{getTotalPrice().toLocaleString()}</span>
                        </div>

                        <button type="submit" form="checkout-form" disabled={loading}
                            className="w-full bg-xmart-primary text-white font-bold py-4 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base min-h-[48px] cursor-pointer">
                            {loading ? 'กำลังสร้างออเดอร์...' : paymentMethod === 'PROMPTPAY' ? 'ดำเนินการชำระเงิน →' : 'ยืนยันสั่งซื้อ (เงินสด)'}
                        </button>
                        <p className="text-center text-xs text-zinc-400 mt-3">
                            {paymentMethod === 'CASH' ? 'ชำระเงินเมื่อได้รับสินค้า (COD)' : 'จ่ายผ่าน QR Code / PromptPay'}
                        </p>
                    </div>
                </aside>
            </main>
        </div>
    );
}
