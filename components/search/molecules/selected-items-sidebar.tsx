import { useSelectedItemsStore } from '@/lib/store/selected-items-store';
import { format } from 'date-fns';
import { Minus, Sparkles, FileText, Trash2, Search, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SelectedItemsSidebarProps {
    onAnalyzeItem?: (title: string, content: string) => void;
    onAnalyzeAll?: (items: { title: string; content: string }[]) => void;
}

const ANALYSIS_PROMPT = "Conduct multidimensional research on the topic below to provide unbiased viewpoints that show the true synergy between ideas:";
const MULTI_ANALYSIS_PROMPT = "Conduct multidimensional research on the following topics to provide unbiased viewpoints that show the true synergy between these ideas:";

export const SelectedItemsSidebar = ({ onAnalyzeItem, onAnalyzeAll }: SelectedItemsSidebarProps) => {
    const { selectedItems, removeItem, clearItems } = useSelectedItemsStore();

    const handleItemClick = (item: { title: string; content: string }) => {
        if (onAnalyzeItem) {
            const analysisText = `${ANALYSIS_PROMPT}\n\nTitle: ${item.title}\n\nContent: ${item.content}`;
            onAnalyzeItem(item.title, analysisText);
        }
    };

    const handleAnalyzeAll = () => {
        if (onAnalyzeAll && selectedItems.length > 0) {
            const combinedText = `${MULTI_ANALYSIS_PROMPT}\n\n${selectedItems.map((item, index) => (
                `${index + 1}. Title: ${item.title}\n   Content: ${item.content}`
            )).join('\n\n')}`;
            onAnalyzeAll(selectedItems.map(item => ({ title: item.title, content: combinedText })));
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-background/95 backdrop-blur-xl border-r border-border flex flex-col h-full relative"
        >
            <div className="p-4 border-b border-border bg-background/50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground/90 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary/70" />
                        <span>Selected</span>
                        <span className="text-sm text-muted-foreground">({selectedItems.length})</span>
                    </h3>
                    <div className="flex items-center gap-2">
                        {selectedItems.length > 0 && (
                            <>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAnalyzeAll}
                                    className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 
                                            transition-colors group"
                                    title="Analyze all selected items"
                                >
                                    <Lightbulb className="w-4 h-4 text-primary group-hover:text-primary/90 transition-colors" />
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearItems}
                                    className="p-1.5 rounded-full bg-muted/20 hover:bg-muted/30 
                                            transition-colors group"
                                >
                                    <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {selectedItems.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-center p-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 
                                          flex items-center justify-center mb-4 border border-primary/20">
                                <FileText className="w-6 h-6 text-primary/70" />
                            </div>
                            <p className="text-sm text-foreground/70 font-medium">No articles selected</p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                                Selected articles from your newsletters will appear here
                            </p>
                        </motion.div>
                    ) : (
                        selectedItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => handleItemClick(item)}
                                className="group relative bg-gradient-to-br from-muted/20 to-muted/10 
                                         rounded-lg p-3 transition-all duration-200
                                         hover:from-muted/30 hover:to-muted/20
                                         border border-border hover:border-border/50
                                         shadow-lg shadow-background/20
                                         cursor-pointer"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.id);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-muted/20 
                                             opacity-0 group-hover:opacity-100 transition-all
                                             hover:bg-muted/30 z-10"
                                >
                                    <Minus className="w-3 h-3 text-foreground/70" />
                                </motion.button>
                                <div className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-primary/50" />
                                    {format(new Date(item.date), 'MMMM d, yyyy')}
                                </div>
                                <div className="text-sm text-foreground/90 font-medium line-clamp-2 leading-snug">
                                    {item.title}
                                </div>
                                {item.content && (
                                    <div 
                                        className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed"
                                        dangerouslySetInnerHTML={{ 
                                            __html: item.content.replace(
                                                /\*\*(.*?)\*\*/g, 
                                                '<span class="text-foreground/80 font-medium">$1</span>'
                                            )
                                        }} 
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 
                                              group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Search className="w-3 h-3 text-primary/70" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </motion.div>
    );
}; 