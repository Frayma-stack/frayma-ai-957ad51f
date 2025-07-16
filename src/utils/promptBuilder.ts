
import { AuthorSocialLink } from '@/types/storytelling';

export const buildAnalysisPrompt = (urls: string[]) => {
  const systemPrompt = `You are an expert author content analyzer. Your task is to analyze written content by an author to extract their writing style, expertise, and professional beliefs from their published work.

IMPORTANT: Focus on analyzing the actual content written by the author - their writing style, thought patterns, expertise areas, and professional perspectives as demonstrated through their published content.

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
1. ANALYZE the author's actual writing to identify their unique voice, style, and expertise
2. EXTRACT writing tones based on how they communicate (professional, conversational, analytical, passionate, etc.)
3. IDENTIFY product/business beliefs from their content themes and perspectives
4. INFER current role and organization from author bio sections or content context
5. CREATE career backstory based on expertise demonstrated in their writing
6. For experiences: Look for mentioned roles, projects, or professional background in the content
7. Focus on QUALITY insights from content rather than assumptions
8. If role/company info isn't in content, make reasonable inferences from their expertise area

RESPONSE FORMAT:
- Return ONLY the JSON object
- NO explanatory text before or after
- Ensure all fields are populated with meaningful, professional content
- Each summary should be exactly one descriptive sentence
- Make reasonable assumptions to provide complete, useful information`;

  const userPrompt = `Analyze the author's written content from the following URLs to extract their professional profile and writing characteristics.

Content URLs analyzed: ${urls.join(', ')}

CONTENT TO ANALYZE:
The scraped written content from these URLs will be provided below.

FOCUS ON:
- The author's writing style and communication patterns
- Professional expertise and knowledge areas demonstrated in their content
- Business/product perspectives and beliefs expressed in their writing
- Any mentioned current role, company, or background information
- Thought leadership topics and areas of focus

Extract:
1. Current role and organization (from author bio or content context)
2. Career backstory based on expertise shown in their writing (2-3 sentences)
3. Professional experiences mentioned or inferred from content
4. Exactly 4 writing tones that reflect their actual communication style
5. Exactly 4 product/business beliefs demonstrated through their content themes

Return only the JSON object with no additional text.`;

  return { systemPrompt, userPrompt };
};
