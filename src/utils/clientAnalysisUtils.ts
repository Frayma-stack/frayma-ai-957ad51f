
import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  const urls = companyLinks.map(link => link.url).filter(url => url.trim());
  
  const systemPrompt = `You are a web research specialist with real-time web browsing capabilities. Your task is to visit and analyze the provided URLs to extract factual information about ${companyName}.

CAPABILITIES:
- You can browse and read website content in real-time
- You have access to current web information
- You can analyze multiple pages and synthesize information

REQUIREMENTS:
- Visit each provided URL and extract real information
- Focus on factual content found on the actual websites
- Synthesize information from multiple sources when available
- Return structured data in the specified JSON format`;

  const userPrompt = `Research and analyze these URLs for ${companyName}:

${urls.map((url, index) => `${index + 1}. ${url}`).join('\n')}

Extract the following information by visiting and analyzing these URLs:

**Company Overview:**
- What does ${companyName} do? (their main business/product)
- What industry/category are they in?
- What's their mission or main value proposition?

**Product Information:**
- Key features or services they offer
- Main use cases or applications
- Target audience or customer types

**Competitive Position:**
- What makes them unique or different?
- How do they position themselves in the market?
- Any competitive advantages mentioned?

Please browse these URLs and return the information in this JSON format:

{
  "companySummary": "Brief description of what the company does",
  "categoryPOV": "Their perspective on their industry/category",
  "companyMission": "Their stated mission or purpose",
  "uniqueInsight": "What makes them unique or their key differentiator",
  "features": [
    {
      "name": "Feature name",
      "benefits": ["Benefit 1", "Benefit 2"]
    }
  ],
  "useCases": [
    {
      "useCase": "Use case title",
      "userRole": "Target user type",
      "description": "Detailed description"
    }
  ],
  "differentiators": [
    {
      "name": "Differentiator name",
      "description": "How this differentiates them",
      "competitorComparison": "Comparison to alternatives if mentioned"
    }
  ]
}

Focus on extracting real information from the websites. If certain information isn't available on the provided URLs, you can leave those fields empty or provide minimal content based on what is available.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log('Parsing client analysis content:', content);
  
  // First check if the response indicates an inability to access URLs
  const cannotAccessPatterns = [
    "unable to access",
    "cannot access", 
    "can't access",
    "don't have the ability to browse",
    "cannot browse",
    "don't have access to",
    "I'm not able to browse"
  ];
  
  const lowerContent = content.toLowerCase();
  const hasAccessIssue = cannotAccessPatterns.some(pattern => lowerContent.includes(pattern));
  
  if (hasAccessIssue) {
    console.log('Detected access issue in response');
    throw new Error('The AI service reported that it cannot access the provided URLs. This may be due to website restrictions or the AI model\'s browsing capabilities. Please try with different URLs or enter the information manually.');
  }
  
  // Try to extract JSON from the response
  let jsonString = '';
  
  // Look for JSON in code blocks first
  const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  } else {
    // Look for standalone JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
  }
  
  if (!jsonString) {
    console.error('No JSON found in response:', content);
    throw new Error('The analysis service did not return the expected JSON format. Please try again or enter the information manually.');
  }
  
  // Clean and parse JSON
  try {
    // Clean up common JSON formatting issues
    let cleanedJson = jsonString
      .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // Replace single quotes with double quotes
      .trim();
    
    const parsed = JSON.parse(cleanedJson);
    
    // Validate that we have some meaningful data
    if (!parsed.companySummary && 
        (!parsed.features || parsed.features.length === 0) && 
        (!parsed.useCases || parsed.useCases.length === 0)) {
      console.warn('Parsed data appears to be empty or minimal:', parsed);
      throw new Error('The analysis returned minimal information. The websites may not contain sufficient accessible content for analysis.');
    }
    
    return parsed;
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError);
    console.error('Attempted to parse:', jsonString);
    throw new Error('Failed to parse the analysis response. The AI may have returned malformed data. Please try again.');
  }
};
