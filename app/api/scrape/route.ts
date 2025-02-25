import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scrapers/core';
import  db  from '@/db/drizzle';
import { scrapedData } from '@/db/schema';
import { ScrapedResult } from '@/lib/scrapers/types';
import { sectorEnum } from '@/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { source } = await request.json();
  
  try {
    const scraper = runScraper(source);
    const result: ScrapedResult[] = (await scraper(source)) || [];
    
    // Store results in database
    await db.insert(scrapedData).values(
      result.map((item) => ({
        source,
        url: item.url,
        content: item.content,
        aiResponse: item.classification,
        relevant: item.classification.relevant,
        sector: item.classification.sector as typeof sectorEnum.enumValues[number],
        relevanceScore: item.classification.relevance_score,
        deadline: item.classification.deadline ?
          new Date(item.classification.deadline) : null
      }))
    );

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '9',
        'X-RateLimit-Reset': '3600'
      }
    });
  } catch (error) {
    console.error('Scraping failed:', error);
    return NextResponse.json(
      { error: 'Scraping failed after multiple attempts' },
      { status: 500 }
    );
  }
} 