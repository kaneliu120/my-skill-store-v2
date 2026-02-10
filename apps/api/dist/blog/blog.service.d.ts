import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
export declare class BlogService {
    private blogRepository;
    constructor(blogRepository: Repository<BlogPost>);
    findAll(status?: string): Promise<BlogPost[]>;
    findOne(id: number): Promise<BlogPost | null>;
    findBySlug(slug: string): Promise<BlogPost | null>;
    create(data: Partial<BlogPost>): Promise<BlogPost>;
    update(id: number, data: Partial<BlogPost>): Promise<BlogPost | null>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
