
import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  let userPrompt = `CRITICAL WEB ANALYSIS TASK - You MUST browse and extract REAL information from these specific URLs for ${companyName}:

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

MANDATORY REQUIREMENTS:
- YOU MUST SEARCH AND BROWSE THESE EXACT URLS
- EXTRACT ONLY FACTUAL CONTENT FROM THE ACTUAL WEBSITES
- DO NOT RETURN TEMPLATE TEXT OR PLACEHOLDER EXAMPLES
- DO NOT USE GENERIC DESCRIPTIONS OR ASSUMED INFORMATION
- IF YOU CANNOT ACCESS A URL, STATE THAT EXPLICITLY

EXTRACT FROM THE ACTUAL WEBSITE CONTENT:

1. COMPANY SUMMARY: Real description of what ${companyName} does (from their actual website text)
2. CATEGORY POV: Their stated perspective on their industry (direct quotes preferred)
3. COMPANY MISSION: Their actual mission statement or purpose (exact text from site)
4. UNIQUE INSIGHT: What they claim makes them unique (their own words)
5. FEATURES/SERVICES: Specific features/services they list on their site
6. USE CASES: Actual use cases they describe on their website
7. DIFFERENTIATORS: How they differentiate from competitors (their claims)

RETURN ONLY THIS JSON STRUCTURE WITH REAL DATA:

{
  "companySummary": "Actual summary text from their website",
  "categoryPOV": "Real perspective statement found on site", 
  "companyMission": "Exact mission text from website",
  "uniqueInsight": "Real unique value proposition from site",
  "features": [
    {
      "name": "Actual feature name from website",
      "benefits": ["Real benefit 1 from site", "Real benefit 2 from site"]
    }
  ],
  "useCases": [
    {
      "useCase": "Real use case title from website",
      "userRole": "Actual target user mentioned on site", 
      "description": "Real description from website content"
    }
  ],
  "differentiators": [
    {
      "name": "Real differentiator from website",
      "description": "Actual description from site content",
      "competitorComparison": "Real comparison if mentioned on site"
    }
  ]
}

ABSOLUTELY NO PLACEHOLDERS, TEMPLATES, OR GENERIC TEXT. ONLY REAL EXTRACTED DATA.`;

  const systemPrompt = `You are a web research specialist with the ability to browse and analyze websites. Your task is to visit specific URLs and extract factual information from the actual website content.

CRITICAL INSTRUCTIONS:
- You MUST browse and read the content of the provided URLs
- Extract ONLY real, factual information found on these websites
- NEVER create fictional, template, or placeholder content
- NEVER use generic examples or assumed information
- If you cannot access a specific URL, explicitly state this
- Return ONLY valid JSON with actual data from the websites
- Quote directly from website content when possible

Your web browsing capability allows you to access and read website content in real-time. Use this capability to provide accurate, factual information extracted from the specific URLs provided.`;

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
    
    // Clean up common JSON issues
    let cleanedJson = jsonString
      .replace(/,\s*}/g, '}')        // Remove trailing commas before }
      .replace(/,\s*]/g, ']')        // Remove trailing commas before ]
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Add quotes around unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"')     // Replace single quotes with double quotes
      .replace(/'/g, '"')                      // Replace remaining single quotes
      .replace(/\n/g, ' ')                     // Remove newlines
      .replace(/\s+/g, ' ');                   // Normalize whitespace
    
    try {
      // Second attempt: use cleaned JSON
      console.log('Attempting to parse cleaned JSON:', cleanedJson);
      return JSON.parse(cleanedJson);
    } catch (secondError) {
      console.log('Second parse attempt failed:', secondError.message);
      
      try {
        // Third attempt: try to extract just the core object content
        const bracketStart = cleanedJson.indexOf('{');
        const bracketEnd = cleanedJson.lastIndexOf('}');
        if (bracketStart !== -1 && bracketEnd !== -1 && bracketEnd > bracketStart) {
          const extractedJson = cleanedJson.substring(bracketStart, bracketEnd + 1);
          console.log('Attempting to parse extracted JSON:', extractedJson);
          return JSON.parse(extractedJson);
        }
        throw new Error('Could not extract valid JSON object');
      } catch (thirdError) {
        console.error('All JSON parsing attempts failed');
        console.error('Original content:', content);
        console.error('Extracted JSON string:', jsonString);
        console.error('Cleaned JSON:', cleanedJson);
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
