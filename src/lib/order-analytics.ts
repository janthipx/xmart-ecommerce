import { Order, Product } from "@/types";

export interface BestSellingItem {
    product: Product;
    totalSold: number;
    revenue: number;
    rank: number;
}

/**
 * คำนวณสรุปยอดขายสินค้าแต่ละตัวจาก Mock Orders
 * Single Source of Truth สำหรับหน้า /best-selling, หน้าแรก, ป้ายการ์ดสินค้า และหน้า Admin Analytics
 */
export function getProductSalesMap(orders: Order[]): Map<string, { totalSold: number; revenue: number }> {
    const map = new Map<string, { totalSold: number; revenue: number }>();

    // กรองคำสั่งซื้อที่ไม่ถูกยกเลิก (DELIVERED, SHIPPING, PREPARING, CONFIRMED, PENDING)
    const validOrders = orders.filter(o => o.orderStatus !== 'CANCELLED');

    for (const order of validOrders) {
        for (const item of order.items) {
            const current = map.get(item.productId) || { totalSold: 0, revenue: 0 };
            const qty = Number(item.quantity) || 1;
            const price = Number(item.priceAtTimeOfOrder) || 0;
            map.set(item.productId, {
                totalSold: current.totalSold + qty,
                revenue: current.revenue + (price * qty),
            });
        }
    }

    return map;
}

/**
 * ดึงรายการสินค้าขายดี เรียงลำดับจากจำนวนที่ขายได้มากที่สุด (totalSold มากไปน้อย)
 */
export function getBestSellingProducts(products: Product[], orders: Order[], limit?: number): BestSellingItem[] {
    const salesMap = getProductSalesMap(orders);

    const items: BestSellingItem[] = [];

    for (const product of products) {
        if (product.status === 'HIDDEN') continue;
        const stat = salesMap.get(product.id);
        if (stat && stat.totalSold > 0) {
            items.push({
                product,
                totalSold: stat.totalSold,
                revenue: stat.revenue,
                rank: 0, // จะคำนวณหลังจัดเรียง
            });
        }
    }

    // เรียงตามจำนวนชิ้นที่ขายได้มากสุดก่อน (ถ้าเท่ากันเรียงตามยอดขาย)
    items.sort((a, b) => b.totalSold !== a.totalSold ? b.totalSold - a.totalSold : b.revenue - a.revenue);

    // กำหนด rank 1, 2, 3...
    items.forEach((item, index) => {
        item.rank = index + 1;
    });

    return limit ? items.slice(0, limit) : items;
}

/**
 * ตรวจสอบว่าสินค้าเป็นสินค้าขายดีติดอันดับ Top N หรือไม่
 */
export function getProductRank(productId: string, bestSellingList: BestSellingItem[], topN = 10): { isBestSeller: boolean; rank?: number } {
    const found = bestSellingList.find(b => b.product.id === productId);
    if (found && found.rank <= topN) {
        return { isBestSeller: true, rank: found.rank };
    }
    return { isBestSeller: false };
}
