"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        const result = login(form.email, form.password);
        setLoading(false);
        if (result.success) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/account');
            }
        } else {
            setError(result.error || 'เกิดข้อผิดพลาด');
        }
    };

    return (
        <div className="min-h-screen bg-xmart-bg flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl p-8 shadow-sm w-full max-w-sm">
                    <div className="text-center mb-7">
                        <div className="text-4xl mb-2">👤</div>
                        <h1 className="text-2xl font-black text-xmart-text">เข้าสู่ระบบ</h1>
                        <p className="text-zinc-400 text-sm mt-1">X MART Membership</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl mb-4 text-center border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Email</label>
                            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="email@example.com"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-xmart-primary" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">รหัสผ่าน</label>
                            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="รหัสผ่าน"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-xmart-primary" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-xmart-primary text-white font-bold py-3.5 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60">
                            {loading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-400 mt-5">
                        ยังไม่มีบัญชี? <Link href="/register" className="text-xmart-primary font-bold hover:underline">สมัครสมาชิก</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
