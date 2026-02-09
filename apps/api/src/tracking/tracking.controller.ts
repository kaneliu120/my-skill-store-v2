import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import type { Request } from 'express';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) { }

  @Post('event')
  async trackEvent(@Body() body: any, @Req() req: Request) {
    const { event_name, element_id, page_url, user_id, metadata } = body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.headers['user-agent'];

    return this.trackingService.create({
      event_name,
      element_id,
      page_url,
      user_id,
      metadata,
      ip_address: typeof ip_address === 'string' ? ip_address : '',
      user_agent,
    });
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('stats')
  async getStats() {
    return this.trackingService.getStats();
  }
}
