import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findMyNotifications(
    @Req() req: Request & { user: any },
    @Query('unread') unread?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.findByUser(req.user.sub, {
      unreadOnly: unread === 'true',
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount(@Req() req: Request & { user: any }) {
    return this.notificationsService.getUnreadCount(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(+id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('read-all')
  markAllAsRead(@Req() req: Request & { user: any }) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }
}
