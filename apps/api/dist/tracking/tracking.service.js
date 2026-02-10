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
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tracking_event_entity_1 = require("./entities/tracking-event.entity");
let TrackingService = class TrackingService {
    trackingRepository;
    constructor(trackingRepository) {
        this.trackingRepository = trackingRepository;
    }
    async create(data) {
        const event = this.trackingRepository.create(data);
        return this.trackingRepository.save(event);
    }
    async getStats() {
        const totalEvents = await this.trackingRepository.count();
        const topEvents = await this.trackingRepository
            .createQueryBuilder('event')
            .select('event.event_name, COUNT(event.id) as count')
            .groupBy('event.event_name')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        const topPages = await this.trackingRepository
            .createQueryBuilder('event')
            .select('event.page_url, COUNT(event.id) as count')
            .groupBy('event.page_url')
            .orderBy('count', 'DESC')
            .limit(10)
            .getRawMany();
        const recentEvents = await this.trackingRepository.find({
            order: { created_at: 'DESC' },
            take: 20,
        });
        return {
            totalEvents,
            topEvents,
            topPages,
            recentEvents,
        };
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tracking_event_entity_1.TrackingEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrackingService);
//# sourceMappingURL=tracking.service.js.map