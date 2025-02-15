'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './navigation-menu';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/login/actions';

const navItems = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
];

const fadeInVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
        },
    },
};

const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1],
        },
    },
};

export function Header() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { scrollY } = useScroll();

    // Auth
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

    React.useEffect(() => {
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

    // Dynamic values based on scroll
    const blurValue = useTransform(scrollY, [0, 100], [0, 12]);
    const backgroundOpacity = useTransform(scrollY, [0, 100], [0.0, 0.7]);
    const borderRadius = useTransform(scrollY, [0, 100], [0, 9999]);
    const scale = useTransform(scrollY, [0, 100], [1, 0.95]);
    const yOffset = useTransform(scrollY, [0, 100], [0, 16]);
    const xOffset = useTransform(scrollY, [0, 100], [0, 20]);
    const headerHeight = useTransform(scrollY, [0, 100], ['4rem', '3.5rem']);
    const containerScale = useTransform(scrollY, [0, 100], [1, 0.9]);
    const bgOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center"
            style={{
                y: yOffset,
                paddingLeft: xOffset,
                paddingRight: xOffset,
            }}
        >
            <motion.div
                className={cn(
                    'w-full relative backdrop-blur-[20px]',
                    'transition-all duration-300',
                    'border border-white/[0.08]',
                    'overflow-hidden',
                )}
                style={{
                    borderRadius,
                    height: headerHeight,
                    scale,
                }}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
            >
                {/* Background layers */}
                <motion.div className="absolute inset-0 bg-black/40" style={{ opacity: bgOpacity }} />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.03] via-blue-500/[0.03] to-emerald-500/[0.03]"
                    style={{ opacity: backgroundOpacity }}
                />

                {/* Gradient line */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-emerald-500/30"
                    style={{ opacity: backgroundOpacity, borderRadius }}
                />

                {/* Outer glow */}
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-emerald-500/10 blur-xl"
                    style={{ opacity: backgroundOpacity, borderRadius }}
                />

                {/* Inner glow */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-emerald-500/5"
                    style={{ opacity: backgroundOpacity }}
                />

                <motion.div className="container mx-auto px-4 h-full relative z-10" style={{ scale: containerScale }}>
                    <div className="flex h-full items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-xl
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                <motion.img src="/axon.svg" alt="Axon" className="h-8 w-auto relative" />
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <NavigationMenu className="hidden md:flex">
                            <NavigationMenuList>
                                <AnimatePresence>
                                    {navItems.map((item, i) => (
                                        <NavigationMenuItem key={item.href}>
                                            <motion.div
                                                variants={menuItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Link href={item.href} legacyBehavior passHref>
                                                    <NavigationMenuLink
                                                        className={cn(
                                                            'group inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium',
                                                            'text-white/70 hover:text-white transition-colors relative',
                                                            'hover:bg-white/[0.05]',
                                                            'focus:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
                                                        )}
                                                    >
                                                        <motion.span
                                                            className="relative z-10"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 
                                       group-hover:opacity-100 blur-sm transition-opacity duration-500"
                                                        />
                                                    </NavigationMenuLink>
                                                </Link>
                                            </motion.div>
                                        </NavigationMenuItem>
                                    ))}
                                </AnimatePresence>
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated === null ? null : isAuthenticated ? (
                                <form>
                                    <motion.div
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: 0.3 }}
                                    >
                                        <button
                                            //variant="ghost"
                                            className="hidden md:inline-flex text-white/70 hover:text-white hover:bg-white/[0.05] rounded-full
                                                   relative group overflow-hidden"
                                            formAction={signOut}
                                        >
                                            <motion.span
                                                className="relative z-10"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Sign Out
                                            </motion.span>
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 
                                                     group-hover:opacity-100 blur-sm transition-opacity duration-500"
                                            />
                                        </button>
                                    </motion.div>
                                </form>
                            ) : (
                                <>
                                    <motion.div
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Link href="/login" passHref>
                                            <Button
                                                variant="ghost"
                                                className="hidden md:inline-flex text-white/70 hover:text-white hover:bg-white/[0.05] rounded-full
                           relative group overflow-hidden"
                                            >
                                                <motion.span
                                                    className="relative z-10"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    Sign In
                                                </motion.span>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 
                             group-hover:opacity-100 blur-sm transition-opacity duration-500"
                                                />
                                            </Button>
                                        </Link>
                                    </motion.div>

                                    <motion.div
                                        variants={menuItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Button className="hidden md:inline-flex relative group overflow-hidden rounded-full">
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 opacity-90
                             group-hover:opacity-100 transition-opacity duration-500"
                                            />
                                            <motion.span
                                                className="relative z-10 text-white"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Get Started
                                            </motion.span>
                                        </Button>
                                    </motion.div>
                                </>
                            )}

                            {/* Mobile Menu */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden text-white/70 hover:text-white hover:bg-white/[0.05] rounded-full"
                                    >
                                        <MenuIcon className="h-5 w-5" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="right"
                                    className="w-80 bg-black/95 border-white/[0.08] backdrop-blur-2xl"
                                >
                                    <nav className="flex flex-col gap-4 mt-8">
                                        <AnimatePresence>
                                            {navItems.map((item, i) => (
                                                <motion.div
                                                    key={item.href}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        className="text-lg font-medium text-white/70 hover:text-white transition-colors block py-2 px-4
                                     rounded-full hover:bg-white/[0.05] relative group"
                                                    >
                                                        <motion.span
                                                            whileHover={{ x: 4 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-emerald-500/10 opacity-0 
                                       group-hover:opacity-100 blur-sm transition-opacity duration-500"
                                                        />
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/[0.05] rounded-full"
                                            >
                                                Sign In
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Button className="w-full relative group overflow-hidden rounded-full">
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 opacity-90
                                   group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                                <span className="relative z-10 text-white">Get Started</span>
                                            </Button>
                                        </motion.div>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.header>
    );
}
