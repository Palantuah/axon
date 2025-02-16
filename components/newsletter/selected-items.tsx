import { useSelectedItemsStore } from '@/lib/store/selected-items-store';
import { format } from 'date-fns';
import { Minus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';


export const SelectedItems = () => {
    const { selectedItems, removeItem, clearItems } = useSelectedItemsStore();

    if (selectedItems.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-64 right-0 bg-background/90 backdrop-blur-md border-t border-border p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">
                    Selected Articles ({selectedItems.length})
                </h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={clearItems}
                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground 
                                bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        Clear All
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {redirect("/search")}}
                        className={cn(
                            "relative group overflow-hidden",
                            "px-4 py-1.5 rounded-xl",
                            "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent",
                            "border border-primary/20",
                            "text-foreground font-medium",
                            "transition-all duration-300",
                            "ring-1 ring-primary/20",
                            "shadow-[0_0_30px_-5px] shadow-primary/30",
                            "hover:shadow-[0_0_40px_-5px] hover:shadow-primary/40",
                            "hover:border-primary/30",
                            "flex items-center gap-2.5"
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent opacity-0",
                            "group-hover:opacity-100 transition-all duration-300",
                            "blur-sm"
                        )} />
                        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/60 to-primary/60 pointer-events-none" />
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="relative text-base">Tell me the truth</span>
                    </motion.button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {selectedItems.map((item) => (
                    <div
                        key={item.id}
                        className="group relative bg-muted/50 rounded-lg p-3 transition-colors hover:bg-muted/70"
                    >
                        <button
                            onClick={() => removeItem(item.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-muted/80 
                                     opacity-0 group-hover:opacity-100 transition-opacity
                                     hover:bg-muted"
                        >
                            <Minus className="w-3 h-3 text-muted-foreground" />
                        </button>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                            {format(new Date(item.date), 'MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-foreground line-clamp-2">
                            {item.title}
                        </div>
                        {item.content && (
                            <div 
                                className="mt-2 text-xs text-muted-foreground line-clamp-2"
                                dangerouslySetInnerHTML={{ 
                                    __html: item.content.replace(
                                        /\*\*(.*?)\*\*/g, 
                                        '<span class="text-foreground font-medium">$1</span>'
                                    )
                                }} 
                            />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}; 