import { playwrightScraper } from './playwright';
import { cheerioScraper } from './cheerio';
import { rateLimit } from './utils';

type ScrapeOptions = {
  maxRetries?: number;
  rateLimitMs?: number;
};

export function runScraper(source: string) {
  const scraperFn = source.startsWith('http') ? cheerioScraper : playwrightScraper;
  
  return async (url: string) => {
    const scrape = rateLimit(scraperFn(source), 1000);
    return await scrape(url);
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