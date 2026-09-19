"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useEffect, useState } from "react";

const NAV = [
    { href: '/admin', label: '📊 Dashboard', exact: true },
    { href: '/admin/orders', label: '📋 จัดการออเดอร์', exact: false },
    { href: '/admin/products', label: '🛍️ จัดการสินค้า', exact: false },
    { href: '/admin/categories', label: '📂 หมวดหมู่', exact: false },
    { href: '/admin/reports', label: '📈 รายงาน', exact: false },
    { href: '/admin/analytics', label: '🔍 Analytics', exact: false },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const [ready, setReady] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setReady(true);
        if (user === null) { router.replace('/admin/login'); }
        else if (user && user.role !== 'ADMIN') { router.replace('/'); }
    }, [user, router]);

    if (!ready || !user || user.role !== 'ADMIN') return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">⏳ กำลังโหลด...</div>
    );

    const handleLogout = () => { logout(); router.push('/admin/login'); };

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href) && (exact || href !== '/admin/login');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-slate-900 text-white flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Brand */}
                <div className="p-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-xmart-primary text-white rounded-xl p-1.5">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2.5 2v6h13V2z" /><path d="M2.5 13v6h13v-6z" /><path d="M18 10h1.5a1.5 1.5 0 0 1 1.5 1.5v6.5h-3v-8z" /></svg>
                        </div>
                        <span className="font-black text-lg">X MART</span>
                    </div>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full">DEMO MODE - ADMIN</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {NAV.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(item.href, item.exact) ? 'bg-xmart-primary text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-xmart-primary/20 text-xmart-primary flex items-center justify-center font-black text-sm">A</div>
                        <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate">{user.name}</p>
                            <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full text-xs text-slate-400 hover:text-red-400 font-bold py-2 rounded-lg hover:bg-red-500/10 transition-all">
                        ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main */}
            <div className="flex-1 md:ml-60 flex flex-col">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                    </button>
                    <h1 className="font-black text-zinc-800 text-sm md:text-base">
                        {NAV.find(n => isActive(n.href, n.exact))?.label || 'Admin'}
                    </h1>
                    <Link href="/" className="text-xs text-zinc-400 hover:text-xmart-primary font-semibold">← หน้าร้าน</Link>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
