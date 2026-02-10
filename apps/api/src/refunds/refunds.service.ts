import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund, RefundStatus } from './entities/refund.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(Refund)
    private refundsRepository: Repository<Refund>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Buyer requests a refund for a completed/confirmed order.
   */
  async requestRefund(requesterId: number, orderId: number, reason: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.buyer_id !== requesterId) {
      throw new ForbiddenException('Only the buyer can request a refund');
    }

    const refundableStatuses = [
      OrderStatus.CONFIRMED,
      OrderStatus.COMPLETED,
      OrderStatus.PAYMENT_VERIFIED,
    ];
    if (!refundableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Cannot request refund for order in "${order.status}" status`,
      );
    }

    // Check for existing pending refund
    const existing = await this.refundsRepository.findOne({
      where: { order_id: orderId, status: RefundStatus.PENDING },
    });
    if (existing) {
      throw new BadRequestException(
        'A refund request is already pending for this order',
      );
    }

    const refund = this.refundsRepository.create({
      order_id: orderId,
      requester_id: requesterId,
      amount_usd: order.amount_usd,
      reason,
      status: RefundStatus.PENDING,
    });

    // Update order status
    order.status = OrderStatus.REFUND_REQUESTED;
    await this.ordersRepository.save(order);

    const saved = await this.refundsRepository.save(refund);

    // Notify seller
    await this.notificationsService.notifyRefundRequested(
      order.seller_id,
      orderId,
    );

    return saved;
  }

  /**
   * Admin or seller processes the refund request.
   */
  async processRefund(
    refundId: number,
    processedBy: number,
    approved: boolean,
    adminNote?: string,
    refundTxHash?: string,
  ) {
    const refund = await this.refundsRepository.findOne({
      where: { id: refundId },
      relations: ['order'],
    });
    if (!refund) {
      throw new NotFoundException('Refund request not found');
    }
    if (refund.status !== RefundStatus.PENDING) {
      throw new BadRequestException('Refund has already been processed');
    }

    refund.processed_by = processedBy;
    if (adminNote) {
      refund.admin_note = adminNote;
    }

    if (approved) {
      refund.status = RefundStatus.APPROVED;
      if (refundTxHash) {
        refund.refund_transaction_hash = refundTxHash;
        refund.status = RefundStatus.COMPLETED;
      }

      // Update order status to refunded
      const order = await this.ordersRepository.findOneBy({
        id: refund.order_id,
      });
      if (order) {
        order.status = OrderStatus.REFUNDED;
        await this.ordersRepository.save(order);
      }
    } else {
      refund.status = RefundStatus.REJECTED;

      // Restore original order status (back to COMPLETED)
      const order = await this.ordersRepository.findOneBy({
        id: refund.order_id,
      });
      if (order && order.status === OrderStatus.REFUND_REQUESTED) {
        order.status = OrderStatus.COMPLETED;
        await this.ordersRepository.save(order);
      }
    }

    const saved = await this.refundsRepository.save(refund);

    // Notify buyer of the decision
    await this.notificationsService.notifyRefundDecision(
      refund.requester_id,
      refund.order_id,
      approved,
      adminNote,
    );

    return saved;
  }

  /**
   * Mark an approved refund as completed (after actual payment is made).
   */
  async completeRefund(refundId: number, adminId: number, txHash: string) {
    const refund = await this.refundsRepository.findOneBy({ id: refundId });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }
    if (refund.status !== RefundStatus.APPROVED) {
      throw new BadRequestException('Refund must be in APPROVED status');
    }

    refund.status = RefundStatus.COMPLETED;
    refund.refund_transaction_hash = txHash;
    refund.processed_by = adminId;
    return this.refundsRepository.save(refund);
  }

  /**
   * Get all refund requests (admin).
   */
  findAll(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return this.refundsRepository.find({
      where,
      relations: ['order', 'requester', 'processor'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get refund by ID.
   */
  async findOne(id: number) {
    const refund = await this.refundsRepository.findOne({
      where: { id },
      relations: ['order', 'requester', 'processor'],
    });
    if (!refund) {
      throw new NotFoundException('Refund not found');
    }
    return refund;
  }

  /**
   * Get refunds for a specific buyer.
   */
  findByUser(userId: number) {
    return this.refundsRepository.find({
      where: { requester_id: userId },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }
}
