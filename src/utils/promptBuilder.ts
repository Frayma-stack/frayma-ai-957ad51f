
import { AuthorSocialLink } from '@/types/storytelling';

export const buildAnalysisPrompt = (urls: string[]) => {
  const systemPrompt = `You are an expert professional profile analyzer. Your task is to extract and structure professional information from any available content (LinkedIn profiles, social media bios, personal websites, etc.).

IMPORTANT: If content extraction is limited (e.g., due to LinkedIn access restrictions), work with whatever information is available and make reasonable professional inferences to create a complete profile.

CRITICAL OUTPUT REQUIREMENTS:
You MUST return a valid JSON object with this EXACT structure:
{
  "currentTitle": "Current job title or role",
  "organization": "Current company or organization name", 
  "careerBackstory": "2-3 sentence professional background summary highlighting key career progression and expertise",
  "experiences": [
    {
      "title": "Job Title @Company Name | Duration",
      "company": "Company Name",
      "duration": "Time Period", 
      "summary": "Brief description of role and achievements"
    }
  ],
  "writingTones": [
    {
      "toneTitle": "Professional",
      "toneSummary": "Clear, authoritative communication style with industry expertise"
    },
    {
      "toneTitle": "Analytical",
      "toneSummary": "Data-driven approach with logical problem-solving focus"
    },
    {
      "toneTitle": "Engaging", 
      "toneSummary": "Accessible and compelling content that connects with audience"
    },
    {
      "toneTitle": "Authentic",
      "toneSummary": "Genuine voice that reflects personal experience and values"
    }
  ],
  "productBeliefs": [
    {
      "beliefTitle": "User-Centric Design",
      "beliefSummary": "Products should solve real user problems with intuitive experiences"
    },
    {
      "beliefTitle": "Data-Driven Decisions",
      "beliefSummary": "Strategic choices backed by insights and measurable outcomes"
    },
    {
      "beliefTitle": "Continuous Innovation",
      "beliefSummary": "Always evolving to meet changing market needs and opportunities"
    },
    {
      "beliefTitle": "Quality Excellence",
      "beliefSummary": "Sustainable execution focused on long-term value creation"
    }
  ]
}

EXTRACTION GUIDELINES:
1. IF professional content is available: Extract actual experiences in "Title @Company | Duration" format
2. IF content is severely limited: Make reasonable professional inferences based on any available context (domain names, URL patterns, etc.)
3. IF LinkedIn is blocked: Use alternative strategies - analyze domain names, social media bios, website content, or any available text
4. ALWAYS provide exactly 4 writing tones and 4 product beliefs with meaningful summaries tailored to the professional context
5. Career backstory should be 2-3 sentences maximum highlighting key progression
6. Focus on creating VALUE even from minimal information - better to have thoughtful defaults than empty fields
7. If specific company/role info isn't available, use generic but professional language

RESPONSE FORMAT:
- Return ONLY the JSON object
- NO explanatory text before or after
- Ensure all fields are populated with meaningful, professional content
- Each summary should be exactly one descriptive sentence
- Make reasonable assumptions to provide complete, useful information`;

  const userPrompt = `Analyze the following professional profile content and extract information in the required JSON format.

URLs analyzed: ${urls.join(', ')}

CONTENT TO ANALYZE:
The scraped content will be provided below. 

IMPORTANT: If content extraction was limited due to access restrictions (especially LinkedIn), work with whatever information you can gather from:
- URL patterns and domain names
- Any partial content that was extracted
- Social media profile information
- Website headers or meta information
- Make reasonable professional inferences to create a complete, useful profile

Extract:
1. Current role and organization (or infer from available info)
2. Career backstory (2-3 sentences maximum)
3. Professional experiences in "Title @Company | Duration" format
4. Exactly 4 writing tones with one-sentence summaries
5. Exactly 4 product beliefs with one-sentence summaries

Return only the JSON object with no additional text.`;

  return { systemPrompt, userPrompt };
};
