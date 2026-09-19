"use client";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const { register } = useAuthStore();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) { setError('รหัสผ่านไม่ตรงกัน'); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 500));
        const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
        setLoading(false);
        if (result.success) router.push('/account');
        else setError(result.error || 'เกิดข้อผิดพลาด');
    };

    return (
        <div className="min-h-screen bg-xmart-bg flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-3xl p-8 shadow-sm w-full max-w-sm">
                    <div className="text-center mb-7">
                        <div className="text-4xl mb-2">🎉</div>
                        <h1 className="text-2xl font-black text-xmart-text">สมัครสมาชิก</h1>
                        <p className="text-zinc-400 text-sm mt-1">X MART Membership</p>
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
                                <label className="block text-xs font-bold text-zinc-700 mb-1">{f.label}</label>
                                <input type={f.type} required={!f.placeholder.includes('ไม่บังคับ')}
                                    value={form[f.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-xmart-primary" />
                            </div>
                        ))}

                        <button type="submit" disabled={loading}
                            className="w-full bg-xmart-primary text-white font-bold py-3.5 rounded-2xl hover:bg-xmart-primary-light transition-all active-scale shadow-md disabled:opacity-60">
                            {loading ? '⏳ กำลังสมัคร...' : '🎉 สมัครสมาชิก'}
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
