"use client";

import { Category } from "@/types";
import { useTranslation, getCategoryName } from "@/lib/i18n";
import Link from "next/link";

export function CategoryNav({ categories }: { categories: Category[] }) {
    const { language } = useTranslation();
    const getIcon = (cat: Category) => cat.icon ?? "📦";

    return (
        <section className="py-2 max-w-7xl mx-auto w-full">
            <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory">
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="flex-shrink-0 snap-start bg-white border border-zinc-200/90 hover:border-blue-300 hover:bg-blue-50/50 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center w-[98px] sm:w-[120px] transition-all shadow-xs hover:shadow-md group"
                    >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] text-2xl sm:text-3xl group-hover:scale-108 transition-transform">
                            {getIcon(cat)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-zinc-800 truncate max-w-[88px] sm:max-w-[108px] text-center leading-snug group-hover:text-[#0060df]">
                            {getCategoryName(cat, language)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
