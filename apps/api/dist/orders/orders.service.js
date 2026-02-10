"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    productsRepository;
    constructor(ordersRepository, productsRepository) {
        this.ordersRepository = ordersRepository;
        this.productsRepository = productsRepository;
    }
    async create(buyerId, productId) {
        const product = await this.productsRepository.findOne({
            where: { id: productId },
            relations: ['seller'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.seller_id === buyerId) {
            throw new common_1.BadRequestException('Cannot buy your own product');
        }
        const order = this.ordersRepository.create({
            buyer_id: buyerId,
            seller_id: product.seller_id,
            product_id: productId,
            amount_usd: product.price_usd,
            status: order_entity_1.OrderStatus.CREATED,
        });
        return this.ordersRepository.save(order);
    }
    findAll() {
        return this.ordersRepository.find({
            relations: ['buyer', 'seller', 'product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['buyer', 'seller', 'product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByBuyer(buyerId) {
        return this.ordersRepository.find({
            where: { buyer_id: buyerId },
            relations: ['product', 'seller'],
            order: { createdAt: 'DESC' },
        });
    }
    async findBySeller(sellerId) {
        return this.ordersRepository.find({
            where: { seller_id: sellerId },
            relations: ['product', 'buyer'],
            order: { createdAt: 'DESC' },
        });
    }
    async reportPayment(orderId, buyerId, transactionHash) {
        const order = await this.findOne(orderId);
        if (order.buyer_id !== buyerId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (order.status !== order_entity_1.OrderStatus.CREATED) {
            throw new common_1.BadRequestException('Order is not in CREATED status');
        }
        order.status = order_entity_1.OrderStatus.PAID_REPORTED;
        if (transactionHash) {
            order.transaction_hash = transactionHash;
        }
        return this.ordersRepository.save(order);
    }
    async confirmPayment(orderId, sellerId) {
        const order = await this.findOne(orderId);
        if (order.seller_id !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (order.status !== order_entity_1.OrderStatus.PAID_REPORTED) {
            throw new common_1.BadRequestException('Order payment has not been reported');
        }
        order.status = order_entity_1.OrderStatus.CONFIRMED;
        const product = await this.productsRepository.findOne({
            where: { id: order.product_id },
        });
        if (product && product.delivery_type === product_entity_1.DeliveryType.AUTO) {
            order.status = order_entity_1.OrderStatus.COMPLETED;
        }
        return this.ordersRepository.save(order);
    }
    async completeOrder(orderId, sellerId) {
        const order = await this.findOne(orderId);
        if (order.seller_id !== sellerId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (order.status !== order_entity_1.OrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Order is not in CONFIRMED status');
        }
        order.status = order_entity_1.OrderStatus.COMPLETED;
        return this.ordersRepository.save(order);
    }
    async cancelOrder(orderId, userId) {
        const order = await this.findOne(orderId);
        if (order.buyer_id !== userId && order.seller_id !== userId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (order.status === order_entity_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel a completed order');
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        return this.ordersRepository.save(order);
    }
    async getDeliveryContent(orderId, buyerId) {
        const order = await this.findOne(orderId);
        if (order.buyer_id !== buyerId) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        if (order.status !== order_entity_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('Order is not completed');
        }
        const product = await this.productsRepository.findOne({
            where: { id: order.product_id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            delivery_type: product.delivery_type,
            delivery_content: product.delivery_content,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map