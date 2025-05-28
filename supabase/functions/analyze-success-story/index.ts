
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!perplexityApiKey) {
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Analyzing success story from URL:', url);

    // Use Perplexity's RAG capabilities to analyze the success story
    const ragPrompt = `
    Analyze the customer success story from this URL: ${url}

    Please extract and provide the following information in a structured JSON format:

    1. title: A concise title for the success story
    2. beforeSummary: A summary of the customer's situation, challenges, or problems before using the product/service (2-3 sentences)
    3. afterSummary: A summary of the positive outcomes, benefits, and transformation after using the product/service (2-3 sentences)
    4. quotes: An array of customer quotes with their authors and titles, each containing:
       - quote: The actual quote text
       - author: The person's name who said it
       - title: Their job title or role
    5. features: An array of product features mentioned, each containing:
       - name: The feature name
       - description: A 5-sentence summary of how this feature was used and its impact

    Please ensure all extracted information is accurate and directly from the source content. Focus on factual information rather than promotional language.

    Return the response as a valid JSON object with the structure above.
    `;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing customer success stories and extracting structured information. You follow Retrieval Augmented Generation (RAG) principles by:
            1. First retrieving and reading the actual content from the provided URL
            2. Analyzing the content thoroughly for customer success elements
            3. Extracting only factual, verifiable information
            4. Structuring the output in the requested JSON format
            5. Ensuring quotes are actual customer statements, not paraphrased content
            Always return valid JSON and be precise in your extractions.`
          },
          {
            role: 'user',
            content: ragPrompt
          }
        ],
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisContent = data.choices[0].message.content;

    console.log('Raw Perplexity response:', analysisContent);

    // Parse the JSON response from Perplexity
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON from Perplexity response:', parseError);
      
      // Fallback: try to extract information using regex patterns
      analysisResult = {
        title: 'Customer Success Story',
        beforeSummary: '',
        afterSummary: '',
        quotes: [],
        features: []
      };

      // Try to extract basic information with fallback patterns
      const titleMatch = analysisContent.match(/title['":\s]+([^"'\n]+)/i);
      if (titleMatch) analysisResult.title = titleMatch[1].trim();

      const beforeMatch = analysisContent.match(/beforeSummary['":\s]+([^"'\n]+)/i);
      if (beforeMatch) analysisResult.beforeSummary = beforeMatch[1].trim();

      const afterMatch = analysisContent.match(/afterSummary['":\s]+([^"'\n]+)/i);
      if (afterMatch) analysisResult.afterSummary = afterMatch[1].trim();
    }

    console.log('Parsed analysis result:', analysisResult);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-success-story function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze success story',
        details: error.message
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
