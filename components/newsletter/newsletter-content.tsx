import { useState, useEffect, useCallback } from 'react';
import { FormattedNewsletter } from '@/components/newsletter/formatted-newsletter';
import { parseNewsletterText } from '@/lib/newsletter-utils';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PodcastPlayer } from '@/components/newsletter/podcast-player';

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

    const fetchDigest = useCallback(async (id?: string) => {
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
                    console.log(digest.formatted_content)
                    setFormattedContent(digest.formatted_content);
                    toast.info('Using previously formatted content');
                } else if (digest.combined_analysis) {
                    await formatContent(digest.combined_analysis, digest.id);
                }
            }
        } catch (err) {
            setError('Failed to fetch digest');
        } finally {
            setIsLoading(false);
        }
    }, [supabase, formattedContent]);

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
                // Update local state first
                console.log(data.formatted_content);
                setFormattedContent(data.formattedContent);
                const update_cell = data.formattedContent;

                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData?.user) {
                    toast.error('Authentication error while saving newsletter');
                    return;
                }

                // Update database
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
                    // Force a re-fetch to ensure UI is in sync with database
                    await fetchDigest(id);
                }
            } else {
                throw new Error('No formatted content received');
            }
        } catch (err) {
            console.error('Error formatting newsletter:', err);
            setError('Failed to format newsletter. Please try again.');
            // Reset formatted content on error
            setFormattedContent(null);
        } finally {
            setIsFormatting(false);
        }
    };

    useEffect(() => {
        fetchDigest(digestId);
    }, [digestId, fetchDigest]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading your newsletter...</p>
                </div>
            </div>
        );
    }

    if (isFormatting) {
        return (
            <div className="min-h-screen w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Formatting newsletter with AI...</p>
                </div>
            </div>
        );
    }

    if (!originalContent) {
        return (
            <div className="min-h-screen w-full bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-muted-foreground">No newsletter content found.</p>
                </div>
            </div>
        );
    }

    const newsData = parseNewsletterText(formattedContent || originalContent);

    return (
        <div className="relative h-screen flex flex-col bg-background">
            <div className="sticky top-0 bg-background/50 backdrop-blur-md z-40 border-b border-border">
                <div className="px-4 py-6">
                    <div className="flex items-center gap-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-medium text-foreground"
                        >
                            Axon Agentic News
                        </motion.h1>
                        
                        {supabaseRow?.eleven_labs_url ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex-1"
                            >
                                <PodcastPlayer audioUrl={supabaseRow.eleven_labs_url} />
                            </motion.div>
                        ) : (
                            <div className="text-sm text-muted-foreground">No audio available</div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-md">
                            <p className="text-destructive text-sm">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
                <FormattedNewsletter sections={newsData} />
            </div>
        </div>
    );
}; 