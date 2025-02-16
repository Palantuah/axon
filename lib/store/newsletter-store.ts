import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NewsletterState {
    selectedDigestId: string | null;
    setSelectedDigestId: (id: string | null) => void;
}

export const useNewsletterStore = create<NewsletterState>()(
    persist(
        (set) => ({
            selectedDigestId: null,
            setSelectedDigestId: (id) => set({ selectedDigestId: id }),
        }),
        {
            name: 'newsletter-storage',
        }
    )
); 