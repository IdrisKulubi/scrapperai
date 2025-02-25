import { NextResponse } from 'next/server';
import { runScraper } from '@/lib/scrapers/core';
import db from '@/db/drizzle';
import { scrapedData } from '@/db/schema';
import { ScrapedResult } from '@/lib/scrapers/types';
import { sectorEnum } from '@/db/schema';
import { getSourceUrl, getPrioritizedSources, sources } from '@/lib/scrapers/sources';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for longer scraping operations

// Helper function to scrape a single source
async function scrapeSource(source: string) {
  try {
    const targetUrl = getSourceUrl(source);
    
    const scraper = runScraper(source, { 
      forceCheerio: process.env.VERCEL ? true : false 
    });
    
    console.log(`Scraping ${source} from ${targetUrl}...`);
    const results = await scraper(targetUrl);
    console.log(`Found ${results.length} results from ${source}`);
    
    return results;
  } catch (error) {
    console.error(`Error scraping ${source}:`, error);
    return [];
  }
}

// Add GET handler for browser navigation
export async function GET(request: Request) {
  // Get source from URL params
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const all = searchParams.get('all') === 'true';
  
  try {
    let allResults: ScrapedResult[] = [];
    
    // Scrape all sources if requested
    if (all) {
      console.log('Scraping all sources...');
      // Get top priority sources first
      const prioritizedSources = getPrioritizedSources().slice(0, 5); // Limit to top 5 for performance
      
      // Scrape sources in sequence to avoid rate limiting
      for (const sourceConfig of prioritizedSources) {
        const sourceId = Object.keys(sources).find(key => sources[key].url === sourceConfig.url) || '';
        const results = await scrapeSource(sourceId);
        allResults = [...allResults, ...results];
      }
    } 
    // Scrape multiple sources if comma-separated list
    else if (source && source.includes(',')) {
      const sourceList = source.split(',');
      console.log(`Scraping multiple sources: ${sourceList.join(', ')}...`);
      
      for (const sourceId of sourceList) {
        const results = await scrapeSource(sourceId.trim());
        allResults = [...allResults, ...results];
      }
    }
    // Scrape single source
    else if (source) {
      allResults = await scrapeSource(source);
    } else {
      return NextResponse.json(
        { error: 'Source parameter is required. Use ?source=afdb or ?all=true' },
        { status: 400 }
      );
    }
    
    // Store results in database
    if (allResults.length > 0) {
      await db.insert(scrapedData).values(
        allResults.map((item) => ({
          source: item.source,
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
      
      console.log(`Stored ${allResults.length} results in database`);
    } else {
      console.warn('No results found from any source');
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

// Update POST handler similarly
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source, all } = body;
    
    let allResults: ScrapedResult[] = [];
    
    if (all) {
      // Similar implementation as GET for all sources
      const prioritizedSources = getPrioritizedSources().slice(0, 5);
      
      for (const sourceConfig of prioritizedSources) {
        const sourceId = Object.keys(sources).find(key => sources[key].url === sourceConfig.url) || '';
        const results = await scrapeSource(sourceId);
        allResults = [...allResults, ...results];
      }
    } else if (source) {
      allResults = await scrapeSource(source);
    } else {
      return NextResponse.json(
        { error: 'Source parameter is required or set all=true' },
        { status: 400 }
      );
    }
    
    // Store results in database
    if (allResults.length > 0) {
      await db.insert(scrapedData).values(
        allResults.map((item) => ({
          source: item.source,
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

    return NextResponse.json(
      { success: true, count: allResults.length, results: allResults },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '9',
          'X-RateLimit-Reset': '3600'
        }
      }
    );
  } catch (error) {
    console.error('Scraping failed:', error);
    return NextResponse.json(
      { error: 'Scraping failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 