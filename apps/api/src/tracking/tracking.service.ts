import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingEvent } from './entities/tracking-event.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(TrackingEvent)
    private trackingRepository: Repository<TrackingEvent>,
  ) {}

  async create(data: Partial<TrackingEvent>) {
    const event = this.trackingRepository.create(data);
    return this.trackingRepository.save(event);
  }

  async getStats() {
    // Total events
    const totalEvents = await this.trackingRepository.count();

    // Top events
    const topEvents = await this.trackingRepository
      .createQueryBuilder('event')
      .select('event.event_name, COUNT(event.id) as count')
      .groupBy('event.event_name')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Top pages
    const topPages = await this.trackingRepository
      .createQueryBuilder('event')
      .select('event.page_url, COUNT(event.id) as count')
      .groupBy('event.page_url')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Recent events
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
}
