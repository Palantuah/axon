'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { oauthSignIn } from '@/app/login/actions'; // Import the server action

interface AuthFormProps {
    className?: string;
}

export function MantraAuthForm({ className }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await oauthSignIn(); // Call the server action
        } catch (error) {
            toast.error('Unable to connect with Google');
            console.error('Google sign-in error:', error);
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-96 max-w-md mx-auto">
            <Card className="border-border/40 shadow-lg relative bg-white dark:bg-black p-4 md:p-8 h-fit flex flex-col gap-6">
                <CardHeader className="space-y-2 text-center p-0">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
                        Welcome to Mantra
                    </h1>
                </CardHeader>

                <CardContent className="space-y-6 p-0">
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="relative flex items-center justify-center w-full h-11 px-4 space-x-2 rounded-md bg-gray-50 dark:bg-zinc-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-input hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span>Continue with Google</span>
                        </button>
                    </div>
                </CardContent>

                <CardFooter className="p-0">
                    <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 w-full">
                        By continuing, you agree to our{' '}
                        <Link href="/terms" className="font-normal text-primary hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="font-normal text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default MantraAuthForm;
