"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { translations, Language } from "./translations";
import { Product, Category, OrderStatus, PaymentStatus } from "@/types";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = "xmart_language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "th";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "th" || saved === "en") return saved;
  } catch {
    // fallback
  }
  return "th";
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: typeof window !== "undefined" ? getInitialLanguage() : "th",
  setLanguage: (lang: Language) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch {
      // ignore
    }
    set({ language: lang });
  },
  t: (key: string, params?: Record<string, string | number>) => {
    const currentLang = get().language || "th";
    let text = translations[currentLang]?.[key] || translations["th"]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  }
}));

// Helper Hook for easy consumption in client components
export function useTranslation() {
  const language = useLanguageStore(s => s.language);
  const setLanguage = useLanguageStore(s => s.setLanguage);
  const t = useLanguageStore(s => s.t);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if ((saved === "th" || saved === "en") && saved !== language) {
        useLanguageStore.setState({ language: saved });
      }
    } catch {
      // ignore
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "th" || e.newValue === "en")) {
        useLanguageStore.setState({ language: e.newValue });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [language]);

  return {
    language,
    setLanguage,
    t
  };
}

/**
 * Get localized Product Name
 */
export function getProductName(product: Product, lang: Language = "th"): string {
  if (lang === "en" && product.nameEn && product.nameEn.trim() !== "") {
    return product.nameEn;
  }
  return product.nameTh || product.name;
}

/**
 * Get localized Order Item Name
 */
export function getOrderItemName(item: { productName: string; productNameTh?: string; productNameEn?: string }, lang: Language = "th"): string {
  if (lang === "en" && item.productNameEn && item.productNameEn.trim() !== "") {
    return item.productNameEn;
  }
  return item.productNameTh || item.productName;
}

/**
 * Get localized Product Description
 */
export function getProductDescription(product: Product, lang: Language = "th"): string {
  if (lang === "en" && product.descriptionEn && product.descriptionEn.trim() !== "") {
    return product.descriptionEn;
  }
  return product.descriptionTh || product.description;
}

/**
 * Category Name Mapping Dictionary (covers all categories cat1 - cat17)
 */
const CATEGORY_NAMES_EN: Record<string, string> = {
  cat1: "Food & Groceries",
  cat2: "Beverages",
  cat3: "Snacks & Sweets",
  cat4: "Personal Care",
  cat5: "Household Goods",
  cat6: "Electronics & IT",
  cat7: "Fashion & Apparel",
  cat8: "Health & Beauty",
  cat9: "Mother & Baby",
  cat10: "Stationery & Office",
  cat11: "Automotive & Vehicles",
  cat12: "Pets & Supplies",
  cat13: "Sports & Outdoors",
  cat14: "Home & Garden",
  cat15: "Real Estate & Properties",
  cat16: "Toys & Games",
  cat17: "Fresh & Frozen Foods",
  "อาหาร": "Food & Groceries",
  "เครื่องดื่ม": "Beverages",
  "ขนม": "Snacks & Sweets",
  "ของใช้ส่วนตัว": "Personal Care",
  "ของใช้ในบ้าน": "Household Goods",
  "เครื่องใช้ไฟฟ้า": "Electronics & IT",
  "แฟชั่น": "Fashion & Apparel",
  "สุขภาพและความงาม": "Health & Beauty",
  "แม่และเด็ก": "Mother & Baby",
  "เครื่องเขียนและสำนักงาน": "Stationery & Office",
  "ยานยนต์": "Automotive & Vehicles",
  "สัตว์เลี้ยง": "Pets & Supplies",
  "กีฬาและกิจกรรมกลางแจ้ง": "Sports & Outdoors",
  "บ้านและสวน": "Home & Garden",
  "อสังหาริมทรัพย์": "Real Estate & Properties",
  "ของเล่น": "Toys & Games",
  "ของสดและอาหารแช่แข็ง": "Fresh & Frozen Foods"
};

/**
 * Get localized Category Name
 */
export function getCategoryName(category: Category | string, lang: Language = "th"): string {
  if (typeof category === "object" && category !== null) {
    if (lang === "en") {
      if (category.nameEn) return category.nameEn;
      if (CATEGORY_NAMES_EN[category.id]) return CATEGORY_NAMES_EN[category.id];
      if (CATEGORY_NAMES_EN[category.name]) return CATEGORY_NAMES_EN[category.name];
    }
    return category.nameTh || category.name;
  }

  if (typeof category === "string") {
    if (lang === "en" && CATEGORY_NAMES_EN[category]) {
      return CATEGORY_NAMES_EN[category];
    }
    return category;
  }

  return "";
}

/**
 * Get Order Status Label
 */
export function getOrderStatusLabel(status: OrderStatus, lang: Language = "th"): string {
  const key = `status.${status}`;
  return translations[lang]?.[key] || translations["th"]?.[key] || status;
}

/**
 * Get Payment Status Label
 */
export function getPaymentStatusLabel(status: PaymentStatus, lang: Language = "th"): string {
  const key = `payment.${status}`;
  return translations[lang]?.[key] || translations["th"]?.[key] || status;
}
