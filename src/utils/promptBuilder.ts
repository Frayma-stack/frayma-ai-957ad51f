
import { AuthorSocialLink } from '@/types/storytelling';

export const buildAnalysisPrompt = (urls: string[]) => {
  const systemPrompt = `You are an expert LinkedIn profile analyzer. Your task is to analyze LinkedIn profiles and extract professional information in a specific format.

CRITICAL FORMATTING REQUIREMENTS:
1. For experiences, format them EXACTLY as: "Title/Role @Company | Duration"
2. Extract ALL professional experiences from LinkedIn in chronological order
3. Include current role, previous roles, and any notable positions
4. Always include duration/dates when available

You must return a valid JSON object with this exact structure:
{
  "currentTitle": "Current job title",
  "organization": "Current company name", 
  "careerBackstory": "Brief professional background summary",
  "experiences": [
    {
      "title": "Software Engineer @Google | 2020-2023",
      "company": "Google",
      "duration": "2020-2023", 
      "summary": "Led development of key features"
    }
  ],
  "writingTones": [
    {
      "toneTitle": "Technical",
      "toneSummary": "Clear technical communication"
    }
  ],
  "productBeliefs": [
    {
      "beliefTitle": "User-Centric Design",
      "beliefSummary": "Products should solve real problems"
    }
  ]
}

IMPORTANT: 
- Extract experiences in the EXACT format "Title @Company | Duration"
- Include ALL LinkedIn work experiences, not just the current one
- If duration is not available, use "Title @Company" format
- Focus on extracting real, verifiable information from the actual LinkedIn content`;

  const userPrompt = `Please analyze the LinkedIn profile content from these URLs and extract professional information:

URLs to analyze: ${urls.join(', ')}

Focus specifically on:
1. Current role and organization
2. ALL work experiences in chronological order (format: "Title @Company | Duration")
3. Professional background/career journey
4. Communication style and writing approach
5. Product philosophy and professional beliefs

Return the analysis as valid JSON only. Do not include any explanatory text outside the JSON structure.`;

  return { systemPrompt, userPrompt };
};
