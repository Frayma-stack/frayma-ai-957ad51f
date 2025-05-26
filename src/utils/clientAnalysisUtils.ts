import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  let userPrompt = `I need you to VISIT AND ANALYZE the following specific URLs for ${companyName} and extract REAL, FACTUAL information:

`;
  
  const urlParts = [];
  
  const linkedinUrls = companyLinks.filter(link => link.type === 'linkedin').map(link => link.url);
  const websiteUrls = companyLinks.filter(link => link.type === 'website').map(link => link.url);
  const aboutUrls = companyLinks.filter(link => link.type === 'about').map(link => link.url);
  const otherUrls = companyLinks.filter(link => link.type === 'other').map(link => link.url);
  
  if (linkedinUrls.length > 0) {
    urlParts.push(`LinkedIn: ${linkedinUrls.join(', ')}`);
  }
  
  if (websiteUrls.length > 0) {
    urlParts.push(`Website: ${websiteUrls.join(', ')}`);
  }
  
  if (aboutUrls.length > 0) {
    urlParts.push(`About page: ${aboutUrls.join(', ')}`);
  }
  
  if (otherUrls.length > 0) {
    urlParts.push(`Other pages: ${otherUrls.join(', ')}`);
  }
  
  userPrompt += urlParts.join('\n');
  
  userPrompt += `

CRITICAL: You MUST search and visit these exact URLs to extract REAL information. Do NOT provide template responses or placeholders.

Extract the following from the ACTUAL content found on these URLs:

1. COMPANY SUMMARY: What does ${companyName} actually do? (from their website content)
2. CATEGORY POV: Their actual stated perspective on their industry 
3. COMPANY MISSION: Their real mission statement or purpose
4. UNIQUE INSIGHT: What they actually say makes them unique
5. FEATURES/SERVICES: Real features/services listed on their site
6. USE CASES: Actual use cases they describe
7. DIFFERENTIATORS: How they actually differentiate themselves

Return ONLY this JSON structure with REAL data from the URLs:

{
  "companySummary": "REAL summary from website content",
  "categoryPOV": "ACTUAL perspective found on their site", 
  "companyMission": "REAL mission from their content",
  "uniqueInsight": "ACTUAL unique value they state",
  "features": [
    {
      "name": "REAL feature name",
      "benefits": ["REAL benefit 1", "REAL benefit 2"]
    }
  ],
  "useCases": [
    {
      "useCase": "REAL use case title",
      "userRole": "ACTUAL target user", 
      "description": "REAL description from their content"
    }
  ],
  "differentiators": [
    {
      "name": "REAL differentiator",
      "description": "ACTUAL description from site",
      "competitorComparison": "REAL comparison if mentioned"
    }
  ]
}

NO TEMPLATES. NO PLACEHOLDERS. NO BRACKETS WITH INSTRUCTIONS. ONLY REAL DATA FROM THE URLS.`;

  const systemPrompt = `You are a web research agent that MUST visit and extract real information from provided URLs. 

MANDATORY REQUIREMENTS:
- VISIT each provided URL and read the actual content
- Extract ONLY factual information found on these specific pages
- NEVER create fictional, template, or placeholder content
- If specific information isn't found, use minimal content or empty arrays
- Return ONLY valid JSON with real data extracted from the URLs

You MUST provide real, specific information found on the actual websites, not generic templates or examples.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log('Raw content to parse:', content);
  
  // Try to extract JSON from various formats
  let jsonString = '';
  
  // First, try to find JSON wrapped in markdown code blocks
  const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
    console.log('Found JSON in code block:', jsonString);
  } else {
    // Try to find a standalone JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
      console.log('Found standalone JSON:', jsonString);
    } else {
      console.error('No JSON found in content:', content);
      throw new Error('Could not find JSON in the analysis response');
    }
  }
  
  // Clean up the JSON string
  jsonString = jsonString.trim();
  
  // Try to fix common JSON issues
  try {
    // First attempt: parse as-is
    return JSON.parse(jsonString);
  } catch (firstError) {
    console.log('First parse attempt failed:', firstError.message);
    
    // Declare cleanedJson in the correct scope
    let cleanedJson = jsonString
      .replace(/,\s*}/g, '}')        // Remove trailing commas before }
      .replace(/,\s*]/g, ']')        // Remove trailing commas before ]
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Add quotes around unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"');    // Replace single quotes with double quotes
    
    try {
      // Second attempt: use cleaned JSON
      console.log('Attempting to parse cleaned JSON:', cleanedJson);
      return JSON.parse(cleanedJson);
    } catch (secondError) {
      console.log('Second parse attempt failed:', secondError.message);
      
      try {
        // Third attempt: try to extract just the core object
        const objectMatch = cleanedJson.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/);
        if (objectMatch) {
          console.log('Attempting to parse extracted object:', objectMatch[0]);
          return JSON.parse(objectMatch[0]);
        }
        throw new Error('Could not extract valid JSON object');
      } catch (thirdError) {
        console.error('All JSON parsing attempts failed');
        console.error('Original content:', content);
        console.error('Extracted JSON string:', jsonString);
        console.error('Final error:', thirdError.message);
        
        // Return a default structure to prevent complete failure
        return {
          companySummary: 'Analysis failed - please try again',
          categoryPOV: '',
          companyMission: '',
          uniqueInsight: '',
          features: [],
          useCases: [],
          differentiators: []
        };
      }
    }
  }
};
