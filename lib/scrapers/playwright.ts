import { chromium } from 'playwright';
import { ScrapedResult } from './types';

export const playwrightScraper = (source: string) => async (url: string) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  const results = [] as ScrapedResult[];
  
  results.push({
    url: url, 
    content: await page.content(), 
    classification: {
      relevant: true,
      sector: 'other',
      relevance_score: 70,
      deadline: undefined,
    },
    timestamp: new Date(),
    source: source, 
  });
  
  await browser.close();
  return results;
}; 