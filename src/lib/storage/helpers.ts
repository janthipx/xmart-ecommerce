// localStorage helpers for X MART Demo

import { Order, Product, Category, User, Notification, CartItem } from "@/types";
import { initialMockOrders, getInitialMockOrders } from "@/data/orders";
import { calculateOrderStatus } from "@/lib/order-status";
import { resolveProductImage } from "@/data/productImages";

const KEYS = {
    ORDERS: 'xmart_orders',
    PRODUCTS: 'xmart_products',
    CATEGORIES: 'xmart_categories',
    USERS: 'xmart_users',
    CURRENT_USER: 'xmart_current_user',
    NOTIFICATIONS: 'xmart_notifications',
    CART: 'xmart_cart',
} as const;

function safeGet<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
}

function safeSet(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('xmart_storage_sync', { detail: { key, value } }));
    } catch { }
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export const cartStorage = {
    get: (): CartItem[] => {
        const items = safeGet<CartItem[]>(KEYS.CART, []);
        let changed = false;
        const rehydrated = items.map(item => {
            const freshImage = resolveProductImage(
                item.product.id,
                item.product.categoryId,
                item.product.sku,
                item.product.image
            );
            if (item.product.image !== freshImage) {
                changed = true;
                return { ...item, product: { ...item.product, image: freshImage } };
            }
            return item;
        });
        if (changed) {
            safeSet(KEYS.CART, rehydrated);
        }
        return rehydrated;
    },
    set: (items: CartItem[]): void => safeSet(KEYS.CART, items),
    clear: (): void => { if (typeof window !== 'undefined') localStorage.removeItem(KEYS.CART); },
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export const ordersStorage = {
    getAll: (): Order[] => {
        const initial = getInitialMockOrders();
        const stored = safeGet<Order[] | null>(KEYS.ORDERS, null);
        const orders = stored && stored.length > 0 ? stored : initial;

        let hasChanges = false;
        const now = Date.now();
        const updated = orders.map(order => {
            if (order.orderStatus === 'CANCELLED') {
                if (order.paymentStatus !== 'FAILED') {
                    hasChanges = true;
                    return { ...order, paymentStatus: 'FAILED' as const };
                }
                return order;
            }
            if (order.orderStatus === 'DELIVERED') return order;
            const calc = calculateOrderStatus(order, now);
            if (calc.currentStatus !== order.orderStatus) {
                hasChanges = true;
                const patch: Order = {
                    ...order,
                    orderStatus: calc.currentStatus,
                    statusUpdatedAt: new Date(now).toISOString(),
                    updatedAt: new Date(now).toISOString(),
                };
                if (calc.isShipping && !patch.delivery?.driverName) {
                    patch.delivery = {
                        driverName: 'สมชาย มาเร็ว',
                        driverPhone: '0812345678',
                        status: 'SHIPPING',
                    };
                }
                return patch;
            }
            return order;
        });

        if (hasChanges || stored === null) {
            safeSet(KEYS.ORDERS, updated);
        }
        return updated;
    },
    add: (order: Order): void => {
        const orders = ordersStorage.getAll();
        safeSet(KEYS.ORDERS, [order, ...orders]);
    },
    update: (orderNumber: string, patch: Partial<Order>): void => {
        if (patch.orderStatus === 'CANCELLED') {
            patch.paymentStatus = 'FAILED';
        }
        // Requirement 3 & 5: Order snapshot items, priceAtTimeOfOrder, and totalPrice are permanently locked
        // Strip items, totalPrice, and createdAt from incoming patch to enforce immutability
        const { items: _lockedItems, totalPrice: _lockedTotalPrice, createdAt: _lockedCreatedAt, ...safePatch } = patch;

        const orders = ordersStorage.getAll().map(o => {
            if (o.orderNumber === orderNumber) {
                const isCancelled = safePatch.orderStatus === 'CANCELLED' || o.orderStatus === 'CANCELLED';

                // Requirement 6 & 7: Payment Gate
                // If PromptPay order has not been paid (paymentStatus is PENDING),
                // prevent moving orderStatus to PREPARING, SHIPPING, or DELIVERED.
                if (o.paymentMethod === 'PROMPTPAY' && o.paymentStatus === 'PENDING' && safePatch.paymentStatus !== 'PAID') {
                    if (safePatch.orderStatus && ['PREPARING', 'SHIPPING', 'DELIVERED'].includes(safePatch.orderStatus)) {
                        delete safePatch.orderStatus;
                    }
                }

                // When PromptPay payment changes from PENDING -> PAID, advance order from PENDING -> CONFIRMED
                if (o.paymentMethod === 'PROMPTPAY' && safePatch.paymentStatus === 'PAID') {
                    if (!safePatch.orderStatus && o.orderStatus === 'PENDING') {
                        safePatch.orderStatus = 'CONFIRMED';
                    }
                    if (!safePatch.statusUpdatedAt) {
                        safePatch.statusUpdatedAt = new Date().toISOString();
                    }
                }

                return {
                    ...o,
                    ...safePatch,
                    paymentStatus: isCancelled ? ('FAILED' as const) : (safePatch.paymentStatus || o.paymentStatus),
                    updatedAt: new Date().toISOString()
                };
            }
            return o;
        });
        safeSet(KEYS.ORDERS, orders);
    },
    findByNumber: (orderNumber: string): Order | undefined =>
        ordersStorage.getAll().find(o => o.orderNumber === orderNumber),
    findByPhone: (phone: string): Order[] =>
        ordersStorage.getAll().filter(o => o.customerPhone === phone),
    findByUser: (userId: string): Order[] =>
        ordersStorage.getAll().filter(o => o.customerId === userId),
    reset: (): void => {
        const fresh = getInitialMockOrders();
        safeSet(KEYS.ORDERS, fresh);
    },
};

// ─── Products ────────────────────────────────────────────────────────────────

export const productsStorage = {
    getAll: (mockFallback: Product[]): Product[] => {
        const stored = safeGet<Product[] | null>(KEYS.PRODUCTS, null);

        // If no stored products, or product count is less than fallback, seed from mockFallback
        if (!stored || stored.length < mockFallback.length) {
            safeSet(KEYS.PRODUCTS, mockFallback);
            return mockFallback;
        }

        // Auto-rehydrate/heal product images against verified real images from resolveProductImage.
        // This ensures stale localStorage copies containing old placeholders or invalid paths
        // are instantly upgraded to the latest real product image paths.
        let changed = false;
        const rehydrated = stored.map(p => {
            const freshImage = resolveProductImage(p.id, p.categoryId, p.sku, p.image);
            if (p.image !== freshImage) {
                changed = true;
                return { ...p, image: freshImage };
            }
            return p;
        });

        if (changed) {
            safeSet(KEYS.PRODUCTS, rehydrated);
            return rehydrated;
        }

        return stored;
    },
    save: (products: Product[]): void => safeSet(KEYS.PRODUCTS, products),
    reset: (mockProducts: Product[]): void => safeSet(KEYS.PRODUCTS, mockProducts),
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const categoriesStorage = {
    getAll: (mockFallback: Category[]): Category[] => {
        const stored = safeGet<Category[] | null>(KEYS.CATEGORIES, null);
        if (!stored || stored.length < mockFallback.length) {
            safeSet(KEYS.CATEGORIES, mockFallback);
            return mockFallback;
        }
        return stored;
    },
    save: (categories: Category[]): void => safeSet(KEYS.CATEGORIES, categories),
    reset: (mockCategories: Category[]): void => safeSet(KEYS.CATEGORIES, mockCategories),
};

// ─── Users ───────────────────────────────────────────────────────────────────

const ADMIN_USER: User = {
    id: 'admin-00',
    name: 'Admin XMART',
    email: 'admin@xmart.com',
    phone: '020000000',
    role: 'ADMIN',
    passwordHash: 'admin123',
    password: 'admin123',
    createdAt: '2026-01-01T00:00:00.000Z',
};

export const usersStorage = {
    getAll: (): User[] => safeGet(KEYS.USERS, []),
    save: (users: User[]): void => safeSet(KEYS.USERS, users),
    findByEmail: (email: string): User | undefined => {
        if (email === ADMIN_USER.email) return ADMIN_USER;
        return usersStorage.getAll().find(u => u.email === email);
    },
    add: (user: User): void => {
        const users = usersStorage.getAll();
        safeSet(KEYS.USERS, [...users, user]);
    },
    getAdmin: () => ADMIN_USER,
};

export const currentUserStorage = {
    get: (): User | null => safeGet(KEYS.CURRENT_USER, null),
    set: (user: User): void => safeSet(KEYS.CURRENT_USER, user),
    clear: (): void => { if (typeof window !== 'undefined') localStorage.removeItem(KEYS.CURRENT_USER); },
};

export const sessionStore = currentUserStorage;

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationsStorage = {
    getAll: (): Notification[] => safeGet(KEYS.NOTIFICATIONS, []),
    add: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>): void => {
        const items = notificationsStorage.getAll();
        const notification: Notification = { ...n, id: `notif-${Date.now()}`, read: false, createdAt: new Date().toISOString() };
        safeSet(KEYS.NOTIFICATIONS, [notification, ...items].slice(0, 50));
    },
    markAllRead: (): void => {
        const items = notificationsStorage.getAll().map(n => ({ ...n, read: true }));
        safeSet(KEYS.NOTIFICATIONS, items);
    },
    countUnread: (): number => notificationsStorage.getAll().filter(n => !n.read).length,
};

// ─── Reset all demo data ─────────────────────────────────────────────────────

export function resetAllDemoData(mockProducts: Product[], mockCategories: Category[]): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.CART);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.CURRENT_USER);
    safeSet(KEYS.ORDERS, getInitialMockOrders());
    safeSet(KEYS.PRODUCTS, mockProducts);
    safeSet(KEYS.CATEGORIES, mockCategories);
}
