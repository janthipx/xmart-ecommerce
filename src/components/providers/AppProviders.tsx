"use client";
import { useEffect } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useOrderStore } from "@/modules/order/store/order.store";
import { useLanguageStore } from "@/lib/i18n";
import { ordersStorage } from "@/lib/storage/helpers";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const hydrateCart = useCartStore(s => s.hydrate);
    const hydrateAuth = useAuthStore(s => s.hydrate);
    const hydrateOrder = useOrderStore(s => s.hydrate);
    const hydrateLanguage = useLanguageStore(s => s.hydrate);

    useEffect(() => {
        hydrateLanguage();
        hydrateCart();
        hydrateAuth();
        hydrateOrder();

        // 1-second live auto-progression ticker across the entire app
        const ticker = setInterval(() => {
            ordersStorage.getAll();
        }, 1000);

        return () => clearInterval(ticker);
    }, [hydrateCart, hydrateAuth, hydrateOrder]);

    return <>{children}</>;
}
