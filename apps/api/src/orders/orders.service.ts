import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Product, DeliveryType } from '../products/entities/product.entity';
import { CryptoVerificationService } from '../payments/crypto-verification.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private cryptoVerification: CryptoVerificationService,
  ) {}

  async create(buyerId: number, productId: number) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['seller'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.seller_id === buyerId) {
      throw new BadRequestException('Cannot buy your own product');
    }

    const order = this.ordersRepository.create({
      buyer_id: buyerId,
      seller_id: product.seller_id,
      product_id: productId,
      amount_usd: product.price_usd,
      status: OrderStatus.CREATED,
    });
    return this.ordersRepository.save(order);
  }

  findAll() {
    return this.ordersRepository.find({
      relations: ['buyer', 'seller', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['buyer', 'seller', 'product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByBuyer(buyerId: number) {
    return this.ordersRepository.find({
      where: { buyer_id: buyerId },
      relations: ['product', 'seller'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySeller(sellerId: number) {
    return this.ordersRepository.find({
      where: { seller_id: sellerId },
      relations: ['product', 'buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async reportPayment(
    orderId: number,
    buyerId: number,
    transactionHash?: string,
    paymentNetwork?: string,
  ) {
    const order = await this.findOne(orderId);
    if (order.buyer_id !== buyerId) {
      throw new ForbiddenException('Not authorized');
    }
    if (order.status !== OrderStatus.CREATED) {
      throw new BadRequestException('Order is not in CREATED status');
    }

    order.status = OrderStatus.PAID_REPORTED;
    if (transactionHash) {
      order.transaction_hash = transactionHash;
    }
    if (paymentNetwork) {
      order.payment_network = paymentNetwork;
    }

    // Auto-verify on blockchain if tx hash and network are provided
    if (transactionHash && paymentNetwork) {
      const verification = await this.cryptoVerification.verifyTransaction(
        transactionHash,
        paymentNetwork,
      );
      order.payment_verified = verification.verified;
      order.verification_details = verification as any;

      if (verification.verified) {
        order.status = OrderStatus.PAYMENT_VERIFIED;
      }
    }

    return this.ordersRepository.save(order);
  }

  /**
   * Buyer can manually retry verification (e.g. after blockchain confirms).
   */
  async verifyPayment(orderId: number, buyerId: number) {
    const order = await this.findOne(orderId);
    if (order.buyer_id !== buyerId) {
      throw new ForbiddenException('Not authorized');
    }
    if (
      order.status !== OrderStatus.PAID_REPORTED &&
      order.status !== OrderStatus.PAYMENT_VERIFIED
    ) {
      throw new BadRequestException(
        'Order must be in PAID_REPORTED or PAYMENT_VERIFIED status',
      );
    }
    if (!order.transaction_hash || !order.payment_network) {
      throw new BadRequestException(
        'Transaction hash and payment network are required for verification',
      );
    }

    const verification = await this.cryptoVerification.verifyTransaction(
      order.transaction_hash,
      order.payment_network,
    );

    order.payment_verified = verification.verified;
    order.verification_details = verification as any;

    if (verification.verified) {
      order.status = OrderStatus.PAYMENT_VERIFIED;
    }

    return this.ordersRepository.save(order);
  }

  async confirmPayment(orderId: number, sellerId: number) {
    const order = await this.findOne(orderId);
    if (order.seller_id !== sellerId) {
      throw new ForbiddenException('Not authorized');
    }
    if (
      order.status !== OrderStatus.PAID_REPORTED &&
      order.status !== OrderStatus.PAYMENT_VERIFIED
    ) {
      throw new BadRequestException('Order payment has not been reported');
    }

    order.status = OrderStatus.CONFIRMED;

    // For auto-hosted products, immediately mark as completed
    const product = await this.productsRepository.findOne({
      where: { id: order.product_id },
    });
    if (product && product.delivery_type === DeliveryType.AUTO) {
      order.status = OrderStatus.COMPLETED;
    }

    return this.ordersRepository.save(order);
  }

  async completeOrder(orderId: number, sellerId: number) {
    const order = await this.findOne(orderId);
    if (order.seller_id !== sellerId) {
      throw new ForbiddenException('Not authorized');
    }
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order is not in CONFIRMED status');
    }
    order.status = OrderStatus.COMPLETED;
    return this.ordersRepository.save(order);
  }

  async cancelOrder(orderId: number, userId: number) {
    const order = await this.findOne(orderId);
    if (order.buyer_id !== userId && order.seller_id !== userId) {
      throw new ForbiddenException('Not authorized');
    }
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.REFUNDED
    ) {
      throw new BadRequestException(
        'Cannot cancel a completed or refunded order',
      );
    }
    order.status = OrderStatus.CANCELLED;
    return this.ordersRepository.save(order);
  }

  async getDeliveryContent(orderId: number, buyerId: number) {
    const order = await this.findOne(orderId);
    if (order.buyer_id !== buyerId) {
      throw new ForbiddenException('Not authorized');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Order is not completed');
    }

    const product = await this.productsRepository.findOne({
      where: { id: order.product_id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      delivery_type: product.delivery_type,
      delivery_content: product.delivery_content,
    };
  }
}
