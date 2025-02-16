import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User2, X, ArrowRight, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageItemProps {
    message: any;
    index: number;
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
}

export const MessageItem: React.FC<MessageItemProps> = ({
    message,
    index,
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
}) => {
    if (message.role !== 'user') return null;

    return (
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
                                    (attachment: any, attachmentIndex: number) => (
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
    );
}; 