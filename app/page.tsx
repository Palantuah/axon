/* eslint-disable @next/next/no-img-element */
'use client';

import { GithubLogo } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Demo } from '@/components/landing/demo';
import { Features } from '@/components/landing/features';
import { Hero } from '@/components/landing/hero';
import { Unite } from '@/components/landing/unite';
import { Icons } from '@/components/landing/icons';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col">
            <Header />
            <main className="flex-1">
                <Hero />
                <Unite />
                <Demo />
                <Features />
            </main>

            {/* Footer Section */}
            <Footer />
        </div>
    );
}
