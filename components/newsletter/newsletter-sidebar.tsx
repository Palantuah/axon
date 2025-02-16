import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useNewsletterStore } from '@/lib/store/newsletter-store';
import { format, formatDistanceToNow } from 'date-fns';
import { Loader2, Clock, FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseNewsletterText } from '@/lib/newsletter-utils';
import { redirect, useRouter } from 'next/navigation';

interface UserDigest {
    id: string;
    updated_at: string;
    combined_analysis: string;
    formatted_content: string | null;
}

interface DigestMetadata {
    articleCount: number;
    readTimeMinutes: number;
}

function calculateDigestMetadata(content: string): DigestMetadata {
    // Calculate article count
    const articles = parseNewsletterText(content)[0].articles;
    const articleCount = articles.length;

    // Calculate read time (average reading speed: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    return {
        articleCount,
        readTimeMinutes
    };
}

export const NewsletterSidebar = () => {
    const router = useRouter();
    const [digests, setDigests] = useState<UserDigest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);
    const { selectedDigestId, setSelectedDigestId } = useNewsletterStore();
    const supabase = createClient();

    const selectedDigest = digests.find(d => d.id === selectedDigestId);

    const formatContent = async () => {
        if (!selectedDigest || selectedDigest.formatted_content) {
            return;
        }
        try {
            setIsFormatting(true);

            const response = await fetch('/api/newsletter-format', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: selectedDigest.combined_analysis }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to format newsletter');
            }

            if (data.formattedContent) {
                const { error: supabaseError } = await supabase
                    .from('user_digests')
                    .update({ 
                        formatted_content: data.formattedContent,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', selectedDigest.id);

                if (supabaseError) {
                    console.error('Error saving to Supabase:', supabaseError);
                } else {
                    // Refresh the digests to get the updated content
                    fetchDigests();
                }
            }
        } catch (err) {
            console.error('Error formatting newsletter:', err);
        } finally {
            setIsFormatting(false);
        }
    };

    const resetFormatting = async () => {
        if (!selectedDigest) return;

        try {
            const { error } = await supabase
                .from('user_digests')
                .update({ formatted_content: null })
                .eq('id', selectedDigest.id);

            if (!error) {
                fetchDigests();
            }
        } catch (err) {
            console.error('Error resetting format:', err);
        }
    };

    const fetchDigests = async () => {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const { data, error } = await supabase
                .from('user_digests')
                .select('id, updated_at, combined_analysis, formatted_content')
                .eq('user_id', userData.user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            setDigests(data || []);
            
            if (data && data.length > 0 && !selectedDigestId) {
                setSelectedDigestId(data[0].id);
            }
        } catch (err) {
            console.error('Error fetching digests:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDigests();
    }, []);

    if (isLoading) {
        return (
            <div className="w-64 bg-background border-r border-border p-4 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="w-64 bg-background border-r border-border flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-medium text-foreground">Your Newsletters</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
                {digests.map((digest) => {
                    const metadata = calculateDigestMetadata(digest.formatted_content || digest.combined_analysis);
                    const updatedAt = new Date(digest.updated_at);
                    
                    return (
                        <button
                            key={digest.id}
                            onClick={() => setSelectedDigestId(digest.id)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg transition-colors",
                                "hover:bg-muted group",
                                selectedDigestId === digest.id ? "bg-muted/80" : ""
                            )}
                        >
                            {/* Date and Time Ago */}
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-foreground">
                                    {format(updatedAt, 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(updatedAt, { addSuffix: true })}
                                </div>
                            </div>

                            {/* Article Count and Read Time */}
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <FileText className="w-3 h-3" />
                                    <span className="font-medium">{metadata.articleCount}</span>
                                    <span className="text-muted-foreground/60">articles</span>
                                </div>
                                <div className="text-xs text-muted-foreground/60">
                                    {metadata.readTimeMinutes}m read
                                </div>
                            </div>

                            {/* Status Indicator */}
                            <div className={cn(
                                "w-full h-0.5 mt-3 rounded-full bg-muted/50",
                                "group-hover:bg-muted-foreground/20 transition-colors",
                                selectedDigestId === digest.id && "bg-muted-foreground/30"
                            )}>
                                <div 
                                    className={cn(
                                        "h-full rounded-full transition-all duration-300",
                                        digest.formatted_content ? "bg-primary w-full" : "bg-secondary w-1/2"
                                    )}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border space-y-2">
                <button
                    onClick={formatContent}
                    disabled={isFormatting || !selectedDigest || selectedDigest.formatted_content !== null}
                    className={cn(
                        "w-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground",
                        "bg-muted hover:bg-muted/80 rounded-md transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                >
                    {isFormatting ? 'Formatting...' : 
                     selectedDigest?.formatted_content ? 'Already Formatted' : 
                     'Format with AI'}
                </button>
                
                {selectedDigest?.formatted_content && (
                    <button
                        onClick={resetFormatting}
                        className="w-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground 
                                 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                        Reset to Original
                    </button>
                )}
            </div>
        </div>
    );
}; 