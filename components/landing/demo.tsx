import { motion } from 'framer-motion';
import { Check, Bot } from 'lucide-react';
import { TextLoop } from '@/components/core/text-loop';
import { TextShimmer } from '@/components/core/text-shimmer';



export function Demo() {
    return(
                <div className="py-24 px-4 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
                <motion.div 
                    className="container max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl font-bold">RAG & Search Grounding</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Watch how Axon combines RAG and search grounding to deliver accurate, up-to-date answers from reliable sources.
                        </p>
                    </div>

                    <div className="relative max-w-2xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-8 space-y-8">
                        {/* Query */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">Query</p>
                                <p className="text-neutral-900 dark:text-neutral-100">
                                    Explain quantum computing and its real-world applications
                                </p>
                            </div>
                        </div>

                        {/* Processing */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">Processing with</p>
                                    <TextLoop interval={1.5}>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🔍 Retrieving relevant information...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            📚 Processing search results...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            🤖 Generating response...
                                        </p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            ✨ Enhancing with context...
                                        </p>
                                    </TextLoop>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-neutral-500">Generating response</p>
                                    <TextShimmer className="text-sm font-medium">
                                        Combining insights from multiple sources for a comprehensive answer...
                                    </TextShimmer>
                                </div>
                            </div>
                        </div>

                        {/* Response Preview */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0 flex items-center justify-center">
                                <Check className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-neutral-500">Response Preview</p>
                                <div className="prose prose-sm dark:prose-invert">
                                    <p className="text-neutral-900 dark:text-neutral-100">
                                        Quantum computing is a revolutionary technology that harnesses quantum mechanics to solve complex problems...
                                    </p>
                                    <div className="text-xs text-neutral-500 mt-2">
                                        Sources: Nature Physics, IBM Research, MIT Technology Review
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
    );
}
