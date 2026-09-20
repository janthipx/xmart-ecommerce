"use client";

import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { getPlaceholderByCategory } from "@/data/productImages";
import { useTranslation, getProductName } from "@/lib/i18n";
import Link from "next/link";
import { CartIcon, TrashIcon, MinusIcon } from "@/components/icons";

export default function CartPage() {
    const { language, t } = useTranslation();
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

    return (
        <div className="min-h-screen bg-xmart-bg pb-28">
            <Header />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <h1 className="text-2xl sm:text-3xl font-black mb-6 text-zinc-900">{t('cart.title')}</h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-zinc-200/80 max-w-xl mx-auto">
                        <div className="flex justify-center mb-4 text-zinc-300">
                            <CartIcon className="w-16 h-16" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 mb-2">{t('cart.empty')}</h2>
                        <p className="text-zinc-500 text-sm sm:text-base mb-6">{t('cart.emptyDesc')}</p>
                        <Link href="/products" className="inline-flex items-center justify-center bg-[#0060df] text-white font-bold py-3.5 px-8 rounded-full hover:bg-[#0051bc] transition-all active-scale shadow-md min-h-[44px]">
                            {t('common.continueShopping')} →
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="bg-white rounded-3xl shadow-xs border border-zinc-200/80 overflow-hidden">
                            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
                                <span className="font-bold text-zinc-800 text-sm sm:text-base">
                                    {language === 'en' ? `Items in Cart (${items.length})` : `รายการสินค้าในตะกร้า (${items.length} ชนิด)`}
                                </span>
                                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                                    {language === 'en' ? 'Free 24/7 Delivery' : 'ส่งฟรีตลอด 24 ชม.'}
                                </span>
                            </div>
                            <ul className="divide-y divide-zinc-100">
                                {items.map(item => {
                                    const isUnlimited = item.product.isUnlimitedStock;
                                    const prodName = getProductName(item.product, language);
                                    return (
                                        <li key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center justify-between">
                                            <div className="flex gap-3 sm:gap-4 items-center flex-1 min-w-0">
                                                <Link href={`/products/${item.product.id}`} className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-2xl p-2 shrink-0 flex items-center justify-center border border-zinc-100">
                                                    <img
                                                        src={item.product.image || getPlaceholderByCategory(item.product.categoryId)}
                                                        alt={prodName}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            const fallback = getPlaceholderByCategory(item.product.categoryId);
                                                            if (!target.src.endsWith(fallback)) {
                                                                target.src = fallback;
                                                            }
                                                        }}
                                                        className="w-full h-full object-contain mix-blend-multiply"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <Link href={`/products/${item.product.id}`}>
                                                        <h3 className="font-bold text-zinc-900 text-sm sm:text-base line-clamp-2 leading-snug hover:text-[#0060df] transition-colors" title={prodName}>
                                                            {prodName}
                                                        </h3>
                                                    </Link>
                                                    <div className="text-xs text-zinc-400 mt-0.5">฿{item.product.price.toLocaleString()} / ชิ้น</div>
                                                    <p className="sm:hidden text-[#0060df] font-black text-base mt-1">
                                                        ฿{(item.product.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-zinc-100 sm:border-0">
                                                <p className="hidden sm:block text-[#0060df] font-black text-base sm:text-lg mr-2 text-right">
                                                    ฿{(item.product.price * item.quantity).toLocaleString()}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex border border-zinc-300 rounded-full overflow-hidden bg-white shadow-2xs">
                                                        <button onClick={() => item.quantity === 1 ? removeItem(item.product.id) : updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-red-50 text-zinc-600 hover:text-red-500 transition-colors font-bold text-base cursor-pointer"
                                                            aria-label="Decrease or remove">
                                                            {item.quantity === 1 ? <TrashIcon className="w-4 h-4" /> : <MinusIcon className="w-4 h-4" />}
                                                        </button>
                                                        <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base font-black bg-zinc-50">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.product.id, isUnlimited ? item.quantity + 1 : Math.min(item.product.stock, item.quantity + 1))}
                                                            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-zinc-100 text-zinc-600 transition-colors font-bold text-base cursor-pointer"
                                                            aria-label="Increase">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Order Summary Column */}
                        <div className="bg-white rounded-3xl shadow-xs border border-zinc-200/80 p-5 sm:p-6 sticky top-24">
                            <h2 className="text-lg font-black text-zinc-900 mb-4">{language === 'en' ? 'Order Summary' : 'สรุปยอดคำสั่งซื้อ'}</h2>
                            <div className="space-y-2.5 text-sm text-zinc-600 pb-4 border-b border-zinc-100">
                                <div className="flex justify-between">
                                    <span>{t('common.subtotal')}</span>
                                    <span className="font-bold text-zinc-800">฿{getTotalPrice().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>{t('common.shippingFee')}</span>
                                    <span>{language === 'en' ? 'Free! 🚚' : 'ฟรี! (ส่งฟรี 🚚)'}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center py-4 mb-4">
                                <span className="font-bold text-zinc-900 text-base">{t('common.total')}</span>
                                <span className="text-2xl sm:text-3xl font-black text-[#0060df]">฿{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <Link href="/checkout" className="w-full flex items-center justify-center bg-[#0060df] text-white font-bold py-4 px-6 rounded-2xl hover:bg-[#0051bc] transition-all active-scale shadow-lg shadow-blue-500/25 min-h-[48px] text-base">
                                {t('cart.checkout')} →
                            </Link>
                            <Link href="/products" className="w-full block text-center text-zinc-500 font-semibold py-3 mt-2 text-sm hover:text-[#0060df] transition-colors">
                                ← {t('common.continueShopping')}
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
