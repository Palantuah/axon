
import { NextResponse } from 'next/server';

export interface TrendingQuery {
    icon: string;
    text: string;
    category: string;
}


export async function GET(req: Request) {
    try {
        // Removed fetching logic, directly return fallback queries
        return NextResponse.json([
            {
                icon: 'sparkles',
                text: 'Global Climate Agreement Reached',
                category: 'politics',
            },
            {
                icon: 'code',
                text: 'New AI Model Breaks Records',
                category: 'tech',
            },
            {
                icon: 'globe',
                text: 'Stock Markets Hit All-Time High',
                category: 'finance',
            },
            {
                icon: 'sparkles',
                text: 'Major Sports Championship Results',
                category: 'sports',
            },
            {
                icon: 'globe',
                text: 'Breakthrough in Cancer Research',
                category: 'health',
            },
            {
                icon: 'code',
                text: 'Space Mission Makes New Discovery',
                category: 'science',
            },
        ]);
    } catch (error) {
        console.error('Failed to fetch trends:', error);
        return NextResponse.error();
    }
}
