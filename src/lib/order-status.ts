import { Order, OrderStatus } from "@/types";

export const STEP_DURATION_SEC = 5; // 5 seconds per step for Demo / Test

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
    PENDING: '',
    CONFIRMED: '',
    PREPARING: '',
    SHIPPING: '',
    DELIVERED: '',
    CANCELLED: '',
};

export interface OrderStatusCalculation {
    currentStatus: OrderStatus;
    nextStatus: OrderStatus | null;
    stepIndex: number;
    secondsRemaining: number;
    formattedRemaining: string; // e.g. "00:05"
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
 * aligns cleanly with the auto-progression timer.
 */
export function getAdjustedCreatedAtForStatus(status: OrderStatus, nowMs: number = Date.now()): string {
    const idx = STATUS_STEPS.indexOf(status);
    if (idx <= 0) return new Date(nowMs).toISOString();
    return new Date(nowMs - (idx * STEP_DURATION_SEC * 1000)).toISOString();
}

/**
 * Calculates current order status based on elapsed time.
 * Demo timing (5s per step):
 *
 * PROMPTPAY (PAID):
 * Starts at CONFIRMED upon payment confirmation
 * 0 - 4.99s   = CONFIRMED
 * 5 - 9.99s   = PREPARING
 * 10 - 14.99s = SHIPPING
 * 15s and up  = DELIVERED
 *
 * CASH:
 * 0 - 4.99s   = PENDING
 * 5 - 9.99s   = CONFIRMED
 * 10 - 14.99s = PREPARING
 * 15 - 19.99s = SHIPPING
 * 20s and up  = DELIVERED
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

    // PAYMENT GATE (Requirement 6 & 8):
    // For PromptPay orders, if paymentStatus is PENDING, order CANNOT advance to PREPARING, SHIPPING, or DELIVERED.
    // It remains strictly at PENDING (or current status) until paid or cancelled.
    if (order.paymentMethod === 'PROMPTPAY' && order.paymentStatus === 'PENDING') {
        return {
            currentStatus: 'PENDING',
            nextStatus: null,
            stepIndex: 0,
            secondsRemaining: 0,
            formattedRemaining: '00:00',
            canCancel: true,
            isShipping: false,
            isDelivered: false,
            isCancelled: false,
        };
    }

    const storedStepIndex = STATUS_STEPS.indexOf(order.orderStatus);
    let stepIndex = storedStepIndex >= 0 ? storedStepIndex : 0;
    let secondsRemaining = 0;

    if (order.paymentMethod === 'PROMPTPAY' && order.paymentStatus === 'PAID') {
        // Progression time starts from payment confirmation
        const paidTimeMs = order.paidAt
            ? new Date(order.paidAt).getTime()
            : (order.statusUpdatedAt ? new Date(order.statusUpdatedAt).getTime() : new Date(order.createdAt).getTime());

        const elapsedSec = Math.max(0, Math.floor((nowMs - paidTimeMs) / 1000));
        const stepsAfterConfirmed = Math.floor(elapsedSec / STEP_DURATION_SEC);
        const calculatedIndex = 1 + stepsAfterConfirmed; // Index 1 is CONFIRMED

        stepIndex = Math.min(
            STATUS_STEPS.length - 1,
            Math.max(storedStepIndex >= 0 ? storedStepIndex : 1, calculatedIndex)
        );

        if (stepIndex < STATUS_STEPS.length - 1) {
            const nextStepBoundarySec = stepIndex * STEP_DURATION_SEC;
            secondsRemaining = Math.max(0, nextStepBoundarySec - elapsedSec);
        } else {
            secondsRemaining = 0;
        }
    } else {
        // CASH orders or default flow
        const baseTimeMs = new Date(order.createdAt).getTime();
        const elapsedSec = Math.max(0, Math.floor((nowMs - baseTimeMs) / 1000));
        const timeStepIndex = Math.floor(elapsedSec / STEP_DURATION_SEC);

        stepIndex = Math.min(
            STATUS_STEPS.length - 1,
            Math.max(storedStepIndex >= 0 ? storedStepIndex : 0, timeStepIndex)
        );

        if (stepIndex < STATUS_STEPS.length - 1) {
            const nextStepBoundarySec = (stepIndex + 1) * STEP_DURATION_SEC;
            secondsRemaining = Math.max(0, nextStepBoundarySec - elapsedSec);
        } else {
            secondsRemaining = 0;
        }
    }

    const currentStatus = STATUS_STEPS[stepIndex];
    const isDelivered = currentStatus === 'DELIVERED';
    const isShipping = currentStatus === 'SHIPPING';
    const nextStatus = isDelivered ? null : STATUS_STEPS[stepIndex + 1];

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
