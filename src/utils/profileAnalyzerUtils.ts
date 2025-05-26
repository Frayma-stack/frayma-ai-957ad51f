
import { AuthorSocialLink, AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';
import { ParsedAnalysisData } from '@/types/profileAnalyzer';

export const collectUrls = (socialLinks: AuthorSocialLink[], additionalUrls: string) => {
  const allUrls = socialLinks
    .filter(link => link.url.trim() !== '')
    .map(link => link.url);
  
  // Add any manually entered URLs
  if (additionalUrls.trim()) {
    additionalUrls.split('\n')
      .map(url => url.trim())
      .filter(url => url !== '')
      .forEach(url => allUrls.push(url));
  }
  
  return allUrls;
};

export const buildAnalysisPrompt = (urls: string[]) => {
  const urlsString = urls.join('\n');
  
  return {
    role: "system",
    content: 
    "You are an expert data extraction agent specialized in analyzing social profiles and related web content. Your task is to visit the provided URLs—including LinkedIn, X (Twitter), and specified blog posts—and extract detailed, structured information about the person's current title/role, career backstory, experiences, writing tones, and product beliefs. Return ONLY a JSON string with the following fields and structure, without any additional commentary or explanation:\n\n" +
    "- currentTitle: string (current job title/role)\n" +
    "- careerBackstory: string (summary in seven sentences or less, first-person)\n" +
    "- experiences: array of objects, each with:\n" +
    "    - title: string (job title/role)\n" +
    "    - company: string\n" +
    "    - duration: string (time spent at company)\n" +
    "    - summary: string (what was done in the role, five sentences or less, first-person)\n" +
    "- writingTones: array of objects, each with:\n" +
    "    - toneTitle: string (succinct title of the writing tone)\n" +
    "    - toneSummary: string (summary of writing tone, four sentences or less, first-person)\n" +
    "- productBeliefs: array of objects, each with:\n" +
    "    - beliefTitle: string (succinct title of the product belief)\n" +
    "    - beliefSummary: string (summary of product belief, five sentences or less, first-person)\n\n" +
    "Use first-person language as if the person is telling someone about themselves. Do NOT include any text outside the JSON string. Do NOT explain your process.\n\n" +
    "CONTENT URLs:\n" +
    urlsString + "\n\n" +
    "Extract data only from these URLs."
  };
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

export const transformAnalysisResults = (parsedData: any) => {
  // Map experiences from new format
  const experiences: AuthorExperience[] = (parsedData.experiences || []).map((exp: any) => ({
    id: crypto.randomUUID(),
    title: `${exp.title} @ ${exp.company} | ${exp.duration}`,
    description: exp.summary || ''
  }));
  
  // Map writing tones from new format
  const tones: AuthorToneItem[] = (parsedData.writingTones || []).map((tone: any) => ({
    id: crypto.randomUUID(),
    tone: tone.toneTitle || '',
    description: tone.toneSummary || ''
  }));

  // Map product beliefs from new format
  const beliefs: AuthorBelief[] = (parsedData.productBeliefs || []).map((belief: any) => ({
    id: crypto.randomUUID(),
    belief: belief.beliefTitle || '',
    description: belief.beliefSummary || ''
  }));
  
  return { 
    currentRole: parsedData.currentTitle || '',
    organization: '', // Not in new format, will be extracted from title if needed
    backstory: parsedData.careerBackstory || '',
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
