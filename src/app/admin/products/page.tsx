"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { productsStorage, categoriesStorage } from "@/lib/storage/helpers";
import { mockProducts } from "@/data/products";
import { mockCategories } from "@/data/categories";
import { useEffect, useState, useRef } from "react";
import { Product, Category } from "@/types";
import { ShoppingBagIcon } from "@/components/icons";

import { getPlaceholderByCategory } from "@/data/productImages";

type FormData = Omit<Product, 'id' | 'sku'> & { sku: string; brand?: string };

const EMPTY_FORM: FormData = {
    sku: '', name: '', brand: '', description: '', price: 0,
    image: '', categoryId: '', stock: 0,
    isUnlimitedStock: false, status: 'AVAILABLE',
};

const PAGE_SIZE = 15;

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editing, setEditing] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<FormData>(EMPTY_FORM);
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('all');
    const [page, setPage] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [uploadError, setUploadError] = useState<string>('');

    const reload = () => {
        setProducts(productsStorage.getAll(mockProducts));
        setCategories(categoriesStorage.getAll(mockCategories));
    };
    useEffect(() => { reload(); }, []);

    // Reset pagination when search or category changes
    useEffect(() => {
        setPage(1);
    }, [search, selectedCat]);

    const filtered = products.filter(p => {
        const matchesSearch = !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
        const matchesCat = selectedCat === 'all' || p.categoryId === selectedCat;
        return matchesSearch && matchesCat;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const hasImage = Boolean(form.image && form.image.trim() !== '' && !form.image.includes('/placeholders/'));
    const previewSrc = hasImage ? form.image : getPlaceholderByCategory(form.categoryId);

    const handleEdit = (p: Product) => {
        setEditing(p);
        setForm({
            sku: p.sku,
            name: p.name,
            brand: p.brand || '',
            description: p.description,
            price: p.price,
            image: p.image || '',
            categoryId: p.categoryId,
            stock: p.stock,
            isUnlimitedStock: p.isUnlimitedStock,
            status: p.status
        });
        setSelectedFileName('');
        setUploadError('');
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm('ลบสินค้านี้?')) return;
        productsStorage.save(products.filter(p => p.id !== id));
        reload();
    };

    const handleToggleHide = (p: Product) => {
        productsStorage.save(products.map(x => x.id === p.id ? { ...x, status: x.status === 'HIDDEN' ? 'AVAILABLE' : 'HIDDEN' } : x));
        reload();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadError('');
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation 1: Check file format (.jpg, .jpeg, .png, .webp)
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const fileNameLower = file.name.toLowerCase();
        const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));
        const hasValidMime = file.type.startsWith('image/');

        if (!hasValidExt && !hasValidMime) {
            setUploadError('กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง (.jpg, .jpeg, .png, .webp)');
            e.target.value = '';
            return;
        }

        // Validation 2: Check file size (max 2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setUploadError('ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const rawDataUrl = event.target?.result as string;
            if (!rawDataUrl) return;

            // Compress / scale to max 800px on canvas to ensure fast loading and safe localStorage persistence
            const img = new Image();
            img.onload = () => {
                try {
                    const maxDim = 800;
                    let w = img.width;
                    let h = img.height;
                    if (w > maxDim || h > maxDim) {
                        if (w > h) {
                            h = Math.round((h * maxDim) / w);
                            w = maxDim;
                        } else {
                            w = Math.round((w * maxDim) / h);
                            h = maxDim;
                        }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, w, h);
                        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                        const optimized = canvas.toDataURL(mime, 0.85);
                        setForm(f => ({ ...f, image: optimized }));
                    } else {
                        setForm(f => ({ ...f, image: rawDataUrl }));
                    }
                } catch {
                    setForm(f => ({ ...f, image: rawDataUrl }));
                }
                setSelectedFileName(file.name);
            };
            img.onerror = () => {
                setForm(f => ({ ...f, image: rawDataUrl }));
                setSelectedFileName(file.name);
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const finalImage = form.image && !form.image.includes('/placeholders/')
            ? form.image.trim()
            : '';

        if (editing) {
            productsStorage.save(products.map(p => p.id === editing.id ? {
                ...editing,
                ...form,
                brand: form.brand?.trim() || undefined,
                price: Number(form.price),
                stock: Number(form.stock),
                image: finalImage,
            } : p));
        } else {
            const newP: Product = {
                ...form,
                id: `p-${Date.now()}`,
                brand: form.brand?.trim() || undefined,
                price: Number(form.price),
                stock: Number(form.stock),
                image: finalImage,
            };
            productsStorage.save([newP, ...products]);
        }
        setShowForm(false);
        setEditing(null);
        setForm(EMPTY_FORM);
        setSelectedFileName('');
        setUploadError('');
        reload();
    };

    const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '-';

    return (
        <AdminLayout>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินค้าตามชื่อ, SKU, หรือแบรนด์..."
                        className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-xmart-primary" />
                    
                    <select
                        value={selectedCat}
                        onChange={e => setSelectedCat(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:border-xmart-primary"
                    >
                        <option value="all">ทุกหมวดหมู่ ({products.length})</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({products.filter(p => p.categoryId === c.id).length})
                            </option>
                        ))}
                    </select>

                    <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap bg-zinc-100 px-3 py-2 rounded-xl text-center">
                        {filtered.length} รายการ
                    </span>
                    <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setSelectedFileName(''); setUploadError(''); setShowForm(true); }}
                        className="bg-xmart-primary text-white font-bold px-5 py-2 rounded-xl hover:bg-xmart-primary-light transition-all text-sm shrink-0 active-scale">
                        + เพิ่มสินค้า
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
                            <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                                <h2 className="font-black text-xl mb-5">{editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">SKU *</label>
                                        <input type="text" required value={form.sku}
                                            onChange={e => setForm({ ...form, sku: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">ชื่อสินค้า *</label>
                                        <input type="text" required value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">แบรนด์ (Brand)</label>
                                        <input type="text" value={form.brand || ''}
                                            onChange={e => setForm({ ...form, brand: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">คำอธิบาย</label>
                                        <input type="text" value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>

                                    {/* Product Image Upload Section */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-zinc-700">รูปภาพสินค้า</label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/jpg"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <div className="border border-zinc-200 rounded-2xl p-3 sm:p-4 bg-zinc-50/60 flex flex-col sm:flex-row items-center gap-4">
                                            {/* Preview Box */}
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl border border-zinc-200 p-2 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                                <img
                                                    src={previewSrc}
                                                    alt="Product Preview"
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        const fallback = getPlaceholderByCategory(form.categoryId);
                                                        if (!target.src.endsWith(fallback)) {
                                                            target.src = fallback;
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* Info and Upload/Change Button */}
                                            <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-800">
                                                        {hasImage ? (editing && !selectedFileName ? 'รูปภาพปัจจุบัน' : 'Preview รูปที่เลือก') : 'ยังไม่มีรูปภาพ (ใช้ Placeholder)'}
                                                    </p>
                                                    {selectedFileName ? (
                                                        <p className="text-[11px] text-zinc-500 truncate max-w-xs mt-0.5" title={selectedFileName}>
                                                            ไฟล์: <span className="font-mono text-zinc-700 font-semibold">{selectedFileName}</span>
                                                        </p>
                                                    ) : (
                                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                                            รองรับไฟล์ .jpg, .jpeg, .png, .webp (ไม่เกิน 2MB)
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 transition-all active-scale shadow-2xs cursor-pointer min-h-[36px]"
                                                    >
                                                        {hasImage ? 'เปลี่ยนรูป' : 'เลือกรูปภาพ'}
                                                    </button>
                                                </div>

                                                {uploadError && (
                                                    <p className="text-xs text-red-500 font-medium">
                                                        {uploadError}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">ราคา (฿) *</label>
                                        <input type="number" required min="0" value={form.price}
                                            onChange={e => setForm({ ...form, price: Number(e.target.value) || 0 })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">หมวดหมู่ *</label>
                                    <select required value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary">
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                {/* Stock */}
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.isUnlimitedStock} onChange={e => setForm({ ...form, isUnlimitedStock: e.target.checked })}
                                            className="w-4 h-4 rounded" />
                                        <span className="text-sm font-bold text-zinc-700">สต็อกไม่จำกัด</span>
                                    </label>
                                </div>
                                {!form.isUnlimitedStock && (
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-700 mb-1">จำนวนสต็อก</label>
                                        <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary" />
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-700 mb-1">สถานะ</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Product['status'] })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xmart-primary">
                                        <option value="AVAILABLE">พร้อมขาย</option>
                                        <option value="HIDDEN">ซ่อน</option>
                                        <option value="OUT_OF_STOCK">หมด</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowForm(false)}
                                        className="flex-1 border border-zinc-200 text-zinc-600 font-bold py-2.5 rounded-xl hover:bg-zinc-50 transition-all text-sm">ยกเลิก</button>
                                    <button type="submit"
                                        className="flex-1 bg-xmart-primary text-white font-bold py-2.5 rounded-xl hover:bg-xmart-primary-light transition-all text-sm">บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50">
                                <tr>
                                    {['สินค้า', 'แบรนด์', 'หมวด', 'ราคา', 'สต็อก', 'สถานะ', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-zinc-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {paginated.map(p => (
                                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-zinc-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                                    <img
                                                        src={p.image || getPlaceholderByCategory(p.categoryId)}
                                                        alt={p.name}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                             const target = e.target as HTMLImageElement;
                                                             const fallback = getPlaceholderByCategory(p.categoryId);
                                                             if (!target.src.endsWith(fallback)) {
                                                                 target.src = fallback;
                                                             }
                                                        }}
                                                        className="w-full h-full object-contain mix-blend-multiply p-1"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xs line-clamp-1">{p.name}</p>
                                                    <p className="text-zinc-400 text-[10px]">{p.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs font-semibold text-zinc-700">{p.brand || '-'}</td>
                                        <td className="px-4 py-3 text-xs text-zinc-500">{getCatName(p.categoryId)}</td>
                                        <td className="px-4 py-3 font-black text-xmart-primary">฿{p.price.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-xs">{p.isUnlimitedStock ? '∞ ไม่จำกัด' : `${p.stock} ชิ้น`}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : p.status === 'HIDDEN' ? 'bg-zinc-100 text-zinc-600' : 'bg-red-100 text-red-600'}`}>
                                                {p.status === 'AVAILABLE' ? 'พร้อมขาย' : p.status === 'HIDDEN' ? 'ซ่อน' : 'หมด'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => handleEdit(p)} className="px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100">แก้ไข</button>
                                                <button onClick={() => handleToggleHide(p)} className="px-2.5 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-bold hover:bg-zinc-200">
                                                    {p.status === 'HIDDEN' ? 'แสดง' : 'ซ่อน'}
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="px-2.5 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100">ลบ</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-12 text-center text-zinc-400">
                                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-zinc-300">
                                    <ShoppingBagIcon className="w-10 h-10" />
                                </div>
                                <p className="font-bold">ไม่พบสินค้า</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Bar */}
                    {filtered.length > 0 && (
                        <div className="px-4 py-3 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
                            <div>
                                แสดง <span className="font-bold text-zinc-900">{(page - 1) * PAGE_SIZE + 1}</span> - <span className="font-bold text-zinc-900">{Math.min(page * PAGE_SIZE, filtered.length)}</span> จากทั้งหมด <span className="font-bold text-zinc-900">{filtered.length}</span> รายการ
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-semibold hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ← ก่อนหน้า
                                </button>
                                <span className="px-3 py-1.5 font-bold text-zinc-800">
                                    {page} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white font-semibold hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    ถัดไป →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
