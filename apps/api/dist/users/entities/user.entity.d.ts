import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities/order.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    nickname: string;
    avatar_url: string;
    role: UserRole;
    crypto_wallet_address: string;
    crypto_qr_code_url: string;
    created_at: Date;
    products: Product[];
    orders_bought: Order[];
    orders_sold: Order[];
}
