import { chromium } from 'playwright';
import { ScrapedResult } from './types';

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

export const playwrightScraper = (source: string) => async (url: string) => {
  try {
    // Skip browser launch in serverless environments
    if (isServerless) {
      console.log('Skipping Playwright in serverless environment');
      throw new Error('Playwright disabled in serverless environment');
    }
    
    // Launch with specific options for better compatibility
    const browser = await chromium.launch({
      headless: true,
      // Use Chrome instead of Chromium if available
      channel: process.env.NODE_ENV === 'development' ? 'chrome' : undefined,
      // Fallback options if browser launch fails
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    try {
      const page = await browser.newPage();
      await page.goto(url, { timeout: 30000 });
      
      // Extract content
      const content = await page.content();
      const title = await page.title();
      
      // More specific extraction based on source
      let extractedContent = '';
      if (source.includes('afdb')) {
        // African Development Bank specific extraction
        extractedContent = await page.evaluate(() => {
          const opportunityElements = document.querySelectorAll('.opportunities-list .item');
          return Array.from(opportunityElements).map(el => el.textContent).join('\n');
        });
      } else {
        // Generic extraction
        extractedContent = await page.evaluate(() => {
          return document.body.innerText;
        });
      }
      
      const results: ScrapedResult[] = [{
        url: url,
        content: extractedContent || content,
        classification: {
          relevant: true,
          sector: 'other',
          relevance_score: 70,
          deadline: undefined,
        },
        timestamp: new Date(),
        source: source,
      }];
      
      await browser.close();
      return results;
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.warn(`Playwright scraping failed: ${error.message}`);
    console.warn('Falling back to fetch-based scraping');
    
    // Fallback to simple fetch-based scraping
    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.SCRAPER_USER_AGENT || 'Mozilla/5.0 (compatible; SustainScraper/1.0)'
      }
    });
    
    const html = await response.text();
    
    return [{
      url: url,
      content: html.slice(0, 10000), // Limit content size
      classification: {
        relevant: true,
        sector: 'other',
        relevance_score: 50, // Lower confidence for fallback method
        deadline: undefined,
      },
      timestamp: new Date(),
      source: source,
    }];
  }
}; 