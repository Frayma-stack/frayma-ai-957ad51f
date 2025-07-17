import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getSystemPrompt = () => {
  return `You are an expert B2B narrative analyst trained in the Product-Led Storytelling (PLS) approach and the 3Rs Formula: Resonance, Relevance, Results.

You will receive multiple call transcripts involving the SAME ICP. These may include sales, onboarding, customer success, or product feedback calls.

Your task is to extract a comprehensive, structured, first-person-style ICP StoryScript for this ICP using insights from ALL the provided transcripts. Return only the JSON below, nothing else.

{
  "ICPName": "Descriptive title of ICP (e.g., Growth Marketing Lead at Seed-Stage SaaS Startup)",
  "DemographicsSummary": "4–5 sentence overview summarizing the ICP's company type, role, team structure, product focus, and GTM maturity.",
  "InternalPains": [
    "Two-sentence summary of a pain this ICP expressed or implied.",
    "... (at least 4 items total)"
  ],
  "ExternalStruggles": [
    "Two-sentence summary of a market-level or team-level external challenge.",
    "... (at least 4 items total)"
  ],
  "DesiredTransformations": [
    "Two-sentence summary of an aspirational goal or outcome they want to achieve.",
    "... (at least 4 items total)"
  ]
}

📌 Guidelines:
- Use first-person framing as if the ICP was describing themselves and their worldview.
- Avoid generic fluff—base summaries only on what was directly stated or clearly implied in the transcripts.
- Do NOT output anything outside of the JSON block.
- Assume all transcripts describe the same ICP, and combine signals across all to generate a more complete profile.
- Ensure each array has at least 4 meaningful items.
- Focus on extracting insights that would be valuable for creating targeted marketing content.`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { calls, transcript, callType, icpName } = await req.json();
    
    let userContent = '';

    // Handle new multi-call format
    if (calls && Array.isArray(calls)) {
      console.log('🧠 Generating ICP from multiple calls:', {
        callCount: calls.length,
        icpName,
        callTypes: calls.map(c => c.callType)
      });

      // Combine all transcripts with call type labels
      const callSections = calls.map(call => {
        const callTypeLabel = call.callType.charAt(0).toUpperCase() + call.callType.slice(1);
        return `[${callTypeLabel} Call]: ${call.transcript}`;
      });

      userContent = `Call Transcripts:\n${callSections.join('\n\n')}`;
    } 
    // Handle legacy single call format
    else if (transcript) {
      console.log('🧠 Generating ICP from single transcript:', {
        transcriptLength: transcript.length,
        callType: callType || 'sales',
        preview: transcript.substring(0, 100) + '...'
      });

      userContent = `Transcript:\n${transcript}`;
    } 
    else {
      throw new Error('No transcript or calls provided');
    }

    const systemPrompt = getSystemPrompt();

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
          { role: 'user', content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('🎯 Generated ICP content:', {
      contentLength: generatedContent.length,
      preview: generatedContent.substring(0, 200) + '...'
    });

    // Parse the JSON response
    let icpData;
    try {
      icpData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse generated JSON:', parseError);
      console.error('Generated content:', generatedContent);
      throw new Error('Failed to parse generated ICP data');
    }

    // Validate the structure
    const requiredFields = ['ICPName', 'DemographicsSummary', 'InternalPains', 'ExternalStruggles', 'DesiredTransformations'];
    for (const field of requiredFields) {
      if (!icpData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log('✅ ICP StoryScript generated successfully:', {
      icpName: icpData.ICPName,
      internalPainsCount: icpData.InternalPains?.length || 0,
      externalStrugglesCount: icpData.ExternalStruggles?.length || 0,
      desiredTransformationsCount: icpData.DesiredTransformations?.length || 0
    });

    return new Response(
      JSON.stringify(icpData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in generate-icp-from-transcript function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});