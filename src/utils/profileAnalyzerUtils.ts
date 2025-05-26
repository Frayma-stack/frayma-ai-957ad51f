
import { AuthorSocialLink, AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';
import { ParsedAnalysisData } from '@/types/profileAnalyzer';

export const collectUrls = (socialLinks: AuthorSocialLink[], additionalUrls: string) => {
  const linkedinUrls = socialLinks
    .filter(link => link.type === 'linkedin' && link.url.trim() !== '')
    .map(link => link.url);
  
  const xUrls = socialLinks
    .filter(link => link.type === 'x' && link.url.trim() !== '')
    .map(link => link.url);
  
  const otherUrls = [...socialLinks
    .filter(link => !['linkedin', 'x'].includes(link.type) && link.url.trim() !== '')
    .map(link => link.url)];
  
  // Add any manually entered URLs
  if (additionalUrls.trim()) {
    additionalUrls.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '')
      .forEach(url => otherUrls.push(url));
  }
  
  return { linkedinUrls, xUrls, otherUrls };
};

export const buildPrompt = (linkedinUrls: string[], xUrls: string[], otherUrls: string[], authorName?: string) => {
  const authorNameText = authorName ? ` of ${authorName}` : '';
  
  let prompt = `Visit the LinkedIn profile url${linkedinUrls.length > 1 ? 's' : ''} (${linkedinUrls.join(', ')})${authorNameText}, extract their most recent role/title and their current organization and prefill into the respective fields above.

Then, revisit their LinkedIn profile url${linkedinUrls.length > 1 ? 's' : ''} (${linkedinUrls.join(', ')})`;

  if (xUrls.length > 0) {
    prompt += ` and X profile${xUrls.length > 1 ? 's' : ''} (${xUrls.join(', ')})`;
  }

  prompt += ` and analyze their last 30 social posts.`;

  if (otherUrls.length > 0) {
    prompt += ` Also analyze these other urls (${otherUrls.join(', ')}).`;
  }

  prompt += ` After analyzing, provide a summary of profile's career backstory (in five sentences or less), covering their career trajectory up to date. 

CRITICAL INSTRUCTIONS FOR EXPERIENCES:
- You MUST extract ALL and ONLY the experiences that are explicitly listed in the LinkedIn profile's "Experience" section
- Do NOT create, infer, or hallucinate any experiences that are not directly visible on the LinkedIn profile
- For each experience found on LinkedIn, the title MUST be formatted EXACTLY as: "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]"
- The description MUST be the EXACT text from that specific LinkedIn experience description, written in first-person as it appears
- If an experience has no description on LinkedIn, use an empty string for the description field
- If you cannot clearly see all experiences due to access limitations, extract only what you can definitively see
- Double-check each experience against what is actually listed on the LinkedIn profile before including it

Also extract FOUR writing tones and FOUR product beliefs from their LinkedIn and X posts`;

  if (otherUrls.length > 0) {
    prompt += `, as well as from these other urls (${otherUrls.join(', ')})`;
  }

  prompt += `. For each of the writing tones and product beliefs analyzed, give it a succinct title followed by a summary of each writing tone and product belief in five sentences. Write all tone and belief summaries in first-person language (e.g. use "I" like the person whose profile is being analyzed is telling someone about themself).

Format the output as a JSON object with fields: 'currentRole', 'organization', 'backstory', 'experiences' (array with fields 'title' and 'description'), 'tones' (array with fields 'tone' and 'description'), and 'beliefs' (array with fields 'belief' and 'description').

FINAL VALIDATION REQUIREMENTS:
- Ensure 'currentRole' contains ONLY the job title from the most recent position
- 'organization' contains ONLY the company name from the most recent position
- For experiences: the 'title' field MUST follow the exact format: "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]"
- For experiences: the 'description' field should contain the actual LinkedIn experience description in first-person, or empty string if none exists
- Include accurate date ranges for each experience as they appear on LinkedIn
- VERIFY: Each experience you include actually exists on the LinkedIn profile - do not add any experiences that are not explicitly listed
- If you're unsure about any experience details, do not include that experience rather than guessing`;
  
  return prompt;
};

export const parseAnalysisContent = (content: string): ParsedAnalysisData => {
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

export const transformAnalysisResults = (parsedData: ParsedAnalysisData) => {
  const experiences: AuthorExperience[] = (parsedData.experiences || []).map((exp: any) => ({
    id: crypto.randomUUID(),
    title: exp.title || '',
    description: exp.description || ''
  }));
  
  const tones: AuthorToneItem[] = (parsedData.tones || []).map((tone: any) => ({
    id: crypto.randomUUID(),
    tone: tone.tone || '',
    description: tone.description || ''
  }));

  const beliefs: AuthorBelief[] = (parsedData.beliefs || []).map((belief: any) => ({
    id: crypto.randomUUID(),
    belief: belief.belief || '',
    description: belief.description || ''
  }));
  
  return { 
    currentRole: parsedData.currentRole || '',
    organization: parsedData.organization || '',
    backstory: parsedData.backstory || '',
    experiences, 
    tones,
    beliefs
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return "Network error: Unable to connect to the analysis service. Please check your internet connection and try again.";
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred while analyzing the profile.";
};

export const getApiErrorMessage = (status: number): string => {
  if (status === 401) {
    return "Authentication failed. Please check your API configuration.";
  } else if (status === 429) {
    return "Rate limit exceeded. Please try again in a few minutes.";
  } else if (status === 403) {
    return "Access forbidden. Please check your API permissions.";
  } else if (status >= 500) {
    return "Server error. Please try again later.";
  }
  return "An error occurred while analyzing the profile.";
};
