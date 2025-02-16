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
                            rgba(255, 255, 255, 0.5) 0%,
                            rgba(240, 249, 255, 0.4) 25%,
                            rgba(224, 242, 254, 0.3) 50%,
                            rgba(186, 230, 253, 0.2) 75%,
                            rgba(125, 211, 252, 0.1) 100%
                        )
                    `,
                    filter: 'blur(100px)',
                }}
            />
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    background: `
                        linear-gradient(
                            135deg,
                            rgba(2, 6, 23, 0.5) 0%,
                            rgba(15, 23, 42, 0.4) 25%,
                            rgba(30, 41, 59, 0.3) 50%,
                            rgba(51, 65, 85, 0.2) 75%,
                            rgba(71, 85, 105, 0.1) 100%
                        )
                    `,
                    filter: 'blur(100px)',
                }}
            />
        </div>
    );
};
