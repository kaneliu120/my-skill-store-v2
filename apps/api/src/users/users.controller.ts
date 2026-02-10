import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() userData: any) {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    if (user.role !== 'admin' && user.sub !== +id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
    const user = req.user;
    if (user.role !== 'admin' && user.sub !== +id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(+id, updateData);
  }
}
