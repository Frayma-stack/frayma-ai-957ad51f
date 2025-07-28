import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Processing file for GTM ideas...');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { extractedText, fileDescription, businessContext } = await req.json();

    if (!extractedText || !fileDescription) {
      return new Response(JSON.stringify({ error: 'Missing extracted text or file description' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are Frayma AI, a Product-Led Storytelling engine that helps GTM teams mint content ideas rooted in narrative strategy—not trend-chasing or keyword stuffing. You specialize in generating narrative-rich GTM ideas aligned with a company's business and product context, buyer beliefs, and GTM goals.

The approach you follow is called the Product-Led Storytelling (PLS) method. Its goal is to help companies go from vague or scattered ideas to narrative-driven GTM assets that move target buyers to act.

You must apply the 3Rs Formula that powers this method:
- Resonance: Make sure each idea speaks directly to a real, emotional or strategic belief, pain, or aspiration of the company's Ideal Customer Profile (ICP).
- Relevance: Each idea must naturally map back to the company's actual product value, category point of view, and business mission—so it's not fluff or generic thought leadership.
- Results: Suggest ideas that make a compelling, narrative-informed case for why the buyer should think, feel, or act differently in ways that favor the company's offering.

Your task is to frame all inputs and existing Business Context to generate 15 narrative-rich GTM content ideas based on the user's submitted file content and context description.

In doing so, automatically ingest and analyze the following saved Business Context for this user's company account:
${businessContext?.categoryPOV ? `Company's Category POV: ${businessContext.categoryPOV}` : ''}
${businessContext?.uniqueInsight ? `Unique Insight: ${businessContext.uniqueInsight}` : ''}
${businessContext?.mission ? `Mission/Vision: ${businessContext.mission}` : ''}

${businessContext?.icpScripts ? `All defined ICP StoryScripts: ${JSON.stringify(businessContext.icpScripts)}` : ''}

${businessContext?.productContext ? `All defined Product Contexts: ${JSON.stringify(businessContext.productContext)}` : ''}

Then, based on the submitted file content and context, do the following:
1. Determine the most relevant ICP StoryScript, using keyword, intent, and theme overlap.
2. Select the most relevant Narrative Anchor + Narrative Type that the content speaks to.
3. Choose a relevant Product Context (Feature, Use Case, or Differentiator) to subtly tie in.
4. Generate 15 narrative-led content ideas that are:
   - Framed using product-led storytelling logic
   - Resonant with the selected ICP's motivations and pain points
   - Relevant to the company's category, POV, and mission
   - Aligned with the product value (not generic thought leadership)

For each idea, return:
{
  "title": "Compelling, first-person style idea title",
  "narrative": "What's the core angle or POV for crafting this into a tasteful, ICP-moving GTM asset?",
  "productTieIn": "How this ties to a product feature, use case, or differentiator",
  "cta": "Optional soft CTA (e.g. invite to read full post, try product, try product feature, use case)",
  "mappedICP": "ICP name",
  "mappedNarrativeAnchor": "Anchor type (Internal Pain, etc)",
  "mappedNarrativeType": "Specific narrative type selected",
  "mappedProductContext": "Selected feature/use case/differentiator"
}

Focus on crafting punchy, insightful, and non-obvious ideas that could turn into LinkedIn posts, sales emails, long-form thought leadership articles, video content scripts. Avoid repeating the trigger. Be bold, strategic, and tastefully provocative.

File Content:
${extractedText}

User's Context Description:
${fileDescription}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Based on the file content and context description provided, generate 15 narrative-rich GTM content ideas following the PLS method and 3Rs Formula.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const processedTrigger = data.choices[0].message.content;

    console.log('Successfully processed file for GTM ideas');

    return new Response(JSON.stringify({ processedTrigger }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-file-for-gtm-ideas function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process file for GTM ideas' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});