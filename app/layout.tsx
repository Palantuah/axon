import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from 'geist/font/sans';
import 'katex/dist/katex.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  metadataBase: new URL("https://axon.app"),
  title: "Axon",
  description: "Axon is a minimalistic AI-powered search engine that helps you find information on the internet.",
  openGraph: {
    url: "https://axon.app",
    siteName: "Axon",
  },
  keywords: [
    "Palantuah",
    "Palantuah Labs",
    "Treehacks",
    "Axon",
    "axon",
    "axon.app",
    "axon ai",
    "axon ai app",
    "axon",
    "MiniPerplx",
    "Axon AI",
    "open source ai search engine",
    "minimalistic ai search engine",
    "ai search engine",
    "Axon (Formerly MiniPerplx)",
    "AI Search Engine",
    "mplx.run",
    "mplx ai",
    "axon.how",
    "search engine",
    "AI",
    "perplexity",
    "Aadvik Vashist",
    "Noah Pan Stier",
    "Vedant Srinivas",
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' }
  ],
}

const syne = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
   preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <NuqsAdapter>
          <Providers>
            <Toaster position="top-center" richColors />
            <main className="flex flex-col min-h-screen w-full">
              {children}
            </main>
          </Providers>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
