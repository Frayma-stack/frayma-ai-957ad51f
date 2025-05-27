
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
    
    for (const url of urls) {
      try {
        console.log(`Fetching content from: ${url}`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
          scrapedContent.push({
            url,
            content: '',
            error: `HTTP ${response.status}: ${response.statusText}`
          });
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
        const elementsToRemove = doc.querySelectorAll('script, style, nav, footer, header, aside, .advertisement, .ads, #sidebar');
        elementsToRemove.forEach(el => el.remove());
        
        // Extract meaningful content
        let content = '';
        
        // Try to get main content areas first
        const mainContent = doc.querySelector('main, article, .content, .main-content, #content, #main');
        if (mainContent) {
          content = mainContent.textContent || '';
        } else {
          // Fallback to body content
          const body = doc.querySelector('body');
          content = body?.textContent || '';
        }
        
        // Clean up the content
        content = content
          .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
          .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
          .trim();
        
        // Limit content length to prevent token overflow
        if (content.length > 8000) {
          content = content.substring(0, 8000) + '...';
        }
        
        console.log(`Successfully scraped ${content.length} characters from ${url}`);
        
        scrapedContent.push({
          url,
          content,
          error: null
        });
        
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        scrapedContent.push({
          url,
          content: '',
          error: error.message
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
