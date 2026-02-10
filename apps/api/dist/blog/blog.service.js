"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_post_entity_1 = require("./entities/blog-post.entity");
let BlogService = class BlogService {
    blogRepository;
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }
    async findAll(status) {
        const query = this.blogRepository.createQueryBuilder('post');
        if (status === 'published') {
            query.where('post.is_published = :is_published', { is_published: true });
            query.orderBy('post.published_at', 'DESC');
        }
        else {
            query.orderBy('post.created_at', 'DESC');
        }
        return query.getMany();
    }
    async findOne(id) {
        return this.blogRepository.findOne({ where: { id } });
    }
    async findBySlug(slug) {
        return this.blogRepository.findOne({ where: { slug } });
    }
    async create(data) {
        const post = this.blogRepository.create(data);
        if (post.is_published && !post.published_at) {
            post.published_at = new Date();
        }
        return this.blogRepository.save(post);
    }
    async update(id, data) {
        if (data.is_published === true) {
            const existing = await this.findOne(id);
            if (existing && !existing.is_published) {
                data.published_at = new Date();
            }
        }
        await this.blogRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        return this.blogRepository.delete(id);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_post_entity_1.BlogPost)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlogService);
//# sourceMappingURL=blog.service.js.map