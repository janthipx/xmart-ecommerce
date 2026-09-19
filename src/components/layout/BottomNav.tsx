"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HomeIcon, MenuIcon, CartIcon, UserIcon, OrderIcon } from "@/components/icons";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const getTotalItems = useCartStore(s => s.getTotalItems);
    const user = useAuthStore(s => s.user);

    useEffect(() => { setMounted(true); }, []);

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname?.startsWith(path + '/'));
    const cartCount = mounted ? getTotalItems() : 0;
    const accountHref = user ? '/account' : '/login';

    // Hide bottom nav on admin pages
    if (pathname?.startsWith('/admin')) return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-xmart-border/40 px-2 py-1 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <Link href="/" className={`flex flex-col items-center p-2 transition-all active-scale flex-1 ${pathname === '/' ? 'text-xmart-primary' : 'text-xmart-text-muted'}`}>
                    <HomeIcon className="h-6 w-6 stroke-[2px]" />
                    <span className="text-[10px] mt-1 font-semibold">หน้าแรก</span>
                </Link>

                <Link href="/products" className={`flex flex-col items-center p-2 transition-all active-scale flex-1 ${isActive('/products') ? 'text-xmart-primary' : 'text-xmart-text-muted'}`}>
                    <MenuIcon className="h-6 w-6 stroke-[2px]" />
                    <span className="text-[10px] mt-1 font-semibold">สินค้า</span>
                </Link>

                <Link href="/cart" className="flex flex-col items-center relative flex-1 group -mt-5">
                    <div className="relative bg-xmart-primary text-white p-3.5 rounded-full shadow-xl hover-lift active-scale border-4 border-white">
                        <CartIcon className="h-6 w-6 stroke-[2px]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-xmart-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold ${isActive('/cart') ? 'text-xmart-primary' : 'text-xmart-text-muted'}`}>ตะกร้า</span>
                </Link>

                <Link href="/track-order" className={`flex flex-col items-center p-2 transition-all active-scale flex-1 ${isActive('/track-order') || isActive('/orders') ? 'text-xmart-primary' : 'text-xmart-text-muted'}`}>
                    <OrderIcon className="h-6 w-6 stroke-[2px]" />
                    <span className="text-[10px] mt-1 font-semibold">ออเดอร์</span>
                </Link>

                <Link href={accountHref} className={`flex flex-col items-center p-2 transition-all active-scale flex-1 ${isActive('/account') || isActive('/login') ? 'text-xmart-primary' : 'text-xmart-text-muted'}`}>
                    {user ? (
                        <div className="w-6 h-6 rounded-full bg-xmart-primary text-white flex items-center justify-center text-xs font-black">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <UserIcon className="h-6 w-6 stroke-[2px]" />
                    )}
                    <span className="text-[10px] mt-1 font-semibold">{user ? 'บัญชี' : 'เข้าสู่ระบบ'}</span>
                </Link>
            </div>
        </nav>
    );
}
