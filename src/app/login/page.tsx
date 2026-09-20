"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon } from "@/components/icons";

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 400));
            const result = login(form.email, form.password);
            if (result.success) {
                const currentUser = useAuthStore.getState().user;
                if (currentUser?.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/account');
                }
            } else {
                setError(result.error || 'เข้าสู่ระบบไม่สำเร็จ');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-xmart-bg flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-200/80 w-full max-w-md">
                    <div className="text-center mb-7">
                        <div className="flex justify-center mb-2 text-zinc-400">
                            <UserIcon className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-xmart-text">เข้าสู่ระบบ</h1>
                        <p className="text-zinc-500 text-sm mt-1">X MART Membership</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl mb-4 text-center border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5">Email</label>
                            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="email@example.com"
                                className="w-full min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5">รหัสผ่าน</label>
                            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="รหัสผ่าน"
                                className="w-full min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary transition-colors" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full min-h-[48px] bg-xmart-primary text-white font-bold py-3 px-4 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60 cursor-pointer text-base">
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
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
