/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, XLogo } from '@phosphor-icons/react';
import { Bot, Brain, Command, GraduationCap, Image, Search, Share2, Sparkles, Star, Trophy, Users, AlertTriangle, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextLoop } from '@/components/core/text-loop';
import { TextShimmer } from '@/components/core/text-shimmer';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Unite } from '@/components/landing/unite';
import { Hero } from '@/components/landing/hero';

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <Hero />
            <Unite />

            {/* Search Simulation */}
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


            {/* Features Section */}
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
                                title: "Smart Understanding",
                                description: "Uses multiple AI models to better understand your questions" 
                            },
                            { 
                                icon: Search, 
                                title: "Comprehensive Search",
                                description: "Searches across multiple sources for complete answers" 
                            },
                            { 
                                icon: Image, 
                                title: "Image Understanding",
                                description: "Can understand and explain images you share" 
                            },
                            { 
                                icon: Command, 
                                title: "Smart Calculations",
                                description: "Performs complex calculations and analysis in real-time" 
                            },
                            { 
                                icon: GraduationCap, 
                                title: "Research Assistant",
                                description: "Helps find and explain academic research" 
                            },
                            { 
                                icon: Sparkles, 
                                title: "Natural Conversations",
                                description: "Responds in a clear, conversational way" 
                            }
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

            {/* New Use Cases Section */}
            <div className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900/50 border-y border-neutral-200 dark:border-neutral-800">
                <motion.div className="container max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold">Built For Everyone</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Whether you need quick answers or in-depth research, Axon adapts to your search needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Students</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Research paper assistance</li>
                                <li>Complex topic explanations</li>
                                <li>Math problem solving</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Researchers</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Academic paper analysis</li>
                                <li>Data interpretation</li>
                                <li>Literature review</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <h3 className="text-lg font-semibold mb-2">Professionals</h3>
                            <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
                                <li>Market research</li>
                                <li>Technical documentation</li>
                                <li>Data analysis</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Section */}
            <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
                <div className="mx-auto max-w-5xl px-4 py-12">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <img src="/axon.png" alt="Axon Logo" className="h-8 w-8 invert" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                © {new Date().getFullYear()} All rights reserved.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link
                                href="https://x.com/axonai"
                                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <XLogo className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://git.new/axon"
                                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 