import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';

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

  findAll(query: { search?: string; category?: string } = {}) {
    const where: any = {};
    if (query.search) {
      where.title = Like(`%${query.search}%`);
    }
    if (query.category) {
      where.category = query.category;
    }

    return this.productsRepository.find({
      where,
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
  }

  findApproved(query: { search?: string; category?: string } = {}) {
    const where: any = { status: ProductStatus.APPROVED };
    if (query.search) {
      where.title = Like(`%${query.search}%`);
    }
    if (query.category) {
      where.category = query.category;
    }

    return this.productsRepository.find({
      where,
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
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
}
