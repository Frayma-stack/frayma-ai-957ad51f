
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ContentScraper } from './contentScraper.ts';
import { CompanyAnalysisClient } from './companyAnalysisClient.ts';
import { ErrorHandler, ProfileAnalysisError } from './errorHandler.ts';
import { ResponseValidator } from './responseValidator.ts';

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
    // Validate environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    ResponseValidator.validateApiKey(openaiApiKey);

    // Parse and validate request body
    const requestBody = await req.json();
    const { systemPrompt, userPrompt, urls } = ResponseValidator.validateRequestBody(requestBody);

    console.log('Starting client analysis with enhanced content scraping...');
    
    // Use URLs from request body if provided, otherwise extract from userPrompt
    const urlsToScrape = urls && urls.length > 0 ? urls : ResponseValidator.extractUrls(userPrompt);
    let enhancedUserPrompt = userPrompt;
    
    if (urlsToScrape.length > 0) {
      try {
        const scraper = new ContentScraper(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!
        );
        
        const scrapedData = await scraper.scrapeCompanyContent(urlsToScrape);
        enhancedUserPrompt = scraper.buildEnhancedPrompt(userPrompt, scrapedData);
        
      } catch (scrapeError) {
        console.error('Company content scraping failed:', scrapeError);
        // Don't fail the entire request, just use the original prompt
        console.log('Continuing with original prompt due to scraping failure');
        enhancedUserPrompt = userPrompt;
      }
    }

    // Analyze company using OpenAI
    const companyAnalysisClient = new CompanyAnalysisClient(openaiApiKey!);
    
    try {
      const data = await companyAnalysisClient.analyzeCompany(systemPrompt, enhancedUserPrompt);
      
      // Validate response structure
      ResponseValidator.validatePerplexityResponse(data);
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (analysisError) {
      console.error('Company analysis API error:', analysisError);
      const error = ErrorHandler.handlePerplexityError(500, analysisError.message);
      return ErrorHandler.createErrorResponse(error, corsHeaders);
    }

  } catch (error) {
    console.error('Error in LinkedIn analyze-profile function:', error);
    
    if (error instanceof ProfileAnalysisError) {
      return ErrorHandler.createErrorResponse(error, corsHeaders);
    }
    
    const genericError = ErrorHandler.handleGenericError(error as Error);
    return ErrorHandler.createErrorResponse(genericError, corsHeaders);
  }
});
