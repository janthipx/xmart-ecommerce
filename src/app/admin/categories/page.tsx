"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { categoriesStorage } from "@/lib/storage/helpers";
import { mockCategories } from "@/data/categories";
import { useEffect, useState } from "react";
import { Category } from "@/types";

const ICONS = ['🍜', '🥤', '🍬', '🧴', '🏠', '🧹', '🛒', '💊', '🎁', '📦', '🌿', '🧃'];

export default function AdminCategoriesPage() {
    const [cats, setCats] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', icon: '📦' });

    const reload = () => setCats(categoriesStorage.getAll(mockCategories));
    useEffect(() => { reload(); }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            categoriesStorage.save(cats.map(c => c.id === editing.id ? { ...c, ...form } : c));
        } else {
            const newCat: Category = { id: `cat-${Date.now()}`, name: form.name, icon: form.icon };
            categoriesStorage.save([...cats, newCat]);
        }
        setShowForm(false); setEditing(null); setForm({ name: '', icon: '📦' }); reload();
    };

    const handleDelete = (id: string) => {
        if (!confirm('ลบหมวดหมู่นี้?')) return;
        categoriesStorage.save(cats.filter(c => c.id !== id));
        reload();
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button onClick={() => { setEditing(null); setForm({ name: '', icon: '📦' }); setShowForm(true); }}
                        className="bg-xmart-primary text-white font-bold px-5 py-2 rounded-xl hover:bg-xmart-primary-light transition-all text-sm active-scale">
                        + เพิ่มหมวดหมู่
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
                        <h3 className="font-bold mb-4">{editing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-1">ชื่อหมวดหมู่ *</label>
                                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-700 block mb-2">Icon</label>
                                <div className="flex flex-wrap gap-2">
                                    {ICONS.map(icon => (
                                        <button type="button" key={icon} onClick={() => setForm({ ...form, icon })}
                                            className={`w-10 h-10 text-xl rounded-xl flex items-center justify-center transition-all ${form.icon === icon ? 'bg-xmart-primary/20 ring-2 ring-xmart-primary' : 'bg-zinc-100 hover:bg-zinc-200'}`}>
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-zinc-200 text-zinc-600 font-bold py-2.5 rounded-xl text-sm">ยกเลิก</button>
                                <button type="submit" className="flex-1 bg-xmart-primary text-white font-bold py-2.5 rounded-xl text-sm">บันทึก</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {cats.map(cat => (
                        <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 text-center">
                            <div className="text-4xl mb-2">{cat.icon}</div>
                            <p className="font-bold text-sm text-zinc-800 mb-3 line-clamp-1">{cat.name}</p>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => { setEditing(cat); setForm({ name: cat.name, icon: cat.icon }); setShowForm(true); }}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">แก้ไข</button>
                                <button onClick={() => handleDelete(cat.id)}
                                    className="px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">ลบ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
