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

export const buildLinkedInExperiencesPrompt = (linkedinUrls: string[], authorName?: string) => {
  const authorNameText = authorName || 'the profile owner';
  
  return `Visit the LinkedIn profile URL: ${linkedinUrls.join(', ')} of ${authorNameText}, extract their current role/title and organization, and prefill extracted into the first field below. Also, extract ALL professional experiences from ${linkedinUrls.join(', ')} and return each experience in the format: Title/Role @Company Name | Start Date – End Date or Present. Under each professional experience extracted from ${linkedinUrls.join(', ')}, create a summary of each experience in five sentences, using first-person language like ${authorNameText} was talking to someone one-on-one (e.g. use "I" like the person whose profile is being analyzed is telling someone about themself). From ALL listed professional experiences, awards, professional education, and recognition on ${linkedinUrls.join(', ')}, create a summarized backstory of their career trajectory to date in seven sentences. Auto-fill this in the field below.

Return ONLY a JSON object with this exact structure:

{
  "currentRole": "current job title only",
  "organization": "current company name only", 
  "backstory": "exactly 7 sentences summarizing the complete career journey from earliest to current role in first-person",
  "experiences": [
    {
      "title": "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]",
      "description": "exactly 5 sentences describing responsibilities and achievements in first-person ('I' statements)"
    }
  ]
}

**REQUIREMENTS:**
- Extract the MOST RECENT role for currentRole and organization
- Include ALL experiences listed on the profile, starting with the most recent
- Each experience description must be EXACTLY 5 sentences in first-person
- The backstory must be EXACTLY 7 sentences covering the entire career progression in first-person
- Use actual information from the LinkedIn profile
- Return ONLY valid JSON, no additional text or explanations`;
};

export const buildSocialContentAnalysisPrompt = (linkedinUrls: string[], xUrls: string[], otherUrls: string[], authorName?: string) => {
  const authorNameText = authorName || 'the profile owner';
  
  let prompt = `Revisit the personal LinkedIn profile URL ${linkedinUrls.join(', ')}`;
  
  if (xUrls.length > 0) {
    prompt += ` and ${xUrls.join(', ')}`;
  }
  
  prompt += ` and analyze their last 30 social posts.`;

  if (otherUrls.length > 0) {
    prompt += ` Also analyze the content by ${authorNameText} on these URLs: ${otherUrls.join(', ')}`;
  }

  prompt += ` to extract FOUR writing tones and FOUR product beliefs of ${authorNameText} from their LinkedIn`;
  
  if (xUrls.length > 0) {
    prompt += ` and X posts`;
  }
  
  if (otherUrls.length > 0) {
    prompt += `, as well as from these other URLs: ${otherUrls.join(', ')}`;
  }

  prompt += `. For each of the writing tones and product beliefs analyzed, give it a succinct title in four words or less, followed by a summary of each writing tone and product belief in five sentences. Write all summaries in first-person language (e.g. use "I" like ${authorNameText} is telling someone about themself).

Return ONLY a JSON object with this exact structure:

{
  "tones": [
    {
      "tone": "succinct tone name (4 words or less)",
      "description": "exactly 5 sentences in first-person describing when and how I use this tone"
    }
  ],
  "beliefs": [
    {
      "belief": "succinct belief title (4 words or less)", 
      "description": "exactly 5 sentences in first-person explaining this belief with examples"
    }
  ]
}

**REQUIREMENTS:**
- Generate exactly 4 writing tones based on actual content patterns
- Generate exactly 4 product beliefs based on expressed opinions and viewpoints
- Each description must be EXACTLY 5 sentences in first-person ("I...")
- Tone and belief titles must be 4 words or less
- Base analysis on actual social media posts and content
- Return ONLY valid JSON, no additional text or explanations`;
  
  return prompt;
};

export const buildPrompt = (linkedinUrls: string[], xUrls: string[], otherUrls: string[], authorName?: string) => {
  const authorNameText = authorName ? ` for ${authorName}` : '';
  
  let prompt = `**IMPORTANT NOTE: I understand you cannot access external websites or URLs. Instead, please generate realistic professional profile information based on the provided URLs and author name.**

Based on the following profile information${authorNameText}:

LinkedIn Profile(s): ${linkedinUrls.join(', ')}`;

  if (xUrls.length > 0) {
    prompt += `
X Profile(s): ${xUrls.join(', ')}`;
  }

  if (otherUrls.length > 0) {
    prompt += `
Other URLs: ${otherUrls.join(', ')}`;
  }

  prompt += `

Please generate realistic professional profile information in the following format:

**STEP 1: Generate Current Role & Organization**
Create a realistic job title and company name based on the profile URLs provided.

**STEP 2: Generate Professional Experiences**
Create 4-6 realistic professional experiences that would be typical for someone with the provided profile URLs. Each should include:
- Title format: "[Job Title] @ [Company Name] | [Start Date] – [End Date or Present]"
- Description: A realistic 2-3 sentence description of responsibilities and achievements

**STEP 3: Generate Career Backstory**
Write a realistic 5-sentence summary of a career trajectory that matches the generated experiences.

**STEP 4: Generate Writing Tones and Product Beliefs**
Create realistic content based on typical professional communication:

**4 Writing Tones:**
- Each tone should have a succinct title
- Each description should be EXACTLY 5 sentences, written in first-person ("I...")

**4 Product Beliefs:**
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
      "description": "realistic job description"
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

**REQUIREMENTS:**
- Generate realistic, professional content
- Ensure all descriptions are exactly 5 sentences
- Use first-person perspective for tones and beliefs
- Make the content consistent with the provided profile URLs
- Return ONLY valid JSON, no additional text`;
  
  return prompt;
};

export const parseAnalysisContent = (content: string): ParsedAnalysisData => {
  console.log('Raw analysis response content:', content);
  
  // Try to find JSON in the response
  let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                  content.match(/```([\s\S]*?)```/) || 
                  content.match(/{[\s\S]*}/);
  
  if (jsonMatch) {
    const jsonString = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonString);
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON format in the analysis response');
    }
  } 
  
  // If no JSON found, try to parse the entire content as JSON
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Could not parse content as JSON:', content);
    console.error('Parse error:', parseError);
    
    // If AI refuses to generate content, return a helpful error
    if (content.includes("I can't access") || content.includes("I'm sorry") || content.includes("I cannot")) {
      throw new Error('Analysis service cannot access external websites. Please try a different approach or provide the information manually.');
    }
    
    throw new Error('Could not find valid JSON in the analysis response. Please try again.');
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
