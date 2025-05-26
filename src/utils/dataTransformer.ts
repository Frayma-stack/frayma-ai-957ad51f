
import { AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

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
