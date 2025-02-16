'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { createClient } from '@/utils/supabase/client';
import { signOut } from '@/app/login/actions';
import { ThemeToggle } from './theme-toggle';
import { redirect } from 'next/navigation';
const navItems = [
    { href: '/features', label: 'Features' },
    { href: '/newsletter', label: 'AI News' },
    { href: '/search', label: 'Search' },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Auth
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const roundedClass = isScrolled ? 'rounded-full' : 'rounded-lg';

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-2"
        >
            <motion.div
                className={cn(
                    'relative backdrop-blur-[20px]',
                    'border border-foreground/[0.08]',
                    'w-full transition-all duration-300 ease-in-out',
                    'flex items-center justify-between',
                    'px-4 py-2',
                    roundedClass,
                    isScrolled ? 'max-w-[600px] bg-background/40' : 'max-w-full bg-background/10'
                )}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-xl
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" className="h-8 w-auto relative text-foreground">
                            <path d="M15 80 L50 15 L85 80 L65 80 L50 45 L35 80 Z" fill="currentColor"/>
                            <path d="M90 15 L125 50 L90 85 L110 85 L125 70 L140 85 L160 85 L125 50 L160 15 L140 15 L125 30 L110 15 Z"  fill="currentColor"/>
                            <path d="M170 50 A35 35 0 0 1 240 50 A35 35 0 0 1 170 50 M205 30 A20 20 0 1 0 205 70 A20 20 0 1 0 205 30"  fill="currentColor"/>
                            <path d="M250 85 L250 15 L275 15 L305 65 L305 15 L325 15 L325 85 L300 85 L270 35 L270 85 Z"  fill="currentColor"/>
                        </motion.svg>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {navItems.map((item) => (
                            <NavigationMenuItem key={item.href}>
                                <Link href={item.href} legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={cn(
                                            'group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium',
                                            'text-muted-foreground hover:text-foreground transition-colors',
                                            'hover:bg-foreground/[0.05]',
                                            roundedClass
                                        )}
                                    >
                                        {item.label}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                    
                    {isAuthenticated === null ? null : isAuthenticated ? (
                        <form>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'hidden md:inline-flex text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]',
                                    'transition-all duration-300',
                                    roundedClass
                                )}
                                formAction={async () => {
                                    await signOut();
                                    redirect('/');
                                }}
                            >
                                Sign Out
                            </Button>
                        </form>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        'hidden md:inline-flex text-foreground/80 hover:text-foreground hover:bg-foreground/[0.05]',
                                        'transition-all duration-300',
                                        roundedClass
                                    )}
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className={cn(
                                    'hidden md:inline-flex bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end',
                                    'transition-all duration-300',
                                    roundedClass
                                )}>
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    'md:hidden text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]',
                                    'transition-all duration-300',
                                    roundedClass
                                )}
                            >
                                <MenuIcon className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 bg-background/95 border-foreground/[0.08] backdrop-blur-2xl">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'text-lg font-medium text-muted-foreground hover:text-foreground transition-colors block py-2 px-4',
                                            'hover:bg-foreground/[0.05]',
                                            'transition-all duration-300',
                                            roundedClass
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {isAuthenticated ? (
                                    <form>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                'w-full justify-start text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]',
                                                'transition-all duration-300',
                                                roundedClass
                                            )}
                                            formAction={signOut}
                                        >
                                            Sign Out
                                        </Button>
                                    </form>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    'w-full justify-start text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]',
                                                    'transition-all duration-300',
                                                    roundedClass
                                                )}
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/login">
                                            <Button className={cn(
                                                'w-full bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end',
                                                'transition-all duration-300',
                                                roundedClass
                                            )}>
                                                Get Started
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </motion.header>
    );
}