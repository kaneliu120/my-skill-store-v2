import { BlogService } from './blog.service';
import { BlogPost } from './entities/blog-post.entity';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(status?: string): Promise<BlogPost[]>;
    findOne(idOrSlug: string): Promise<BlogPost | null>;
    create(data: Partial<BlogPost>): Promise<BlogPost>;
    update(id: string, data: Partial<BlogPost>): Promise<BlogPost | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
