import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { ProcessRefundDto } from './dto/process-refund.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  requestRefund(
    @Req() req: Request & { user: any },
    @Body() dto: CreateRefundDto,
  ) {
    return this.refundsService.requestRefund(
      req.user.sub,
      dto.order_id,
      dto.reason,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyRefunds(@Req() req: Request & { user: any }) {
    return this.refundsService.findByUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll(@Query('status') status?: string) {
    return this.refundsService.findAll(status);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refundsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/process')
  processRefund(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() dto: ProcessRefundDto,
  ) {
    return this.refundsService.processRefund(
      +id,
      req.user.sub,
      dto.approved,
      dto.admin_note,
      dto.refund_transaction_hash,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/complete')
  completeRefund(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body('refund_transaction_hash') txHash: string,
  ) {
    return this.refundsService.completeRefund(+id, req.user.sub, txHash);
  }
}
