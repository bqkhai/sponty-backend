export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    EXPIRED = 'expired'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

export enum PaymentMethod {
    MOMO = 'momo',
    VNPAY = 'vnpay',
    APPLE_PAY = 'apple_pay',
    OFFLINE = 'offline'
}

export enum LedgerType {
    PAYMENT = 'payment',
    FEE = 'fee',
    PAYOUT = 'payout',
    REFUND = 'refund'
}

export enum PayoutStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid'
}

export enum EventApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}
