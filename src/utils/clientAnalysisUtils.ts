
import { CompanyLink } from '@/types/storytelling';

export const buildClientAnalysisPrompt = (companyLinks: CompanyLink[], companyName: string) => {
  let prompt = `Visit the following URLs for ${companyName}: `;
  
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
  
  prompt += urlParts.join(', ');
  
  prompt += `. Analyze the company information and extract the following details:

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

  return prompt;
};

export const parseClientAnalysisContent = (content: string) => {
  let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || content.match(/{[\s\S]*}/);
  
  if (jsonMatch) {
    const jsonString = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonString);
    return JSON.parse(jsonString);
  } else {
    console.error('Could not find JSON in response content:', content);
    throw new Error('Could not find JSON in the analysis response');
  }
};
