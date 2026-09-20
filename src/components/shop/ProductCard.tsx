"use client";

import { Product } from "@/types";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { getPlaceholderByCategory } from "@/data/productImages";
import { useTranslation, getProductName, getCategoryName } from "@/lib/i18n";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    rank?: number;
    isBestSeller?: boolean;
}

export function ProductCard({ product, rank, isBestSeller }: ProductCardProps) {
    const { language, t } = useTranslation();
    const addItem = useCartStore(s => s.addItem);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToast, setAddedToast] = useState(false);

    const isOutOfStock = !product.isUnlimitedStock && product.stock === 0;
    const isHidden = product.status === 'HIDDEN';

    if (isHidden) return null;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        addItem(product);
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 1200);
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(v => !v);
    };

    // Category display name
    const categoryName = getCategoryName(product.category || product.categoryId, language);
    const productName = getProductName(product, language);

    // Stock display formatting
    let stockDisplay = language === 'en' ? 'In Stock' : 'มีสินค้า';
    let stockColor = 'text-emerald-600';
    let dotColor = 'bg-emerald-500';

    if (isOutOfStock) {
        stockDisplay = language === 'en' ? 'Out of Stock' : 'สินค้าหมด';
        stockColor = 'text-red-500';
        dotColor = 'bg-red-500';
    } else if (!product.isUnlimitedStock && product.stock <= 5) {
        stockDisplay = language === 'en' ? `Only ${product.stock} left` : `เหลือ ${product.stock} ชิ้น`;
        stockColor = 'text-amber-600 font-semibold';
        dotColor = 'bg-amber-500';
    } else if (product.isUnlimitedStock) {
        stockDisplay = language === 'en' ? 'In Stock' : 'มีสินค้า';
        stockColor = 'text-zinc-600';
        dotColor = 'bg-emerald-500';
    } else {
        stockDisplay = language === 'en' ? `${product.stock} in stock` : `มีสินค้า ${product.stock} ชิ้น`;
        stockColor = 'text-zinc-600';
        dotColor = 'bg-emerald-500';
    }

    // Promo label helper for clean bilingual display
    const promoLabel = product.promotionLabel
        ? (language === 'en'
            ? product.promotionLabel.replace('ราคาพิเศษ', 'Special Price').replace(/ลด\s*(\d+)%/, '$1% OFF')
            : product.promotionLabel)
        : (language === 'en' ? 'PROMO' : 'โปรโมชั่น');

    return (
        <div className="flex flex-col justify-between h-full bg-white rounded-2xl border border-zinc-200/85 shadow-xs hover:shadow-md transition-all duration-200 p-3 sm:p-4 relative group">
            {/* Top Badges (Promotion / Best-Selling Rank) */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start max-w-[72%] pointer-events-none">
                {product.isPromotion && (
                    <span className="bg-[#e60023] text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-md shadow-xs tracking-wide">
                        {promoLabel}
                    </span>
                )}
                {rank && rank <= 3 ? (
                    <span className={`text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-md shadow-xs text-white ${
                        rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-slate-500' : 'bg-amber-700'
                    }`}>
                        #{rank} {language === 'en' ? 'Top' : 'ขายดี'}
                    </span>
                ) : (rank || isBestSeller) ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md">
                        {rank ? `#${rank} ${language === 'en' ? 'Top' : 'ขายดี'}` : (language === 'en' ? 'Popular' : 'ขายดี')}
                    </span>
                ) : null}
            </div>

            {/* Wishlist Heart Button at Top Right */}
            <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-zinc-50 transition-colors cursor-pointer"
                aria-label="Wishlist"
            >
                {isWishlisted ? (
                    <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )}
            </button>

            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="block relative pt-1 mb-2">
                <div className="w-full aspect-square flex items-center justify-center p-2 sm:p-3 bg-zinc-50/60 rounded-xl group-hover:scale-102 transition-transform duration-200">
                    <img
                        src={product.image || product.imageUrl || getPlaceholderByCategory(product.categoryId)}
                        alt={productName}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallback = getPlaceholderByCategory(product.categoryId);
                            if (!target.src.endsWith(fallback)) {
                                target.src = fallback;
                            }
                        }}
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col flex-grow">
                {/* Brand & Category */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                    {product.brand && (
                        <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider truncate">
                            {product.brand}
                        </span>
                    )}
                    <span className="inline-block bg-zinc-100 text-zinc-600 text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded shrink-0">
                        {categoryName}
                    </span>
                </div>

                {/* Title */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#0060df] transition-colors line-clamp-2 mb-1.5 leading-snug min-h-[2.5rem]" title={productName}>
                        {productName}
                    </h3>
                </Link>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 mb-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                    <span className="text-[11px] text-zinc-400 ml-1 font-medium">5.0</span>
                </div>

                {/* Price (with Struck-through Original Price if Promotion) */}
                <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                    <span className={`text-lg sm:text-xl md:text-2xl font-black ${product.isPromotion ? 'text-[#e60023]' : 'text-[#0060df]'}`}>
                        ฿ {product.price.toLocaleString()}
                    </span>
                    {product.isPromotion && product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-zinc-400 line-through font-normal">
                            ฿{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock status indicator */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></span>
                    <span className={stockColor}>
                        {stockDisplay}
                    </span>
                </div>

                {/* Add to Cart Button (min-height: 44px for mobile touch standard) */}
                <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`w-full mt-auto min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs ${
                        isOutOfStock
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                            : addedToast
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#0060df] hover:bg-[#0051bc] text-white active:scale-98'
                    }`}
                >
                    {addedToast ? (
                        <>
                            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>{language === 'en' ? 'Added!' : 'เพิ่มแล้ว!'}</span>
                        </>
                    ) : isOutOfStock ? (
                        <span>{language === 'en' ? 'Out of stock' : 'สินค้าหมด'}</span>
                    ) : (
                        <>
                            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span>{language === 'en' ? 'Add to cart' : 'เพิ่มลงตะกร้า'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
