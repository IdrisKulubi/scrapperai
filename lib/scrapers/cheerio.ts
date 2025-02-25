import { load } from 'cheerio';
import { ScrapedResult } from './types';

export const cheerioScraper = (source: string) => async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = load(html);

  // Add site-specific parsing logic here
  const results: ScrapedResult[] = [];
  
  $('div.opportunity-item').each((i, el) => {
    results.push({
      url: $(el).find('a').attr('href') || '',
      content: $(el).text(),
      classification: {
        relevant: true,
        sector: 'energy',
        relevance_score: 85,
        deadline: $(el).find('.deadline').text()
      },
      timestamp: new Date(),
      source: source,
    });
  });
  
  return results;
}; 