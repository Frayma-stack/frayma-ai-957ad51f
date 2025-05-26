import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  let userPrompt = `Visit the following URLs for ${companyName}: `;
  
  const urlParts = [];
  
  const linkedinUrls = companyLinks.filter(link => link.type === 'linkedin').map(link => link.url);
  const websiteUrls = companyLinks.filter(link => link.type === 'website').map(link => link.url);
  const aboutUrls = companyLinks.filter(link => link.type === 'about').map(link => link.url);
  const otherUrls = companyLinks.filter(link => link.type === 'other').map(link => link.url);
  
  if (linkedinUrls.length > 0) {
    urlParts.push(`LinkedIn company page (${linkedinUrls.join(', ')})`);
  }
  
  if (websiteUrls.length > 0) {
    urlParts.push(`website (${websiteUrls.join(', ')})`);
  }
  
  if (aboutUrls.length > 0) {
    urlParts.push(`about page (${aboutUrls.join(', ')})`);
  }
  
  if (otherUrls.length > 0) {
    urlParts.push(`other relevant pages (${otherUrls.join(', ')})`);
  }
  
  userPrompt += urlParts.join(', ');
  
  userPrompt += `. Analyze the company information and extract the following details:

1. COMPANY SUMMARY: Provide a comprehensive overview of what the company does, their target market, and their value proposition (3-4 sentences).

2. CATEGORY POINT OF VIEW: Extract or infer the company's perspective on their industry/category and how they position themselves in the market.

3. COMPANY MISSION: Identify the company's mission statement or core purpose.

4. UNIQUE INSIGHT: What unique perspective or insight does this company bring to their market?

5. FEATURES/SERVICES: List the main features, services, or products the company offers. For each feature/service, include:
   - Name of the feature/service
   - Key benefits it provides to customers

6. USE CASES/SOLUTIONS: Identify the primary use cases or solutions the company addresses. For each use case:
   - Use case title
   - Target user role/persona
   - Description of how the company solves this problem

7. DIFFERENTIATORS: Identify what makes this company different from competitors. For each differentiator:
   - Differentiator name
   - Description of what makes them unique
   - How this compares to their closest competitors (mention specific competitors if possible)

Format the output as a JSON object with the following structure:
{
  "companySummary": "string",
  "categoryPOV": "string", 
  "companyMission": "string",
  "uniqueInsight": "string",
  "features": [
    {
      "name": "string",
      "benefits": ["string", "string"]
    }
  ],
  "useCases": [
    {
      "useCase": "string",
      "userRole": "string", 
      "description": "string"
    }
  ],
  "differentiators": [
    {
      "name": "string",
      "description": "string",
      "competitorComparison": "string"
    }
  ]
}

IMPORTANT: Ensure all fields are populated with relevant information extracted from the provided URLs. Focus on factual, specific details rather than generic marketing language.`;

  const systemPrompt = `You are an expert data extraction agent. You MUST visit and analyze the exact URLs provided by the user to extract real, factual information about the company. Do NOT create fictional or generic content.

CRITICAL INSTRUCTIONS:
- You MUST search and visit each provided URL to gather real information
- Extract ONLY factual information found on these specific URLs
- Do NOT hallucinate, invent, or create generic content
- If information is not available on the URLs, leave those fields empty or minimal
- Focus on company websites, LinkedIn profiles, about pages, and other relevant content

Return ONLY a JSON object with the exact structure requested. Write all descriptions factually based on the actual content found on the URLs.`;

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
