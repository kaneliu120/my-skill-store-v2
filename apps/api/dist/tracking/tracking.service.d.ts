import { Repository } from 'typeorm';
import { TrackingEvent } from './entities/tracking-event.entity';
export declare class TrackingService {
    private trackingRepository;
    constructor(trackingRepository: Repository<TrackingEvent>);
    create(data: Partial<TrackingEvent>): Promise<TrackingEvent>;
    getStats(): Promise<{
        totalEvents: number;
        topEvents: any[];
        topPages: any[];
        recentEvents: TrackingEvent[];
    }>;
}
