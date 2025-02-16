'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type GradientBackgroundProps = {
    className?: string;
};

export const GradientBackground = ({
    className,
}: GradientBackgroundProps) => {
    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 h-full w-full overflow-hidden",
                className
            )}
        >
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    background: `
                        linear-gradient(
                            135deg,
                            hsl(var(--background)) 0%,
                            hsl(var(--muted)) 25%,
                            hsl(var(--accent)) 50%,
                            hsl(var(--secondary)) 75%,
                            hsl(var(--primary)) 100%
                        )
                    `,
                    opacity: 0.5,
                    filter: 'blur(100px)',
                }}
            />
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    background: `
                        linear-gradient(
                            135deg,
                            hsl(var(--background)) 0%,
                            hsl(var(--muted)) 25%,
                            hsl(var(--accent)) 50%,
                            hsl(var(--secondary)) 75%,
                            hsl(var(--primary)) 100%
                        )
                    `,
                    opacity: 0.2,
                    filter: 'blur(100px)',
                }}
            />
        </div>
    );
};
