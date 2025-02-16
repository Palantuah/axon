import { cn } from './utils';

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

export function parseNewsletterText(rawText: string): NewsletterSection[] {
  // Create a single section for all articles
  const section: NewsletterSection = {
    category: 'All News',
    articles: []
  };

  // Split text into lines
  const lines = rawText.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Check for article (any non-empty line followed by meta block)
    if (line && lines[i + 1]?.trim() === '<meta>') {
      const article: Article = {
        title: line,
        content: '',
        priority: 3,
        tags: [],
      };

      // Skip the <meta> line
      i += 2;

      // Parse metadata block
      while (i < lines.length && lines[i].trim() !== '</meta>') {
        const metaLine = lines[i].trim();
        
        if (metaLine.startsWith('priority:')) {
          const priority = parseInt(metaLine.split(':')[1].trim());
          article.priority = (priority >= 1 && priority <= 3 ? priority : 3) as 1 | 2 | 3;
        } else if (metaLine.startsWith('date:')) {
          article.timestamp = metaLine.split(':')[1].trim();
        } else if (metaLine.startsWith('tags:')) {
          article.tags = metaLine
            .split(':')[1]
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
        }
        i++;
      }

      // Skip the </meta> line
      i++;

      // Collect content until next article or end
      let contentLines = [];
      while (i < lines.length) {
        const contentLine = lines[i].trim();
        
        // Stop if we hit another article (indicated by a meta block)
        if (contentLine === '<meta>') {
          i--; // Back up one line to catch the title
          break;
        }
        
        if (contentLine) {
          contentLines.push(contentLine);
        }
        i++;
      }

      article.content = contentLines.join('\n').trim();

      if (article.content) {
        section.articles.push(article);
      }
      continue;
    }

    i++;
  }

  // Sort articles by priority
  section.articles.sort((a, b) => a.priority - b.priority);

  return [section];
}

// Helper function to extract entities for tagging
function extractEntities(text: string): string[] {
  const entities = new Set<string>();
  
  // Company patterns
  const companyPattern = /\b(Microsoft|Apple|Google|Meta|OpenAI|Tesla|Amazon|Netflix|IBM|Intel)\b/g;
  const companies = text.match(companyPattern);
  if (companies) {
    companies.forEach(company => entities.add(company));
  }
  
  // Technology patterns
  const techPattern = /\b(AI|ML|API|Cloud|Blockchain|IoT|5G|VR|AR|XR)\b/g;
  const techTerms = text.match(techPattern);
  if (techTerms) {
    techTerms.forEach(term => entities.add(term));
  }
  
  // Extract names (basic pattern - can be improved)
  const namePattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g;
  const names = text.match(namePattern);
  if (names) {
    names.forEach(name => {
      if (name.split(' ').length >= 2) { // Only add full names
        entities.add(name);
      }
    });
  }
  
  return Array.from(entities);
}

// Helper function to determine priority based on content
function determinePriority(title: string, content: string): 1 | 2 | 3 {
  const combinedText = (title + ' ' + content).toLowerCase();
  
  // Priority 1: Breaking news, major events
  const priority1Terms = [
    'breaking',
    'urgent',
    'critical',
    'major',
    'emergency',
    'exclusive',
    'just in'
  ];
  
  if (priority1Terms.some(term => combinedText.includes(term))) {
    return 1;
  }
  
  // Priority 2: Important updates
  const priority2Terms = [
    'announces',
    'launches',
    'reports',
    'update',
    'reveals',
    'confirms',
    'significant'
  ];
  
  if (priority2Terms.some(term => combinedText.includes(term))) {
    return 2;
  }
  
  return 3;
}

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