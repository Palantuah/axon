'use client';

import { motion } from 'framer-motion';
import type { Article, NewsletterSection } from '@/lib/newsletter-utils';
import { cn } from '@/lib/utils';
import { TextMorph } from '@/components/core/text-morph';
import { CalendarDays, Tag } from 'lucide-react';
import { useNewsletterStore } from '@/lib/store/newsletter-store';
import { useSelectedItemsStore, SelectedNewsItem } from '@/lib/store/selected-items-store';

const priorityConfig = {
    1: {
        lightColor: 'rgb(239, 68, 68)',
        darkColor: 'rgb(248, 113, 113)',
        gradient: 'from-red-500/20 to-transparent',
        label: 'Breaking'
    },
    2: {
        lightColor: 'rgb(234, 179, 8)',
        darkColor: 'rgb(250, 204, 21)',
        gradient: 'from-yellow-500/20 to-transparent',
        label: 'Important'
    },
    3: {
        lightColor: 'rgb(34, 197, 94)',
        darkColor: 'rgb(74, 222, 128)',
        gradient: 'from-green-500/20 to-transparent',
        label: 'Update'
    }
} as const;

interface FormattedNewsletterProps {
    sections: NewsletterSection[];
}

export const FormattedNewsletter = ({ sections }: FormattedNewsletterProps) => {
    const { selectedDigestId } = useNewsletterStore();
    const { addItem, removeItem, hasItem } = useSelectedItemsStore();

    const handleItemClick = (article: Article) => {
        const itemId = `${selectedDigestId}-${article.title}`;
        
        if (hasItem(itemId)) {
            removeItem(itemId);
        } else {
            const item: SelectedNewsItem = {
                id: itemId,
                title: article.title,
                newsletterId: selectedDigestId!,
                date: article.timestamp || new Date().toISOString(),
                content: article.content
            };
            addItem(item);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-4">
                    <h2 className="text-xl font-medium text-foreground mb-4">
                        {section.category}
                    </h2>
                    <div className="space-y-4">
                        {section.articles.map((article, articleIndex) => {
                            const itemId = `${selectedDigestId}-${article.title}`;
                            const isSelected = hasItem(itemId);
                            const priorityColors = priorityConfig[article.priority];

                            return (
                                <motion.article
                                    key={articleIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: articleIndex * 0.05 }}
                                    onClick={() => handleItemClick(article)}
                                    className={cn(
                                        "group relative overflow-hidden rounded-xl cursor-pointer",
                                        "bg-gradient-to-br from-muted/30 to-muted/10",
                                        "border border-border hover:border-border/50",
                                        "transition-all duration-300",
                                        isSelected && [
                                            "ring-2 ring-offset-0",
                                            "bg-gradient-to-br from-muted/50 to-muted/30",
                                            "border-transparent",
                                            "shadow-[0_0_25px_-5px] shadow-muted/10",
                                        ],
                                        isSelected && article.priority === 1 && [
                                            "ring-red-500/50",
                                            "shadow-red-500/30",
                                            "after:absolute after:inset-0 after:rounded-xl",
                                            "after:shadow-[inset_0_0_15px_-3px] after:shadow-red-500/20",
                                            "after:pointer-events-none"
                                        ],
                                        isSelected && article.priority === 2 && [
                                            "ring-yellow-500/50",
                                            "shadow-yellow-500/30",
                                            "after:absolute after:inset-0 after:rounded-xl",
                                            "after:shadow-[inset_0_0_15px_-3px] after:shadow-yellow-500/20",
                                            "after:pointer-events-none"
                                        ],
                                        isSelected && article.priority === 3 && [
                                            "ring-green-500/50",
                                            "shadow-green-500/30",
                                            "after:absolute after:inset-0 after:rounded-xl",
                                            "after:shadow-[inset_0_0_15px_-3px] after:shadow-green-500/20",
                                            "after:pointer-events-none"
                                        ]
                                    )}
                                >
                                    {isSelected && (
                                        <div className={cn(
                                            "absolute inset-0 rounded-xl opacity-30",
                                            "bg-gradient-to-br from-transparent via-transparent",
                                            article.priority === 1 && "to-red-500/20",
                                            article.priority === 2 && "to-yellow-500/20",
                                            article.priority === 3 && "to-green-500/20"
                                        )} />
                                    )}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-0",
                                        "group-hover:opacity-100 transition-opacity duration-300",
                                        priorityConfig[article.priority].gradient
                                    )} />
                                    
                                    <div className="relative p-6 space-y-4">
                                        {/* Priority Indicator */}
                                        <div 
                                            className="absolute -left-1 top-0 bottom-0 w-1 transition-colors duration-300"
                                            style={{ 
                                                backgroundColor: `var(--${priorityColors.darkColor}, ${priorityColors.lightColor})`
                                            }} 
                                        />

                                        {/* Title and Priority Label */}
                                        <div className="flex items-start justify-between gap-4">
                                            <h1 className="text-lg font-medium text-foreground leading-snug flex-1">
                                                {article.title}
                                            </h1>
                                            <span 
                                                className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
                                                style={{ 
                                                    color: `var(--${priorityColors.darkColor}, ${priorityColors.lightColor})`,
                                                    backgroundColor: `color-mix(in srgb, var(--${priorityColors.darkColor}, ${priorityColors.lightColor}) 20%, transparent)`
                                                }}
                                            >
                                                {priorityColors.label}
                                            </span>
                                        </div>

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {article.timestamp && (
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="w-4 h-4" />
                                                    <span>{article.timestamp}</span>
                                                </div>
                                            )}
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <Tag className="w-4 h-4" />
                                                    <div className="flex gap-2 flex-wrap">
                                                        {article.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div 
                                            className="text-muted-foreground leading-relaxed"
                                            dangerouslySetInnerHTML={{ 
                                                __html: article.content.replace(
                                                    /\*\*(.*?)\*\*/g, 
                                                    '<span class="text-foreground font-medium">$1</span>'
                                                )
                                            }} 
                                        />
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}; 