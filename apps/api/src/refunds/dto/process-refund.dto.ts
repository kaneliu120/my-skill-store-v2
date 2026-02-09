import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class ProcessRefundDto {
  @IsBoolean()
  approved: boolean;

  @IsString()
  @IsOptional()
  admin_note?: string;

  @IsString()
  @IsOptional()
  refund_transaction_hash?: string;
}
