/* eslint-disable @next/next/no-img-element */
"use client";
import 'katex/dist/katex.min.css';

import MultiSearch from '@/components/multi-search';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Wave } from "@foobar404/wave";
import {XLogo } from '@phosphor-icons/react';
import { TextIcon } from '@radix-ui/react-icons';
import { ToolInvocation } from 'ai';
import { motion } from 'framer-motion';

import {
    AlignLeft,
    ArrowRight,
    Book,
    Brain,
    Building,
    Calculator,
    Calendar,
    Check,
    ChevronDown,
    Code,
    Copy,
    Download,
    Edit2,
    ExternalLink,
    FileText,
    Film,
    Globe,
    Heart,
    Loader2,
    LucideIcon,
    MapPin,
    Moon,
    Pause,
    TrendingUp,
    Tv,
    Sparkles,
    Sun,
    Plus,
    Play,
    Users,
    User2,
    X,
} from 'lucide-react';

import React, {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import ReactMarkdown from 'react-markdown';
import { Tweet } from 'react-tweet';
import {
    generateSpeech,
} from '@/app/actions';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ReasonSearch from '@/components/reason-search';
import { BorderTrail } from '@/components/core/border-trail';
import { TextShimmer } from '@/components/core/text-shimmer';
import { cn } from '@/lib/utils';

interface XResult {
    id: string;
    url: string;
    title: string;
    author?: string;
    publishedDate?: string;
    text: string;
    highlights?: string[];
    tweetId: string;
}

interface AcademicResult {
    title: string;
    url: string;
    author?: string | null;
    publishedDate?: string;
    summary: string;
}

const SearchLoadingState = ({
    icon: Icon,
    text,
    color
}: {
    icon: LucideIcon,
    text: string,
    color: "red" | "green" | "orange" | "violet" | "gray" | "blue"
}) => {
    const colorVariants = {
        red: {
            background: "bg-red-50 dark:bg-red-950",
            border: "from-red-200 via-red-500 to-red-200 dark:from-red-400 dark:via-red-500 dark:to-red-700",
            text: "text-red-500",
            icon: "text-red-500"
        },
        green: {
            background: "bg-green-50 dark:bg-green-950",
            border: "from-green-200 via-green-500 to-green-200 dark:from-green-400 dark:via-green-500 dark:to-green-700",
            text: "text-green-500",
            icon: "text-green-500"
        },
        orange: {
            background: "bg-orange-50 dark:bg-orange-950",
            border: "from-orange-200 via-orange-500 to-orange-200 dark:from-orange-400 dark:via-orange-500 dark:to-orange-700",
            text: "text-orange-500",
            icon: "text-orange-500"
        },
        violet: {
            background: "bg-violet-50 dark:bg-violet-950",
            border: "from-violet-200 via-violet-500 to-violet-200 dark:from-violet-400 dark:via-violet-500 dark:to-violet-700",
            text: "text-violet-500",
            icon: "text-violet-500"
        },
        gray: {
            background: "bg-neutral-50 dark:bg-neutral-950",
            border: "from-neutral-200 via-neutral-500 to-neutral-200 dark:from-neutral-400 dark:via-neutral-500 dark:to-neutral-700",
            text: "text-neutral-500",
            icon: "text-neutral-500"
        },
        blue: {
            background: "bg-blue-50 dark:bg-blue-950",
            border: "from-blue-200 via-blue-500 to-blue-200 dark:from-blue-400 dark:via-blue-500 dark:to-blue-700",
            text: "text-blue-500",
            icon: "text-blue-500"
        }
    };

    const variant = colorVariants[color];

    return (
        <Card className="relative w-full h-[100px] my-4 overflow-hidden shadow-none">
            <BorderTrail
                className={cn(
                    'bg-gradient-to-l',
                    variant.border
                )}
                size={80}
            />
            <CardContent className="p-6">
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "relative h-10 w-10 rounded-full flex items-center justify-center",
                            variant.background
                        )}>
                            <BorderTrail
                                className={cn(
                                    "bg-gradient-to-l",
                                    variant.border
                                )}
                                size={40}
                            />
                            <Icon className={cn("h-5 w-5", variant.icon)} />
                        </div>
                        <div className="space-y-2">
                            <TextShimmer
                                className="text-base font-medium"
                                duration={2}
                            >
                                {text}
                            </TextShimmer>
                            <div className="flex gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse"
                                        style={{
                                            width: `${Math.random() * 40 + 20}px`,
                                            animationDelay: `${i * 0.2}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface VideoDetails {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
    type?: string;
    provider_name?: string;
    provider_url?: string;
    height?: number;
    width?: number;
}

export const ToolInvocationListView = memo(
    ({ toolInvocations, message, data }: { 
        toolInvocations: ToolInvocation[], 
        message: any,
        data?: any[]
    }) => {

        const renderToolInvocation = useCallback(
            (toolInvocation: ToolInvocation, index: number) => {
                const args = JSON.parse(JSON.stringify(toolInvocation.args));
                const result = 'result' in toolInvocation ? JSON.parse(JSON.stringify(toolInvocation.result)) : null;


                if (toolInvocation.toolName === 'x_search') {
                    if (!result) {
                        return <SearchLoadingState
                            icon={XLogo}
                            text="Searching for latest news..."
                            color="gray"
                        />;
                    }

                    const PREVIEW_COUNT = 3;

                    const FullTweetList = memo(() => (
                        <div className="grid gap-4 p-4 sm:max-w-[500px]">
                            {result.map((post: XResult, index: number) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className='[&>div]:m-0'
                                >
                                    <Tweet id={post.tweetId} />
                                </motion.div>
                            ))}
                        </div>
                    ));

                    FullTweetList.displayName = 'FullTweetList';

                    return (
                        <Card className="w-full my-4 overflow-hidden shadow-none">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                                        <XLogo className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle>Latest from X</CardTitle>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {result.length} tweets found
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="relative">
                                <div className="px-4 pb-2 h-72">
                                    <div className="flex flex-nowrap overflow-x-auto gap-4 no-scrollbar">
                                        {result.slice(0, PREVIEW_COUNT).map((post: XResult, index: number) => (
                                            <motion.div
                                                key={post.tweetId}
                                                className="w-[min(100vw-2rem,320px)] flex-none"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <Tweet id={post.tweetId} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-black pointer-events-none" />

                                <div className="absolute bottom-0 inset-x-0 flex items-center justify-center pb-4 pt-20 bg-gradient-to-t from-white dark:from-black to-transparent">
                                    <div className="hidden sm:block">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 bg-white dark:bg-black"
                                                >
                                                    <XLogo className="h-4 w-4" />
                                                    Show all {result.length} tweets
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="right" className="w-[400px] sm:w-[600px] overflow-y-auto !p-0 !z-[70]">
                                                <SheetHeader className='!mt-5 !font-sans'>
                                                    <SheetTitle className='text-center'>All Tweets</SheetTitle>
                                                </SheetHeader>
                                                <FullTweetList />
                                            </SheetContent>
                                        </Sheet>
                                    </div>

                                    <div className="block sm:hidden">
                                        <Drawer>
                                            <DrawerTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2 bg-white dark:bg-black"
                                                >
                                                    <XLogo className="h-4 w-4" />
                                                    Show all {result.length} tweets
                                                </Button>
                                            </DrawerTrigger>
                                            <DrawerContent className="max-h-[85vh] font-sans">
                                                <DrawerHeader>
                                                    <DrawerTitle>All Tweets</DrawerTitle>
                                                </DrawerHeader>
                                                <div className="overflow-y-auto">
                                                    <FullTweetList />
                                                </div>
                                            </DrawerContent>
                                        </Drawer>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                }

                if (toolInvocation.toolName === 'academic_search') {
                    if (!result) {
                        return <SearchLoadingState
                            icon={Book}
                            text="Searching academic papers..."
                            color="violet"
                        />;
                    }

                    return (
                        <Card className="w-full my-4 overflow-hidden">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 flex items-center justify-center backdrop-blur-sm">
                                        <Book className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <CardTitle>Academic Papers</CardTitle>
                                        <p className="text-sm text-muted-foreground">Found {result.results.length} papers</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="px-4 pb-2">
                                <div className="flex overflow-x-auto gap-4 no-scrollbar hover:overflow-x-scroll">
                                    {result.results.map((paper: AcademicResult, index: number) => (
                                        <motion.div
                                            key={paper.url || index}
                                            className="w-[400px] flex-none"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <div className="h-[300px] relative group overflow-y-auto">
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                <div className="h-full relative backdrop-blur-sm bg-background/95 dark:bg-neutral-900/95 border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl p-4 flex flex-col transition-all duration-500 group-hover:border-violet-500/20">
                                                    <h3 className="font-semibold text-xl tracking-tight mb-3 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300">
                                                        {paper.title}
                                                    </h3>

                                                    {paper.author && (
                                                        <div className="mb-3">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                                                <User2 className="h-3.5 w-3.5 text-violet-500" />
                                                                <span className="line-clamp-1">
                                                                    {paper.author.split(';')
                                                                        .slice(0, 2)
                                                                        .join(', ') +
                                                                        (paper.author.split(';').length > 2 ? ' et al.' : '')
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {paper.publishedDate && (
                                                        <div className="mb-4">
                                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                                                <Calendar className="h-3.5 w-3.5 text-violet-500" />
                                                                {new Date(paper.publishedDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex-1 relative mb-4 pl-3">
                                                        <div className="absolute -left-0 top-1 bottom-1 w-[2px] rounded-full bg-gradient-to-b from-violet-500 via-violet-400 to-transparent opacity-50" />
                                                        <p className="text-sm text-muted-foreground line-clamp-4">
                                                            {paper.summary}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => window.open(paper.url, '_blank')}
                                                            className="flex-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 group/btn"
                                                        >
                                                            <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                            View Paper
                                                        </Button>

                                                        {paper.url.includes('arxiv.org') && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => window.open(paper.url.replace('abs', 'pdf'), '_blank')}
                                                                className="bg-neutral-100 dark:bg-neutral-800 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 group/btn"
                                                            >
                                                                <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    );
                }

                if (toolInvocation.toolName === 'currency_converter') {
                    return null;
                }

                if (toolInvocation.toolName === 'reason_search') {
                    const updates = message?.annotations?.filter((a: any) => 
                        a.type === 'research_update'
                    ).map((a: any) => a.data);
                    return <ReasonSearch updates={updates || []} />;
                }

                if (toolInvocation.toolName === 'web_search') {
                    return (
                        <div className="mt-4">
                            <MultiSearch 
                                result={result} 
                                args={args} 
                                annotations={message?.annotations?.filter(
                                    (a: any) => a.type === 'query_completion'
                                ) || []}
                            />
                        </div>
                    );
                }

                if (toolInvocation.toolName === 'retrieve') {
                    if (!result) {
                        return (
                            <div className="border border-neutral-200 rounded-xl my-4 p-4 dark:border-neutral-800 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900/90">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-10 h-10">
                                        <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-lg" />
                                        <Globe className="h-5 w-5 text-primary/70 absolute inset-0 m-auto" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-md" />
                                        <div className="space-y-1.5">
                                            <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-md" />
                                            <div className="h-3 w-2/3 bg-neutral-100 dark:bg-neutral-800/50 animate-pulse rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="border border-neutral-200 rounded-xl my-4 overflow-hidden dark:border-neutral-800 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-900/90">
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-lg" />
                                        <img
                                            className="h-5 w-5 absolute inset-0 m-auto"
                                            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(result.results[0].url)}`}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                                            {result.results[0].title}
                                        </h2>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                                            {result.results[0].description}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                                {result.results[0].language || 'Unknown'}
                                            </span>
                                            <a
                                                href={result.results[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                View source
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-neutral-200 dark:border-neutral-800">
                                <details className="group">
                                    <summary className="w-full px-4 py-2 cursor-pointer text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TextIcon className="h-4 w-4 text-neutral-400" />
                                            <span>View content</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                                    </summary>
                                    <div className="max-h-[50vh] overflow-y-auto p-4 bg-neutral-50/50 dark:bg-neutral-800/30">
                                        <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>{result.results[0].content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </div>
                    );
                }
                if (toolInvocation.toolName === 'text_translate') {
                    return <TranslationTool toolInvocation={toolInvocation} result={result} />;
                }


                return null;
            },
            [message]
        );

        const TranslationTool: React.FC<{ toolInvocation: ToolInvocation; result: any }> = ({ toolInvocation, result }) => {
            const [isPlaying, setIsPlaying] = useState(false);
            const [audioUrl, setAudioUrl] = useState<string | null>(null);
            const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
            const audioRef = useRef<HTMLAudioElement | null>(null);
            const canvasRef = useRef<HTMLCanvasElement | null>(null);
            const waveRef = useRef<Wave | null>(null);

            useEffect(() => {
                const _audioRef = audioRef.current
                return () => {
                    if (_audioRef) {
                        _audioRef.pause();
                        _audioRef.src = '';
                    }
                };
            }, []);

            useEffect(() => {
                if (audioUrl && audioRef.current && canvasRef.current) {
                    waveRef.current = new Wave(audioRef.current, canvasRef.current);
                    waveRef.current.addAnimation(new waveRef.current.animations.Lines({
                        lineColor: "rgb(203, 113, 93)",
                        lineWidth: 2,
                        mirroredY: true,
                        count: 100,
                    }));
                }
            }, [audioUrl]);

            const handlePlayPause = async () => {
                if (!audioUrl && !isGeneratingAudio) {
                    setIsGeneratingAudio(true);
                    try {
                        const { audio } = await generateSpeech(result.translatedText, 'alloy');
                        setAudioUrl(audio);
                        setIsGeneratingAudio(false);
                    } catch (error) {
                        console.error("Error generating speech:", error);
                        setIsGeneratingAudio(false);
                    }
                } else if (audioRef.current) {
                    if (isPlaying) {
                        audioRef.current.pause();
                    } else {
                        audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                }
            };

            const handleReset = () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    setIsPlaying(false);
                }
            };

            if (!result) {
                return (
                    <Card className="w-full my-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <CardContent className="flex items-center justify-center h-24">
                            <div className="animate-pulse flex items-center">
                                <div className="h-4 w-4 bg-primary rounded-full mr-2"></div>
                                <div className="h-4 w-32 bg-primary rounded"></div>
                            </div>
                        </CardContent>
                    </Card>
                );
            }

            return (
                <Card className="w-full my-4 shadow-none bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="w-full h-24 bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                                <canvas ref={canvasRef} width="800" height="200" className="w-full h-full" />
                            </div>
                            <div className="flex text-left gap-3 items-center justify-center text-pretty">
                                <div className="flex justify-center space-x-2">
                                    <Button
                                        onClick={handlePlayPause}
                                        disabled={isGeneratingAudio}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm w-24 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                                    >
                                        {isGeneratingAudio ? (
                                            "Generating..."
                                        ) : isPlaying ? (
                                            <><Pause className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Pause</>
                                        ) : (
                                            <><Play className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Play</>
                                        )}
                                    </Button>
                                </div>
                                <div className='text-sm text-neutral-800 dark:text-neutral-200'>
                                    The phrase <span className='font-semibold'>{toolInvocation.args.text}</span> translates from <span className='font-semibold'>{result.detectedLanguage}</span> to <span className='font-semibold'>{toolInvocation.args.to}</span> as <span className='font-semibold'>{result.translatedText}</span> in <span className='font-semibold'>{toolInvocation.args.to}</span>.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    {audioUrl && (
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => { setIsPlaying(false); handleReset(); }}
                        />
                    )}
                </Card>
            );
        };

        return (
            <>
                {toolInvocations.map(
                    (toolInvocation: ToolInvocation, toolIndex: number) => (
                        <div key={`tool-${toolIndex}`}>
                            {renderToolInvocation(toolInvocation, toolIndex)}
                        </div>
                    )
                )}
            </>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.toolInvocations === nextProps.toolInvocations &&
               prevProps.message === nextProps.message;
    }
);

ToolInvocationListView.displayName = 'ToolInvocationListView';
