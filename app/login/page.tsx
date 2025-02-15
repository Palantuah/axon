import { createClient } from '../utils/supabase';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function LoginForm() {
    const signIn = async () => {
        'use server';

        // supabase client init
        const supabase = createClient();
        const origin = headers().get('origin');

        // GitHub sign in for now can add goog later
        const { error, data } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${origin}`,
            },
        });
        if (error) {
            console.log(error);
            return;
        } else {
            redirect(data.url);
        }
        // landing page?
    };
    return (
        <form action={signIn} className="flex-1 flex min-h-screen justify-center items-center">
            <button className="hover:bg-gray-800 p-8 rounded-xl">Sign in with GitHub</button>
        </form>
    );
}
