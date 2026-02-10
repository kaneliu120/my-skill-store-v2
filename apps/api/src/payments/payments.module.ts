import { Module } from '@nestjs/common';
import { CryptoVerificationService } from './crypto-verification.service';

@Module({
  providers: [CryptoVerificationService],
  exports: [CryptoVerificationService],
})
export class PaymentsModule {}
