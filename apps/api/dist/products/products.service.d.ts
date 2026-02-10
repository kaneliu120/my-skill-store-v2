import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    create(data: Partial<Product>): Promise<Product>;
    findAll(query?: {
        search?: string;
        category?: string;
    }): Promise<Product[]>;
    findApproved(query?: {
        search?: string;
        category?: string;
    }): Promise<Product[]>;
    findPendingReview(): Promise<Product[]>;
    findBySeller(sellerId: number): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    updateBySeller(id: number, sellerId: number, data: Partial<Product>): Promise<Product>;
    removeBySeller(id: number, sellerId: number): Promise<{
        deleted: boolean;
    }>;
    approve(id: number): Promise<Product>;
    reject(id: number, reason: string): Promise<Product>;
}
