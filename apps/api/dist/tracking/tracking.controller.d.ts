import { TrackingService } from './tracking.service';
import type { Request } from 'express';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    trackEvent(body: any, req: Request): Promise<import("./entities/tracking-event.entity").TrackingEvent>;
    getStats(): Promise<{
        totalEvents: number;
        topEvents: any[];
        topPages: any[];
        recentEvents: import("./entities/tracking-event.entity").TrackingEvent[];
    }>;
}
