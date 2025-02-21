import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scrapers/core';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { source } = await request.json();
  
  try {
    const result = await runScraper(source);
    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '9',
        'X-RateLimit-Reset': '3600'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Scraping failed after multiple attempts' },
      { status: 429 }
    );
  }
} 