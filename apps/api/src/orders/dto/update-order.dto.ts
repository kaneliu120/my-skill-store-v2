import { IsOptional, IsString } from 'class-validator';

export class ReportPaymentDto {
  @IsString()
  @IsOptional()
  transaction_hash?: string;
}
