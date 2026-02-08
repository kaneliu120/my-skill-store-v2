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

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.blogService.findAll(status);
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    // Check if it looks like a number
    if (/^\d+$/.test(idOrSlug)) {
      return this.blogService.findOne(+idOrSlug);
    }
    return this.blogService.findBySlug(idOrSlug);
  }

  @Post()
  create(@Body() data: Partial<BlogPost>) {
    return this.blogService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<BlogPost>) {
    return this.blogService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
