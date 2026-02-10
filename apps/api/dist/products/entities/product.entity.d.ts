import { User } from '../../users/entities/user.entity';
export declare enum ProductStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    REJECTED = "rejected",
    OFF_SHELF = "off_shelf"
}
export declare enum DeliveryType {
    AUTO = "auto_hosted",
    MANUAL = "manual"
}
export declare class Product {
    id: number;
    seller_id: number;
    seller: User;
    title: string;
    description: string;
    category: string;
    tags: string;
    preview_image_url: string;
    price_usd: number;
    delivery_type: DeliveryType;
    delivery_content: string;
    status: ProductStatus;
    review_reason: string;
    createdAt: Date;
}
