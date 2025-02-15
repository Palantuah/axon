'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { login, signup, oauthSignIn } from '@/app/login/actions'; // Import the server action

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
                        Welcome to Axon
                    </h1>
                </CardHeader>

                <CardContent className="space-y-6 p-0">
                    <form className="max-w-md mx-auto p-6 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 w-full p-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 w-full p-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <button
                                formAction={login}
                                className="w-full px-4 py-2 rounded-lg shadow-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Log in
                            </button>
                            <button
                                formAction={signup}
                                className="w-full px-4 py-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                    ``{' '}
                    {/* 
                    <div className="flex flex-col space-y-3">
                        <button
                            formAction={oauthSignIn}
                            disabled={isLoading}
                            className="relative flex items-center justify-center w-full h-11 px-4 space-x-2 rounded-md bg-gray-50 dark:bg-zinc-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-input hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span>Continue with Google</span>
                        </button>
                    </div> */}
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
