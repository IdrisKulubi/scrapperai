import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scrapers/core';
import db from '@/db/drizzle';
import { scrapedData } from '@/db/schema';
import { ScrapedResult } from '@/lib/scrapers/types';
import { sectorEnum } from '@/db/schema';
import { getSourceUrl } from '@/lib/scrapers/sources';

export const dynamic = 'force-dynamic';

// Add GET handler for browser navigation
export async function GET(request: Request) {
  // Get source from URL params
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  
  if (!source) {
    return NextResponse.json(
      { error: 'Source parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get the actual URL to scrape based on the source identifier
    const targetUrl = getSourceUrl(source);
    
    const scraper = runScraper(source, { 
      forceCheerio: process.env.VERCEL ? true : false 
    });
    
    // Pass the target URL, not the source identifier
    const result: ScrapedResult[] = (await scraper(targetUrl)) || [];
    
    // Store results in database
    if (result.length > 0) {
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
    }

    // Redirect back to dashboard after scraping
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Scraping failed:', error);
    return NextResponse.json(
      { error: 'Scraping failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { source } = await request.json();
  
  try {
    const targetUrl = getSourceUrl(source);
    
    const scraper = runScraper(source, { 
      forceCheerio: process.env.VERCEL ? true : false 
    });
    
    const result: ScrapedResult[] = (await scraper(targetUrl)) || [];
    
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