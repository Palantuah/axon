'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { login, signup, oauthSignIn } from '@/app/login/actions';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from '@/components/auth/background-beams';
import { CardSpotlight } from '@/components/ui/card-spotlight';

interface AuthFormProps {
    className?: string;
}

export function MantraAuthForm({ className }: AuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await oauthSignIn();
            // The redirect will be handled by Supabase OAuth flow
        } catch (error) {
            toast.error('Unable to connect with Google');
            console.error('Google sign-in error:', error);
            setIsLoading(false);
        }
    };

    const handleLogin = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await login(formData);
            router.push('/search');
        } catch (error: any) {
            toast.error(error.message || 'Failed to log in');
            setIsLoading(false);
        }
    };

    const handleSignup = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await signup(formData);
            router.push('/search');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up');
            setIsLoading(false);
        }
    };

    return (
        <>
            <BackgroundBeams className="opacity-15" />
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full max-w-md mx-auto relative z-10"
            >
                <CardSpotlight 
                    className="p-8"
                    color="#262626"
                >
                    <CardHeader className="space-y-3 text-center p-0 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground/60 to-foreground">
                                Welcome to Axon
                            </h1>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="space-y-8 p-0">
                        <form className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-neutral-300">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <motion.div
                                            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 transition duration-500"
                                            animate={{
                                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                            style={{
                                                filter: 'blur(8px)',
                                            }}
                                        />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="Enter your email"
                                            className="relative bg-background/40 backdrop-blur-sm"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-neutral-300">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <motion.div
                                            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500/30 to-violet-500/30 opacity-0 group-hover:opacity-100 transition duration-500"
                                            animate={{
                                                backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                                            }}
                                            transition={{
                                                duration: 8,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                            style={{
                                                filter: 'blur(8px)',
                                            }}
                                        />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Enter your password"
                                            className="relative bg-background/40 backdrop-blur-sm"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    formAction={handleLogin}
                                    variant="outline"
                                    className="relative group w-full h-11 bg-background/60 border-white/10 hover:bg-background/5 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
                                    disabled={isLoading}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-500 rounded-md"
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        style={{
                                            filter: 'blur(8px)',
                                        }}
                                    />
                                    <span className="relative z-10 text-md font-semibold">
                                        {isLoading ? 'Logging in...' : 'Log in'}
                                    </span>
                                </Button>
                                <Button
                                    formAction={handleSignup}
                                    className="relative group w-full h-11 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-violet-500/5 hover:from-violet-500 hover:via-blue-500 hover:to-violet-500 transition-all duration-200 backdrop-blur-sm"
                                    disabled={isLoading}
                                    variant="inverted"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-md"
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        style={{
                                            filter: 'blur(8px)',
                                        }}
                                    />
                                    <span className="relative z-10 text-md font-semibold">
                                        {isLoading ? 'Signing up...' : 'Sign up'}
                                    </span>
                                </Button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.08]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 text-foreground/60 font-medium">or continue with</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            variant="outline"
                            className="relative group w-full h-11 bg-background/60 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
                        >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition duration-500 rounded-md"
                                        animate={{
                                            backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                        style={{
                                            filter: 'blur(8px)',
                                        }}
                                    />
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
                                    </div>
                                </Button>
                            </CardContent>

                            <CardFooter className="p-0 mt-8">
                                <p className="text-center text-sm text-neutral-500 w-full">
                                    By continuing, you agree to our{' '}
                                    <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-neutral-300 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </CardFooter>
                        </CardSpotlight>
                    </motion.div>
                </>
            );
        }

        export default MantraAuthForm;
