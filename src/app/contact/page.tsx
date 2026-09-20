"use client";

import { Header } from "@/components/layout/Header";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { useState } from "react";
import {
    PhoneIcon,
    MailIcon,
    MessageSquareIcon,
    ClockIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    ZapIcon,
    RefreshCwIcon
} from "@/components/icons";

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const INITIAL_FORM: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

export default function ContactPage() {
    const { language, t } = useTranslation();
    const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Short simulated delay for smooth UX
        await new Promise(r => setTimeout(r, 600));
        setSubmitting(false);
        setSubmitted(true);
    };

    const handleResetForm = () => {
        setForm(INITIAL_FORM);
        setSubmitted(false);
    };

    return (
        <div className="min-h-screen bg-xmart-bg flex flex-col">
            <Header />

            <main className="flex-1 w-full">
                {/* Breadcrumb */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
                    <nav className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                        <Link href="/" className="hover:text-xmart-primary transition-colors">
                            {language === 'en' ? 'Home' : 'หน้าแรก'}
                        </Link>
                        <span>/</span>
                        <span className="text-zinc-800 font-bold">{t('footer.contact')}</span>
                    </nav>
                </div>

                {/* Hero Header */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-br from-[#0a3863] via-xmart-primary to-blue-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
                        <div className="max-w-2xl relative z-10 space-y-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-blue-100 border border-white/20">
                                <ZapIcon className="w-3.5 h-3.5 text-amber-300" />
                                {t('contact.badge')}
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                {t('contact.title')}
                            </h1>
                            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                                {t('contact.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area: Info Cards + Form */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                    {/* Demo Contact Channels Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Phone Card */}
                        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-xmart-primary flex items-center justify-center">
                                <PhoneIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    {t('contact.phoneTitle')}
                                </h3>
                                <p className="text-base font-black text-zinc-900 mt-0.5">
                                    {t('contact.phoneVal')}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {t('contact.phoneDesc')}
                                </p>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <MailIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    {t('contact.emailTitle')}
                                </h3>
                                <p className="text-base font-black text-zinc-900 mt-0.5">
                                    {t('contact.emailVal')}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {t('contact.emailDesc')}
                                </p>
                            </div>
                        </div>

                        {/* LINE Card */}
                        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <MessageSquareIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    {t('contact.lineTitle')}
                                </h3>
                                <p className="text-base font-black text-zinc-900 mt-0.5">
                                    {t('contact.lineVal')}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {t('contact.lineDesc')}
                                </p>
                            </div>
                        </div>

                        {/* Operating Hours Card */}
                        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <ClockIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    {t('contact.hoursTitle')}
                                </h3>
                                <p className="text-base font-black text-zinc-900 mt-0.5">
                                    {t('contact.hoursVal')}
                                </p>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    {t('contact.hoursDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-100 shadow-sm">
                        <div className="max-w-2xl mb-6 space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                <AlertCircleIcon className="w-3.5 h-3.5" />
                                <span>Demo Mode</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900">
                                {t('contact.formTitle')}
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-500">
                                {t('contact.formSubtitle')}
                            </p>
                        </div>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 space-y-4 max-w-xl">
                                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                                    <CheckCircleIcon className="w-7 h-7 text-green-600" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-green-900">
                                        {language === 'en' ? 'Message Sent (Demo Mode)' : 'ส่งข้อความสำเร็จ (โหมดจำลอง)'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-green-800/90 leading-relaxed">
                                        {t('contact.demoSuccess')}
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleResetForm}
                                        className="inline-flex items-center gap-2 bg-green-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-xs"
                                    >
                                        <RefreshCwIcon className="w-3.5 h-3.5" />
                                        <span>{language === 'en' ? 'Send Another Message' : 'ส่งข้อความใหม่อีกครั้ง'}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                                            {t('contact.nameLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder={language === 'en' ? 'e.g. John Doe' : 'เช่น สมชาย ใจดี'}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary focus:bg-white transition-all min-h-[44px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                                            {t('contact.emailLabel')}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="example@mail.com"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary focus:bg-white transition-all min-h-[44px]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                                            {t('contact.phoneLabel')}
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            placeholder="08X-XXX-XXXX"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary focus:bg-white transition-all min-h-[44px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                                            {t('contact.subjectLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                            placeholder={language === 'en' ? 'e.g. Inquiry about product availability' : 'เช่น สอบถามสินค้า'}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary focus:bg-white transition-all min-h-[44px]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                                        {t('contact.messageLabel')}
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        placeholder={language === 'en' ? 'Write your message here...' : 'พิมพ์ข้อความของคุณที่นี่...'}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary focus:bg-white transition-all resize-y"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-xmart-primary text-white font-bold px-8 py-3 rounded-full hover:bg-xmart-primary-light transition-all text-sm shadow-md active-scale disabled:opacity-60 cursor-pointer min-h-[48px]"
                                    >
                                        {submitting
                                            ? (language === 'en' ? 'Sending Demo...' : 'กำลังจำลองส่งข้อความ...')
                                            : t('contact.sendBtn')
                                        }
                                    </button>
                                    <span className="text-xs text-zinc-400">
                                        {language === 'en'
                                            ? '* Demo interface. No real message transmission.'
                                            : '* แบบฟอร์มจำลอง ไม่มีการส่งข้อมูลจริง'}
                                    </span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
