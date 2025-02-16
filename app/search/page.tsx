/* eslint-disable @next/next/no-img-element */
'use client';
import 'katex/dist/katex.min.css';

import { InstallPrompt } from '@/components/InstallPrompt';

import { Button } from '@/components/ui/button';

import { cn, SearchGroupId } from '@/lib/utils';
import { CurrencyDollar, Flag, Info, SoccerBall, TennisBall } from '@phosphor-icons/react';
import { useChat, UseChatOptions } from 'ai/react';
import { AnimatePresence, motion } from 'framer-motion';
import { GeistMono } from 'geist/font/mono';
import {
    AlignLeft,
    ArrowRight,
    Brain,
    Check,
    ChevronDown,
    Code,
    Copy,
    Edit2,
    Globe,
    Heart,
    Loader2,
    Moon,
    Pause,
    TrendingUp,
    Sparkles,
    Sun,
    Plus,
    Users,
    User2,
    X,
} from 'lucide-react';
import Marked, { ReactRenderer } from 'marked-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { parseAsString, useQueryState } from 'nuqs';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Latex from 'react-latex-next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { toast } from 'sonner';
import { fetchMetadata, suggestQuestions } from '@/app/actions';
import { TrendingQuery } from '@/app/api/trending/route';
import { ReasoningUIPart, ToolInvocationUIPart, TextUIPart } from '@ai-sdk/ui-utils';

import FormComponent from '@/components/ui/form-component';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';

import { ToolInvocationListView } from '@/components/search/molecules/tool-invocations';
import { PreferencesModal } from '@/components/preferences-modal';
import { Footer } from '@/components/ui/footer';

export const maxDuration = 120;

interface Attachment {
    name: string;
    contentType: string;
    url: string;
    size: number;
}

const HomeContent = () => {
    const [query] = useQueryState('query', parseAsString.withDefault(''));
    const [q] = useQueryState('q', parseAsString.withDefault(''));
    const [model] = useQueryState('model', parseAsString.withDefault('axon-default'));

    const initialState = useMemo(
        () => ({
            query: query || q,
            model: model,
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }),
        [],
    );

    const lastSubmittedQueryRef = useRef(initialState.query);
    const [hasSubmitted, setHasSubmitted] = useState(() => !!initialState.query);
    const [selectedModel, setSelectedModel] = useState(initialState.model);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [isEditingMessage, setIsEditingMessage] = useState(false);
    const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const initializedRef = useRef(false);
    const [selectedGroup, setSelectedGroup] = useState<SearchGroupId>('web');

    const CACHE_KEY = 'trendingQueriesCache';
    const CACHE_DURATION = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

    interface TrendingQueriesCache {
        data: TrendingQuery[];
        timestamp: number;
    }

    const getTrendingQueriesFromCache = (): TrendingQueriesCache | null => {
        if (typeof window === 'undefined') return null;

        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsedCache = JSON.parse(cached) as TrendingQueriesCache;
        const now = Date.now();

        if (now - parsedCache.timestamp > CACHE_DURATION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return parsedCache;
    };

    useEffect(() => {
        console.log('selectedModel', selectedModel);
    }, [selectedModel]);

    const [trendingQueries, setTrendingQueries] = useState<TrendingQuery[]>([]);

    const chatOptions: UseChatOptions = useMemo(
        () => ({
            maxSteps: 5,
            experimental_throttle: 500,
            body: {
                model: selectedModel,
                group: selectedGroup,
            },
            onFinish: async (message, { finishReason }) => {
                console.log('[finish reason]:', finishReason);
                if (message.content && (finishReason === 'stop' || finishReason === 'length')) {
                    const newHistory = [
                        { role: 'user', content: lastSubmittedQueryRef.current },
                        { role: 'assistant', content: message.content },
                    ];
                    const { questions } = await suggestQuestions(newHistory);
                    setSuggestedQuestions(questions);
                }
            },
            onError: (error) => {
                console.error('Chat error:', error.cause, error.message);
                toast.error('An error occurred.', {
                    description: `Oops! An error occurred while processing your request. ${error.message}`,
                });
            },
        }),
        [selectedModel, selectedGroup],
    );

    const { isLoading, input, messages, setInput, append, handleSubmit, setMessages, reload, stop, data, setData } =
        useChat(chatOptions);

    useEffect(() => {
        if (!initializedRef.current && initialState.query && !messages.length) {
            initializedRef.current = true;
            setHasSubmitted(true);
            console.log('[initial query]:', initialState.query);
            append({
                content: initialState.query,
                role: 'user',
            });
        }
    }, [initialState.query, append, setInput, messages.length]);

    useEffect(() => {
        const fetchTrending = async () => {
            const cached = getTrendingQueriesFromCache();
            if (cached) {
                setTrendingQueries(cached.data);
                return;
            }

            try {
                const res = await fetch('/api/trending');
                if (!res.ok) throw new Error('Failed to fetch trending queries');
                const data = await res.json();

                const cacheData: TrendingQueriesCache = {
                    data,
                    timestamp: Date.now(),
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

                setTrendingQueries(data);
            } catch (error) {
                console.error('Error fetching trending queries:', error);
                setTrendingQueries([]);
            }
        };

        fetchTrending();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ThemeToggle: React.FC = () => {
        const { theme, setTheme } = useTheme();

        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    };

    const CopyButton = ({ text }: { text: string }) => {
        const [isCopied, setIsCopied] = useState(false);

        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                    if (!navigator.clipboard) {
                        return;
                    }
                    await navigator.clipboard.writeText(text);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                    toast.success('Copied to clipboard');
                }}
                className="h-8 px-2 text-xs rounded-full"
            >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
        );
    };

    interface MarkdownRendererProps {
        content: string;
    }

    interface CitationLink {
        text: string;
        link: string;
    }

    interface LinkMetadata {
        title: string;
        description: string;
    }

    const isValidUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
        const [metadataCache, setMetadataCache] = useState<Record<string, LinkMetadata>>({});

        const citationLinks = useMemo<CitationLink[]>(() => {
            return Array.from(content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)).map(([_, text, link]) => ({ text, link }));
        }, [content]);

        const fetchMetadataWithCache = useCallback(
            async (url: string) => {
                if (metadataCache[url]) {
                    return metadataCache[url];
                }
                const metadata = await fetchMetadata(url);
                if (metadata) {
                    setMetadataCache((prev) => ({ ...prev, [url]: metadata }));
                }
                return metadata;
            },
            [metadataCache],
        );

        interface CodeBlockProps {
            language: string | undefined;
            children: string;
        }

        const CodeBlock = React.memo(
            ({ language, children }: CodeBlockProps) => {
                const [isCopied, setIsCopied] = useState(false);
                const { theme } = useTheme();

                const handleCopy = useCallback(async () => {
                    await navigator.clipboard.writeText(children);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                }, [children]);

                return (
                    <div className="group my-3">
                        <div className="grid grid-rows-[auto,1fr] rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
                                <div className="px-2 py-0.5 text-xs font-medium bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-500 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700">
                                    {language || 'text'}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`
                      px-2 py-1.5
                      rounded-md text-xs
                      transition-colors duration-200
                      ${
                          isCopied
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }
                      opacity-0 group-hover:opacity-100
                      hover:bg-neutral-200 dark:hover:bg-neutral-700
                      flex items-center gap-1.5
                    `}
                                    aria-label={isCopied ? 'Copied!' : 'Copy code'}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5" />
                                            <span>Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className={`overflow-x-auto ${GeistMono.className}`}>
                                <SyntaxHighlighter
                                    language={language || 'text'}
                                    style={theme === 'dark' ? atomDark : vs}
                                    showLineNumbers
                                    wrapLines
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        fontSize: '0.875rem',
                                        background: theme === 'dark' ? '#171717' : '#ffffff',
                                        lineHeight: 1.6,
                                        borderBottomLeftRadius: '0.5rem',
                                        borderBottomRightRadius: '0.5rem',
                                    }}
                                    lineNumberStyle={{
                                        minWidth: '2.5em',
                                        paddingRight: '1em',
                                        color: theme === 'dark' ? '#404040' : '#94a3b8',
                                        userSelect: 'none',
                                    }}
                                    codeTagProps={{
                                        style: {
                                            color: theme === 'dark' ? '#e5e5e5' : '#1e293b',
                                            fontFamily: 'var(--font-mono)',
                                        },
                                    }}
                                >
                                    {children}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                );
            },
            (prevProps, nextProps) =>
                prevProps.children === nextProps.children && prevProps.language === nextProps.language,
        );

        CodeBlock.displayName = 'CodeBlock';

        const LinkPreview = ({ href }: { href: string }) => {
            const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
            const [isLoading, setIsLoading] = useState(false);

            React.useEffect(() => {
                setIsLoading(true);
                fetchMetadataWithCache(href).then((data) => {
                    setMetadata(data);
                    setIsLoading(false);
                });
            }, [href]);

            if (isLoading) {
                return (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-500 dark:text-neutral-400" />
                    </div>
                );
            }

            const domain = new URL(href).hostname;

            return (
                <div className="flex flex-col space-y-2 bg-white dark:bg-neutral-800 rounded-md shadow-md overflow-hidden">
                    <div className="flex items-center space-x-2 p-3 bg-neutral-100 dark:bg-neutral-700">
                        <Image
                            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
                            alt="Favicon"
                            width={20}
                            height={20}
                            className="rounded-sm"
                        />
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 truncate">
                            {domain}
                        </span>
                    </div>
                    <div className="px-3 pb-3">
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2">
                            {metadata?.title || 'Untitled'}
                        </h3>
                        {metadata?.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                                {metadata.description}
                            </p>
                        )}
                    </div>
                </div>
            );
        };

        const renderHoverCard = (href: string, text: React.ReactNode, isCitation: boolean = false) => {
            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={
                                isCitation
                                    ? 'cursor-help text-sm text-primary py-0.5 px-1.5 m-0 bg-neutral-200 dark:bg-neutral-700 rounded-full no-underline'
                                    : 'text-teal-600 dark:text-teal-400 no-underline hover:underline'
                            }
                        >
                            {text}
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent side="top" align="start" className="w-80 p-0 shadow-lg">
                        <LinkPreview href={href} />
                    </HoverCardContent>
                </HoverCard>
            );
        };

        const renderer: Partial<ReactRenderer> = {
            text(text: string) {
                if (!text.includes('$')) return text;
                return (
                    <Latex
                        delimiters={[
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                        ]}
                    >
                        {text}
                    </Latex>
                );
            },
            paragraph(children) {
                if (typeof children === 'string' && children.includes('$')) {
                    return (
                        <p className="my-4">
                            <Latex
                                delimiters={[
                                    { left: '$$', right: '$$', display: true },
                                    { left: '$', right: '$', display: false },
                                ]}
                            >
                                {children}
                            </Latex>
                        </p>
                    );
                }
                return <p className="my-4">{children}</p>;
            },
            code(children, language) {
                return <CodeBlock language={language}>{String(children)}</CodeBlock>;
            },
            link(href, text) {
                const citationIndex = citationLinks.findIndex((link) => link.link === href);
                if (citationIndex !== -1) {
                    return <sup>{renderHoverCard(href, citationIndex + 1, true)}</sup>;
                }
                return isValidUrl(href) ? (
                    renderHoverCard(href, text)
                ) : (
                    <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {text}
                    </a>
                );
            },
            heading(children, level) {
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
                const className = `text-${4 - level}xl font-bold my-4 text-neutral-800 dark:text-neutral-100`;
                return <HeadingTag className={className}>{children}</HeadingTag>;
            },
            list(children, ordered) {
                const ListTag = ordered ? 'ol' : 'ul';
                return (
                    <ListTag className="list-inside list-disc my-4 pl-4 text-neutral-800 dark:text-neutral-200">
                        {children}
                    </ListTag>
                );
            },
            listItem(children) {
                return <li className="my-2 text-neutral-800 dark:text-neutral-200">{children}</li>;
            },
            blockquote(children) {
                return (
                    <blockquote className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic my-4 text-neutral-700 dark:text-neutral-300">
                        {children}
                    </blockquote>
                );
            },
        };

        return (
            <div className="markdown-body dark:text-neutral-200 font-sans">
                <Marked renderer={renderer}>{content}</Marked>
            </div>
        );
    };

    const lastUserMessageIndex = useMemo(() => {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                return i;
            }
        }
        return -1;
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            const userScrolled = window.innerHeight + window.scrollY < document.body.offsetHeight;
            if (!userScrolled && bottomRef.current && (messages.length > 0 || suggestedQuestions.length > 0)) {
                bottomRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [messages, suggestedQuestions]);

    const handleExampleClick = async (card: TrendingQuery) => {
        const exampleText = card.text;
        lastSubmittedQueryRef.current = exampleText;
        setHasSubmitted(true);
        setSuggestedQuestions([]);
        await append({
            content: exampleText.trim(),
            role: 'user',
        });
    };

    const handleSuggestedQuestionClick = useCallback(
        async (question: string) => {
            setHasSubmitted(true);
            setSuggestedQuestions([]);

            await append({
                content: question.trim(),
                role: 'user',
            });
        },
        [append],
    );

    const handleMessageEdit = useCallback(
        (index: number) => {
            setIsEditingMessage(true);
            setEditingMessageIndex(index);
            setInput(messages[index].content);
        },
        [messages, setInput],
    );

    const handleMessageUpdate = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (input.trim()) {
                // Create new messages array up to the edited message
                const newMessages = messages.slice(0, editingMessageIndex + 1);
                // Update the edited message
                newMessages[editingMessageIndex] = { ...newMessages[editingMessageIndex], content: input.trim() };
                // Set the new messages array
                setMessages(newMessages);
                // Reset editing state
                setIsEditingMessage(false);
                setEditingMessageIndex(-1);
                // Store the edited message for reference
                lastSubmittedQueryRef.current = input.trim();
                // Clear input
                setInput('');
                // Reset suggested questions
                setSuggestedQuestions([]);
                // Trigger a new chat completion without appending
                reload();
            } else {
                toast.error('Please enter a valid message.');
            }
        },
        [input, messages, editingMessageIndex, setMessages, reload, setInput],
    );

    const AboutButton = () => {
        return (
            <Link href="/">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                >
                    <Info className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </Button>
            </Link>
        );
    };

    interface NavbarProps {}

    const Navbar: React.FC<NavbarProps> = () => {
        return (
            <div
                className={cn(
                    'fixed top-0 left-0 right-0 z-[60] flex justify-between items-center p-4',
                    // Add opaque background only after submit
                    hasSubmitted
                        ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                        : 'bg-background',
                )}
            >
                <div className="flex items-center gap-4">
                    <Link href="/new">
                        <Button
                            type="button"
                            variant={'secondary'}
                            className="rounded-full bg-accent hover:bg-accent/80 backdrop-blur-sm group transition-all hover:scale-105 pointer-events-auto"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-all" />
                            <span className="text-sm ml-2 group-hover:block hidden animate-in fade-in duration-300">
                                New
                            </span>
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <PreferencesModal />
                    <AboutButton />
                    <ThemeToggle />
                </div>
            </div>
        );
    };

    const SuggestionCards: React.FC<{
        trendingQueries: TrendingQuery[];
        handleExampleClick: (query: TrendingQuery) => void;
    }> = ({ trendingQueries, handleExampleClick }) => {
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

                if (timestamp - lastScrollTime.current > 16) {
                    const newScrollLeft = scrollRef.current.scrollLeft + 1;

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
                trending: <TrendingUp className="w-3 h-3" />,
                community: <Users className="w-3 h-3" />,
                science: <Brain className="w-3 h-3" />,
                tech: <Code className="w-3 h-3" />,
                travel: <Globe className="w-3 h-3" />,
                politics: <Flag className="w-3 h-3" />,
                health: <Heart className="w-3 h-3" />,
                sports: <TennisBall className="w-3 h-3" />,
                finance: <CurrencyDollar className="w-3 h-3" />,
                football: <SoccerBall className="w-3 h-3" />,
            };
            return iconMap[category as keyof typeof iconMap] || <Sparkles className="w-3 h-3" />;
        };

        if (isLoading || trendingQueries.length === 0) {
            return (
                <div className="mt-4 relative">
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

                        <div className="flex gap-2 overflow-x-auto pb-2 px-2 scroll-smooth no-scrollbar">
                            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 h-12 w-[120px] rounded-lg bg-neutral-50/80 dark:bg-neutral-800/80 
                                                     border border-neutral-200/50 dark:border-neutral-700/50"
                                >
                                    <div className="flex items-start gap-1.5 h-full p-2">
                                        <div
                                            className="w-4 h-4 rounded-md bg-neutral-200/50 dark:bg-neutral-700/50 
                                                              animate-pulse mt-0.5"
                                        />
                                        <div className="space-y-1 flex-1">
                                            <div className="h-2.5 bg-neutral-200/50 dark:bg-neutral-700/50 rounded animate-pulse" />
                                            <div className="h-2 w-1/2 bg-neutral-200/50 dark:bg-neutral-700/50 rounded animate-pulse" />
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
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[8]" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[8]" />

                    <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 px-2 scroll-smooth no-scrollbar"
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => {
                            // Add a small delay before resuming animation on mobile
                            setTimeout(() => setIsPaused(false), 1000);
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {Array(20)
                            .fill(trendingQueries)
                            .flat()
                            .map((query, index) => (
                                <motion.button
                                    key={`${index}-${query.text}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: Math.min(index * 0.02, 0.5), // Cap the maximum delay
                                        ease: 'easeOut',
                                    }}
                                    onClick={() => handleExampleClick(query)}
                                    className="group flex-shrink-0 w-[120px] h-12 bg-neutral-50/80 dark:bg-neutral-800/80
                                         backdrop-blur-sm rounded-lg
                                         hover:bg-white dark:hover:bg-neutral-700/70
                                         active:scale-95
                                         transition-all duration-200
                                         border border-neutral-200/50 dark:border-neutral-700/50"
                                    style={{ WebkitTapHighlightColor: 'transparent' }}
                                >
                                    <div className="flex items-start gap-1.5 h-full p-2">
                                        <div className="w-5 h-5 rounded-md bg-primary/10 dark:bg-primary/20 flex items-center justify-center mt-0.5">
                                            {getIconForCategory(query.category)}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <p className="text-xs font-medium truncate leading-tight">{query.text}</p>
                                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 capitalize">
                                                {query.category}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    const handleModelChange = useCallback(
        (newModel: string) => {
            setSelectedModel(newModel);
            setSuggestedQuestions([]);
            reload({ body: { model: newModel } });
        },
        [reload],
    );

    const resetSuggestedQuestions = useCallback(() => {
        setSuggestedQuestions([]);
    }, []);

    const memoizedMessages = useMemo(() => {
        // Create a shallow copy
        const msgs = [...messages];

        return msgs.filter((message) => {
            // Keep all user messages
            if (message.role === 'user') return true;

            // For assistant messages
            if (message.role === 'assistant') {
                // Keep messages that have tool invocations
                if (message.parts?.some((part) => part.type === 'tool-invocation')) {
                    return true;
                }
                // Keep messages that have text parts but no tool invocations
                if (
                    message.parts?.some((part) => part.type === 'text') ||
                    !message.parts?.some((part) => part.type === 'tool-invocation')
                ) {
                    return true;
                }
                return false;
            }
            return false;
        });
    }, [messages]);

    const memoizedSuggestionCards = useMemo(
        () => (
            <SuggestionCards trendingQueries={trendingQueries} handleExampleClick={handleExampleClick} />
            // eslint-disable-next-line react-hooks/exhaustive-deps
        ),
        [trendingQueries],
    );

    // Track visibility state for each reasoning section using messageIndex-partIndex as key
    const [reasoningVisibilityMap, setReasoningVisibilityMap] = useState<Record<string, boolean>>({});

    const renderPart = (
        part: TextUIPart | ReasoningUIPart | ToolInvocationUIPart,
        messageIndex: number,
        partIndex: number,
        parts: (TextUIPart | ReasoningUIPart | ToolInvocationUIPart)[],
        message: any,
        data?: any[],
    ) => {
        if (
            part.type === 'text' &&
            partIndex === 0 &&
            parts.some((p, i) => i > partIndex && p.type === 'tool-invocation')
        ) {
            return null;
        }

        switch (part.type) {
            case 'text':
                return (
                    <div key={`${messageIndex}-${partIndex}-text`}>
                        <div className="flex items-center justify-between mt-5 mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-5 text-primary" />
                                <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                    Answer
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <CopyButton text={part.text} />
                            </div>
                        </div>
                        <MarkdownRenderer content={part.text} />
                    </div>
                );
            case 'reasoning': {
                const sectionKey = `${messageIndex}-${partIndex}`;
                const isComplete = parts[partIndex + 1]?.type === 'text';

                // Auto-expand completed reasoning sections if not manually toggled
                if (isComplete && reasoningVisibilityMap[sectionKey] === undefined) {
                    setReasoningVisibilityMap((prev) => ({
                        ...prev,
                        [sectionKey]: true,
                    }));
                }

                return (
                    <motion.div
                        key={`${messageIndex}-${partIndex}-reasoning`}
                        id={`reasoning-${messageIndex}`}
                        className="mb-4"
                    >
                        <button
                            onClick={() =>
                                setReasoningVisibilityMap((prev) => ({
                                    ...prev,
                                    [sectionKey]: !prev[sectionKey],
                                }))
                            }
                            className="flex items-center justify-between w-full group text-left px-4 py-2 
                                hover:bg-neutral-50 dark:hover:bg-neutral-800/50 
                                border border-neutral-200 dark:border-neutral-800 
                                rounded-lg transition-all duration-200
                                bg-neutral-50/50 dark:bg-neutral-900/50"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                </div>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {isComplete ? 'Reasoned' : 'Reasoning'}
                                </span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 text-neutral-500 transition-transform duration-200',
                                    reasoningVisibilityMap[sectionKey] ? 'rotate-180' : '',
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {reasoningVisibilityMap[sectionKey] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative pl-4 mt-2">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                                        <div className="text-sm italic text-neutral-600 dark:text-neutral-400">
                                            <MarkdownRenderer content={part.reasoning} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            }
            case 'tool-invocation':
                return (
                    <ToolInvocationListView
                        key={`${messageIndex}-${partIndex}-tool`}
                        toolInvocations={[part.toolInvocation]}
                        message={message}
                        data={data}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col !font-sans items-center min-h-screen bg-background text-foreground transition-all duration-500">
            <Navbar />

            <div
                className={`w-full p-2 sm:p-4 ${
                    hasSubmitted ? 'mt-20 sm:mt-16' : 'flex-1 flex items-center justify-center'
                }`}
            >
                <div
                    className={`w-full max-w-[90%] !font-sans sm:max-w-2xl space-y-6 p-0 mx-auto transition-all duration-300 flex flex-col`}
                >
                    {!hasSubmitted && (
                        <div className="text-center !font-sans">
                            <h1 className="text-2xl sm:text-4xl mb-6 text-neutral-800 dark:text-neutral-100 font-syne">
                                What do you want to explore?
                            </h1>
                        </div>
                    )}
                    <AnimatePresence>
                        {!hasSubmitted && (
                            <motion.div
                                initial={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="!mt-4"
                            >
                                <FormComponent
                                    input={input}
                                    setInput={setInput}
                                    attachments={attachments}
                                    setAttachments={setAttachments}
                                    hasSubmitted={hasSubmitted}
                                    setHasSubmitted={setHasSubmitted}
                                    isLoading={isLoading}
                                    handleSubmit={handleSubmit}
                                    fileInputRef={fileInputRef}
                                    inputRef={inputRef}
                                    stop={stop}
                                    messages={memoizedMessages}
                                    append={append}
                                    selectedModel={selectedModel}
                                    setSelectedModel={handleModelChange}
                                    resetSuggestedQuestions={resetSuggestedQuestions}
                                    lastSubmittedQueryRef={lastSubmittedQueryRef}
                                    selectedGroup={selectedGroup}
                                    setSelectedGroup={setSelectedGroup}
                                    showExperimentalModels={true}
                                />
                                {memoizedSuggestionCards}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4 sm:space-y-6 mb-32">
                        {memoizedMessages.map((message, index) => (
                            <div key={index}>
                                {message.role === 'user' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex items-start gap-2 mb-4 px-2 sm:px-0"
                                    >
                                        <User2 className="size-4 sm:size-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="flex-grow min-w-0">
                                            {isEditingMessage && editingMessageIndex === index ? (
                                                <form onSubmit={handleMessageUpdate} className="w-full">
                                                    <div className="relative flex items-center">
                                                        <Input
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            className="pr-20 h-8 text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                                                            placeholder="Edit your message..."
                                                        />
                                                        <div className="absolute right-1 flex items-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setIsEditingMessage(false);
                                                                    setEditingMessageIndex(-1);
                                                                    setInput('');
                                                                }}
                                                                className="h-6 w-6"
                                                                disabled={isLoading}
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-primary hover:text-primary/80"
                                                                disabled={isLoading}
                                                            >
                                                                <ArrowRight className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-base sm:text-lg font-medium font-sans break-words text-neutral-800 dark:text-neutral-200">
                                                            {message.content}
                                                        </p>
                                                        <div className="flex flex-row gap-2">
                                                            {message.experimental_attachments?.map(
                                                                (attachment, attachmentIndex) => (
                                                                    <div key={attachmentIndex} className="mt-2">
                                                                        {attachment.contentType!.startsWith(
                                                                            'image/',
                                                                        ) && (
                                                                            <img
                                                                                src={attachment.url}
                                                                                alt={
                                                                                    attachment.name ||
                                                                                    `Attachment ${attachmentIndex + 1}`
                                                                                }
                                                                                className="max-w-full h-24 sm:h-32 object-fill rounded-lg"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!isEditingMessage && index === lastUserMessageIndex && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleMessageEdit(index)}
                                                            className="h-6 w-6 text-neutral-500 dark:text-neutral-400 hover:text-primary flex-shrink-0"
                                                            disabled={isLoading}
                                                        >
                                                            <Edit2 className="size-4 sm:size-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {message.role === 'assistant' &&
                                    message.parts?.map((part, partIndex) =>
                                        renderPart(
                                            part as TextUIPart | ReasoningUIPart | ToolInvocationUIPart,
                                            index,
                                            partIndex,
                                            message.parts as (TextUIPart | ReasoningUIPart | ToolInvocationUIPart)[],
                                            message,
                                            data,
                                        ),
                                    )}
                            </div>
                        ))}
                        {suggestedQuestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="w-full max-w-xl sm:max-w-2xl"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <AlignLeft className="w-5 h-5 text-primary" />
                                    <h2 className="font-semibold text-base text-neutral-800 dark:text-neutral-200">
                                        Suggested questions
                                    </h2>
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    {suggestedQuestions.map((question, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="w-fit font-medium rounded-2xl p-1 justify-start text-left h-auto py-2 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 whitespace-normal"
                                            onClick={() => handleSuggestedQuestionClick(question)}
                                        >
                                            {question}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                    <div ref={bottomRef} />
                </div>

                <AnimatePresence>
                    {hasSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                            className="fixed bottom-4 left-0 right-0 w-full max-w-[90%] sm:max-w-2xl mx-auto"
                        >
                            <FormComponent
                                input={input}
                                setInput={setInput}
                                attachments={attachments}
                                setAttachments={setAttachments}
                                hasSubmitted={hasSubmitted}
                                setHasSubmitted={setHasSubmitted}
                                isLoading={isLoading}
                                handleSubmit={handleSubmit}
                                fileInputRef={fileInputRef}
                                inputRef={inputRef}
                                stop={stop}
                                messages={messages}
                                append={append}
                                selectedModel={selectedModel}
                                setSelectedModel={handleModelChange}
                                resetSuggestedQuestions={resetSuggestedQuestions}
                                lastSubmittedQueryRef={lastSubmittedQueryRef}
                                selectedGroup={selectedGroup}
                                setSelectedGroup={setSelectedGroup}
                                showExperimentalModels={false}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex bg-background size-full justify-center items-center">
                <Footer />
            </div>

        </div>
    );
};

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="flex flex-col items-center gap-6 p-8">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 animate-pulse">Loading...</p>
        </div>
    </div>
);

const Home = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <HomeContent />
            <InstallPrompt />
        </Suspense>
    );
};

export default Home;
