'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MantraAuthForm } from '@/components/auth/auth-login';
import { BackgroundBeams } from '@/components/auth/background-beams';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();

            if (data?.user) {
                redirect('/');
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return null;
    }

    return (
        <div className="size-full flex items-center justify-center p-4 relative">
            <BackgroundBeams />
            <MantraAuthForm />
        </div>
    );
}
