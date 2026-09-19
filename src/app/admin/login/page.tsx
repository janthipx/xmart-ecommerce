"use client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
    const { adminLogin } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setLoading(true);
        await new Promise(r => setTimeout(r, 400));
        const result = adminLogin(form.email, form.password);
        setLoading(false);
        if (result.success) router.push('/admin');
        else setError(result.error || 'เกิดข้อผิดพลาด');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-xmart-primary-dark via-xmart-primary to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
                <div className="text-center mb-7">
                    <div className="w-16 h-16 bg-gradient-to-br from-xmart-primary to-blue-400 text-white text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        🔐
                    </div>
                    <h1 className="text-xl font-black text-xmart-text">X MART Admin</h1>
                    <p className="text-zinc-400 text-sm mt-1">เข้าสู่ระบบจัดการ</p>
                    <span className="inline-block mt-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">DEMO MODE</span>
                </div>

                {error && <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-xmart-primary" />
                    <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-xmart-primary" />
                    <button type="submit" disabled={loading}
                        className="w-full bg-xmart-primary text-white font-bold py-3.5 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60">
                        {loading ? '⏳ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ Admin'}
                    </button>
                </form>

                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-zinc-500">
                    <p className="font-bold text-blue-700 mb-1">Demo Credentials:</p>
                    <p>Email: <span className="font-mono font-bold">demo123@gmail.com</span></p>
                    <p>Password: <span className="font-mono font-bold">demo123_</span></p>
                </div>

                <Link href="/" className="block text-center text-zinc-400 text-sm mt-4 hover:text-zinc-600">← กลับหน้าหลัก</Link>
            </div>
        </div>
    );
}
