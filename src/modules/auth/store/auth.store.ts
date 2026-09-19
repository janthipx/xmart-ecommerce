import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { usersStorage, sessionStore } from '@/lib/storage/helpers';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => { success: boolean; error?: string };
    register: (data: { name: string; email: string; phone?: string; password: string }) => { success: boolean; error?: string };
    logout: () => void;
    hydrate: () => void;
    adminLogin: (email: string, password: string) => { success: boolean; error?: string };
}

const ADMIN_EMAIL = 'admin@xmart.com';
const ADMIN_PASSWORD = 'admin123';

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    isLoading: true,

    hydrate: () => {
        const stored = sessionStore.get();
        set({ user: stored, isLoading: false });
    },

    login: (email, password) => {
        // Check admin
        if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const adminUser: User = {
                id: 'admin-001', name: 'Admin X MART', email: ADMIN_EMAIL,
                password: '', role: 'ADMIN', createdAt: new Date().toISOString(),
            };
            sessionStore.set(adminUser);
            set({ user: adminUser });
            return { success: true };
        }
        // Check members
        const found = usersStorage.findByEmail(email);
        if (!found) return { success: false, error: 'ไม่พบบัญชีนี้ในระบบ' };
        const userPassword = found.password || found.passwordHash;
        if (userPassword !== password) return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
        sessionStore.set(found);
        set({ user: found });
        return { success: true };
    },

    adminLogin: (email, password) => {
        if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const adminUser: User = {
                id: 'admin-001', name: 'Admin X MART', email: ADMIN_EMAIL,
                password: '', role: 'ADMIN', createdAt: new Date().toISOString(),
            };
            sessionStore.set(adminUser);
            set({ user: adminUser });
            return { success: true };
        }
        return { success: false, error: 'Email หรือ Password ไม่ถูกต้อง' };
    },

    register: ({ name, email, phone, password }) => {
        if (email.toLowerCase() === ADMIN_EMAIL) return { success: false, error: 'ไม่สามารถใช้ Email นี้ได้' };
        const existing = usersStorage.findByEmail(email);
        if (existing) return { success: false, error: 'Email นี้มีบัญชีอยู่แล้ว' };
        if (password.length < 6) return { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };

        const newUser: User = {
            id: `u-${Date.now()}`, name, email, phone,
            password, role: 'MEMBER', createdAt: new Date().toISOString(),
        };
        usersStorage.add(newUser);
        sessionStore.set(newUser);
        set({ user: newUser });
        return { success: true };
    },

    logout: () => {
        sessionStore.clear();
        set({ user: null });
    },
}));
