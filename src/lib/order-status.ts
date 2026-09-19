import { Order, OrderStatus } from "@/types";

export const STEP_DURATION_SEC = 5 * 60; // 300 seconds (5 minutes)

export const STATUS_STEPS: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'SHIPPING',
    'DELIVERED'
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'รับคำสั่งซื้อ',
    CONFIRMED: 'ยืนยันคำสั่งซื้อ',
    PREPARING: 'กำลังเตรียมสินค้า',
    SHIPPING: 'กำลังจัดส่ง',
    DELIVERED: 'จัดส่งสำเร็จ',
    CANCELLED: 'ยกเลิกคำสั่งซื้อ',
};

export const STATUS_ICONS: Record<OrderStatus, string> = {
    PENDING: '📋',
    CONFIRMED: '✅',
    PREPARING: '📦',
    SHIPPING: '🚚',
    DELIVERED: '🎉',
    CANCELLED: '❌',
};

export interface OrderStatusCalculation {
    currentStatus: OrderStatus;
    nextStatus: OrderStatus | null;
    stepIndex: number;
    secondsRemaining: number;
    formattedRemaining: string; // e.g. "04:32"
    canCancel: boolean;
    isShipping: boolean;
    isDelivered: boolean;
    isCancelled: boolean;
}

/**
 * Check whether an order status allows cancellation per Requirement 10.
 * Rules:
 * PENDING    = Allowed (ยกเลิกได้)
 * CONFIRMED  = Allowed (ยกเลิกได้)
 * PREPARING  = Allowed (ยกเลิกได้)
 * SHIPPING   = Allowed (ยกเลิกได้จนกว่าสินค้าจะถึงมือผู้รับ)
 * DELIVERED  = Disallowed (ยกเลิกไม่ได้)
 * CANCELLED  = Disallowed (ยกเลิกไม่ได้)
 */
export function canCancelOrder(status: OrderStatus): boolean {
    return ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING'].includes(status);
}

/**
 * Returns adjusted createdAt timestamp so that an order manually advanced to targetStatus
 * aligns cleanly with the 5-minute auto-progression timer.
 */
export function getAdjustedCreatedAtForStatus(status: OrderStatus, nowMs: number = Date.now()): string {
    const idx = STATUS_STEPS.indexOf(status);
    if (idx <= 0) return new Date(nowMs).toISOString();
    return new Date(nowMs - (idx * STEP_DURATION_SEC * 1000)).toISOString();
}

/**
 * Calculates current order status based on elapsed time from order.createdAt.
 * 0 - 4:59 min   = PENDING
 * 5 - 9:59 min   = CONFIRMED
 * 10 - 14:59 min = PREPARING
 * 15 - 19:59 min = SHIPPING
 * 20 min and up  = DELIVERED
 */
export function calculateOrderStatus(order: Order, nowMs: number = Date.now()): OrderStatusCalculation {
    if (order.orderStatus === 'CANCELLED') {
        return {
            currentStatus: 'CANCELLED',
            nextStatus: null,
            stepIndex: -1,
            secondsRemaining: 0,
            formattedRemaining: '00:00',
            canCancel: false,
            isShipping: false,
            isDelivered: false,
            isCancelled: true,
        };
    }

    const createdMs = new Date(order.createdAt).getTime();
    const elapsedSec = Math.max(0, Math.floor((nowMs - createdMs) / 1000));

    // Calculate step index based on 5-minute intervals
    const stepIndex = Math.min(STATUS_STEPS.length - 1, Math.floor(elapsedSec / STEP_DURATION_SEC));
    const currentStatus = STATUS_STEPS[stepIndex];

    const isDelivered = currentStatus === 'DELIVERED';
    const isShipping = currentStatus === 'SHIPPING';
    const nextStatus = isDelivered ? null : STATUS_STEPS[stepIndex + 1];

    const nextStepTimeSec = (stepIndex + 1) * STEP_DURATION_SEC;
    const secondsRemaining = isDelivered ? 0 : Math.max(0, nextStepTimeSec - elapsedSec);

    const minutes = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    const formattedRemaining = `${minutes}:${seconds}`;

    const canCancel = canCancelOrder(currentStatus);

    return {
        currentStatus,
        nextStatus,
        stepIndex,
        secondsRemaining,
        formattedRemaining,
        canCancel,
        isShipping,
        isDelivered,
        isCancelled: false,
    };
}
