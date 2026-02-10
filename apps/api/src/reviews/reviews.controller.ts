import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: any },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(
      req.user.sub,
      dto.order_id,
      dto.rating,
      dto.comment,
    );
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findByProduct(
      +productId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get('product/:productId/rating')
  getProductRating(@Param('productId') productId: string) {
    return this.reviewsService.getProductRating(+productId);
  }

  @Get('seller/:sellerId')
  findBySeller(
    @Param('sellerId') sellerId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.findBySeller(
      +sellerId,
      page ? +page : 1,
      limit ? +limit : 20,
    );
  }

  @Get('seller/:sellerId/rating')
  getSellerRating(@Param('sellerId') sellerId: string) {
    return this.reviewsService.getSellerRating(+sellerId);
  }
}
