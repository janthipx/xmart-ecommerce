import { create } from 'zustand';
import { Order } from '@/types';
import { ordersStorage } from '@/lib/storage/helpers';

interface OrderState {
    orders: Order[];
    loaded: boolean;
    hydrate: () => void;
    syncOrders: () => void;
    updateOrder: (orderNumber: string, patch: Partial<Order>) => void;
    findByNumber: (orderNumber: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
    orders: [],
    loaded: false,

    hydrate: () => {
        const stored = ordersStorage.getAll();
        set({ orders: stored, loaded: true });
    },

    syncOrders: () => {
        const stored = ordersStorage.getAll();
        set({ orders: stored });
    },

    updateOrder: (orderNumber, patch) => {
        ordersStorage.update(orderNumber, patch);
        const updated = ordersStorage.getAll();
        set({ orders: updated });
    },

    findByNumber: (orderNumber) => {
        return get().orders.find(o => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()) || ordersStorage.findByNumber(orderNumber);
    },
}));

if (typeof window !== 'undefined') {
    const handleSync = () => {
        useOrderStore.getState().syncOrders();
    };
    window.addEventListener('xmart_storage_sync', handleSync);
    window.addEventListener('storage', handleSync);
}

