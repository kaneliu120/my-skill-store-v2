import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
export declare enum OrderStatus {
    CREATED = "created",
    PAID_REPORTED = "paid_reported",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: number;
    buyer_id: number;
    buyer: User;
    seller_id: number;
    seller: User;
    product_id: number;
    product: Product;
    amount_usd: number;
    status: OrderStatus;
    transaction_hash: string;
    createdAt: Date;
}
