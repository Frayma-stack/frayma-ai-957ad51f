
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

  async scrapeCompanyContent(urls: string[]): Promise<ScrapedContent> {
    console.log('Scraping company content from URLs:', urls);
    
    try {
      const scrapeResponse = await fetch(`${this.supabaseUrl}/functions/v1/scrape-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`
        },
        body: JSON.stringify({ urls }),
        signal: AbortSignal.timeout(45000) // 45 second timeout
      });
      
      if (!scrapeResponse.ok) {
        const errorText = await scrapeResponse.text();
        console.error(`Scrape function failed: ${scrapeResponse.status} ${scrapeResponse.statusText}`, errorText);
        throw new Error(`Company content scraping failed: ${scrapeResponse.status} ${scrapeResponse.statusText}. ${errorText}`);
      }
      
      const scrapedData = await scrapeResponse.json();
      console.log('Successfully scraped company content from', scrapedData.scrapedContent?.length || 0, 'URLs');
      
      return scrapedData;
    } catch (error) {
      console.error('Error calling scrape-content function:', error);
      if (error.name === 'AbortError') {
        throw new Error('Scraping timeout - the request took too long to complete');
      }
      throw error;
    }
  }

  buildEnhancedPrompt(userPrompt: string, scrapedData: ScrapedContent): string {
    if (!scrapedData?.scrapedContent) {
      return userPrompt;
    }

    const companyContent = scrapedData.scrapedContent
      .filter(item => item.content && item.content.trim().length > 0)
      .map((item, index) => {
        return `--- Company Content from ${item.url} ---\n${item.content}\n`;
      })
      .join('\n');
    
    if (companyContent) {
      return `${userPrompt}\n\nBELOW IS THE ACTUAL COMPANY WEBSITE CONTENT. Please analyze this real company data to extract business information:\n\n${companyContent}`;
    }

    // If no content was successfully scraped, return the original prompt for fallback analysis
    console.warn('No content was scraped, proceeding with original prompt for basic analysis');
    return userPrompt;
  }
}
