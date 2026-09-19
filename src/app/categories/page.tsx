"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mockCategories } from "@/data/categories";

function CategoriesRedirectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const id = searchParams.get('id') || searchParams.get('cat') || '';
        const found = mockCategories.find(c => c.id === id || c.name === id);
        if (found) {
            router.replace(`/products?category=${encodeURIComponent(found.name)}`);
        } else {
            router.replace('/products');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-400">
            <p>กำลังนำทางไปยังหมวดหมู่สินค้า...</p>
        </div>
    );
}

export default function CategoriesRedirectPage() {
    return (
        <Suspense fallback={null}>
            <CategoriesRedirectContent />
        </Suspense>
    );
}
