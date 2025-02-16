import { 
    Users, 
    Brain, 
    Code, 
    Flag, 
    Heart, 
    DollarSign, 
    Newspaper, 
    ChartLine, 
    Search, 
    Sparkles,
    Lightbulb,
    GraduationCap,
    FileText,
    BarChart,
    Microscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TrendingQuery } from '@/lib/types';

interface SuggestionCardsProps {
    trendingQueries: TrendingQuery[];
    handleExampleClick: (query: TrendingQuery) => void;
}

export const SuggestionCards: React.FC<SuggestionCardsProps> = ({ trendingQueries, handleExampleClick }) => {
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const animationFrameRef = useRef<number>();
    const lastScrollTime = useRef<number>(0);

    useEffect(() => {
        if (trendingQueries.length > 0) {
            setIsLoading(false);
        }
    }, [trendingQueries]);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!scrollRef.current || isPaused) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            if (timestamp - lastScrollTime.current > 20) { // Slowed down from 16ms to 50ms
                const newScrollLeft = scrollRef.current.scrollLeft + 0.5; // Slowed down from 1px to 0.5px

                if (newScrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth) {
                    scrollRef.current.scrollLeft = 0;
                } else {
                    scrollRef.current.scrollLeft = newScrollLeft;
                }

                lastScrollTime.current = timestamp;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPaused]);

    const getIconForCategory = (category: string) => {
        const iconMap = {
            trending: <ChartLine className="w-4 h-4" />,
            analysis: <BarChart className="w-4 h-4" />,
            research: <Search className="w-4 h-4" />,
            science: <Microscope className="w-4 h-4" />,
            tech: <Code className="w-4 h-4" />,
            innovation: <Lightbulb className="w-4 h-4" />,
            education: <GraduationCap className="w-4 h-4" />,
            finance: <DollarSign className="w-4 h-4" />,
            health: <Heart className="w-4 h-4" />,
            policy: <Flag className="w-4 h-4" />,
            community: <Users className="w-4 h-4" />,
            news: <Newspaper className="w-4 h-4" />,
            report: <FileText className="w-4 h-4" />,
            insights: <Brain className="w-4 h-4" />,
        };
        return iconMap[category as keyof typeof iconMap] || <Sparkles className="w-4 h-4" />;
    };

    if (isLoading || trendingQueries.length === 0) {
        return (
            <div className="mt-4 relative">
                <div className="relative">
                    {/* <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" /> */}

                    <div className="flex gap-3 overflow-x-auto pb-2 px-2 scroll-smooth no-scrollbar">
                        {[1, 2, 3, 4].map((_, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 h-[72px] w-[280px] rounded-xl 
                                         bg-neutral-50/80 dark:bg-neutral-800/80 
                                         border border-neutral-200/50 dark:border-neutral-700/50
                                         backdrop-blur-md"
                            >
                                <div className="flex items-start gap-3 h-full p-3">
                                    <div
                                        className="w-10 h-10 rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50 
                                                 animate-pulse mt-0.5 flex items-center justify-center"
                                    />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded animate-pulse" />
                                        <div className="h-2.5 w-2/3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded animate-pulse" />
                                        <div className="h-2 w-1/3 bg-neutral-200/50 dark:bg-neutral-700/50 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 relative">
            <div className="relative">
                {/* <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[8]" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[8]" /> */}

                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto pb-2 px-2 scroll-smooth no-scrollbar"
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => {
                        setTimeout(() => setIsPaused(false), 1000);
                    }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {Array(10)
                        .fill(trendingQueries)
                        .flat()
                        .map((query, index) => (
                            <motion.button
                                key={`${index}-${query.text}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    delay: Math.min(index * 0.05, 0.5),
                                    ease: [0.32, 0.72, 0, 1]
                                }}
                                onClick={() => handleExampleClick(query)}
                                className="group flex-shrink-0 w-[280px] h-[72px] 
                                         bg-neutral-50/80 dark:bg-neutral-800/80
                                         backdrop-blur-md rounded-xl
                                         hover:bg-white dark:hover:bg-neutral-700/70
                                         active:scale-[0.98]
                                         transition-all duration-300
                                         border border-neutral-200/50 dark:border-neutral-700/50
                                         hover:border-violet-500/30 dark:hover:border-violet-500/30
                                         hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <div className="flex items-start gap-3 h-full p-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/5 dark:bg-primary/10 
                                                  flex items-center justify-center flex-shrink-0
                                                  group-hover:bg-primary/10 dark:group-hover:bg-primary/20
                                                  transition-colors duration-300">
                                        {getIconForCategory(query.category)}
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="text-sm font-medium leading-snug mb-1 
                                                    text-neutral-800 dark:text-neutral-200
                                                    line-clamp-2">
                                            {query.text}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 capitalize">
                                                {query.category}
                                            </p>
                                            {query.source && (
                                                <>
                                                    <span className="text-[11px] text-neutral-400">•</span>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                        {query.source}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                </div>
            </div>
        </motion.div>
    );
}; 