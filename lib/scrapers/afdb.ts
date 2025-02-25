import { CheerioAPI } from 'cheerio';
import { ScrapedResult } from './types';

export const afdbScraper = {
  name: 'African Development Bank',
  baseUrl: 'https://www.afdb.org',
  selectors: {
    v1: {
      container: 'div.opportunity-listing',
      title: 'h3.opportunity-title',
      content: 'div.opportunity-content',
      date: 'span.posting-date',
    },
  },
  parser: ($: CheerioAPI): ScrapedResult[] => {
    const results: ScrapedResult[] = [];
    
    if (!afdbScraper.selectors.v1) {
      console.warn("Selectors v1 is undefined, skipping parsing.");
      return results;
    }
    
    const v1Selectors = afdbScraper.selectors.v1;
    
    $(v1Selectors.container).each((i, el) => {
      results.push({
        title: $(el).find(v1Selectors.title).text().trim(),
        content: $(el).find(v1Selectors.content).text().trim(),
        date: $(el).find(v1Selectors.date).text().trim(),
        url: $(el).find('a').attr('href') || '',
        source: afdbScraper.name || '',
        timestamp: new Date(),
        classification: {
          relevant: true,
          sector: 'infrastructure',
          relevance_score: 0.8,
        },
      });
    });

    return results;
  },
  validate: (result: ScrapedResult) => {
    return !!result.title && !!result.content && !!result.url;
  },
}; 