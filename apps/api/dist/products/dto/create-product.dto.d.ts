import { DeliveryType } from '../entities/product.entity';
export declare class CreateProductDto {
    title: string;
    description?: string;
    price_usd: number;
    delivery_type: DeliveryType;
    delivery_content?: string;
    preview_image_url?: string;
    category?: string;
    tags?: string;
}
