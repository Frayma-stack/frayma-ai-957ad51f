
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

    console.log('Making request to Perplexity API...');
    console.log('System prompt length:', systemPrompt?.length || 0);
    console.log('User prompt length:', userPrompt?.length || 0);
    
    // Enhanced parameters based on Perplexity's recommendations for URL analysis
    const requestBody = {
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      search_domain_filter: [],
      return_citations: true,
      frequency_penalty: 1,
      presence_penalty: 0
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Frayma-Client-Analysis/1.0'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Perplexity API response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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
        errorMessage = 'Invalid request format. The URLs may not be accessible or properly formatted.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: `HTTP ${response.status}: ${errorText}`,
          suggestion: 'Please verify that the provided URLs are publicly accessible and try again.'
        }), 
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('Perplexity API success response:', JSON.stringify(data, null, 2));

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
      suggestion = 'Unable to connect to the analysis service. This may be due to network restrictions, firewall blocking, or internet connectivity issues. Please check your connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout';
      suggestion = 'The analysis service took too long to respond. Please try again with fewer URLs or check if the URLs are accessible.';
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
