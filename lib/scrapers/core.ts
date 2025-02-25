import { playwrightScraper } from './playwright';
import { cheerioScraper } from './cheerio';
import { rateLimit } from './utils';
import { ScrapedResult } from './types';

type ScrapeOptions = {
  maxRetries?: number;
  rateLimitMs?: number;
  forceCheerio?: boolean;
};

export function runScraper(source: string, options: ScrapeOptions = {}) {
  const { forceCheerio = false } = options;
  const useCheerio = forceCheerio ||
                     source.startsWith('http') ||
                     process.env.VERCEL ||
                     process.env.FORCE_CHEERIO === 'true';
  const scraperFn = useCheerio ? cheerioScraper : playwrightScraper;
  const fallbackScraperFn = useCheerio ? playwrightScraper : cheerioScraper;

  return async (url: string): Promise<ScrapedResult[]> => {
    try {
      const scrape = rateLimit(scraperFn(source), 1000);
      const results = await scrape(url);

      if (results && results.length > 0) {
        return results as ScrapedResult[]; // Primary scraper success
      } else {
        console.warn(`No results from primary scraper (${useCheerio ? 'cheerio' : 'playwright'}), trying fallback.`);
        const fallbackScrape = rateLimit(fallbackScraperFn(source), 1000);
        const fallbackResults = await fallbackScrape(url);
        if (fallbackResults && fallbackResults.length > 0) {
          return fallbackResults as ScrapedResult[]         ; 
        } else {
          console.error(`Both primary and fallback scrapers returned no results for ${url}.`);
          return []; // Both scrapers failed to get results, return empty array
        }
      }
    } catch (primaryError) {
      console.error(`Error in primary scraper (${useCheerio ? 'cheerio' : 'playwright'}): ${primaryError.message}, trying fallback.`);
      try {
        const fallbackScrape = rateLimit(fallbackScraperFn(source), 1000);
        const fallbackResults = await fallbackScrape(url);
        if (fallbackResults && fallbackResults.length > 0) {
          return fallbackResults as ScrapedResult[] ; // Fallback scraper success after primary error
        } else {
          console.error(`Fallback scraper also failed or returned no results after primary scraper error for ${url}.`);
          return []; // Fallback scraper failed or no results after primary error, return empty array
        }
      } catch (fallbackError) {
        console.error(`Fallback scraper error (${useCheerio ? 'playwright' : 'cheerio'}): ${fallbackError.message} after primary scraper error.`);
        console.error(`Both primary and fallback scrapers failed for ${url}.`);
        return []; // Both scrapers failed with errors, return empty array
      }
    }
  };
}

export const runScraperOld = async (
  source: string,
  options: ScrapeOptions = {}
) => {
  const { maxRetries = 3, rateLimitMs = 2000 } = options;
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const result = await rateLimit(
        source.includes('dynamic') 
          ? playwrightScraper(source)
          : cheerioScraper(source),
        rateLimitMs
      );
      
      return result;
    } catch (error) {
      attempts++;
      if (attempts === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
    }
  }
}; 