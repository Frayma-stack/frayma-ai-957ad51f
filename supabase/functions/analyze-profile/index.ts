import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ContentScraper } from "./contentScraper.ts";
import { PerplexityClient } from "./perplexityClient.ts";
import { ErrorHandler, ProfileAnalysisError } from "./errorHandler.ts";
import { ResponseValidator } from "./responseValidator.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    ResponseValidator.validateApiKey(perplexityApiKey);

    // Parse and validate request body
    const requestBody = await req.json();
    const { systemPrompt, userPrompt } =
      ResponseValidator.validateRequestBody(requestBody);

    console.log(
      "Starting LinkedIn profile analysis with enhanced content scraping..."
    );

    // Extract URLs and scrape content if needed
    const urlMatches = ResponseValidator.extractUrls(userPrompt);
    let enhancedUserPrompt = userPrompt;

    if (urlMatches.length > 0) {
      try {
        const scraper = new ContentScraper(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!
        );

        const scrapedData = await scraper.scrapeLinkedinContent2(urlMatches);
        enhancedUserPrompt = scraper.buildEnhancedPrompt(
          userPrompt,
          scrapedData
        );
      } catch (scrapeError) {
        console.error("LinkedIn content scraping failed:", scrapeError);
        const error = ErrorHandler.handleScrapeError(scrapeError as Error);
        return ErrorHandler.createErrorResponse(error, corsHeaders);
      }
    }

    // Analyze profile using Perplexity
    const perplexityClient = new PerplexityClient(perplexityApiKey!);

    try {
      const data = await perplexityClient.analyzeProfile(
        systemPrompt,
        enhancedUserPrompt
      );

      // Validate response structure
      ResponseValidator.validatePerplexityResponse(data);

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (perplexityError) {
      console.error("Perplexity API error:", perplexityError);
      const error = ErrorHandler.handlePerplexityError(
        500,
        perplexityError.message
      );
      return ErrorHandler.createErrorResponse(error, corsHeaders);
    }
  } catch (error) {
    console.error("Error in LinkedIn analyze-profile function:", error);

    if (error instanceof ProfileAnalysisError) {
      return ErrorHandler.createErrorResponse(error, corsHeaders);
    }

    const genericError = ErrorHandler.handleGenericError(error as Error);
    return ErrorHandler.createErrorResponse(genericError, corsHeaders);
  }
});
