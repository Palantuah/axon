'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function GradientBackground({ className, ...props }: GradientBackgroundProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={cn('absolute inset-0 overflow-hidden', className)} {...props}>
            {/* Main centered gradient */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: isDark ? [0.7, 0.8, 0.7] : [0.6, 0.7, 0.6],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] blur-[80px]"
                style={{
                    background: 'radial-gradient(circle at center, rgb(139, 92, 246) 0%, rgba(139, 92, 246, 0) 70%)',
                }}
            />
            
            {/* Top-right blue accent */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -top-[25vh] right-[10vw] w-[50vw] h-[50vh] blur-[100px]"
                style={{
                    background: 'radial-gradient(circle at center, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 70%)',
                    opacity: isDark ? 0.5 : 0.45,
                }}
            />
            
            {/* Bottom-left emerald accent */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -20, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
                className="absolute bottom-[-20vh] left-[5vw] w-[45vw] h-[45vh] blur-[120px]"
                style={{
                    background: 'radial-gradient(circle at center, rgb(16, 185, 129) 0%, rgba(16, 185, 129, 0) 70%)',
                    opacity: isDark ? 0.45 : 0.4,
                }}
            />

            {/* Subtle ambient light */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1))',
                    opacity: isDark ? 0.4 : 0.3,
                }}
            />

            {/* Fine grain overlay */}
            <div 
                className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay pointer-events-none"
                style={{
                    opacity: isDark ? 0.2 : 0.12,
                }}
            />
        </div>
    );
} 