import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReportPaymentDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request & { user: any }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, dto.product_id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/purchases')
  findMyPurchases(@Req() req: Request & { user: any }) {
    return this.ordersService.findByBuyer(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/sales')
  findMySales(@Req() req: Request & { user: any }) {
    return this.ordersService.findBySeller(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/pay')
  reportPayment(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() dto: ReportPaymentDto,
  ) {
    return this.ordersService.reportPayment(
      +id,
      req.user.sub,
      dto.transaction_hash,
      dto.payment_network,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/verify')
  verifyPayment(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
  ) {
    return this.ordersService.verifyPayment(+id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/confirm')
  confirmPayment(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
  ) {
    return this.ordersService.confirmPayment(+id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/complete')
  completeOrder(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
  ) {
    return this.ordersService.completeOrder(+id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  cancelOrder(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.ordersService.cancelOrder(+id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/delivery')
  getDelivery(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.ordersService.getDeliveryContent(+id, req.user.sub);
  }
}
