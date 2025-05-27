
export const buildAnalysisPrompt = (urls: string[]) => {
  const urlsString = urls.join('\n');
  
  return {
    systemPrompt: `You are an expert data extraction agent. You MUST analyze the exact content provided by the user to extract real, factual information about the person. Do NOT create fictional or generic content.

CRITICAL INSTRUCTIONS:
- Analyze ONLY the website content provided in the user message below
- Extract ONLY factual information found in the provided content
- Do NOT hallucinate, invent, or create generic content
- If information is not available in the provided content, leave those fields empty or minimal
- Focus on LinkedIn profiles, social media posts, blog content, and website information

Return ONLY a JSON object with this exact structure:

{
  "currentTitle": "exact job title found in the content",
  "careerBackstory": "real career summary based on content (max 7 sentences, first-person)",
  "experiences": [
    {
      "title": "actual job title from content",
      "company": "real company name from content", 
      "duration": "actual duration from content",
      "summary": "real work description from content (max 5 sentences, first-person)"
    }
  ],
  "writingTones": [
    {
      "toneTitle": "observed writing style from actual content",
      "toneSummary": "description of actual writing tone from content (max 4 sentences, first-person)"
    }
  ],
  "productBeliefs": [
    {
      "beliefTitle": "actual belief/opinion found in content",
      "beliefSummary": "real belief description from content (max 5 sentences, first-person)"
    }
  ]
}

Write all descriptions in first-person as if the person is speaking about themselves. Return ONLY the JSON - no explanations, no markdown formatting.`,
    userPrompt: `ANALYZE the content from these URLs to extract real information about the person:

${urlsString}

REQUIREMENTS:
- Extract factual information from the provided website content below
- Do NOT create fictional content
- If a section has no real data from the content, provide minimal/empty arrays
- Focus on: LinkedIn experience, actual writing samples, real product opinions
- Extract information ONLY from the content provided

The actual website content will be provided below. Analyze this real content to extract the required information.`
  };
};
