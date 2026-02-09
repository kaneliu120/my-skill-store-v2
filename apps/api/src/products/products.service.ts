import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';

export interface SearchQuery {
  search?: string;
  category?: string;
  tags?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryType?: string;
  sellerId?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(data: Partial<Product>) {
    const product = this.productsRepository.create(data);
    return this.productsRepository.save(product);
  }

  /**
   * Advanced search with multi-condition filtering, sorting, and pagination.
   */
  async search(query: SearchQuery = {}, statusFilter?: ProductStatus) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller');

    // Status filter
    if (statusFilter) {
      qb.andWhere('product.status = :status', { status: statusFilter });
    }

    // Text search across title, description, and tags
    if (query.search) {
      qb.andWhere(
        '(product.title ILIKE :search OR product.description ILIKE :search OR product.tags ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Category filter
    if (query.category) {
      qb.andWhere('product.category = :category', {
        category: query.category,
      });
    }

    // Tags filter (comma-separated, matches any)
    if (query.tags) {
      const tagList = query.tags.split(',').map((t) => t.trim());
      const tagConditions = tagList.map((_, i) => `product.tags ILIKE :tag${i}`);
      const tagParams: Record<string, string> = {};
      tagList.forEach((tag, i) => {
        tagParams[`tag${i}`] = `%${tag}%`;
      });
      qb.andWhere(`(${tagConditions.join(' OR ')})`, tagParams);
    }

    // Price range filter
    if (query.minPrice !== undefined) {
      qb.andWhere('product.price_usd >= :minPrice', {
        minPrice: query.minPrice,
      });
    }
    if (query.maxPrice !== undefined) {
      qb.andWhere('product.price_usd <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    // Delivery type filter
    if (query.deliveryType) {
      qb.andWhere('product.delivery_type = :deliveryType', {
        deliveryType: query.deliveryType,
      });
    }

    // Seller filter
    if (query.sellerId) {
      qb.andWhere('product.seller_id = :sellerId', {
        sellerId: query.sellerId,
      });
    }

    // Sorting
    const sortableFields: Record<string, string> = {
      price: 'product.price_usd',
      created: 'product.createdAt',
      title: 'product.title',
    };
    const sortField = sortableFields[query.sortBy || 'created'] || 'product.createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(sortField, sortOrder);

    // Pagination
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findAll(query: SearchQuery = {}) {
    return this.search(query);
  }

  findApproved(query: SearchQuery = {}) {
    return this.search(query, ProductStatus.APPROVED);
  }

  findPendingReview() {
    return this.productsRepository.find({
      where: { status: ProductStatus.PENDING_REVIEW },
      relations: ['seller'],
      order: { createdAt: 'ASC' },
    });
  }

  findBySeller(sellerId: number) {
    return this.productsRepository.find({
      where: { seller_id: sellerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateBySeller(id: number, sellerId: number, data: Partial<Product>) {
    const product = await this.findOne(id);
    if (product.seller_id !== sellerId) {
      throw new ForbiddenException('Not authorized to update this product');
    }
    await this.productsRepository.update(id, data);
    return this.findOne(id);
  }

  async removeBySeller(id: number, sellerId: number) {
    const product = await this.findOne(id);
    if (product.seller_id !== sellerId) {
      throw new ForbiddenException('Not authorized to delete this product');
    }
    await this.productsRepository.delete(id);
    return { deleted: true };
  }

  // Admin methods
  async approve(id: number) {
    await this.productsRepository.update(id, {
      status: ProductStatus.APPROVED,
    });
    return this.findOne(id);
  }

  async reject(id: number, reason: string) {
    await this.productsRepository.update(id, {
      status: ProductStatus.REJECTED,
      review_reason: reason,
    });
    return this.findOne(id);
  }

  /**
   * Get distinct categories for filter UI.
   */
  async getCategories(): Promise<string[]> {
    const result = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .andWhere('product.status = :status', { status: ProductStatus.APPROVED })
      .getRawMany();
    return result.map((r) => r.category).filter(Boolean);
  }
}
