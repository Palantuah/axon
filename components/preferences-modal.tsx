import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { getPreferences, updatePreferences } from '@/app/api/main/actions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PreferencesModal() {
    const supabase = useMemo(() => createClient(), []);
    const [preferences, setPreferences] = useState<string[]>([]);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Available topic preferences with icons and descriptions
    const availablePreferences = [
        { id: 'Technology', icon: '💻', description: 'Latest in tech and innovation', color: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30' },
        { id: 'Music', icon: '🎵', description: 'Music news and trends', color: 'from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30' },
        { id: 'Space', icon: '🚀', description: 'Space exploration and astronomy', color: 'from-indigo-500/20 to-violet-500/20 hover:from-indigo-500/30 hover:to-violet-500/30' },
        { id: 'Health', icon: '🏥', description: 'Health and medical news', color: 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30' },
        { id: 'Finance', icon: '💰', description: 'Financial markets and business', color: 'from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30' },
        { id: 'Gaming', icon: '🎮', description: 'Gaming industry and culture', color: 'from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30' }
    ];

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const user = await supabase.auth.getUser();
                if (!user?.data?.user || !isMounted) return;

                const data = await getPreferences();
                if (isMounted) {
                    setPreferences(data || []);
                    setSelectedPreferences(data || []);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [supabase]);

    const handlePreferenceChange = (topic: string) => {
        setSelectedPreferences((prev) => {
            if (prev.includes(topic)) {
                return prev.filter((pref) => pref !== topic);
            } else {
                if (prev.length >= 3) {
                    toast.error("You can only select up to 3 preferences");
                    return prev;
                }
                return [...prev, topic];
            }
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const result = await updatePreferences(selectedPreferences);
        if (result.success) {
            setPreferences(selectedPreferences);
            toast.success("Preferences updated successfully");
            setOpen(false);
        } else {
            toast.error("Failed to update preferences");
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl border-neutral-200/20 dark:border-neutral-700/20">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400">
                            Customize Your Feed
                        </DialogTitle>
                        <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                            Select up to 3 topics you're interested in to personalize your content
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <AnimatePresence>
                            {availablePreferences.map((topic) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handlePreferenceChange(topic.id)}
                                    className={`
                                        relative p-4 rounded-xl cursor-pointer
                                        bg-gradient-to-br transition-all duration-300
                                        ${selectedPreferences.includes(topic.id)
                                            ? topic.color
                                            : 'from-neutral-200/20 to-neutral-300/20 hover:from-neutral-200/30 hover:to-neutral-300/30 dark:from-neutral-700/20 dark:to-neutral-800/20 dark:hover:from-neutral-700/30 dark:hover:to-neutral-800/30'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl">{topic.icon}</span>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{topic.id}</h3>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">{topic.description}</p>
                                        </div>
                                    </div>
                                    {selectedPreferences.includes(topic.id) && (
                                        <Badge 
                                            variant="secondary" 
                                            className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 text-neutral-900 dark:text-neutral-100"
                                        >
                                            Selected
                                        </Badge>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {selectedPreferences.length > 0 && (
                        <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                            <AlertCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                You have selected {selectedPreferences.length}/3 preferences
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-neutral-100/50 dark:bg-neutral-800/50 border-t border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="flex justify-between w-full">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedPreferences(preferences);
                                setOpen(false);
                            }}
                            className="text-neutral-600 dark:text-neutral-400"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading || selectedPreferences.length === 0}
                            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white"
                        >
                            {loading ? 'Saving...' : 'Save Preferences'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 