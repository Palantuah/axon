import { z } from 'zod';

export interface NewsletterSection {
  category: string;
  articles: Article[];
}

export interface Article {
  title: string;
  content: string;
  priority: 1 | 2 | 3;
  timestamp?: string;
  tags?: string[];
}

// Validation schemas
const MetadataSchema = z.object({
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().trim()).min(1)
});

const ArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  metadata: MetadataSchema
});

// Constants
const TITLE_STOP_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 
  'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with'
]);

const PRIORITY_KEYWORDS = {
  1: new Set([
    'breaking', 'urgent', 'critical', 'emergency', 'exclusive', 'just in',
    'alert', 'crisis', 'immediate', 'vital'
  ]),
  2: new Set([
    'important', 'update', 'developing', 'significant', 'major', 'key',
    'announces', 'launches', 'reports', 'reveals', 'confirms'
  ])
};

// Helper Functions
function capitalizeTitle(title: string): string {
  // First preserve any existing bold text
  const boldTexts = new Map<string, string>();
  let counter = 0;
  let preservedTitle = title.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
    const key = `__BOLD_${counter}__`;
    boldTexts.set(key, content);
    counter++;
    return key;
  });

  const words = preservedTitle.split(/\s+/);
  const capitalizedWords = words.map((word, index) => {
    // Check if this is a preserved bold text
    if (word.startsWith('__BOLD_') && word.endsWith('__')) {
      const originalText = boldTexts.get(word);
      return `**${originalText}**`;
    }

    // Always capitalize first and last words
    if (index === 0 || index === words.length - 1) {
      return capitalizeWord(word);
    }

    // Don't capitalize certain stop words unless they're proper nouns
    if (TITLE_STOP_WORDS.has(word.toLowerCase()) && !isProperNoun(word)) {
      return word.toLowerCase();
    }

    // Handle hyphenated words
    if (word.includes('-')) {
      return word.split('-')
        .map(part => capitalizeWord(part))
        .join('-');
    }

    // Handle words with special characters (e.g., parentheses)
    const specialChars = /^[^a-zA-Z]*/;
    const prefix = word.match(specialChars)?.[0] || '';
    const mainWord = word.slice(prefix.length);
    
    if (!mainWord) return word;

    // If it's already a proper noun or acronym (all caps), preserve the case
    if (isProperNoun(mainWord) && mainWord === mainWord.toUpperCase()) {
      return prefix + mainWord;
    }

    // Capitalize the word
    return prefix + mainWord.charAt(0).toUpperCase() + mainWord.slice(1).toLowerCase();
  });

  return capitalizedWords.join(' ');
}

function capitalizeWord(word: string): string {
  // Handle empty strings
  if (!word) return word;

  // If it's an acronym (all caps), preserve it
  if (word === word.toUpperCase() && word.length > 1) {
    return word;
  }

  // Handle hyphenated words
  if (word.includes('-')) {
    return word.split('-')
      .map(part => capitalizeWord(part))
      .join('-');
  }

  // Handle words with special characters
  const specialChars = /^[^a-zA-Z]*/;
  const prefix = word.match(specialChars)?.[0] || '';
  const mainWord = word.slice(prefix.length);
  
  if (!mainWord) return word;

  // Handle proper nouns that are already correctly capitalized
  if (isProperNoun(mainWord) && mainWord !== mainWord.toUpperCase()) {
    return prefix + mainWord;
  }

  return prefix + mainWord.charAt(0).toUpperCase() + mainWord.slice(1).toLowerCase();
}

function isProperNoun(word: string): boolean {
  return /^[A-Z]/.test(word);
}

function formatNumber(text: string): string {
  return text.replace(/\b(\d+(?:\.\d+)?)\s*(million|billion|trillion)\b/gi, (_, num, unit) => {
    const value = parseFloat(num);
    const suffix = unit.charAt(0).toUpperCase();
    return `$${value}${suffix}`;
  });
}

function formatBoldText(text: string): string {
  // Handle nested bold tags
  text = text.replace(/\*\*\*\*([^*]+)\*\*\*\*/g, '**$1**');
  
  // Handle malformed bold tags
  text = text.replace(/(?<!\*)\*(?!\*)/g, '**');
  text = text.replace(/(?<!\*)\*\*\*(?!\*)/g, '**');
  
  // Ensure proper spacing around bold text
  return text.replace(/\*\*([^*]+)\*\*/g, (_, content) => {
    const trimmed = content.trim();
    // Don't add space if followed by punctuation
    const suffix = /[.,!?;:]$/.test(trimmed) ? '' : ' ';
    return `**${trimmed}**${suffix}`;
  });
}

function parseMetadataBlock(block: string): z.infer<typeof MetadataSchema> {
  const metadata: Record<string, any> = {
    priority: 3,
    date: new Date().toISOString().split('T')[0],
    tags: []
  };

  const lines = block.split('\n');
  for (const line of lines) {
    const [key, ...values] = line.split(':').map(s => s.trim());
    const value = values.join(':').trim();

    switch (key.toLowerCase()) {
      case 'priority':
        const priority = parseInt(value);
        if (priority >= 1 && priority <= 3) {
          metadata.priority = priority;
        }
        break;
      case 'date':
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          metadata.date = value;
        }
        break;
      case 'tags':
        metadata.tags = value.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0);
        break;
    }
  }

  return MetadataSchema.parse(metadata);
}

export function formatContent(content: string): string {
  let formatted = content
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Remove extra spaces
    .replace(/[ \t]+/g, ' ')
    // Fix spacing around punctuation
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])(?=[A-Za-z])/g, '$1 ')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    // Format numbers
    .replace(/\$?\d+\.?\d*\s*(million|billion|trillion)/gi, match => formatNumber(match))
    // Format quotes
    .replace(/(['"])([^'"]*)\1/g, (_, quote, content) => `"${content}"`)
    // Bold text formatting
    .split('\n')
    .map(line => formatBoldText(line))
    .join('\n')
    .trim();

  // Ensure proper spacing between sentences
  formatted = formatted.replace(/([.!?])\s*([A-Z])/g, '$1 $2');

  return formatted;
}

export function parseNewsletterText(rawText: string): NewsletterSection[] {
  // Split into articles
  const articleBlocks = rawText
    .split(/(?=^[A-Za-z].*?\n<meta>)/m)
    .filter(block => block.trim().length > 0);

  const articles: Article[] = [];

  for (const block of articleBlocks) {
    try {
      // Split into title, metadata, and content
      const [titleLine, ...rest] = block.trim().split('\n');
      const metaStart = rest.findIndex(line => line.trim() === '<meta>');
      const metaEnd = rest.findIndex(line => line.trim() === '</meta>');
      
      if (metaStart === -1 || metaEnd === -1 || metaEnd <= metaStart) {
        console.warn('Invalid article format, skipping:', titleLine);
        continue;
      }

      const metadataBlock = rest.slice(metaStart + 1, metaEnd).join('\n');
      const content = rest.slice(metaEnd + 1).join('\n').trim();

      // Parse and validate
      const metadata = parseMetadataBlock(metadataBlock);
      const article: Article = {
        title: titleLine.trim(),
        content: formatContent(content),
        priority: metadata.priority,
        timestamp: metadata.date,
        tags: metadata.tags
      };

      articles.push(article);
    } catch (error) {
      console.error('Error parsing article:', error);
      continue;
    }
  }

  // Sort articles by priority
  articles.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Secondary sort by timestamp if available
    if (a.timestamp && b.timestamp) {
      return b.timestamp.localeCompare(a.timestamp);
    }
    return 0;
  });

  // Group into a single section (as per current UI)
  return [{
    category: 'All News',
    articles
  }];
}

// Keep the existing UI-related constants
export const NEWSLETTER_DESIGN_SYSTEM = {
  typography: {
    sectionHeader: 'text-2xl font-bold tracking-tight',
    articleTitle: 'text-lg font-medium leading-snug',
    bodyText: 'text-base leading-relaxed',
    metadata: 'text-sm text-neutral-500 dark:text-neutral-400',
  },
  spacing: {
    section: 'mb-12',
    article: 'mb-8',
    metadata: 'mt-4',
  },
  colors: {
    Tech: 'from-blue-500/10 to-cyan-500/10',
    Sports: 'from-green-500/10 to-emerald-500/10',
    Finance: 'from-purple-500/10 to-pink-500/10',
    'Global News': 'from-orange-500/10 to-amber-500/10',
    'US News': 'from-red-500/10 to-rose-500/10',
  },
} as const;

// Keep the existing prompt template
export const DEEPSEEK_PROMPT_TEMPLATE = `
You are a professional newsletter formatter. Format the following content into clean, semantic markdown following these rules:

1. Structure:
   - Use ## for section headers
   - Use ### for article titles
   - Use > for important quotes or highlights
   - Use bullet points sparingly, prefer paragraphs
   
2. Formatting:
   - Keep paragraphs concise (2-4 sentences)
   - Use bold for key terms or names
   - Add horizontal rules (---) between major sections
   
3. Metadata:
   - Add [PRIORITY:1/2/3] at the start of each article
   - Add [TAGS:tag1,tag2] at the end of each article
   - Include timestamps where relevant [TIME:YYYY-MM-DD]

4. Special Formatting:
   - Format numbers consistently (e.g., "$5.2M" not "5.2 million dollars")
   - Use proper quotation marks ("" not "")
   - Maintain consistent date formats (YYYY-MM-DD)

Content to format:
{content}
`;

export function generateDeepseekPrompt(content: string): string {
  return DEEPSEEK_PROMPT_TEMPLATE.replace('{content}', content);
} 