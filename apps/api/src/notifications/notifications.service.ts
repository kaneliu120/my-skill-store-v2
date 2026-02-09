import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
} from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  /**
   * Create a notification for a user.
   */
  async create(data: {
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }): Promise<Notification> {
    const notification = this.notificationsRepository.create(data);
    return this.notificationsRepository.save(notification);
  }

  /**
   * Get all notifications for a user, newest first.
   */
  async findByUser(
    userId: number,
    options: { unreadOnly?: boolean; page?: number; limit?: number } = {},
  ) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100);

    const where: any = { user_id: userId };
    if (options.unreadOnly) {
      where.is_read = false;
    }

    const [items, total] = await this.notificationsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get unread count for a user.
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationsRepository.count({
      where: { user_id: userId, is_read: false },
    });
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.is_read = true;
    return this.notificationsRepository.save(notification);
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: number) {
    await this.notificationsRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true },
    );
    return { success: true };
  }

  // --- Helper methods for common notification scenarios ---

  async notifyOrderCreated(sellerId: number, orderId: number, productTitle: string) {
    return this.create({
      user_id: sellerId,
      type: NotificationType.ORDER_CREATED,
      title: 'New Order Received',
      message: `You have a new order (#${orderId}) for "${productTitle}".`,
      metadata: { order_id: orderId },
    });
  }

  async notifyPaymentReported(sellerId: number, orderId: number, verified: boolean) {
    return this.create({
      user_id: sellerId,
      type: verified
        ? NotificationType.PAYMENT_VERIFIED
        : NotificationType.PAYMENT_REPORTED,
      title: verified ? 'Payment Verified' : 'Payment Reported',
      message: verified
        ? `Payment for order #${orderId} has been verified on blockchain.`
        : `Buyer has reported payment for order #${orderId}. Please verify and confirm.`,
      metadata: { order_id: orderId, verified },
    });
  }

  async notifyPaymentConfirmed(buyerId: number, orderId: number) {
    return this.create({
      user_id: buyerId,
      type: NotificationType.PAYMENT_CONFIRMED,
      title: 'Payment Confirmed',
      message: `Your payment for order #${orderId} has been confirmed by the seller.`,
      metadata: { order_id: orderId },
    });
  }

  async notifyOrderCompleted(buyerId: number, orderId: number) {
    return this.create({
      user_id: buyerId,
      type: NotificationType.ORDER_COMPLETED,
      title: 'Order Completed',
      message: `Order #${orderId} is complete. You can now access your delivery content.`,
      metadata: { order_id: orderId },
    });
  }

  async notifyOrderCancelled(userId: number, orderId: number) {
    return this.create({
      user_id: userId,
      type: NotificationType.ORDER_CANCELLED,
      title: 'Order Cancelled',
      message: `Order #${orderId} has been cancelled.`,
      metadata: { order_id: orderId },
    });
  }

  async notifyProductApproved(sellerId: number, productId: number, productTitle: string) {
    return this.create({
      user_id: sellerId,
      type: NotificationType.PRODUCT_APPROVED,
      title: 'Product Approved',
      message: `Your product "${productTitle}" has been approved and is now live.`,
      metadata: { product_id: productId },
    });
  }

  async notifyProductRejected(
    sellerId: number,
    productId: number,
    productTitle: string,
    reason: string,
  ) {
    return this.create({
      user_id: sellerId,
      type: NotificationType.PRODUCT_REJECTED,
      title: 'Product Rejected',
      message: `Your product "${productTitle}" was rejected. Reason: ${reason}`,
      metadata: { product_id: productId, reason },
    });
  }

  async notifyNewReview(
    sellerId: number,
    orderId: number,
    rating: number,
    productTitle: string,
  ) {
    return this.create({
      user_id: sellerId,
      type: NotificationType.NEW_REVIEW,
      title: 'New Review',
      message: `Your product "${productTitle}" received a ${rating}-star review.`,
      metadata: { order_id: orderId, rating },
    });
  }

  async notifyRefundRequested(sellerId: number, orderId: number) {
    return this.create({
      user_id: sellerId,
      type: NotificationType.REFUND_REQUESTED,
      title: 'Refund Requested',
      message: `A refund has been requested for order #${orderId}.`,
      metadata: { order_id: orderId },
    });
  }

  async notifyRefundDecision(
    buyerId: number,
    orderId: number,
    approved: boolean,
    reason?: string,
  ) {
    return this.create({
      user_id: buyerId,
      type: approved
        ? NotificationType.REFUND_APPROVED
        : NotificationType.REFUND_REJECTED,
      title: approved ? 'Refund Approved' : 'Refund Rejected',
      message: approved
        ? `Your refund request for order #${orderId} has been approved.`
        : `Your refund request for order #${orderId} was rejected.${reason ? ` Reason: ${reason}` : ''}`,
      metadata: { order_id: orderId, approved, reason },
    });
  }
}
