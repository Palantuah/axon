'use client';
import { Provider } from '@supabase/supabase-js';
import { oAuthSignIn } from './actions';

type OAuthProvider = {
    name: Provider;
    displayName: string;
};

export function OAuthButtons() {
    const oAuthProviders: OAuthProvider[] = [
        {
            name: 'google',
            displayName: 'Google',
        },
    ];

    return (
        <>
            {oAuthProviders.map((provider) => (
                <button
                    key={1}
                    className="w-full flex items-center justify-center gap-2"
                    onClick={async () => {
                        await oAuthSignIn(provider.name);
                    }}
                >
                    Login with {provider.displayName}
                </button>
            ))}
        </>
    );
}
