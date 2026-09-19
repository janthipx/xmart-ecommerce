"use client";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useEffect, useState, use } from "react";
import { Product, Category } from "@/types";
import { productsStorage, categoriesStorage, notificationsStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { ProductCard } from "@/components/shop/ProductCard";
import { getPlaceholderByCategory } from "@/data/productImages";
import { getBestSellingProducts, BestSellingItem } from "@/lib/order-analytics";
import { ordersStorage } from "@/lib/storage/helpers";
import { useTranslation, getProductName, getProductDescription, getCategoryName } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { language, t } = useTranslation();
    const { id } = use(params);
    const addItem = useCartStore(s => s.addItem);
    const initialProduct = mockProducts.find(p => p.id === id) || null;
    const initialCategory = initialProduct ? mockCategories.find(c => c.id === initialProduct.categoryId) || null : null;
    const initialRelated = initialProduct ? mockProducts.filter(p => p.categoryId === initialProduct.categoryId && p.id !== initialProduct.id && p.status !== 'HIDDEN').slice(0, 4) : [];

    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [related, setRelated] = useState<Product[]>(initialRelated);
    const [category, setCategory] = useState<Category | null>(initialCategory);
    const [bestSellerRank, setBestSellerRank] = useState<number | null>(null);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(!initialProduct);

    useEffect(() => {
        const products = productsStorage.getAll(mockProducts);
        const categories = categoriesStorage.getAll(mockCategories);
        const orders = ordersStorage.getAll();
        const found = products.find(p => p.id === id);
        if (found) {
            setProduct(found);
            setCategory(categories.find(c => c.id === found.categoryId) || null);
            setRelated(products.filter(p => p.categoryId === found.categoryId && p.id !== found.id && p.status !== 'HIDDEN').slice(0, 4));

            const bestSelling = getBestSellingProducts(products, orders);
            const rankItem = bestSelling.find(b => b.product.id === found.id);
            setBestSellerRank(rankItem ? rankItem.rank : null);
        }
        setLoading(false);
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-xmart-bg">
            <Header />
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-zinc-400 text-center"><div className="text-4xl mb-2 animate-bounce">⏳</div><p>กำลังโหลด...</p></div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-xmart-bg">
            <Header />
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h1 className="text-xl font-bold mb-2">ไม่พบสินค้านี้</h1>
                <Link href="/products" className="text-xmart-primary font-bold hover:underline">กลับไปดูสินค้าทั้งหมด</Link>
            </div>
        </div>
    );

    const isOutOfStock = !product.isUnlimitedStock && product.stock === 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addItem(product, qty);
        notificationsStorage.add({ title: 'เพิ่มลงตะกร้าแล้ว', message: `${product.name} × ${qty} ชิ้น`, type: 'ORDER' });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const productName = getProductName(product, language);
    const productDesc = getProductDescription(product, language);
    const categoryName = category ? getCategoryName(category, language) : '';

    return (
        <div className="min-h-screen bg-xmart-bg pb-24">
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                <nav className="text-xs sm:text-sm text-zinc-500 mb-6 flex items-center gap-2 flex-wrap">
                    <Link href="/" className="hover:text-xmart-primary">{t('header.home')}</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-xmart-primary">{t('header.products')}</Link>
                    {category && <><span>/</span><Link href={`/products?category=${encodeURIComponent(category.name)}`} className="hover:text-xmart-primary font-semibold">{category.icon} {categoryName}</Link></>}
                    <span>/</span>
                    <span className="text-zinc-800 font-bold line-clamp-1">{productName}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-14 items-start">
                    {/* Image Column */}
                    <div className="bg-white rounded-3xl p-6 sm:p-12 flex items-center justify-center aspect-square shadow-sm border border-zinc-200/80 relative overflow-hidden">
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-white/75 flex items-center justify-center z-10">
                                <span className="bg-zinc-800 text-white text-sm sm:text-base font-bold px-5 py-2.5 rounded-full shadow-md">{language === 'en' ? 'Out of Stock' : 'สินค้าหมด'}</span>
                            </div>
                        )}
                        <img
                            src={product.image || getPlaceholderByCategory(product.categoryId)}
                            alt={productName}
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const fallback = getPlaceholderByCategory(product.categoryId);
                                if (!target.src.endsWith(fallback)) {
                                    target.src = fallback;
                                }
                            }}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            {product.isPromotion && (
                                <span className="inline-flex items-center text-xs sm:text-sm font-bold text-white bg-[#e60023] rounded-full px-3.5 py-1 shadow-xs tracking-wide">
                                    {product.promotionLabel || (language === 'en' ? 'PROMO' : 'โปรโมชั่น')}
                                </span>
                            )}
                            {bestSellerRank !== null && bestSellerRank <= 10 && (
                                <span className={`inline-flex items-center text-xs sm:text-sm font-black rounded-full px-3.5 py-1 shadow-xs text-white ${
                                    bestSellerRank === 1 ? 'bg-amber-500' : bestSellerRank === 2 ? 'bg-slate-500' : bestSellerRank === 3 ? 'bg-amber-700' : 'bg-amber-100 !text-amber-900 border border-amber-200'
                                }`}>
                                    {bestSellerRank <= 3 ? (language === 'en' ? `#${bestSellerRank} Best Seller` : `อันดับ #${bestSellerRank} ขายดี`) : (language === 'en' ? 'Best Seller 🔥' : 'สินค้าขายดี 🔥')}
                                </span>
                            )}
                            {category && (
                                <Link
                                    href={`/products?category=${encodeURIComponent(category.name)}`}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0060df] bg-blue-50 hover:bg-blue-100 rounded-full px-3.5 py-1 transition-colors"
                                >
                                    {category.icon} {categoryName}
                                </Link>
                            )}
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-3 py-1 rounded-md">
                                SKU: {product.sku}
                            </span>
                        </div>

                        {product.brand && (
                            <div className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                                {language === 'en' ? 'Brand' : 'แบรนด์'}: <span className="text-zinc-800 font-semibold">{product.brand}</span>
                            </div>
                        )}

                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-3">{productName}</h1>
                        <p className="text-zinc-600 text-base sm:text-lg mb-6 leading-relaxed">{productDesc}</p>

                        <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                            <span className={`text-3xl sm:text-4xl md:text-5xl font-black ${product.isPromotion ? 'text-[#e60023]' : 'text-[#0060df]'}`}>
                                ฿{product.price.toLocaleString()}
                            </span>
                            {product.isPromotion && product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-lg sm:text-xl text-zinc-400 line-through font-normal">
                                    ฿{product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="text-emerald-700 font-bold text-xs sm:text-sm mb-1 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                                {language === 'en' ? 'Free Shipping on all orders 🎉' : 'ส่งฟรีทุกคำสั่งซื้อ 🎉'}
                            </span>
                        </div>

                        {/* Stock Status per Rule 9 & 10 */}
                        <div className="mb-6">
                            {isOutOfStock ? (
                                <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span>{language === 'en' ? 'Out of Stock' : 'สินค้าหมด'}</span>
                                </div>
                            ) : !product.isUnlimitedStock && product.stock <= 5 ? (
                                <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    <span>{language === 'en' ? `Only ${product.stock} left in stock` : `เหลือเพียง ${product.stock} ชิ้น (สินค้าใกล้หมด)`}</span>
                                </div>
                            ) : product.isUnlimitedStock ? (
                                <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span>{language === 'en' ? 'In Stock (Ready to deliver)' : 'มีสินค้าพร้อมส่ง (ไม่จำกัดจำนวน)'}</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-xl">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    <span>{language === 'en' ? `In Stock (${product.stock} units)` : `มีสินค้าพร้อมส่ง (${product.stock} ชิ้น)`}</span>
                                </div>
                            )}
                        </div>

                        {/* Quantity selector */}
                        {!isOutOfStock && (
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex border-2 border-zinc-200 rounded-full overflow-hidden bg-white shadow-2xs">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center text-xl font-bold hover:bg-zinc-100 transition-colors cursor-pointer" aria-label="Decrease quantity">-</button>
                                    <span className="w-14 h-11 flex items-center justify-center font-black text-base">{qty}</span>
                                    <button onClick={() => setQty(q => product.isUnlimitedStock ? q + 1 : Math.min(product.stock, q + 1))}
                                        className="w-11 h-11 flex items-center justify-center text-xl font-bold hover:bg-zinc-100 transition-colors cursor-pointer" aria-label="Increase quantity">+</button>
                                </div>
                                <span className="text-zinc-600 text-sm sm:text-base font-medium">{language === 'en' ? 'Total' : 'รวม'} = <span className="font-black text-[#0060df] text-lg sm:text-xl">฿{(product.price * qty).toLocaleString()}</span></span>
                            </div>
                        )}

                        <button onClick={handleAddToCart} disabled={isOutOfStock}
                            className={`w-full min-h-[50px] py-4 px-6 rounded-2xl font-bold text-base sm:text-lg transition-all active-scale shadow-lg cursor-pointer flex items-center justify-center gap-2 ${added ? 'bg-green-600 text-white shadow-green-500/30' : isOutOfStock ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-[#0060df] text-white hover:bg-[#0051bc] shadow-blue-500/30'}`}>
                            {added ? (language === 'en' ? '✅ Added to Cart!' : '✅ เพิ่มลงตะกร้าแล้ว!') : isOutOfStock ? (language === 'en' ? 'Out of Stock' : 'สินค้าหมด') : (language === 'en' ? `🛒 Add to Cart (${qty} ${qty > 1 ? 'items' : 'item'})` : `🛒 เพิ่มลงตะกร้า (${qty} ชิ้น)`)}
                        </button>

                        <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 space-y-2 text-sm sm:text-base text-zinc-600 shadow-2xs">
                            <div className="flex items-center gap-2"><span>✅</span> <span>{language === 'en' ? '24/7 Express Delivery Nationwide' : 'สินค้ามีพร้อมจัดส่ง 24 ชั่วโมง ทั่วไทย'}</span></div>
                            <div className="flex items-center gap-2"><span>🚚</span> <span>{language === 'en' ? 'Free Shipping on all orders, no minimum' : 'ส่งฟรีทุกคำสั่งซื้อ ไม่มีขั้นต่ำ'}</span></div>
                            <div className="flex items-center gap-2"><span>💵</span> <span>{language === 'en' ? 'Cash on Delivery & Instant PromptPay QR' : 'ชำระเงินสดปลายทาง / PromptPay QR ทันที'}</span></div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="pt-4 border-t border-zinc-200">
                        <h2 className="text-xl sm:text-2xl font-black mb-6 text-zinc-900">{language === 'en' ? 'Related Products in Category' : 'สินค้าในหมวดเดียวกัน'}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {related.map(r => <ProductCard key={r.id} product={r} />)}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
