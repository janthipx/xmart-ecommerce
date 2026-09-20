"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCheckIcon } from "@/components/icons";

export default function RegisterPage() {
    const { register } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }
        if (form.password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
            router.push('/account');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ');
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
                        <div className="flex justify-center mb-2 text-blue-600">
                            <UserCheckIcon className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-xmart-text">สมัครสมาชิก</h1>
                        <p className="text-zinc-500 text-sm mt-1">X MART Membership</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-xl mb-4 text-center border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { key: 'name', label: 'ชื่อ-นามสกุล *', type: 'text', placeholder: 'ชื่อ นามสกุล' },
                            { key: 'email', label: 'Email *', type: 'email', placeholder: 'email@example.com' },
                            { key: 'phone', label: 'เบอร์โทรศัพท์', type: 'tel', placeholder: '08XXXXXXXX (ไม่บังคับ)' },
                            { key: 'password', label: 'รหัสผ่าน * (อย่างน้อย 6 ตัว)', type: 'password', placeholder: 'รหัสผ่าน' },
                            { key: 'confirm', label: 'ยืนยันรหัสผ่าน *', type: 'password', placeholder: 'ยืนยันรหัสผ่าน' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-xs sm:text-sm font-bold text-zinc-700 mb-1.5">{f.label}</label>
                                <input type={f.type} required={!f.placeholder.includes('ไม่บังคับ')}
                                    value={form[f.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full min-h-[44px] bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm sm:text-base focus:bg-white focus:outline-none focus:border-xmart-primary transition-colors" />
                            </div>
                        ))}

                        <button type="submit" disabled={loading}
                            className="w-full min-h-[48px] bg-xmart-primary text-white font-bold py-3 px-4 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60 cursor-pointer text-base">
                            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-400 mt-5">
                        มีบัญชีแล้ว? <Link href="/login" className="text-xmart-primary font-bold hover:underline">เข้าสู่ระบบ</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
