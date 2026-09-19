"use client";
import { useEffect } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const hydrateCart = useCartStore(s => s.hydrate);
    const hydrateAuth = useAuthStore(s => s.hydrate);

    useEffect(() => {
        hydrateCart();
        hydrateAuth();
    }, [hydrateCart, hydrateAuth]);

    return <>{children}</>;
}
