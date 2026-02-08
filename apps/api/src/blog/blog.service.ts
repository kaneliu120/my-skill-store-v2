import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogRepository: Repository<BlogPost>,
  ) {}

  async findAll(status?: string) {
    const query = this.blogRepository.createQueryBuilder('post');

    if (status === 'published') {
      query.where('post.is_published = :is_published', { is_published: true });
      query.orderBy('post.published_at', 'DESC');
    } else {
      query.orderBy('post.created_at', 'DESC');
    }

    return query.getMany();
  }

  async findOne(id: number) {
    return this.blogRepository.findOne({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.blogRepository.findOne({ where: { slug } });
  }

  async create(data: Partial<BlogPost>) {
    const post = this.blogRepository.create(data);
    if (post.is_published && !post.published_at) {
      post.published_at = new Date();
    }
    return this.blogRepository.save(post);
  }

  async update(id: number, data: Partial<BlogPost>) {
    if (data.is_published === true) {
      const existing = await this.findOne(id);
      if (existing && !existing.is_published) {
        data.published_at = new Date();
      }
    }
    await this.blogRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.blogRepository.delete(id);
  }
}
