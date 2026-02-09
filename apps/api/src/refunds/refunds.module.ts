import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './entities/refund.entity';
import { Order } from '../orders/entities/order.entity';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Refund, Order]),
    NotificationsModule,
  ],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
