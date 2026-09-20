"use client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { LockIcon } from "@/components/icons";

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
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-zinc-100">
                <div className="text-center mb-7">
                    <div className="w-16 h-16 bg-gradient-to-br from-xmart-primary to-blue-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <LockIcon className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-xmart-text">X MART Admin</h1>
                    <p className="text-zinc-500 text-sm mt-1">เข้าสู่ระบบจัดการ</p>
                    <span className="inline-block mt-2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">DEMO MODE</span>
                </div>

                {error && <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary transition-colors" />
                    <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary transition-colors" />
                    <button type="submit" disabled={loading}
                        className="w-full min-h-[48px] bg-xmart-primary text-white font-bold py-3 px-4 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60 cursor-pointer text-base">
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ Admin'}
                    </button>
                </form>

                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-zinc-500 space-y-1">
                    <p className="font-bold text-blue-700">Demo Credentials:</p>
                    <p>Email: <span className="font-mono font-bold text-zinc-800">demo123@gmail.com</span> <span className="text-zinc-400"></span></p>
                    <p>Password: <span className="font-mono font-bold text-zinc-800">demo123_</span> <span className="text-zinc-400"></span></p>
                </div>

                <Link href="/" className="block text-center text-zinc-400 text-sm mt-4 hover:text-zinc-600">← กลับหน้าหลัก</Link>
            </div>
        </div>
    );
}
