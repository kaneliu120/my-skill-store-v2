import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReportPaymentDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: Request & {
        user: any;
    }, dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(): Promise<import("./entities/order.entity").Order[]>;
    findMyPurchases(req: Request & {
        user: any;
    }): Promise<import("./entities/order.entity").Order[]>;
    findMySales(req: Request & {
        user: any;
    }): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string): Promise<import("./entities/order.entity").Order>;
    reportPayment(req: Request & {
        user: any;
    }, id: string, dto: ReportPaymentDto): Promise<import("./entities/order.entity").Order>;
    confirmPayment(req: Request & {
        user: any;
    }, id: string): Promise<import("./entities/order.entity").Order>;
    completeOrder(req: Request & {
        user: any;
    }, id: string): Promise<import("./entities/order.entity").Order>;
    cancelOrder(req: Request & {
        user: any;
    }, id: string): Promise<import("./entities/order.entity").Order>;
    getDelivery(req: Request & {
        user: any;
    }, id: string): Promise<{
        delivery_type: import("../products/entities/product.entity").DeliveryType;
        delivery_content: string;
    }>;
}
