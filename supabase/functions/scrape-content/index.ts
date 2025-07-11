import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No URLs provided or invalid format' }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Scraping content from URLs:', urls);
    
    const scrapedContent = [];
    
    for (const rawUrl of urls) {
      // Clean up the URL (remove trailing commas, etc.)
      const url = rawUrl.replace(/[,\s]+$/, '').trim();
      
      try {
        console.log(`Fetching content from: ${url}`);
        
        // Use different user agents for different platforms
        let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        
        if (url.includes('linkedin.com')) {
          // LinkedIn-specific headers
          userAgent = 'LinkedInBot/1.0 (compatible; Mozilla/5.0; +http://www.linkedin.com/static?key=LinkedInBot)';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
          // Twitter/X-specific headers
          userAgent = 'Twitterbot/1.0';
        }
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive'
          },
          // Longer timeout for potentially slow responses
          signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
          
          // For LinkedIn, provide a helpful error message
          if (url.includes('linkedin.com')) {
            scrapedContent.push({
              url,
              content: '',
              error: `LinkedIn blocking detected (${response.status}). Please provide the LinkedIn profile information manually or use a different professional URL.`
            });
          } else {
            scrapedContent.push({
              url,
              content: '',
              error: `HTTP ${response.status}: ${response.statusText}`
            });
          }
          continue;
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        if (!doc) {
          console.error(`Failed to parse HTML from ${url}`);
          scrapedContent.push({
            url,
            content: '',
            error: 'Failed to parse HTML content'
          });
          continue;
        }

        // Remove script, style, and other non-content elements
        const elementsToRemove = doc.querySelectorAll('script, style, nav, footer, header, aside, .advertisement, .ads, #sidebar, .cookie-banner, .popup');
        elementsToRemove.forEach(el => el.remove());
        
        // Extract meaningful content with platform-specific strategies
        let content = '';
        
        if (url.includes('linkedin.com')) {
          // LinkedIn-specific content extraction
          const profileSections = doc.querySelectorAll('.pv-about-section, .pv-experience-section, .experience-section, .pv-profile-section, .profile-section');
          const experienceItems = doc.querySelectorAll('.pv-entity__summary-info, .experience-item, .pv-experience-section__experiences');
          const aboutSection = doc.querySelector('.pv-about-section__summary-text, .about-section');
          
          if (profileSections.length > 0) {
            content = Array.from(profileSections).map(section => section.textContent || '').join('\n\n');
          } else if (experienceItems.length > 0) {
            content = Array.from(experienceItems).map(item => item.textContent || '').join('\n\n');
          } else if (aboutSection) {
            content = aboutSection.textContent || '';
          }
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
          // Twitter/X-specific content extraction
          const bioSection = doc.querySelector('[data-testid="UserDescription"], .profile-description, .bio');
          const tweets = doc.querySelectorAll('[data-testid="tweet"], .tweet-text');
          
          if (bioSection) {
            content = bioSection.textContent || '';
          }
          if (tweets.length > 0) {
            const tweetTexts = Array.from(tweets).slice(0, 5).map(tweet => tweet.textContent || '').join('\n');
            content = content ? `${content}\n\nRecent posts:\n${tweetTexts}` : tweetTexts;
          }
        }
        
        // Fallback to general content extraction
        if (!content || content.trim().length < 50) {
          const mainContent = doc.querySelector('main, article, .content, .main-content, #content, #main, .container');
          if (mainContent) {
            content = mainContent.textContent || '';
          } else {
            const body = doc.querySelector('body');
            content = body?.textContent || '';
          }
        }
        
        // Clean up the content
        content = content
          .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
          .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
          .replace(/\t+/g, ' ') // Replace tabs with spaces
          .trim();
        
        // Limit content length to prevent token overflow but keep more for better analysis
        if (content.length > 12000) {
          content = content.substring(0, 12000) + '...';
        }
        
        console.log(`Successfully scraped ${content.length} characters from ${url}`);
        
        scrapedContent.push({
          url,
          content,
          error: null
        });
        
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        
        let errorMessage = error.message;
        if (url.includes('linkedin.com') && error.message.includes('fetch')) {
          errorMessage = 'LinkedIn access blocked. Please provide professional information manually.';
        }
        
        scrapedContent.push({
          url,
          content: '',
          error: errorMessage
        });
      }
    }

    return new Response(JSON.stringify({ scrapedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scrape-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
