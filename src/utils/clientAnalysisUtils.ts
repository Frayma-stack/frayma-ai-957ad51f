
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
- IF YOU CANNOT ACCESS A URL, RETURN A JSON WITH "cannotAccess": true AND EXPLAIN WHY

EXTRACT FROM THE ACTUAL WEBSITE CONTENT:

1. COMPANY SUMMARY: Real description of what ${companyName} does (from their actual website text)
2. CATEGORY POV: Their stated perspective on their industry (direct quotes preferred)
3. COMPANY MISSION: Their actual mission statement or purpose (exact text from site)
4. UNIQUE INSIGHT: What they claim makes them unique (their own words)
5. FEATURES/SERVICES: Specific features/services they list on their site
6. USE CASES: Actual use cases they describe on their website
7. DIFFERENTIATORS: How they differentiate from competitors (their claims)

IF YOU CAN ACCESS THE URLS, RETURN THIS JSON STRUCTURE WITH REAL DATA:

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

IF YOU CANNOT ACCESS THE URLS, RETURN THIS JSON STRUCTURE:

{
  "cannotAccess": true,
  "reason": "Explain why you cannot access the URLs (e.g., permission denied, server error, etc.)",
  "suggestion": "Suggest what the user can do instead"
}

ABSOLUTELY NO PLACEHOLDERS, TEMPLATES, OR GENERIC TEXT. ONLY REAL EXTRACTED DATA OR CLEAR INDICATION OF ACCESS FAILURE.`;

  const systemPrompt = `You are a web research specialist with the ability to browse and analyze websites. Your task is to visit specific URLs and extract factual information from the actual website content.

CRITICAL INSTRUCTIONS:
- You MUST attempt to browse and read the content of the provided URLs
- Extract ONLY real, factual information found on these websites
- NEVER create fictional, template, or placeholder content
- NEVER use generic examples or assumed information
- If you cannot access specific URLs, you must return a JSON response with "cannotAccess": true and explain the reason
- Return ONLY valid JSON with actual data from the websites OR clear indication of access failure
- Quote directly from website content when possible

Your web browsing capability should allow you to access and read website content. If you encounter access restrictions or technical issues, clearly communicate this in your response.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log('Raw content to parse:', content);
  
  // Check if the AI explicitly stated it cannot access URLs
  if (content.includes("unable to access") || 
      content.includes("cannot access") || 
      content.includes("I can't access") ||
      content.includes("do not include browsing external websites") ||
      content.includes("current capabilities do not include")) {
    
    console.log('AI indicated it cannot access URLs');
    throw new Error('The AI service cannot access external websites for analysis. This is a limitation of the current analysis service. Please try entering the company information manually or use a different approach.');
  }
  
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
      throw new Error('Could not find valid JSON in the analysis response. The service may have returned an unexpected format.');
    }
  }
  
  // Clean up the JSON string
  jsonString = jsonString.trim();
  
  // Try to fix common JSON issues
  try {
    // First attempt: parse as-is
    const parsed = JSON.parse(jsonString);
    
    // Check if this is a "cannot access" response
    if (parsed.cannotAccess === true) {
      const reason = parsed.reason || 'Unknown access restriction';
      const suggestion = parsed.suggestion || 'Please try entering the information manually';
      
      // Provide more specific guidance based on the reason
      let enhancedMessage = `Website analysis failed: ${reason}`;
      
      if (reason.includes('authentication') || reason.includes('not publicly available')) {
        enhancedMessage += '\n\nThis commonly happens with:\n• LinkedIn company pages (require login)\n• Private company websites\n• Sites with access restrictions\n\nSuggestions:\n• Try alternative public URLs (blog posts, press releases, public pages)\n• Search for the company on public directories or news sites\n• Enter the company information manually using the form fields';
      } else if (reason.includes('server error') || reason.includes('timeout')) {
        enhancedMessage += '\n\nThis appears to be a temporary issue. You can:\n• Try again in a few moments\n• Check if the URLs are working in your browser\n• Enter the information manually if the issue persists';
      }
      
      enhancedMessage += `\n\nOriginal suggestion: ${suggestion}`;
      
      throw new Error(enhancedMessage);
    }
    
    return parsed;
  } catch (firstError) {
    // If it's already a cannot access error, re-throw it
    if (firstError.message.includes('Website analysis failed')) {
      throw firstError;
    }
    
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
      const parsed = JSON.parse(cleanedJson);
      
      // Check if this is a "cannot access" response
      if (parsed.cannotAccess === true) {
        const reason = parsed.reason || 'Unknown access restriction';
        const suggestion = parsed.suggestion || 'Please try entering the information manually';
        
        let enhancedMessage = `Website analysis failed: ${reason}`;
        
        if (reason.includes('authentication') || reason.includes('not publicly available')) {
          enhancedMessage += '\n\nThis commonly happens with:\n• LinkedIn company pages (require login)\n• Private company websites\n• Sites with access restrictions\n\nSuggestions:\n• Try alternative public URLs (blog posts, press releases, public pages)\n• Search for the company on public directories or news sites\n• Enter the company information manually using the form fields';
        }
        
        enhancedMessage += `\n\nOriginal suggestion: ${suggestion}`;
        
        throw new Error(enhancedMessage);
      }
      
      return parsed;
    } catch (secondError) {
      console.log('Second parse attempt failed:', secondError.message);
      
      try {
        // Third attempt: try to extract just the core object content
        const bracketStart = cleanedJson.indexOf('{');
        const bracketEnd = cleanedJson.lastIndexOf('}');
        if (bracketStart !== -1 && bracketEnd !== -1 && bracketEnd > bracketStart) {
          const extractedJson = cleanedJson.substring(bracketStart, bracketEnd + 1);
          console.log('Attempting to parse extracted JSON:', extractedJson);
          const parsed = JSON.parse(extractedJson);
          
          // Check if this is a "cannot access" response
          if (parsed.cannotAccess === true) {
            const reason = parsed.reason || 'Unknown access restriction';
            const suggestion = parsed.suggestion || 'Please try entering the information manually';
            
            let enhancedMessage = `Website analysis failed: ${reason}`;
            
            if (reason.includes('authentication') || reason.includes('not publicly available')) {
              enhancedMessage += '\n\nThis commonly happens with:\n• LinkedIn company pages (require login)\n• Private company websites\n• Sites with access restrictions\n\nSuggestions:\n• Try alternative public URLs (blog posts, press releases, public pages)\n• Search for the company on public directories or news sites\n• Enter the company information manually using the form fields';
            }
            
            enhancedMessage += `\n\nOriginal suggestion: ${suggestion}`;
            
            throw new Error(enhancedMessage);
          }
          
          return parsed;
        }
        throw new Error('Could not extract valid JSON object');
      } catch (thirdError) {
        console.error('All JSON parsing attempts failed');
        console.error('Original content:', content);
        console.error('Extracted JSON string:', jsonString);
        console.error('Cleaned JSON:', cleanedJson);
        console.error('Final error:', thirdError.message);
        
        throw new Error('The analysis service returned an invalid response format. This may be due to the AI model returning incomplete or malformed data. Please try again or enter the information manually.');
      }
    }
  }
};
