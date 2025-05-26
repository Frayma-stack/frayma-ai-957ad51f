
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
  
  let prompt = `**CRITICAL INSTRUCTIONS: You MUST visit the actual LinkedIn profile URL(s) and only extract information that is explicitly visible. Do NOT create, infer, or make up any information.**

Visit the LinkedIn profile URL${linkedinUrls.length > 1 ? 's' : ''}: ${linkedinUrls.join(', ')}${authorNameText}

**STEP 1: Extract Current Role & Organization**
From the LinkedIn profile header/summary section, extract:
- Most recent job title (ONLY the title, not the company)
- Current organization/company name (ONLY the company name)

**STEP 2: Extract ALL Experiences**
Go to the "Experience" section on LinkedIn and extract EVERY single experience listed. Do NOT skip any.
For each experience you see:
- Title format: "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]"
- Description: Copy the EXACT description from LinkedIn. If no description exists, use empty string.
- You MUST extract ALL experiences, not just recent ones
- If you cannot see all experiences due to access limitations, mention this in your response

**STEP 3: Career Backstory**
Write a 5-sentence summary of their career trajectory based on the experiences you extracted.

**STEP 4: Analyze Social Posts**`;

  if (xUrls.length > 0) {
    prompt += `
Visit X profile${xUrls.length > 1 ? 's' : ''}: ${xUrls.join(', ')} and analyze their recent posts.`;
  }

  prompt += `
From LinkedIn posts and`;
  if (xUrls.length > 0) prompt += ` X posts`;
  if (otherUrls.length > 0) prompt += ` and other URLs (${otherUrls.join(', ')})`;
  
  prompt += `:

**Extract 4 Writing Tones:**
- Each tone should have a succinct title
- Each description should be EXACTLY 5 sentences, written in first-person ("I...")

**Extract 4 Product Beliefs:**
- Each belief should have a succinct title  
- Each description should be EXACTLY 5 sentences, written in first-person ("I...")

**OUTPUT FORMAT:**
Return ONLY a JSON object with this exact structure:
{
  "currentRole": "job title only",
  "organization": "company name only", 
  "backstory": "exactly 5 sentences about career trajectory",
  "experiences": [
    {
      "title": "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]",
      "description": "exact LinkedIn description or empty string"
    }
  ],
  "tones": [
    {
      "tone": "tone title",
      "description": "exactly 5 sentences in first-person"
    }
  ],
  "beliefs": [
    {
      "belief": "belief title", 
      "description": "exactly 5 sentences in first-person"
    }
  ]
}

**FINAL VALIDATION:**
- Verify you extracted ALL experiences from LinkedIn's Experience section
- Confirm no hallucinated experiences were added
- Check that all descriptions are exactly 5 sentences
- Ensure all content is in first-person perspective`;
  
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
