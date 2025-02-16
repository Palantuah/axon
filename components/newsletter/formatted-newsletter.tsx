'use client';

import { motion } from 'framer-motion';
import { Article, NewsletterSection } from '@/lib/newsletter-utils';
import { cn } from '@/lib/utils';
import { TextMorph } from '@/components/core/text-morph';
import { CalendarDays, Tag } from 'lucide-react';

interface FormattedNewsletterProps {
  sections: NewsletterSection[];
  className?: string;
}

export function FormattedNewsletter({ sections, className }: FormattedNewsletterProps) {
  // Get all articles (they're already sorted by priority)
  const articles = sections[0]?.articles || [];

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.title}
          article={article}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  delay: number;
}

function ArticleCard({ article, delay }: ArticleCardProps) {
  // Determine the priority color and label
  const priorityConfig = {
    1: {
      color: 'rgb(239, 68, 68)',
      gradient: 'from-red-500/20 to-transparent',
      label: 'Breaking'
    },
    2: {
      color: 'rgb(234, 179, 8)',
      gradient: 'from-yellow-500/20 to-transparent',
      label: 'Important'
    },
    3: {
      color: 'rgb(34, 197, 94)',
      gradient: 'from-green-500/20 to-transparent',
      label: 'Update'
    }
  }[article.priority];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "group relative overflow-hidden rounded-xl",
        "bg-gradient-to-br from-white/[0.03] to-white/[0.01]",
        "border border-white/[0.05] hover:border-white/[0.1]",
        "transition-all duration-300"
      )}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0",
        "group-hover:opacity-100 transition-opacity duration-300",
        priorityConfig.gradient
      )} />
      
      <div className="relative p-6 space-y-4">
        {/* Priority Indicator */}
        <div className="absolute -left-1 top-0 bottom-0 w-1 transition-colors duration-300"
             style={{ backgroundColor: priorityConfig.color }} />

        {/* Title and Priority Label */}
        <div className="flex items-start justify-between gap-4">
          <TextMorph
            as="h3"
            className="text-lg font-medium text-white/90 leading-snug flex-1"
          >
            {article.title}
          </TextMorph>
          <span 
            className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
            style={{ 
              color: priorityConfig.color,
              backgroundColor: `${priorityConfig.color}20`
            }}
          >
            {priorityConfig.label}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-white/50">
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
                    className="px-2 py-0.5 rounded-full bg-white/[0.05] text-white/60 text-xs"
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
          className="text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: article.content.replace(
              /\*\*(.*?)\*\*/g, 
              '<span class="text-white/90 font-medium">$1</span>'
            )
          }} 
        />
      </div>
    </motion.article>
  );
} 