// /app/api/chat/route.ts
import { getGroupConfig } from '@/app/actions';
import { serverEnv } from '@/env/server';
import { xai } from '@ai-sdk/xai';
import { anthropic } from '@ai-sdk/anthropic'
import { groq } from '@ai-sdk/groq'
import CodeInterpreter from '@e2b/code-interpreter';
import FirecrawlApp from '@mendable/firecrawl-js';
import { tavily } from '@tavily/core';
import { 
    convertToCoreMessages, 
    smoothStream, 
    streamText, 
    tool, 
    createDataStreamResponse, 
    wrapLanguageModel, 
    extractReasoningMiddleware, 
    customProvider ,
    generateObject
} from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';

const axon = customProvider({
    languageModels: {
        'axon-default': xai('grok-2-1212'),
        'axon-grok-vision': xai('grok-2-vision-1212'),
        'axon-sonnet': anthropic('claude-3-5-sonnet-20241022'),
        'axon-r1': wrapLanguageModel({
            model: groq('deepseek-r1-distill-llama-70b'),
            middleware: extractReasoningMiddleware({ tagName: 'think' })
        }),
        'axon-llama-groq': groq("llama-3.3-70b-versatile"),
    }
})

// Allow streaming responses up to 120 seconds
export const maxDuration = 300;

interface XResult {
    id: string;
    url: string;
    title: string;
    author?: string;
    publishedDate?: string;
    text: string;
    highlights?: string[];
    tweetId: string;
}



interface VideoDetails {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
    type?: string;
    provider_name?: string;
    provider_url?: string;
}

interface VideoResult {
    videoId: string;
    url: string;
    details?: VideoDetails;
    captions?: string;
    timestamps?: string[];
    views?: string;
    likes?: string;
    summary?: string;
}

function sanitizeUrl(url: string): string {
    return url.replace(/\s+/g, '%20');
}

async function isValidImageUrl(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
        });

        clearTimeout(timeout);

        return response.ok && (response.headers.get('content-type')?.startsWith('image/') ?? false);
    } catch {
        return false;
    }
}


const extractDomain = (url: string): string => {
    const urlPattern = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i;
    return url.match(urlPattern)?.[1] || url;
};

const deduplicateByDomainAndUrl = <T extends { url: string }>(items: T[]): T[] => {
    const seenDomains = new Set<string>();
    const seenUrls = new Set<string>();

    return items.filter(item => {
        const domain = extractDomain(item.url);
        const isNewUrl = !seenUrls.has(item.url);
        const isNewDomain = !seenDomains.has(domain);

        if (isNewUrl && isNewDomain) {
            seenUrls.add(item.url);
            seenDomains.add(domain);
            return true;
        }
        return false;
    });
};

// Modify the POST function to use the new handler
export async function POST(req: Request) {
    const { messages, model, group } = await req.json();
    const { tools: activeTools, systemPrompt } = await getGroupConfig(group);

    console.log("Running with model: ", model.trim());

    return createDataStreamResponse({
        execute: async (dataStream) => {
            const result = streamText({
                model: axon.languageModel(model),
                maxSteps: 5,
                providerOptions: {
                    'axon': {
                        reasoning_format: group === "fun" ? "raw" : "parsed",
                    }
                },
                messages: convertToCoreMessages(messages),
                experimental_transform: smoothStream({
                    chunking: 'word',
                    delayInMs: 15,
                }),
                temperature: 0,
                experimental_activeTools: [...activeTools],
                system: systemPrompt,
                tools: {
                    // stock_chart: tool({
                    //     description: 'Write and execute Python code to find stock data and generate a stock chart.',
                    //     parameters: z.object({
                    //         title: z.string().describe('The title of the chart.'),
                    //         code: z.string().describe('The Python code to execute.'),
                    //         icon: z
                    //             .enum(['stock', 'date', 'calculation', 'default'])
                    //             .describe('The icon to display for the chart.'),
                    //     }),
                    //     execute: async ({ code, title, icon }: { code: string; title: string; icon: string }) => {
                    //         console.log('Code:', code);
                    //         console.log('Title:', title);
                    //         console.log('Icon:', icon);

                    //         const sandbox = await CodeInterpreter.create(serverEnv.SANDBOX_TEMPLATE_ID!);
                    //         const execution = await sandbox.runCode(code);
                    //         let message = '';

                    //         if (execution.results.length > 0) {
                    //             for (const result of execution.results) {
                    //                 if (result.isMainResult) {
                    //                     message += `${result.text}\n`;
                    //                 } else {
                    //                     message += `${result.text}\n`;
                    //                 }
                    //             }
                    //         }

                    //         if (execution.logs.stdout.length > 0 || execution.logs.stderr.length > 0) {
                    //             if (execution.logs.stdout.length > 0) {
                    //                 message += `${execution.logs.stdout.join('\n')}\n`;
                    //             }
                    //             if (execution.logs.stderr.length > 0) {
                    //                 message += `${execution.logs.stderr.join('\n')}\n`;
                    //             }
                    //         }

                    //         if (execution.error) {
                    //             message += `Error: ${execution.error}\n`;
                    //             console.log('Error: ', execution.error);
                    //         }

                    //         console.log(execution.results);
                    //         if (execution.results[0].chart) {
                    //             execution.results[0].chart.elements.map((element: any) => {
                    //                 console.log(element.points);
                    //             });
                    //         }

                    //         return {
                    //             message: message.trim(),
                    //             chart: execution.results[0].chart ?? '',
                    //         };
                    //     },
                    // }),

                    web_search: tool({
                        description: 'Search the web for information with multiple queries, max results and search depth.',
                        parameters: z.object({
                            queries: z.array(z.string().describe('Array of search queries to look up on the web.')),
                            maxResults: z.array(
                                z.number().describe('Array of maximum number of results to return per query.').default(10),
                            ),
                            topics: z.array(
                                z.enum(['general', 'news']).describe('Array of topic types to search for.').default('general'),
                            ),
                            searchDepth: z.array(
                                z.enum(['basic', 'advanced']).describe('Array of search depths to use.').default('basic'),
                            ),
                            exclude_domains: z
                                .array(z.string())
                                .describe('A list of domains to exclude from all search results.')
                                .default([]),
                        }),
                        execute: async ({
                            queries,
                            maxResults,
                            topics,
                            searchDepth,
                            exclude_domains,
                        }: {
                            queries: string[];
                            maxResults: number[];
                            topics: ('general' | 'news')[];
                            searchDepth: ('basic' | 'advanced')[];
                            exclude_domains?: string[];
                        }) => {
                            const apiKey = serverEnv.TAVILY_API_KEY;
                            const tvly = tavily({ apiKey });
                            const includeImageDescriptions = true;

                            console.log('Queries:', queries);
                            console.log('Max Results:', maxResults);
                            console.log('Topics:', topics);
                            console.log('Search Depths:', searchDepth);
                            console.log('Exclude Domains:', exclude_domains);

                            // Execute searches in parallel
                            const searchPromises = queries.map(async (query, index) => {
                                const data = await tvly.search(query, {
                                    topic: topics[index] || topics[0] || 'general',
                                    days: topics[index] === 'news' ? 7 : undefined,
                                    maxResults: maxResults[index] || maxResults[0] || 10,
                                    searchDepth: searchDepth[index] || searchDepth[0] || 'basic',
                                    includeAnswer: true,
                                    includeImages: true,
                                    includeImageDescriptions: includeImageDescriptions,
                                    excludeDomains: exclude_domains,
                                });

                                // Add annotation for query completion
                                dataStream.writeMessageAnnotation({
                                    type: 'query_completion',
                                    data: {
                                        query,
                                        index,
                                        total: queries.length,
                                        status: 'completed',
                                        resultsCount: data.results.length,
                                        imagesCount: data.images.length
                                    }
                                });

                                return {
                                    query,
                                    results: deduplicateByDomainAndUrl(data.results).map((obj: any) => ({
                                        url: obj.url,
                                        title: obj.title,
                                        content: obj.content,
                                        raw_content: obj.raw_content,
                                        published_date: topics[index] === 'news' ? obj.published_date : undefined,
                                    })),
                                    images: includeImageDescriptions
                                        ? await Promise.all(
                                            deduplicateByDomainAndUrl(data.images).map(
                                                async ({ url, description }: { url: string; description?: string }) => {
                                                    const sanitizedUrl = sanitizeUrl(url);
                                                    const isValid = await isValidImageUrl(sanitizedUrl);
                                                    return isValid
                                                        ? {
                                                            url: sanitizedUrl,
                                                            description: description ?? '',
                                                        }
                                                        : null;
                                                },
                                            ),
                                        ).then((results) =>
                                            results.filter(
                                                (image): image is { url: string; description: string } =>
                                                    image !== null &&
                                                    typeof image === 'object' &&
                                                    typeof image.description === 'string' &&
                                                    image.description !== '',
                                            ),
                                        )
                                        : await Promise.all(
                                            deduplicateByDomainAndUrl(data.images).map(async ({ url }: { url: string }) => {
                                                const sanitizedUrl = sanitizeUrl(url);
                                                return (await isValidImageUrl(sanitizedUrl)) ? sanitizedUrl : null;
                                            }),
                                        ).then((results) => results.filter((url): url is string => url !== null)),
                                };
                            });

                            const searchResults = await Promise.all(searchPromises);

                            return {
                                searches: searchResults,
                            };
                        },
                    }),
                    x_search: tool({
                        description: 'Search X (formerly Twitter) posts.',
                        parameters: z.object({
                            query: z.string().describe('The search query, if a username is provided put in the query with @username'),
                            startDate: z.string().optional().describe('The start date for the search in YYYY-MM-DD format'),
                            endDate: z.string().optional().describe('The end date for the search in YYYY-MM-DD format'),
                        }),
                        execute: async ({
                            query,
                            startDate,
                            endDate,
                        }: {
                            query: string;
                            startDate?: string;
                            endDate?: string;
                        }) => {
                            try {
                                const exa = new Exa(serverEnv.EXA_API_KEY as string);

                                const start = startDate
                                    ? new Date(startDate).toISOString()
                                    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
                                const end = endDate ? new Date(endDate).toISOString() : new Date().toISOString();

                                const result = await exa.searchAndContents(query, {
                                    type: 'keyword',
                                    numResults: 15,
                                    text: true,
                                    highlights: true,
                                    includeDomains: ['twitter.com', 'x.com'],
                                });

                                // Extract tweet ID from URL
                                const extractTweetId = (url: string): string | null => {
                                    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
                                    return match ? match[1] : null;
                                };

                                // Process and filter results
                                const processedResults = result.results.reduce<Array<XResult>>((acc, post) => {
                                    const tweetId = extractTweetId(post.url);
                                    if (tweetId) {
                                        acc.push({
                                            ...post,
                                            tweetId,
                                            title: post.title || '',
                                        });
                                    }
                                    return acc;
                                }, []);

                                return processedResults;
                            } catch (error) {
                                console.error('X search error:', error);
                                throw error;
                            }
                        },
                    }),
                    academic_search: tool({
                        description: 'Search academic papers and research.',
                        parameters: z.object({
                            query: z.string().describe('The search query'),
                        }),
                        execute: async ({ query }: { query: string }) => {
                            try {
                                const exa = new Exa(serverEnv.EXA_API_KEY as string);

                                // Search academic papers with content summary
                                const result = await exa.searchAndContents(query, {
                                    type: 'auto',
                                    numResults: 20,
                                    category: 'research paper',
                                    summary: {
                                        query: 'Abstract of the Paper',
                                    },
                                });

                                // Process and clean results
                                const processedResults = result.results.reduce<typeof result.results>((acc, paper) => {
                                    // Skip if URL already exists or if no summary available
                                    if (acc.some((p) => p.url === paper.url) || !paper.summary) return acc;

                                    // Clean up summary (remove "Summary:" prefix if exists)
                                    const cleanSummary = paper.summary.replace(/^Summary:\s*/i, '');

                                    // Clean up title (remove [...] suffixes)
                                    const cleanTitle = paper.title?.replace(/\s\[.*?\]$/, '');

                                    acc.push({
                                        ...paper,
                                        title: cleanTitle || '',
                                        summary: cleanSummary,
                                    });

                                    return acc;
                                }, []);

                                // Take only the first 10 unique, valid results
                                const limitedResults = processedResults.slice(0, 10);

                                return {
                                    results: limitedResults,
                                };
                            } catch (error) {
                                console.error('Academic search error:', error);
                                throw error;
                            }
                        },
                    }),

                    retrieve: tool({ //TEAM-SCRAPYBARA
                        description: 'Retrieve the information from a URL using Firecrawl.',
                        parameters: z.object({
                            url: z.string().describe('The URL to retrieve the information from.'),
                        }),
                        execute: async ({ url }: { url: string }) => {
                            const app = new FirecrawlApp({
                                apiKey: serverEnv.FIRECRAWL_API_KEY,
                            });
                            try {
                                const content = await app.scrapeUrl(url);
                                if (!content.success || !content.metadata) {
                                    return { error: 'Failed to retrieve content' };
                                }

                                // Define schema for extracting missing content
                                const schema = z.object({
                                    title: z.string(),
                                    content: z.string(),
                                    description: z.string()
                                });

                                let title = content.metadata.title;
                                let description = content.metadata.description;
                                let extractedContent = content.markdown;

                                // If any content is missing, use extract to get it
                                if (!title || !description || !extractedContent) {
                                    const extractResult = await app.extract([url], {
                                        prompt: "Extract the page title, main content, and a brief description.",
                                        schema: schema
                                    });

                                    if (extractResult.success && extractResult.data) {
                                        title = title || extractResult.data.title;
                                        description = description || extractResult.data.description;
                                        extractedContent = extractedContent || extractResult.data.content;
                                    }
                                }

                                return {
                                    results: [
                                        {
                                            title: title || 'Untitled',
                                            content: extractedContent || '',
                                            url: content.metadata.sourceURL,
                                            description: description || '',
                                            language: content.metadata.language,
                                        },
                                    ],
                                };
                            } catch (error) {
                                console.error('Firecrawl API error:', error);
                                return { error: 'Failed to retrieve content' };
                            }
                        },
                    }),
                    // get_weather_data: tool({
                    //     description: 'Get the weather data for the given coordinates.',
                    //     parameters: z.object({
                    //         lat: z.number().describe('The latitude of the location.'),
                    //         lon: z.number().describe('The longitude of the location.'),
                    //     }),
                    //     execute: async ({ lat, lon }: { lat: number; lon: number }) => {
                    //         const apiKey = serverEnv.OPENWEATHER_API_KEY;
                    //         const response = await fetch(
                    //             `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`,
                    //         );
                    //         const data = await response.json();
                    //         return data;
                    //     },
                    // }),
                    // code_interpreter: tool({
                    //     description: 'Write and execute Python code.',
                    //     parameters: z.object({
                    //         title: z.string().describe('The title of the code snippet.'),
                    //         code: z
                    //             .string()
                    //             .describe(
                    //                 'The Python code to execute. put the variables in the end of the code to print them. do not use the print function.',
                    //             ),
                    //         icon: z
                    //             .enum(['stock', 'date', 'calculation', 'default'])
                    //             .describe('The icon to display for the code snippet.'),
                    //     }),
                    //     execute: async ({ code, title, icon }: { code: string; title: string; icon: string }) => {
                    //         console.log('Code:', code);
                    //         console.log('Title:', title);
                    //         console.log('Icon:', icon);

                    //         const sandbox = await CodeInterpreter.create(serverEnv.SANDBOX_TEMPLATE_ID!);
                    //         const execution = await sandbox.runCode(code);
                    //         let message = '';

                    //         if (execution.results.length > 0) {
                    //             for (const result of execution.results) {
                    //                 if (result.isMainResult) {
                    //                     message += `${result.text}\n`;
                    //                 } else {
                    //                     message += `${result.text}\n`;
                    //                 }
                    //             }
                    //         }

                    //         if (execution.logs.stdout.length > 0 || execution.logs.stderr.length > 0) {
                    //             if (execution.logs.stdout.length > 0) {
                    //                 message += `${execution.logs.stdout.join('\n')}\n`;
                    //             }
                    //             if (execution.logs.stderr.length > 0) {
                    //                 message += `${execution.logs.stderr.join('\n')}\n`;
                    //             }
                    //         }

                    //         if (execution.error) {
                    //             message += `Error: ${execution.error}\n`;
                    //             console.log('Error: ', execution.error);
                    //         }

                    //         console.log(execution.results);
                    //         if (execution.results[0].chart) {
                    //             execution.results[0].chart.elements.map((element: any) => {
                    //                 console.log(element.points);
                    //             });
                    //         }

                    //         return {
                    //             message: message.trim(),
                    //             chart: execution.results[0].chart ?? '',
                    //         };
                    //     },
                    // }),
                    reason_search: tool({
                        description: 'Perform a reasoned web search with multiple steps and sources.',
                        parameters: z.object({
                            topic: z.string().describe('The main topic or question to research'),
                            depth: z.enum(['basic', 'advanced']).describe('Search depth level').default('basic'),
                        }),
                        execute: async ({ topic, depth }: { topic: string; depth: 'basic' | 'advanced' }) => {
                            const apiKey = serverEnv.TAVILY_API_KEY;
                            const tvly = tavily({ apiKey });
                            const exa = new Exa(serverEnv.EXA_API_KEY as string);

                            // Send initial plan status update (without steps count and extra details)
                            dataStream.writeMessageAnnotation({
                                type: 'research_update',
                                data: {
                                    id: 'research-plan-initial', // unique id for the initial state
                                    type: 'plan',
                                    status: 'running',
                                    title: 'Research Plan',
                                    message: 'Creating research plan...',
                                    timestamp: Date.now(),
                                    overwrite: true
                                }
                            });

                            // Now generate the research plan
                            const { object: researchPlan } = await generateObject({
                                model: xai("grok-beta"),
                                temperature: 0.5,
                                schema: z.object({
                                    search_queries: z.array(z.object({
                                        query: z.string(),
                                        rationale: z.string(),
                                        source: z.enum(['web', 'academic', 'both']),
                                        priority: z.number().min(1).max(5)
                                    })).max(12),
                                    required_analyses: z.array(z.object({
                                        type: z.string(),
                                        description: z.string(),
                                        importance: z.number().min(1).max(5)
                                    })).max(8)
                                }),
                                prompt: `Create a focused research plan for the topic: "${topic}". 
                                        Keep the plan concise but comprehensive, with:
                                        - 4-12 targeted search queries (each can use web, academic, or both sources)
                                        - 2-8 key analyses to perform
                                        - Prioritize the most important aspects to investigate
                                        
                                        Consider different angles and potential controversies, but maintain focus on the core aspects.
                                        Ensure the total number of steps (searches + analyses) does not exceed 20.`
                            });

                            // Generate IDs for all steps based on the plan
                            const generateStepIds = (plan: typeof researchPlan) => {
                                // Generate an array of search steps.
                                const searchSteps = plan.search_queries.flatMap((query, index) => {
                                    if (query.source === 'both') {
                                        return [
                                            { id: `search-web-${index}`, type: 'web', query },
                                            { id: `search-academic-${index}`, type: 'academic', query }
                                        ];
                                    }
                                    const searchType = query.source === 'academic' ? 'academic' : 'web';
                                    return [{ id: `search-${searchType}-${index}`, type: searchType, query }];
                                });
                                
                                // Generate an array of analysis steps.
                                const analysisSteps = plan.required_analyses.map((analysis, index) => ({
                                    id: `analysis-${index}`,
                                    type: 'analysis',
                                    analysis
                                }));
                                
                                return {
                                    planId: 'research-plan',
                                    searchSteps,
                                    analysisSteps
                                };
                            };

                            const stepIds = generateStepIds(researchPlan);
                            let completedSteps = 0;
                            const totalSteps = stepIds.searchSteps.length + stepIds.analysisSteps.length;

                            // Complete plan status
                            dataStream.writeMessageAnnotation({
                                type: 'research_update',
                                data: {
                                    id: stepIds.planId,
                                    type: 'plan',
                                    status: 'completed',
                                    title: 'Research Plan',
                                    plan: researchPlan,
                                    totalSteps: totalSteps,
                                    message: 'Research plan created',
                                    timestamp: Date.now(),
                                    overwrite: true
                                }
                            });

                            // Execute searches
                            const searchResults = [];
                            let searchIndex = 0;  // Add index tracker

                            for (const step of stepIds.searchSteps) {
                                // Send running annotation for this search step
                                dataStream.writeMessageAnnotation({
                                    type: 'research_update',
                                    data: {
                                        id: step.id,
                                        type: step.type,
                                        status: 'running',
                                        title: step.type === 'web'
                                            ? `Searching the web for "${step.query.query}"`
                                            : step.type === 'academic'
                                                ? `Searching academic papers for "${step.query.query}"`
                                                : `Analyzing ${step.query.query}`,
                                        query: step.query.query,
                                        message: `Searching ${step.query.source} sources...`,
                                        timestamp: Date.now()
                                    }
                                });

                                if (step.type === 'web') {
                                    const webResults = await tvly.search(step.query.query, {
                                        searchDepth: depth,
                                        includeAnswer: true,
                                        maxResults: Math.min(6 - step.query.priority, 10)
                                    });

                                    searchResults.push({
                                        type: 'web',
                                        query: step.query,
                                        results: webResults.results.map(r => ({
                                            source: 'web',
                                            title: r.title,
                                            url: r.url,
                                            content: r.content
                                        }))
                                    });
                                    completedSteps++;
                                } else if (step.type === 'academic') {
                                    const academicResults = await exa.searchAndContents(step.query.query, {
                                        type: 'auto',
                                        numResults: Math.min(6 - step.query.priority, 5),
                                        category: 'research paper',
                                        summary: true
                                    });

                                    searchResults.push({
                                        type: 'academic',
                                        query: step.query,
                                        results: academicResults.results.map(r => ({
                                            source: 'academic',
                                            title: r.title || '',
                                            url: r.url || '',
                                            content: r.summary || ''
                                        }))
                                    });
                                    completedSteps++;
                                }

                                // Send completed annotation for the search step
                                dataStream.writeMessageAnnotation({
                                    type: 'research_update',
                                    data: {
                                        id: step.id,
                                        type: step.type,
                                        status: 'completed',
                                        title: step.type === 'web'
                                            ? `Searched the web for "${step.query.query}"`
                                            : step.type === 'academic'
                                                ? `Searched academic papers for "${step.query.query}"`
                                                : `Analysis of ${step.query.query} complete`,
                                        query: step.query.query,
                                        results: searchResults[searchResults.length - 1].results.map(r => {
                                            return { ...r };
                                        }),
                                        message: `Found ${searchResults[searchResults.length - 1].results.length} results`,
                                        timestamp: Date.now(),
                                        overwrite: true
                                    }
                                });

                                searchIndex++;  // Increment index
                            }

                            // Perform analyses
                            let analysisIndex = 0;  // Add index tracker

                            for (const step of stepIds.analysisSteps) {
                                dataStream.writeMessageAnnotation({
                                    type: 'research_update',
                                    data: {
                                        id: step.id,
                                        type: 'analysis',
                                        status: 'running',
                                        title: `Analyzing ${step.analysis.type}`,
                                        analysisType: step.analysis.type,
                                        message: `Analyzing ${step.analysis.type}...`,
                                        timestamp: Date.now()
                                    }
                                });

                                const { object: analysisResult } = await generateObject({
                                    model: xai("grok-beta"),
                                    temperature: 0.5,
                                    schema: z.object({
                                        findings: z.array(z.object({
                                            insight: z.string(),
                                            evidence: z.array(z.string()),
                                            confidence: z.number().min(0).max(1)
                                        })),
                                        implications: z.array(z.string()),
                                        limitations: z.array(z.string())
                                    }),
                                    prompt: `Perform a ${step.analysis.type} analysis on the search results. ${step.analysis.description}
                                            Consider all sources and their reliability.
                                            Search results: ${JSON.stringify(searchResults)}`
                                });

                                dataStream.writeMessageAnnotation({
                                    type: 'research_update',
                                    data: {
                                        id: step.id,
                                        type: 'analysis',
                                        status: 'completed',
                                        title: `Analysis of ${step.analysis.type} complete`,
                                        analysisType: step.analysis.type,
                                        findings: analysisResult.findings,
                                        message: `Analysis complete`,
                                        timestamp: Date.now(),
                                        overwrite: true
                                    }
                                });

                                analysisIndex++;  // Increment index
                            }

                            // Before returning, ensure we mark as complete if response is done
                            completedSteps = searchResults.reduce((acc, search) => {
                                // Count each search result as a step
                                return acc + (search.type === 'both' ? 2 : 1);
                            }, 0) + researchPlan.required_analyses.length;

                            const finalProgress = {
                                id: 'research-progress',
                                type: 'progress' as const,
                                status: 'completed' as const,
                                message: `Research complete: ${completedSteps}/${totalSteps} steps finished`,
                                completedSteps,
                                totalSteps,
                                isComplete: true,
                                timestamp: Date.now()
                            };

                            dataStream.writeMessageAnnotation({
                                type: 'research_update',
                                data: {
                                    ...finalProgress,
                                    overwrite: true
                                }
                            });

                            return {
                                plan: researchPlan,
                                results: searchResults
                            };
                        },
                    }),
                },
                onChunk(event) {
                    if (event.chunk.type === 'tool-call') {
                        console.log('Called Tool: ', event.chunk.toolName);
                    }
                },
                onStepFinish(event) {
                    if (event.warnings) {
                        console.log('Warnings: ', event.warnings);
                    }
                },
                onFinish(event) {
                    console.log('Fin reason: ', event.finishReason);
                    console.log('Steps ', event.steps);
                    console.log('Messages: ', event.response.messages);
                },
                onError(event) {
                    console.log('Error: ', event.error);
                },
            });

            result.consumeStream();

            return result.mergeIntoDataStream(dataStream, {
                sendReasoning: true
            });
        }
    })
}