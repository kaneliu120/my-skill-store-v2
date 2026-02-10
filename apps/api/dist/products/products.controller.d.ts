import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(req: Request & {
        user: any;
    }, createProductDto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(status?: string, search?: string, category?: string): Promise<import("./entities/product.entity").Product[]>;
    findMyProducts(req: Request & {
        user: any;
    }): Promise<import("./entities/product.entity").Product[]>;
    findPendingReview(): Promise<import("./entities/product.entity").Product[]>;
    approve(id: string): Promise<import("./entities/product.entity").Product>;
    reject(id: string, reason: string): Promise<import("./entities/product.entity").Product>;
    findOne(id: string): Promise<import("./entities/product.entity").Product>;
    update(req: Request & {
        user: any;
    }, id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(req: Request & {
        user: any;
    }, id: string): Promise<{
        deleted: boolean;
    }>;
}
