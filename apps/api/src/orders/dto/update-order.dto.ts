import { IsOptional, IsString } from 'class-validator';

export class ReportPaymentDto {
  @IsString()
  @IsOptional()
  transaction_hash?: string;

  @IsString()
  @IsOptional()
  payment_network?: string;
}
