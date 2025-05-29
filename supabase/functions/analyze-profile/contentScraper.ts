
export interface ScrapedContent {
  scrapedContent: Array<{
    url: string;
    content?: string;
    error?: string;
  }>;
}

export class ContentScraper {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseAnonKey = supabaseAnonKey;
  }

  async scrapeLinkedInContent(urls: string[]): Promise<ScrapedContent> {
    console.log('Scraping LinkedIn content from URLs:', urls);
    
    const scrapeResponse = await fetch(`${this.supabaseUrl}/functions/v1/scrape-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.supabaseAnonKey}`
      },
      body: JSON.stringify({ urls })
    });
    
    if (!scrapeResponse.ok) {
      throw new Error(`LinkedIn scraping failed: ${scrapeResponse.status} ${scrapeResponse.statusText}`);
    }
    
    const scrapedData = await scrapeResponse.json();
    console.log('Successfully scraped LinkedIn content from', scrapedData.scrapedContent?.length || 0, 'URLs');
    
    return scrapedData;
  }

  buildEnhancedPrompt(userPrompt: string, scrapedData: ScrapedContent): string {
    if (!scrapedData?.scrapedContent) {
      return userPrompt;
    }

    const linkedinContent = scrapedData.scrapedContent
      .filter(item => item.content && item.content.trim().length > 0)
      .map((item, index) => {
        return `--- LinkedIn Content from ${item.url} ---\n${item.content}\n`;
      })
      .join('\n');
    
    if (linkedinContent) {
      return `${userPrompt}\n\nBELOW IS THE ACTUAL LINKEDIN PROFILE CONTENT. Please analyze this real LinkedIn data to extract professional experiences in the exact format "Title @Company | Duration":\n\n${linkedinContent}`;
    }

    // If no content was successfully scraped, throw an error
    const errors = scrapedData.scrapedContent
      .filter(item => item.error)
      .map(item => `${item.url}: ${item.error}`)
      .join(', ');
    
    throw new Error(`Could not extract content from the LinkedIn URLs. LinkedIn scraping errors: ${errors}`);
  }
}
