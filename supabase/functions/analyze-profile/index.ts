
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { systemPrompt, userPrompt } = await req.json();
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    
    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please contact support.' }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Starting author profile analysis with pre-fetched content...');
    
    // Extract URLs from the user prompt to scrape content
    const urlMatches = userPrompt.match(/https?:\/\/[^\s]+/g) || [];
    let scrapedData;
    
    if (urlMatches.length > 0) {
      console.log('Scraping content from URLs:', urlMatches);
      
      try {
        const scrapeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
          },
          body: JSON.stringify({ urls: urlMatches })
        });
        
        if (!scrapeResponse.ok) {
          throw new Error(`Scraping failed: ${scrapeResponse.status} ${scrapeResponse.statusText}`);
        }
        
        scrapedData = await scrapeResponse.json();
        console.log('Successfully scraped content from', scrapedData.scrapedContent?.length || 0, 'URLs');
        
      } catch (scrapeError) {
        console.error('Content scraping failed:', scrapeError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to scrape website content',
            details: scrapeError.message,
            suggestion: 'Please verify the URLs are accessible and try again.'
          }), 
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Build the enhanced prompt with scraped content
    let enhancedUserPrompt = userPrompt;
    
    if (scrapedData && scrapedData.scrapedContent) {
      const contentSections = scrapedData.scrapedContent
        .filter(item => item.content && item.content.trim().length > 0)
        .map((item, index) => {
          return `--- Content from ${item.url} ---\n${item.content}\n`;
        })
        .join('\n');
      
      if (contentSections) {
        enhancedUserPrompt = `${userPrompt}\n\nBELOW IS THE ACTUAL CONTENT FROM THE PROVIDED WEBSITES. Please analyze this real content to extract the author information:\n\n${contentSections}`;
      } else {
        // If no content was successfully scraped, return an error
        const errors = scrapedData.scrapedContent
          .filter(item => item.error)
          .map(item => `${item.url}: ${item.error}`)
          .join(', ');
        
        return new Response(
          JSON.stringify({ 
            error: 'Could not extract content from the provided URLs',
            details: `Scraping errors: ${errors}`,
            suggestion: 'Please verify the URLs are publicly accessible and contain the expected content.'
          }), 
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    console.log('Making request to Perplexity API with scraped content...');
    console.log('Enhanced user prompt length:', enhancedUserPrompt?.length || 0);
    
    // Use a model that analyzes provided content
    const requestBody = {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt + '\n\nIMPORTANT: The user will provide the actual website content below. Do NOT search online. Analyze ONLY the provided content and extract information from it. If information is not available in the provided content, leave those fields empty or state that the information is not available.'
        },
        {
          role: 'user',
          content: enhancedUserPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      search_domain_filter: [],
      return_citations: false,
      frequency_penalty: 1,
      presence_penalty: 0
    };

    console.log('Request body prepared for Perplexity API');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Frayma-Author-Analysis/1.0'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Perplexity API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error response:', errorText);
      
      let errorMessage = 'Analysis service error';
      if (response.status === 401) {
        errorMessage = 'Authentication failed with analysis service. Please check API key configuration.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. The analysis service is currently overloaded. Please try again in a few minutes.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden to analysis service. This may be due to network restrictions or API permissions.';
      } else if (response.status >= 500) {
        errorMessage = 'Analysis service temporarily unavailable. Please try again later.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request format or content too large for processing.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: `HTTP ${response.status}: ${errorText}`,
          suggestion: 'Please try again or contact support if the issue persists.'
        }), 
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('Perplexity API success response received');

    // Enhanced response validation
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from Perplexity API:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from analysis service',
          suggestion: 'The analysis service returned an unexpected format. Please try again.'
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-profile function:', error);
    
    let errorMessage = 'Internal server error';
    let suggestion = 'Please try again later.';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network connection error';
      suggestion = 'Unable to connect to the analysis service. Please check your connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout';
      suggestion = 'The analysis request timed out. Please try again or contact support.';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        suggestion: suggestion,
        details: error.message
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
