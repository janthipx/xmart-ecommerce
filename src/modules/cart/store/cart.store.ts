import { create } from 'zustand';
import { Product } from '@/types';
import { cartStorage } from '@/lib/storage/helpers';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    loaded: boolean;
    hydrate: () => void;
    addItem: (product: Product, qty?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
    items: [],
    loaded: false,

    hydrate: () => {
        const stored = cartStorage.get();
        set({ items: stored, loaded: true });
    },

    addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        const updated = existing
            ? items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
            : [...items, { product, quantity: qty }];
        cartStorage.set(updated);
        set({ items: updated });
    },

    removeItem: (productId) => {
        const updated = get().items.filter(i => i.product.id !== productId);
        cartStorage.set(updated);
        set({ items: updated });
    },

    updateQuantity: (productId, qty) => {
        if (qty < 1) return;
        const updated = get().items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
        cartStorage.set(updated);
        set({ items: updated });
    },

    clearCart: () => {
        cartStorage.clear();
        set({ items: [] });
    },

    getTotalItems: () => get().items.reduce((t, i) => t + i.quantity, 0),
    getTotalPrice: () => get().items.reduce((t, i) => t + (i.product.price * i.quantity), 0),
}));
