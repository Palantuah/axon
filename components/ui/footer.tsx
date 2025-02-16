import { GithubLogo } from '@phosphor-icons/react';
import Link from 'next/link';
import { Icons } from '@/components/landing/icons';

export const Footer = () => {
    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black w-full flex justify-center items-center">
            <div className="mx-auto max-w-5xl px-4 py-6 w-full">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-16 flex items-center justify-center transform-gpu">
                <Icons.axon />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} All rights reserved.
            </p>
        </div>

        <div className="flex items-center gap-3">
            <Link
                href="https://github.com/Palantuah/axon"
                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
            >
                <GithubLogo className="size-6" />
            </Link>
        </div>
    </div>
</div>
        </footer>
    );
};
