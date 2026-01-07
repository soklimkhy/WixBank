export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum OrderStatus {
    OPEN = 'OPEN',
    FILLED = 'FILLED',
    CANCELLED = 'CANCELLED',
}

export interface Order {
    id: number;
    user: number; // User ID
    order_type: OrderType;
    currency: string;        // e.g. "USD"
    target_currency: string; // e.g. "KHR"
    amount: string;          // Decimal string from backend
    rate: string;            // Decimal string
    filled_amount: string;
    status: OrderStatus;
    created_at: string;      // ISO Date
}

export interface Wallet {
    id: number;
    currency: string;
    balance: string;
}

export interface Transaction {
    id: number;
    buyer: number;
    seller: number;
    amount: string;
    rate: string;
    currency: string;
    target_currency: string;
    timestamp: string;
}
