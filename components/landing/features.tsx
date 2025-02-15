import { motion } from 'framer-motion';
import { Brain, Search, Image, Command, GraduationCap, Sparkles } from 'lucide-react';

export function Features() {
    return (
        <div className="py-24 px-4">
            <motion.div
                className="container max-w-5xl mx-auto space-y-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Advanced Search Features</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Experience a smarter way to search with AI-powered features that understand your queries better.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: 'Smart Understanding',
                            description: 'Uses multiple AI models to better understand your questions',
                        },
                        {
                            icon: Search,
                            title: 'Comprehensive Search',
                            description: 'Searches across multiple sources for complete answers',
                        },
                        {
                            icon: Image,
                            title: 'Image Understanding',
                            description: 'Can understand and explain images you share',
                        },
                        {
                            icon: Command,
                            title: 'Smart Calculations',
                            description: 'Performs complex calculations and analysis in real-time',
                        },
                        {
                            icon: GraduationCap,
                            title: 'Research Assistant',
                            description: 'Helps find and explain academic research',
                        },
                        {
                            icon: Sparkles,
                            title: 'Natural Conversations',
                            description: 'Responds in a clear, conversational way',
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
