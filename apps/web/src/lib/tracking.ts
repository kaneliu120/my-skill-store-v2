import api from './api';

export interface TrackingData {
    event_name: string;
    element_id?: string;
    page_url?: string;
    user_id?: number;
    metadata?: Record<string, unknown>;
}

export const trackEvent = async (data: TrackingData) => {
    try {
        // Add page_url automatically if not provided
        if (!data.page_url && typeof window !== 'undefined') {
            data.page_url = window.location.pathname;
        }

        // Attempt to get user_id from localStorage if stored (optional)
        // In a real app, user_id might come from auth context, but for simplicity we rely on backend logic or what's passed

        await api.post('/tracking/event', data);
    } catch (error) {
        console.error('Tracking failed:', error);
    }
};
