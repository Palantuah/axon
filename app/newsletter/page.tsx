'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { ScrollProgress } from '@/components/news/scroll-progress';
import { FormattedNewsletter } from '@/components/newsletter/formatted-newsletter';
import { parseNewsletterText } from '@/lib/newsletter-utils';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const NewsletterPage = () => {
    const [isFormatting, setIsFormatting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formattedContent, setFormattedContent] = useState<string | null>(null);
    const [originalContent, setOriginalContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    
    interface UserDigest {
        id: string;
        user_id: string;
        combined_analysis: string;
        formatted_content: string | null;
        updated_at: string;
        source_analysis_ids: string[];
        eleven_labs_url: string | null;
    }
    
    const [supabaseRow, setSupabaseRow] = useState<UserDigest | null>(null);
    // Function to fetch most recent digest
    const fetchRecentDigest = async () => {
        try {
            setIsLoading(true);
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data: digest, error: digestError } = await supabase
                .from('user_digests')
                .select('*')
                .eq('user_id', userData.user.id)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            if (digestError) throw digestError;

            if (digest) {
                console.log(digest);
                setSupabaseRow(digest);
                setOriginalContent(digest.combined_analysis);
                if (digest.formatted_content) {
                    setFormattedContent(digest.formatted_content);
                    toast.info('Using previously formatted content');
                } else if (digest.combined_analysis) {
                    // Auto-format if no formatted content exists
                    await formatContent(digest.combined_analysis, digest.id);
                }
            }
        } catch (err) {
            console.error('Error fetching recent digest:', err);
            setError('Failed to fetch recent digest');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to format content using server API
    const formatContent = async (content: string, id?: string) => {
        // Prevent reformatting if we already have formatted content
        if (formattedContent) {
            toast.info('Content is already formatted');
            return;
        }
        try {
            setIsFormatting(true);
            setError(null);

            const response = await fetch('/api/newsletter-format', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to format newsletter');
            }

            if (data.formattedContent) {
                setFormattedContent(data.formattedContent);
                const update_cell = data.formattedContent;

                // Verify user session before update
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    console.error('User session error:', userError);
                    toast.error('Authentication error while saving newsletter');
                    return;
                }

                if (!userData?.user) {
                    console.error('No authenticated user found');
                    toast.error('Please log in to save newsletter');
                    return;
                }

                console.log("Attempting Supabase update with:", {
                    digestId: id,
                    contentLength: data.formattedContent.length,
                    timestamp: new Date().toISOString(),
                    update_cell
                });
                

                const { error: supabaseError, data: updateData } = await supabase
                    .from('user_digests')
                    .update({ 
                        formatted_content: update_cell,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select();

                // Add detailed logging
                console.log("Update attempt details:", {
                    id,
                    contentLength: update_cell.length,
                    timestamp: new Date().toISOString(),
                    updateResult: {
                        error: supabaseError?.message,
                        errorCode: supabaseError?.code,
                        data: updateData,
                        status: supabaseError?.status
                    }
                });
                
                // Verify the update by fetching the row
                const { data: verifyData, error: verifyError } = await supabase
                    .from('user_digests')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                console.log("Verification fetch result:", {
                    error: verifyError,
                    data: verifyData,
                    formatted_content_length: verifyData?.formatted_content?.length,
                    matches_update: verifyData?.formatted_content === update_cell
                });

                if (supabaseError) {
                    console.error('Error saving to Supabase:', supabaseError);
                    toast.error('Newsletter formatted but failed to save to database');
                } else {
                    toast.success('Newsletter formatted and saved successfully');
                }
            } else {
                throw new Error('No formatted content received');
            }
        } catch (err) {
            console.error('Error formatting newsletter:', err);
            setError('Failed to format newsletter. Please try again.');
        } finally {
            setIsFormatting(false);
        }
    };

    // Fetch digest on initial load
    useEffect(() => {
        fetchRecentDigest();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                    <p className="text-white/70">Loading your newsletter...</p>
                </div>
            </div>
        );
    }

    if (isFormatting) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                    <p className="text-white/70">Formatting newsletter with AI...</p>
                </div>
            </div>
        );
    }

    if (!originalContent) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-white/70">No newsletter content found.</p>
                </div>
            </div>
        );
    }

    // Parse the content - use formatted content if available, otherwise use original
    const newsData = parseNewsletterText(formattedContent || originalContent);

    return (
        <div className="min-h-screen w-full bg-black">
            <ScrollProgress />

            <div className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md z-40 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-medium text-white/90"
                    >
                        Today&apos;s Newsletter
                    </motion.h1>

                    <div className="mt-4 flex items-center gap-2">
                        <button
                            onClick={() => formatContent(originalContent!, supabaseRow?.id)}
                            disabled={isFormatting || formattedContent !== null}
                            className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white 
                       bg-white/5 hover:bg-white/10 rounded-md transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formattedContent ? 'Already Formatted' : 'Format with AI'}
                        </button>
                        {formattedContent && (
                            <button
                                onClick={() => {
                                    setFormattedContent(null);
                                    setError(null);
                                }}
                                className="px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white 
                         bg-white/5 hover:bg-white/10 rounded-md transition-colors"
                            >
                                Reset to Original
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-md">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div ref={containerRef} className="h-screen overflow-y-auto pt-32 pb-8 px-4 scrollbar-hide">
                <FormattedNewsletter sections={newsData} />
            </div>
        </div>
    );
};

export default NewsletterPage;
