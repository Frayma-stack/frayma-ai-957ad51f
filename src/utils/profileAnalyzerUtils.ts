
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

export const buildPrompt = (linkedinUrls: string[], xUrls: string[], otherUrls: string[]) => {
  let prompt = "Visit the ";
  
  const urlParts = [];
  
  if (linkedinUrls.length > 0) {
    urlParts.push(`LinkedIn profile url${linkedinUrls.length > 1 ? 's' : ''} (${linkedinUrls.join(', ')})`);
  }
  
  if (xUrls.length > 0) {
    urlParts.push(`X profile url${xUrls.length > 1 ? 's' : ''} (${xUrls.join(', ')})`);
  }
  
  if (otherUrls.length > 0) {
    urlParts.push(`other url${otherUrls.length > 1 ? 's' : ''} (${otherUrls.join(', ')})`);
  }
  
  prompt += urlParts.join(', and ');
  
  prompt += `, analyze their last 30 social posts, and extract the following information:

1. CURRENT ROLE & ORGANIZATION: Extract the person's most recent/current job title and company name from their LinkedIn profile. This should be their latest position.

2. CAREER BACKSTORY: Provide a summary of their career journey in four sentences or less, written in first-person language (using 'I').

3. ALL PROFESSIONAL EXPERIENCES: Extract ALL professional experiences from their LinkedIn profile. For each experience, format as follows:
   - Title: '[Job Title] at [Company Name] ([Duration/Years])'
   - Description: Summary of what they did in that role (4 sentences or less, written in first-person using 'I')
   
   Include experiences in chronological order from most recent to oldest. Capture the exact job titles, company names, and duration as shown on LinkedIn.

4. WRITING TONES: Analyze their social posts and identify 3 distinct writing tones with:
   - Tone: A succinct title for the tone
   - Description: Summary of this writing style (4 sentences or less, first-person)

5. PRODUCT BELIEFS: Extract 4 product/business beliefs from their content with:
   - Belief: A succinct title for the belief
   - Description: Summary of this belief (4 sentences or less, first-person)

Format the output as a JSON object with fields: 'currentRole', 'organization', 'backstory', 'experiences' (array with fields 'title' and 'description'), 'tones' (array with fields 'tone' and 'description'), and 'beliefs' (array with fields 'belief' and 'description').

IMPORTANT: Ensure 'currentRole' contains ONLY the job title, 'organization' contains ONLY the company name, and all experiences are captured with their full context from LinkedIn.`;
  
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
