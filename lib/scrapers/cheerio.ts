import { load } from 'cheerio';
import { ScrapedResult } from './types';
import { getSourceConfig } from './sources';

export const cheerioScraper = (source: string) => async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': process.env.SCRAPER_USER_AGENT || 'Mozilla/5.0 (compatible; SustainScraper/1.0)'
    }
  });
  
  const html = await response.text();
  const $ = load(html);
  
  const results: ScrapedResult[] = [];
  const sourceConfig = getSourceConfig(source);
  const selectors = sourceConfig?.selectors || {
    container: 'div.opportunity-item',
    title: 'h3',
    content: '.content',
    date: '.date',
    link: 'a'
  };
  
  // Use source-specific selectors
  $(selectors.container).each((i, el) => {
    const $el = $(el);
    const title = $el.find(selectors.title).text().trim();
    const content = $el.find(selectors.content).text().trim();
    const dateText = $el.find(selectors.date).text().trim();
    
    // Extract link - handle both relative and absolute URLs
    let link = $el.find(selectors.link).attr('href') || '';
    if (link && !link.startsWith('http')) {
      // Handle relative URLs
      const urlObj = new URL(url);
      if (link.startsWith('/')) {
        link = `${urlObj.origin}${link}`;
      } else {
        link = `${urlObj.origin}/${link}`;
      }
    }
    
    // Only add if we have meaningful content
    if (title || content) {
      results.push({
        url: link,
        content: `${title}\n\n${content}\n\nDeadline: ${dateText}`,
        classification: {
          relevant: true,
          sector: 'energy', // Default, will be refined by AI
          relevance_score: 85,
          deadline: dateText || undefined
        },
        timestamp: new Date(),
        source: sourceConfig?.name || source,
        title: title,
        date: dateText
      });
    }
  });
  
  // If no results found with specific selectors, try a more generic approach
  if (results.length === 0) {
    console.log(`No results found with specific selectors for ${source}, trying generic approach`);
    
    // Look for common opportunity patterns
    $('div, article, section').each((i, el) => {
      const $el = $(el);
      const text = $el.text();
      
      // Only process elements with substantial text
      if (text.length > 100) {
        // Look for keywords that indicate opportunities
        const keywords = ['opportunity', 'grant', 'funding', 'tender', 'project', 'proposal', 'application'];
        const hasKeywords = keywords.some(keyword => text.toLowerCase().includes(keyword));
        
        if (hasKeywords) {
          const link = $el.find('a').attr('href') || url;
          results.push({
            url: link,
            content: text.slice(0, 1000), // Limit content size
            classification: {
              relevant: true,
              sector: 'other',
              relevance_score: 60, // Lower confidence for generic extraction
              deadline: undefined
            },
            timestamp: new Date(),
            source: sourceConfig?.name || source,
            title: 'Generic Opportunity',
            date: ''
          });
        }
      }
    });
  }
  
  return results;
}; 