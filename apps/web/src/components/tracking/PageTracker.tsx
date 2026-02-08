'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';
import { useAuth } from '@/components/auth/AuthContext';

export function PageTracker() {
    const pathname = usePathname();
    const { user } = useAuth();

    useEffect(() => {
        trackEvent({
            event_name: 'page_view',
            page_url: pathname,
            user_id: user?.id,
        });
    }, [pathname, user?.id]);

    return null;
}
