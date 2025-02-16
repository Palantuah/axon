'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { getURL } from '@/utils/helpers';

export async function login(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
}

export async function oauthSignIn() {
    const supabase = await createClient();
    const redirectUrl = getURL('/auth/callback');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    });

    if (error) {
        throw new Error(error.message);
    }

    // No need to revalidate here as OAuth will handle the redirect
    return data;
}
