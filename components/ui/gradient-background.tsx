'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    intensity?: 'subtle' | 'medium' | 'high';
}

export function GradientBackground({ 
    className, 
    intensity = 'medium',
    ...props 
}: GradientBackgroundProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const intensityValues = {
        subtle: {
            blur: 130,
            opacity: isDark ? 0.4 : 0.3,
            scale: [1, 1.03, 1],
        },
        medium: {
            blur: 150,
            opacity: isDark ? 0.5 : 0.4,
            scale: [1, 1.05, 1],
        },
        high: {
            blur: 170,
            opacity: isDark ? 0.6 : 0.5,
            scale: [1, 1.08, 1],
        },
    };

    const currentIntensity = intensityValues[intensity];

    return (
        <div className={cn('absolute inset-0 overflow-hidden -z-10', className)} {...props}>
            {/* Primary violet gradient */}
            <motion.div
                animate={{
                    scale: currentIntensity.scale,
                    opacity: [currentIntensity.opacity, currentIntensity.opacity + 0.05, currentIntensity.opacity],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[130vh]"
                style={{
                    filter: `blur(${currentIntensity.blur}px)`,
                    background: 'radial-gradient(circle at center, rgb(139, 92, 246) 0%, rgba(139, 92, 246, 0) 80%)',
                }}
            />
            
            {/* Upper blue gradient */}
            <motion.div
                animate={{
                    scale: [1, 1.08, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0],
                    opacity: [0.3, 0.35, 0.3],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute -top-[20vh] right-[5vw] w-[70vw] h-[70vh]"
                style={{
                    filter: `blur(${currentIntensity.blur + 30}px)`,
                    background: 'radial-gradient(circle at center, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 80%)',
                    opacity: isDark ? 0.4 : 0.35,
                }}
            />
            
            {/* Lower blue accent */}
            <motion.div
                animate={{
                    scale: [1, 1.06, 1],
                    x: [0, -15, 0],
                    y: [0, 15, 0],
                    opacity: [0.25, 0.3, 0.25],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
                className="absolute bottom-[-10vh] left-[10vw] w-[60vw] h-[60vh]"
                style={{
                    filter: `blur(${currentIntensity.blur + 40}px)`,
                    background: 'radial-gradient(circle at center, rgb(99, 102, 241) 0%, rgba(99, 102, 241, 0) 80%)',
                    opacity: isDark ? 0.35 : 0.3,
                }}
            />

            {/* Subtle glow effect */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.08, 0.05],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="absolute inset-0"
                style={{
                    background: isDark 
                        ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse at center, rgba(0,0,0,0.03) 0%, transparent 70%)',
                }}
            />

            {/* Fine grain overlay */}
            <div 
                className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay pointer-events-none"
                style={{
                    opacity: isDark ? 0.12 : 0.08,
                }}
            />
        </div>
    );
} 