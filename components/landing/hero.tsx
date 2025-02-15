'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Cover } from '@/components/ui/cover';
// import { WaveAnimation } from '@/components/ui/wave-animation';

const fadeUpVariants = {
    hidden: {
        y: 20,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
        },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

export const Hero = () => {
    const [query, setQuery] = useState('');
    const { scrollY } = useScroll();

    // Smoother fade out for content only, not background
    const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const contentScale = useTransform(scrollY, [0, 400], [1, 0.95]);

    return (
        <>
            {/* <div className="fixed inset-0 size-full">
                <WaveAnimation />
            </div> */}

            {/* Content with fade effect */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ opacity: contentOpacity, scale: contentScale }}
                className="min-h-[95vh] flex flex-col items-center justify-center px-4 relative z-10"
            >
                {/* Main content */}
                <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
                    <motion.div variants={fadeUpVariants} className="space-y-6">
                        <h1 className="text-6xl font-semibold tracking-tight leading-none text-foreground">
                            Discover Insights Through
                        </h1>
                        <div>
                            <Cover>
                                {' '}
                                <span
                                    className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500/90 via-blue-500/90 to-emerald-500/90
                             px-4 block text-7xl font-bold"
                                >
                                    Unbiased Analysis
                                </span>
                            </Cover>
                        </div>

                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                            Bridge the gap between information complexity and clarity with rigorous research and
                            data-driven insights.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        className="flex items-center gap-3 max-w-2xl mx-auto w-full relative group"
                    >
                        <div className="relative flex-1 group">
                            <div
                                className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-blue-500/20 rounded-xl blur opacity-0 
                            group-hover:opacity-100 transition duration-500"
                            ></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="What would you like to analyze?"
                                    className="w-full pl-6 pr-12 py-3 rounded-xl bg-background/20 border border-border/10 backdrop-blur-md
                            text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20
                            transition-all duration-300"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-background/5 border border-border/10
                           hover:bg-background/10 transition-colors duration-200"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5 text-foreground" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUpVariants}
                        className="flex flex-wrap items-center justify-center gap-4 text-sm"
                    >
                        {['market analysis', 'competitor research', 'trend forecasting', 'data insights'].map(
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
        </>
    );
};
