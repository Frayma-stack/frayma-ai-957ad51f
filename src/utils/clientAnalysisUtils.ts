
import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  const urls = companyLinks.map(link => link.url).filter(url => url.trim());
  
  const systemPrompt = `You are an expert AI research assistant specialized in company analysis and content synthesis.

IMPORTANT: You will be provided with the actual website content from the company's URLs below. DO NOT attempt to search online or access any URLs. Analyze ONLY the content that is explicitly provided to you.

Your task is to extract detailed company information from the provided website content and output it in a structured JSON format.

Please analyze the provided content and extract the following fields exactly as specified:

{
  "company_description": "A concise description of the company based on the provided content.",
  "category_point_of_view": "The company's Category Point of View summarized in exactly 3 sentences from the provided content.",
  "company_mission": "The company's Mission statement as explicitly stated in the provided content.",
  "unique_insight": "A unique insight about the company in 3 to 4 sentences based on the provided content.",
  "features_services": [
    {
      "feature_service_name": "Name of the feature or service found in the content",
      "benefits": [
        "Benefit 1 from the content",
        "Benefit 2 from the content",
        "Benefit 3 from the content",
        "Benefit 4 from the content",
        "Benefit 5 (optional) from the content",
        "Benefit 6 (optional) from the content"
      ]
    }
  ],
  "use_cases": [
    {
      "role_title_team": "Relevant role, title, or team mentioned in the content",
      "value_add_description": "Description of the value-add for this use case from the content"
    }
  ],
  "differentiators": [
    {
      "title": "Differentiator title from the content",
      "description": "Succinct 2-3 sentence description of the differentiator from the content"
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

Critical instructions:
- Extract information ONLY from the website content that will be provided below
- Do NOT search online, access URLs, or use external knowledge
- If specific information is not available in the provided content, leave those fields empty or state "Not available in provided content"
- Use only factual information that appears in the provided website content
- Do not invent or hallucinate any information not present in the content
- Ensure all text is concise, clear, and directly extracted from the provided content
- Return only the JSON object as your response, without any additional commentary or explanation

Current Date: ${new Date().toISOString().split('T')[0]}`;

  const userPrompt = `Company Name: ${companyName}

The following URLs will be analyzed and their content provided below:
${urls.map((url, index) => `- ${url}`).join('\n')}

Please extract the detailed company information from the website content that will be provided and return the structured JSON as specified. Remember to analyze ONLY the actual content provided, not any external or additional information.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log('Parsing client analysis content from pre-fetched data:', content);
  
  // Enhanced error detection patterns for content-based analysis
  const contentIssuePatterns = [
    "not available in provided content",
    "no content was provided",
    "content is empty",
    "unable to find",
    "information not found",
    "not mentioned in the content",
    "no specific information",
    "content does not contain"
  ];
  
  const lowerContent = content.toLowerCase();
  
  // Try to extract JSON from the response using multiple strategies
  let jsonString = '';
  
  // Strategy 1: Look for JSON in code blocks
  const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  } else {
    // Strategy 2: Look for standalone JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
  }
  
  if (!jsonString) {
    console.error('No JSON found in response:', content);
    
    // Check if response indicates content issues
    const hasContentIssue = contentIssuePatterns.some(pattern => lowerContent.includes(pattern));
    if (hasContentIssue) {
      throw new Error('The analysis indicates that the website content could not be properly extracted or contains insufficient information for analysis. Please verify the URLs contain the expected company information and are publicly accessible.');
    }
    
    // Check if response contains structured information but not in JSON format
    if (content.includes('company') || content.includes('mission') || content.includes('feature')) {
      throw new Error('The analysis service returned information but not in the expected JSON format. This may indicate an issue with content processing. Please try again.');
    }
    
    throw new Error('The analysis service did not return the expected JSON format. The website content may not have been properly processed or may be insufficient for analysis.');
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
    
    // Enhanced validation for content-based analysis
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
      throw new Error('The analysis returned minimal information from the website content. The websites may not contain sufficient accessible content for meaningful analysis, or the content structure may not be suitable for automated extraction.');
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
      throw new Error('The analysis service returned malformed data from the website content. This may be due to complex content structure or processing issues. Please verify the website content is standard HTML and try again.');
    }
    
    throw new Error('Failed to parse the analysis response from the website content. The content processing may have encountered issues with the website structure or format. Please verify the URLs contain standard, accessible content and try again.');
  }
};
