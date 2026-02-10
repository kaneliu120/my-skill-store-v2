import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create a review for a completed order (buyer only, one per order).
   */
  async create(reviewerId: number, orderId: number, rating: number, comment?: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.buyer_id !== reviewerId) {
      throw new ForbiddenException('Only the buyer can review this order');
    }
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed orders');
    }

    // Check for existing review
    const existing = await this.reviewsRepository.findOneBy({ order_id: orderId });
    if (existing) {
      throw new BadRequestException('You have already reviewed this order');
    }

    const review = this.reviewsRepository.create({
      order_id: orderId,
      product_id: order.product_id,
      reviewer_id: reviewerId,
      seller_id: order.seller_id,
      rating,
      comment,
    });

    const saved = await this.reviewsRepository.save(review);

    // Notify seller
    const productTitle = order.product?.title || `Product #${order.product_id}`;
    await this.notificationsService.notifyNewReview(
      order.seller_id,
      orderId,
      rating,
      productTitle,
    );

    return saved;
  }

  /**
   * Get all reviews for a product.
   */
  async findByProduct(productId: number, page = 1, limit = 20) {
    limit = Math.min(limit, 100);

    const [items, total] = await this.reviewsRepository.findAndCount({
      where: { product_id: productId },
      relations: ['reviewer'],
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
   * Get average rating and review count for a product.
   */
  async getProductRating(productId: number) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.product_id = :productId', { productId })
      .getRawOne();

    return {
      averageRating: result.averageRating
        ? parseFloat(parseFloat(result.averageRating).toFixed(1))
        : 0,
      reviewCount: parseInt(result.reviewCount, 10),
    };
  }

  /**
   * Get all reviews for a seller.
   */
  async findBySeller(sellerId: number, page = 1, limit = 20) {
    limit = Math.min(limit, 100);

    const [items, total] = await this.reviewsRepository.findAndCount({
      where: { seller_id: sellerId },
      relations: ['reviewer', 'product'],
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
   * Get seller's average rating.
   */
  async getSellerRating(sellerId: number) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.seller_id = :sellerId', { sellerId })
      .getRawOne();

    return {
      averageRating: result.averageRating
        ? parseFloat(parseFloat(result.averageRating).toFixed(1))
        : 0,
      reviewCount: parseInt(result.reviewCount, 10),
    };
  }
}
