
import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  const urls = companyLinks.map(link => link.url).filter(url => url.trim());
  
  const systemPrompt = `You are an expert AI research assistant specialized in company analysis and content synthesis.

Given a set of URLs provided by the user that relate to a company—typically including the company's main website, LinkedIn page, About page, Services page, or other relevant pages—your task is to extract detailed company information and output it in a structured JSON format for direct use in a product.

Please analyze the content from the URLs and provide the following fields exactly as specified:

{
  "company_description": "A concise description of the company.",
  "category_point_of_view": "The company's Category Point of View summarized in exactly 3 sentences.",
  "company_mission": "The company's Mission statement as explicitly stated by the company.",
  "unique_insight": "A unique insight about the company in 3 to 4 sentences.",
  "features_services": [
    {
      "feature_service_name": "Name of the feature or service",
      "benefits": [
        "Benefit 1",
        "Benefit 2",
        "Benefit 3",
        "Benefit 4",
        "Benefit 5 (optional)",
        "Benefit 6 (optional)"
      ]
    }
  ],
  "use_cases": [
    {
      "role_title_team": "Relevant role, title, or team for this use case",
      "value_add_description": "Description of the value-add for this use case"
    }
  ],
  "differentiators": [
    {
      "title": "Differentiator title",
      "description": "Succinct 2-3 sentence description of the differentiator"
    }
  ],
  "sources": [
    "URL 1",
    "URL 2",
    "URL 3",
    "URL 4",
    "...additional URLs as provided"
  ]
}

Additional instructions:
- Use the URLs in the order provided by the user and list them in the "sources" array.
- Cite sources by referencing their index in the "sources" array when extracting factual statements (this is for your internal tracking; do not output citations in the JSON fields).
- Do not include any information beyond what is requested.
- Ensure all text is concise, clear, and professional.
- Return only the JSON object as your response, without any additional commentary or explanation.

Current Date: ${new Date().toISOString().split('T')[0]}`;

  const userPrompt = `The URLs to analyze are:
${urls.map((url, index) => `- ${url}`).join('\n')}

Company Name: ${companyName}

Please extract the detailed company information from these URLs and return the structured JSON as specified.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log('Parsing client analysis content:', content);
  
  // Enhanced error detection patterns based on Perplexity's suggestions
  const accessErrorPatterns = [
    "unable to access",
    "cannot access", 
    "can't access",
    "don't have the ability to browse",
    "cannot browse",
    "don't have access to",
    "I'm not able to browse",
    "network error",
    "connection refused",
    "timeout",
    "403 forbidden",
    "401 unauthorized",
    "blocked by firewall",
    "restricted access",
    "cannot fetch",
    "failed to retrieve"
  ];
  
  const lowerContent = content.toLowerCase();
  const hasAccessIssue = accessErrorPatterns.some(pattern => lowerContent.includes(pattern));
  
  if (hasAccessIssue) {
    console.log('Detected access issue in response');
    throw new Error('The analysis service reported that it cannot access the provided URLs. This may be due to network restrictions, firewall blocking, authentication requirements, or URL accessibility issues. Please verify the URLs are publicly accessible and try again, or consider providing the information manually.');
  }
  
  // Try to extract JSON from the response using multiple strategies
  let jsonString = '';
  
  // Strategy 1: Look for JSON in code blocks
  const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  } else {
    // Strategy 2: Look for standalone JSON object (most comprehensive)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
  }
  
  if (!jsonString) {
    console.error('No JSON found in response:', content);
    
    // Check if response contains structured information but not in JSON format
    if (content.includes('company') || content.includes('mission') || content.includes('feature')) {
      throw new Error('The analysis service returned information but not in the expected JSON format. The URLs may have been analyzed but the response format was incorrect. Please try again or provide the information manually.');
    }
    
    throw new Error('The analysis service did not return the expected JSON format. This may indicate the URLs could not be properly analyzed or accessed. Please verify the URLs are valid and accessible, then try again.');
  }
  
  // Clean and parse JSON with enhanced error handling
  try {
    // Enhanced JSON cleaning
    let cleanedJson = jsonString
      .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"')  // Replace single quotes with double quotes
      .replace(/\\n/g, ' ')  // Replace newlines with spaces
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
    
    const parsed = JSON.parse(cleanedJson);
    
    // Enhanced validation based on the new structure
    const hasValidData = (
      parsed.company_description ||
      parsed.category_point_of_view ||
      parsed.company_mission ||
      parsed.unique_insight ||
      (parsed.features_services && parsed.features_services.length > 0) ||
      (parsed.use_cases && parsed.use_cases.length > 0) ||
      (parsed.differentiators && parsed.differentiators.length > 0)
    );
    
    if (!hasValidData) {
      console.warn('Parsed data appears to be empty or minimal:', parsed);
      throw new Error('The analysis returned minimal information. The websites may not contain sufficient accessible content for analysis, or there may be network restrictions preventing proper access to the URLs.');
    }
    
    // Transform the data to match our internal structure
    const transformedData = {
      companySummary: parsed.company_description || '',
      categoryPOV: parsed.category_point_of_view || '',
      companyMission: parsed.company_mission || '',
      uniqueInsight: parsed.unique_insight || '',
      features: (parsed.features_services || []).map((item: any) => ({
        name: item.feature_service_name || '',
        benefits: Array.isArray(item.benefits) ? item.benefits : []
      })),
      useCases: (parsed.use_cases || []).map((item: any) => ({
        useCase: item.role_title_team || '',
        userRole: item.role_title_team || '',
        description: item.value_add_description || ''
      })),
      differentiators: (parsed.differentiators || []).map((item: any) => ({
        name: item.title || '',
        description: item.description || '',
        competitorComparison: ''
      })),
      sources: parsed.sources || []
    };
    
    return transformedData;
    
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError);
    console.error('Attempted to parse:', jsonString);
    
    // Provide more specific error messages based on the error type
    if (parseError instanceof SyntaxError) {
      throw new Error('The analysis service returned malformed data. This may be due to network issues or URL accessibility problems. Please verify the URLs are working and try again.');
    }
    
    throw new Error('Failed to parse the analysis response. The AI may have encountered issues accessing the provided URLs due to network restrictions, authentication requirements, or firewall blocking. Please verify the URLs are publicly accessible and try again.');
  }
};
