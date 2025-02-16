import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

let supabaseClient: ReturnType<typeof createBrowserClient>;

try {
    supabaseClient = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    toast.error('Failed to initialize Supabase client');
}

export function createClient() {
    if (!supabaseClient) {
        throw new Error('Supabase client failed to initialize');
    }
    return supabaseClient;
}
