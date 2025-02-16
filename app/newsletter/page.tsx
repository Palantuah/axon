'use client';

import { NewsletterContent } from '@/components/newsletter/newsletter-content';
import { NewsletterSidebar } from '@/components/newsletter/newsletter-sidebar';
import { SelectedItems } from '@/components/newsletter/selected-items';
import { useNewsletterStore } from '@/lib/store/newsletter-store';

const NewsletterPage = () => {
    const { selectedDigestId } = useNewsletterStore();

    return (
        <div className="flex h-screen bg-black">
            <NewsletterSidebar />
            <div className="flex-1">
                <NewsletterContent digestId={selectedDigestId || undefined} />
                <SelectedItems />
            </div>
        </div>
    );
};

export default NewsletterPage;
