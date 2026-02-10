import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateRefundDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
