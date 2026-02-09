import { IsNumber, IsString, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
