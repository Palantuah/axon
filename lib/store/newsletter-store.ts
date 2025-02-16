import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsletterState {
    lastTriggered: number | null;
    triggerNewsletter: () => Promise<void>;
    shouldTriggerNewsletter: () => boolean;
}

export const useNewsletterStore = create<NewsletterState>()(
    persist(
        (set, get) => ({
            lastTriggered: null,
            triggerNewsletter: async () => {
                try {
                    const response = await fetch('/api/trigger-lambda');
                    if (!response.ok) {
                        throw new Error('Failed to trigger newsletter');
                    }
                    set({ lastTriggered: Date.now() });
                } catch (error) {
                    console.error('Error triggering newsletter:', error);
                }
            },
            shouldTriggerNewsletter: () => {
                const lastTriggered = get().lastTriggered;
                if (!lastTriggered) return true;
                
                const oneDayInMs = 24 * 60 * 60 * 1000;
                const timeSinceLastTrigger = Date.now() - lastTriggered;
                
                return timeSinceLastTrigger >= oneDayInMs;
            }
        }),
        {
            name: 'newsletter-storage',
        }
    )
); 