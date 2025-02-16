'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Cover } from '@/components/ui/cover';
import { GradientBackground } from '@/components/ui/gradient-background';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
        },
    },
};

const gradientVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1,
            ease: [0.32, 0.72, 0, 1],
        },
    },
};

export const Hero = () => {
    const [query, setQuery] = useState('');
    const { scrollY } = useScroll();

    const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const contentScale = useTransform(scrollY, [0, 400], [1, 0.95]);
    const backgroundY = useTransform(scrollY, [0, 400], ['0%', '20%']);

    return (
        <div className="relative z-0 flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
                <GradientBackground />
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ opacity: contentOpacity, scale: contentScale }}
                className="w-full px-4 relative z-10 pt-16"
            >
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <motion.div variants={containerVariants} className="space-y-8">
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none text-foreground"
                        >
                            Your Interests, Transformed Into
                        </motion.h1>

                        <motion.div variants={gradientVariants}>
                            <Cover>
                                <span
                                    className="bg-clip-text text-transparent bg-[length:400%_400%] bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 px-4 block text-5xl sm:text-6xl lg:text-7xl font-bold"
                                    style={{
                                        animation: 'gradient-shift 8s ease infinite',
                                    }}
                                >
                                    Personalized Content
                                </span>
                            </Cover>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
                        >
                            Tell us your interests, and we'll synthesize curated newsletters and engaging podcasts from the best sources across the web.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 max-w-2xl mx-auto w-full relative group"
                    >
                        <div className="relative flex-1 group">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-blue-500/20 rounded-xl blur"
                                transition={{ duration: 0.3 }}
                            />
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/0 to-blue-500/0 group-focus-within:from-violet-500/30 group-focus-within:to-blue-500/30 rounded-xl blur transition-all duration-300" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What topics interest you?"
                                    className="relative w-full pl-6 pr-12 py-3 rounded-xl bg-background/20 border border-border/10 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2.5 rounded-lg bg-background/5 border border-border/10 hover:bg-background/10 transition-colors duration-200 transform-gpu"
                                    >
                                        <MagnifyingGlassIcon className="w-5 h-5 text-foreground" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center justify-center gap-4 text-sm"
                    >
                        {['tech news', 'startup insights', 'industry analysis', 'weekly digest', 'audio content'].map(
                            (tag, i) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-gray-400
                         hover:bg-black/30 hover:border-white/20 hover:text-white
                         transition-all duration-300 cursor-pointer backdrop-blur-sm"
                                >
                                    {tag}
                                </motion.span>
                            ),
                        )}
                    </motion.div>
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes gradient-shift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
        </div>
    );
};
