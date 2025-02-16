import { motion } from 'framer-motion';
import { Brain, Search, Image, Command, GraduationCap, Sparkles } from 'lucide-react';
import HalftoneWaves from '@/components/ui/halftone-waves';
export function Features() {
    return (
        <div className="px-4 h-fit relative z-10 overflow-hidden">
            <HalftoneWaves />
            <motion.div
                className="relative max-w-5xl mx-auto z-20 flex flex-col py-16 gap-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="relative text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white">Smart Content Synthesis</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Experience personalized newsletters and podcasts crafted from your preferred topics and trusted sources.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: 'Topic Analysis',
                            description: 'Advanced AI understands your interests and finds relevant content sources',
                        },
                        {
                            icon: Search,
                            title: 'Multi-Source Synthesis',
                            description: 'Combines content from numerous newsletters and publications into one digest',
                        },
                        {
                            icon: Command,
                            title: 'Audio Transformation',
                            description: 'Converts written content into engaging podcast episodes',
                        },
                        {
                            icon: Sparkles,
                            title: 'Custom Formatting',
                            description: 'Delivers content in your preferred style and format',
                        },
                        {
                            icon: GraduationCap,
                            title: 'Source Verification',
                            description: 'Ensures all content comes from reliable and authoritative sources',
                        },
                        {
                            icon: Image,
                            title: 'Rich Media Integration',
                            description: 'Includes relevant images, charts, and visualizations in your newsletter',
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="group relative p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
                            whileHover={{ y: -4 }}
                        >
                            <div className="space-y-4">
                                <div className="p-2.5 w-fit rounded-xl bg-neutral-100 dark:bg-neutral-800">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
