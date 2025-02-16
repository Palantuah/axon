'use client';

import { useEffect } from 'react';
import { useNewsletterStore } from '@/lib/store/newsletter-store';

export function NewsletterProvider() {
    const { triggerNewsletter, shouldTriggerNewsletter } = useNewsletterStore();

    useEffect(() => {
        if (shouldTriggerNewsletter()) {
            triggerNewsletter();
        }
    }, [shouldTriggerNewsletter, triggerNewsletter]);

    return null;
} 