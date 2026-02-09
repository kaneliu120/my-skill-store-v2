import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogPost } from './entities/blog-post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.blogService.findAll(status);
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    if (/^\d+$/.test(idOrSlug)) {
      return this.blogService.findOne(+idOrSlug);
    }
    return this.blogService.findBySlug(idOrSlug);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() data: Partial<BlogPost>) {
    return this.blogService.create(data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<BlogPost>) {
    return this.blogService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
