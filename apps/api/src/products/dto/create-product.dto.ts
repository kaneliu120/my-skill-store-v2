import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { DeliveryType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price_usd: number;

  @IsEnum(DeliveryType)
  delivery_type: DeliveryType;

  @IsString()
  @IsOptional()
  delivery_content?: string;

  @IsString()
  @IsOptional()
  preview_image_url?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  tags?: string;
}
