import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product, DeliveryType } from '../products/entities/product.entity';
export declare class OrdersService {
    private ordersRepository;
    private productsRepository;
    constructor(ordersRepository: Repository<Order>, productsRepository: Repository<Product>);
    create(buyerId: number, productId: number): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    findByBuyer(buyerId: number): Promise<Order[]>;
    findBySeller(sellerId: number): Promise<Order[]>;
    reportPayment(orderId: number, buyerId: number, transactionHash?: string): Promise<Order>;
    confirmPayment(orderId: number, sellerId: number): Promise<Order>;
    completeOrder(orderId: number, sellerId: number): Promise<Order>;
    cancelOrder(orderId: number, userId: number): Promise<Order>;
    getDeliveryContent(orderId: number, buyerId: number): Promise<{
        delivery_type: DeliveryType;
        delivery_content: string;
    }>;
}
