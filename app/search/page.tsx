/* eslint-disable @next/next/no-img-element */
'use client';
import 'katex/dist/katex.min.css';

import { InstallPrompt } from '@/components/InstallPrompt';
import { SearchGroupId } from '@/lib/utils';
import { TrendingQuery } from '@/lib/types';
import { useChat, UseChatOptions } from '@ai-sdk/react'
import { AnimatePresence, motion } from 'framer-motion';
import { parseAsString, useQueryState } from 'nuqs';
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { suggestQuestions } from '@/app/actions';
import FormComponent from '@/components/ui/form-component';
import { Navbar } from '@/components/search/molecules/navbar';
import { SuggestionCards } from '@/components/search/molecules/suggestion-cards';
import { MessageList } from '@/components/search/molecules/message-list';
import { SelectedItemsSidebar } from '@/components/search/molecules/selected-items-sidebar';
import { toast } from 'sonner';
import { GradientBackground } from '@/components/search/molecules/gradient';
import { cn } from '@/lib/utils';

export const maxDuration = 120;

interface Attachment {
    name: string;
    contentType: string;
    url: string;
    size: number;
}

const DEFAULT_TRENDING_QUERIES: TrendingQuery[] = [
    {
        icon: 'sparkles',
        text: 'Global Climate Agreement Reached',
        category: 'politics',
    },
    {
        icon: 'code',
        text: 'New AI Model Breaks Records',
        category: 'tech',
    },
    {
        icon: 'globe',
        text: 'Stock Markets Hit All-Time High',
        category: 'finance',
    },
    {
        icon: 'sparkles',
        text: 'Major Sports Championship Results',
        category: 'sports',
    },
    {
        icon: 'globe',
        text: 'Breakthrough in Cancer Research',
        category: 'health',
    },
    {
        icon: 'code',
        text: 'Space Mission Makes New Discovery',
        category: 'science',
    },
];

const HomeContent = () => {
    const [query] = useQueryState('query', parseAsString.withDefault(''));
    const [q] = useQueryState('q', parseAsString.withDefault(''));
    const [model] = useQueryState('model', parseAsString.withDefault('axon-default'));

    const initialState = useMemo(
        () => ({
            query: query || q,
            model: model,
        }),
        [model, q, query],
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

    const [trendingQueries, setTrendingQueries] = useState<TrendingQuery[]>([]);

    useEffect(() => {
        setTrendingQueries(DEFAULT_TRENDING_QUERIES);
    }, []);

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
            onError: (error: any) => {
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

    const handleExampleClick = useCallback(async (card: TrendingQuery) => {
        const exampleText = card.text;
        lastSubmittedQueryRef.current = exampleText;
        setHasSubmitted(true);
        setSuggestedQuestions([]);
        await append({
            content: exampleText.trim(),
            role: 'user',
        });
    }, [append, setHasSubmitted, setSuggestedQuestions]);

    const trendingCards = useMemo(() => {
        return trendingQueries.map((card) => ({
            ...card,
            onClick: () => handleExampleClick(card),
        }));
    }, [trendingQueries, handleExampleClick]);

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
        () => <SuggestionCards trendingQueries={trendingQueries} handleExampleClick={handleExampleClick} />,
        [trendingQueries, handleExampleClick],
    );

    const handleAnalyzeItem = useCallback(
        async (title: string, content: string) => {
            setHasSubmitted(true);
            setSuggestedQuestions([]);
            lastSubmittedQueryRef.current = content;
            
            await append({
                content,
                role: 'user',
            });
        },
        [append, setHasSubmitted, setSuggestedQuestions],
    );

    const handleAnalyzeAll = useCallback(
        async (items: { title: string; content: string }[]) => {
            if (items.length === 0) return;
            
            setHasSubmitted(true);
            setSuggestedQuestions([]);
            lastSubmittedQueryRef.current = items[0].content;
            
            await append({
                content: items[0].content,
                role: 'user',
            });
        },
        [append, setHasSubmitted, setSuggestedQuestions],
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <SelectedItemsSidebar 
                onAnalyzeItem={handleAnalyzeItem}
                onAnalyzeAll={handleAnalyzeAll}
            />
            <div className="flex-1 flex flex-col overflow-auto">
                <div className="flex-1 flex flex-col !font-sans items-center text-foreground transition-all duration-500 relative">
                    <GradientBackground />
                    <Navbar hasSubmitted={hasSubmitted} />

                    <div
                        className={`w-full p-2 sm:p-4 z-20 ${
                            hasSubmitted ? 'mt-20 sm:mt-16' : 'flex-1 flex items-center justify-center'
                        }`}
                    >
                        <div
                            className={`w-full max-w-[90%] !font-sans sm:max-w-2xl space-y-6 p-0 mx-auto transition-all duration-300 flex flex-col`}
                        >
                            {!hasSubmitted && (
                                <div className="text-center !font-sans">
                                    <h1 className="text-2xl sm:text-4xl mb-6 text-foreground font-syne">
                                        Uncover truth in all dimensions
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

                            <MessageList
                                messages={memoizedMessages}
                                suggestedQuestions={suggestedQuestions}
                                handleSuggestedQuestionClick={handleSuggestedQuestionClick}
                                isEditingMessage={isEditingMessage}
                                editingMessageIndex={editingMessageIndex}
                                input={input}
                                setInput={setInput}
                                setIsEditingMessage={setIsEditingMessage}
                                setEditingMessageIndex={setEditingMessageIndex}
                                handleMessageEdit={handleMessageEdit}
                                handleMessageUpdate={handleMessageUpdate}
                                isLoading={isLoading}
                                lastUserMessageIndex={lastUserMessageIndex}
                                data={data}
                            />
                            <div ref={bottomRef} />
                        </div>

                        <AnimatePresence>
                            {hasSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="fixed bottom-4 left-64 right-0 w-full max-w-[90%] sm:max-w-2xl mx-auto"
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
                </div>
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
