import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const model = openai('gpt-4o');

const SYSTEM_PROMPT = `You are a newsletter formatter that transforms raw text into a clean, engaging newsletter format. Format and rank the content following these exact rules:

1. Content Organization:
   - Analyze all articles across all sections and rank them by importance/impact
   - Combine all sections into a single ranked feed
   - Format each article as a clear headline followed by content
   - Include all metadata in a special format that can be parsed:
     <meta>
     priority: N (1 = critical/breaking, 2 = important, 3 = regular)
     date: YYYY-MM-DD
     tags: tag1, tag2, tag3 (include original section as a tag)
     </meta>

2. Ranking Criteria:
   - Priority 1 (Critical/Breaking):
     * Breaking news with immediate impact
     * Major announcements or developments
     * Critical updates or emergencies
     * Global significance events
   
   - Priority 2 (Important):
     * Significant industry updates
     * Notable financial/market news
     * Important policy changes
     * Regional significant events
   
   - Priority 3 (Regular):
     * Regular updates
     * Minor developments
     * Follow-up stories
     * Local news

3. Content Formatting:
   - Headlines should be clear and engaging
   - Bold all company names, person names, and product names with **
   - Keep paragraphs intact but clean up any messy formatting
   - Standardize number formats ($XM, $XB, XK)
   - Preserve all factual information exactly as provided

Example Output:

Breaking: Global AI Safety Summit Announced
<meta>
priority: 1
date: 2024-03-14
tags: Technology, AI, Global, Breaking
</meta>
**OpenAI** and **Microsoft** announce an emergency summit on AI safety protocols. **Sam Altman** states this represents a critical moment for the industry.

Market Update: Tech Stocks Surge
<meta>
priority: 2
date: 2024-03-14
tags: Finance, Technology, Markets
</meta>
**Apple Inc.** leads market rally with $5.2B in quarterly earnings, exceeding expectations.

Format the following content exactly according to these rules, ranking ALL articles by importance regardless of their original section:`;

// Improved section splitting with regex
function splitIntoSections(content: string): string[] {
  // Split on category headers (word followed by newline)
  const sections = content.split(/(?=^[A-Za-z][A-Za-z\s]*\n\n)/m)
    .filter(section => section.trim().length > 0)
    .map(section => section.trim());
  
  return sections;
}

// Schema for formatted article
const ArticleSchema = z.object({
  title: z.string(),
  priority: z.number().min(1).max(3),
  content: z.string(),
  tags: z.array(z.string()),
  timestamp: z.string()
});

// Schema for formatted section
const SectionSchema = z.object({
  category: z.string(),
  articles: z.array(ArticleSchema)
});

// Schema for the complete formatted newsletter
const NewsletterSchema = z.object({
  sections: z.array(SectionSchema)
});

async function formatSection(section: string): Promise<string> {
  try {
    const { object } = await generateObject({
      model,
      temperature: 0.1, // Lower temperature for more consistent formatting
      maxTokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: section.trim()
        }
      ],
      schema: z.object({
        formattedContent: z.string().describe('The formatted newsletter section in natural format with embedded metadata'),
      }).describe('The formatted newsletter content'),
    });

    return object.formattedContent;
  } catch (error) {
    console.error('Error formatting section:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Valid content string is required' },
        { status: 400 }
      );
    }

    // Split content into sections
    const sections = splitIntoSections(content);
    
    if (sections.length === 0) {
      return NextResponse.json(
        { error: 'No valid sections found in content' },
        { status: 400 }
      );
    }

    // Format each section in parallel
    const formattedSections = await Promise.all(
      sections.map(async (section) => {
        try {
          return await formatSection(section);
        } catch (error) {
          console.error('Error formatting section:', section, error);
          return section; // Return original section if formatting fails
        }
      })
    );

    // Combine formatted sections with double newlines
    const formattedContent = formattedSections
      .filter(Boolean)
      .join('\n\n')
      .trim();

    if (!formattedContent) {
      throw new Error('Failed to format any sections');
    }

    return NextResponse.json({ formattedContent });
  } catch (error) {
    console.error('Error formatting newsletter:', error);
    return NextResponse.json(
      { 
        error: 'Failed to format newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 