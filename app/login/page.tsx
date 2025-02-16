'use client';

import { useEffect, useState } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { MantraAuthForm } from '@/components/auth/auth-login';
import { BackgroundBeams } from '@/components/auth/background-beams';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let subscription: { unsubscribe: () => void } | null = null;

        try {
            const supabase = createClient();
            const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
                try {
                    if (session?.user) {
                        router.push('/');
                    }
                    setIsLoading(false);
                } catch (error) {
                    toast.error('Authentication error occurred');
                    setIsLoading(false);
                }
            });
            subscription = data.subscription;
        } catch (error) {
            setError('Failed to initialize authentication');
            setIsLoading(false);
        }

        return () => {
            if (subscription) {
                try {
                    subscription.unsubscribe();
                } catch (error) {
                    toast.error('Error cleaning up auth subscription');
                }
            }
        };
    }, [router]);

    if (isLoading) {
        return null;
    }

    if (error) {
        return (
            <div className="size-full flex items-center justify-center p-4 relative min-h-screen">
                <BackgroundBeams />
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-500 mb-2">{error}</h2>
                    <p className="text-neutral-400">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="size-full flex items-center justify-center p-4 relative min-h-screen">
            <BackgroundBeams />
            <MantraAuthForm />
        </div>
    );
}
