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
    
    $(this.selectors.v1.container).each((i, el) => {
      results.push({
        title: $(el).find(this.selectors.v1.title).text().trim(),
        content: $(el).find(this.selectors.v1.content).text().trim(),
        date: $(el).find(this.selectors.v1.date).text().trim(),
        url: $(el).find('a').attr('href') || '',
      });
    });

    return results;
  },
  validate: (result: ScrapedResult) => {
    return !!result.title && !!result.content && !!result.url;
  },
}; 