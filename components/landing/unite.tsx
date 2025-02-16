'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { Icons } from '@/components/landing/icons';
export function Unite() {
    return (
        <div className="flex flex-row items-center justify-center py-20 h-screen md:h-auto bg-background relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full md:h-[40rem] px-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                    }}
                    className="div"
                >
                    <h2 className="text-center text-xl md:text-4xl font-bold text-foreground">
                        Bridging Information Complexity with Clarity
                    </h2>
                    <p className="text-center text-base md:text-lg font-normal text-muted-foreground max-w-lg mt-4 mx-auto">
                        Delivering rigorous research and unbiased analysis through advanced AI synthesis and comprehensive data integration.
                    </p>
                </motion.div>

                <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden mt-12">
                    <Icons.axon/>
                    <OrbitingCircles iconSize={50} radius={180} speed={0.5}>
                        <Icons.openai />
                        <Icons.anthropic />
                        <Icons.deepseek />
                        <Icons.groq />
                        <Icons.scrapybara />
                        {/* fix this one - not evne scrappybara rn */}
                        <Icons.elevenlabs />
                        {/* make this svg smaller by 25% */}
                        <Icons.exa />
                    </OrbitingCircles>
                    <OrbitingCircles iconSize={30} radius={120} reverse speed={1}>
                        <Icons.vercel />
                        <Icons.e2b />
                        {/* make e2b 15% larger */}
                        <Icons.tavily />
                        <Icons.x />
                        <Icons.supabase />
                        <Icons.google />
                    </OrbitingCircles>
                </div>

                <div className="absolute w-full bottom-0 inset-x-0 h-40 bg-gradient-to-b pointer-events-none select-none from-transparent dark:to-black to-white z-40" />
            </div>
        </div>
    );
}
