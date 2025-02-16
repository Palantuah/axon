import { motion } from 'framer-motion';
import { AlignLeft, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { MessageItem } from './message-item';
import { ToolInvocationListView } from './tool-invocations';
import { MarkdownRenderer } from './markdown-renderer';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface MessageListProps {
    messages: any[];
    suggestedQuestions: string[];
    handleSuggestedQuestionClick: (question: string) => void;
    isEditingMessage: boolean;
    editingMessageIndex: number;
    input: string;
    setInput: (input: string) => void;
    setIsEditingMessage: (isEditing: boolean) => void;
    setEditingMessageIndex: (index: number) => void;
    handleMessageEdit: (index: number) => void;
    handleMessageUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
    lastUserMessageIndex: number;
    data?: any[];
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    suggestedQuestions,
    handleSuggestedQuestionClick,
    isEditingMessage,
    editingMessageIndex,
    input,
    setInput,
    setIsEditingMessage,
    setEditingMessageIndex,
    handleMessageEdit,
    handleMessageUpdate,
    isLoading,
    lastUserMessageIndex,
    data,
}) => {
    const [reasoningVisibilityMap, setReasoningVisibilityMap] = useState<Record<string, boolean>>({});

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

    const renderPart = (
        part: any,
        messageIndex: number,
        partIndex: number,
        parts: any[],
        message: any,
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
        <div className="space-y-4 sm:space-y-6 mb-32">
            {messages.map((message, index) => (
                <div key={index}>
                    {message.role === 'user' && (
                        <MessageItem
                            message={message}
                            index={index}
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
                        />
                    )}

                    {message.role === 'assistant' &&
                        message.parts?.map((part: any, partIndex: number) =>
                            renderPart(part, index, partIndex, message.parts, message),
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
    );
}; 