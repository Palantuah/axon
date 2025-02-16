/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Info, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { PreferencesModal } from '@/components/preferences-modal';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface NavbarProps {
    hasSubmitted: boolean;
}

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-transparent hover:bg-foreground/[0.05] transition-colors rounded-full"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

const AboutButton = () => {
    return (
        <Link href="/">
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-foreground/[0.05] transition-colors"
            >
                <Info className="h-5 w-5 text-muted-foreground" />
            </Button>
        </Link>
    );
};

export const Navbar: React.FC<NavbarProps> = ({ hasSubmitted }: { hasSubmitted: boolean }) => {
    return (
        <motion.div
            className={cn(
                'fixed top-0 left-0 right-0 z-[60] flex justify-between items-center px-4 py-2',
                // Add opaque background only after submit
                hasSubmitted
                    ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                    : 'bg-background',
                'border-b border-foreground/[0.08]'
            )}
        >
            <div className="flex items-center gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-emerald-500/20 rounded-full blur-xl
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 100" className="h-6 w-auto relative text-foreground">
                            <path d="M15 80 L50 15 L85 80 L65 80 L50 45 L35 80 Z" fill="currentColor"/>
                            <path d="M90 15 L125 50 L90 85 L110 85 L125 70 L140 85 L160 85 L125 50 L160 15 L140 15 L125 30 L110 15 Z"  fill="currentColor"/>
                            <path d="M170 50 A35 35 0 0 1 240 50 A35 35 0 0 1 170 50 M205 30 A20 20 0 1 0 205 70 A20 20 0 1 0 205 30"  fill="currentColor"/>
                            <path d="M250 85 L250 15 L275 15 L305 65 L305 15 L325 15 L325 85 L300 85 L270 35 L270 85 Z"  fill="currentColor"/>
                        </motion.svg>
                    </motion.div>
                </Link>

                <Link href="/new">
                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-full hover:bg-foreground/[0.05] backdrop-blur-sm group transition-all hover:scale-105"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-all" />
                        <span className="text-sm ml-2 text-muted-foreground group-hover:text-foreground">
                            New
                        </span>
                    </Button>
                </Link>
            </div>
            <div className="flex items-center space-x-2">
                <PreferencesModal />
                <AboutButton />
                <ThemeToggle />
            </div>
        </motion.div>
    );
};