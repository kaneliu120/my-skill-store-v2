import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  OFF_SHELF = 'off_shelf',
}

export enum DeliveryType {
  AUTO = 'auto_hosted',
  MANUAL = 'manual',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  seller_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  preview_image_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_usd: number;

  @Column({ type: 'enum', enum: DeliveryType })
  delivery_type: DeliveryType;

  @Column({ type: 'text', nullable: true })
  delivery_content: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @Column({ type: 'text', nullable: true })
  review_reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
