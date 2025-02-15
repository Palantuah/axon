'use client';

import { redirect } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { useEffect } from 'react';

import { MantraAuthForm } from '@/components/auth/auth-login';
import { BackgroundBeams } from '@/components/auth/background-beams';
import { createClient } from '@/utils/supabase/client';

import { login, signup } from './actions';

export default function LoginPage() {
    return (
        <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required />
            <button formAction={login}>Log in</button>
            <button formAction={signup}>Sign up</button>
        </form>
    );
}

// export default async function AuthForm() {
//     const supabase = await createClient();
//     const { data, error } = await supabase.auth.getUser();

//     if (error || !data?.user) {
//         redirect('/login');
//     }

//     return (
//         <div className="size-full flex items-center justify-center p-4 relative">
//             <BackgroundBeams />
//             <MantraAuthForm />
//         </div>
//     );
// }
