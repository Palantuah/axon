import { useState, useEffect } from 'react';
import { ScrollProgress } from '@/components/news/scroll-progress';
import { FormattedNewsletter } from '@/components/newsletter/formatted-newsletter';
import { parseNewsletterText } from '@/lib/newsletter-utils';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UserDigest {
    id: string;
    user_id: string;
    combined_analysis: string;
    formatted_content: string | null;
    updated_at: string;
    source_analysis_ids: string[];
    eleven_labs_url: string | null;
}

interface NewsletterContentProps {
    digestId?: string;
}

export const NewsletterContent = ({ digestId }: NewsletterContentProps) => {
    const [isFormatting, setIsFormatting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formattedContent, setFormattedContent] = useState<string | null>(null);
    const [originalContent, setOriginalContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [supabaseRow, setSupabaseRow] = useState<UserDigest | null>(null);
    const supabase = createClient();

    // Function to fetch digest by ID or most recent
    const fetchDigest = async (id?: string) => {
        try {
            setIsLoading(true);
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            let query = supabase
                .from('user_digests')
                .select('*')
                .eq('user_id', userData.user.id);

            if (id) {
                query = query.eq('id', id);
            } else {
                query = query.order('updated_at', { ascending: false }).limit(1);
            }

            const { data: digest, error: digestError } = await query.single();

            if (digestError) throw digestError;

            if (digest) {
                setSupabaseRow(digest);
                setOriginalContent(digest.combined_analysis);
                if (digest.formatted_content) {
                    setFormattedContent(digest.formatted_content);
                    toast.info('Using previously formatted content');
                } else if (digest.combined_analysis) {
                    await formatContent(digest.combined_analysis, digest.id);
                }
            }
        } catch (err) {
            console.error('Error fetching digest:', err);
            setError('Failed to fetch digest');
        } finally {
            setIsLoading(false);
        }
    };

    const formatContent = async (content: string, id?: string) => {
        if (formattedContent) {
            toast.info('Content is already formatted');
            return;
        }
        try {
            setIsFormatting(true);
            setError(null);

            const response = await fetch('/api/newsletter-format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to format newsletter');
            }

            if (data.formattedContent) {
                setFormattedContent(data.formattedContent);
                const update_cell = data.formattedContent;

                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData?.user) {
                    toast.error('Authentication error while saving newsletter');
                    return;
                }

                const { error: supabaseError } = await supabase
                    .from('user_digests')
                    .update({ 
                        formatted_content: update_cell,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select();

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

    useEffect(() => {
        fetchDigest(digestId);
    }, [digestId]);

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
                        Newsletter
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

            <div className="h-screen overflow-y-auto pt-32 pb-8 px-4 scrollbar-hide">
                <FormattedNewsletter sections={newsData} />
            </div>
        </div>
    );
}; 