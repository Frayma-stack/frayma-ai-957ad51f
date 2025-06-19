
import { ICPStoryScript, CustomerSuccessStory, Author } from '@/types/storytelling';
import { FormData } from './useGTMNarrativeData';
import { useContentTriggersGeneration } from './useContentTriggersGeneration';
import { useHeadlinesGeneration } from './useHeadlinesGeneration';
import { usePhaseContentGeneration } from './usePhaseContentGeneration';

interface UseGTMNarrativeGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  authors?: Author[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useGTMNarrativeGeneration = ({
  formData,
  scripts,
  successStories,
  authors = [],
  onDataChange
}: UseGTMNarrativeGenerationProps) => {
  const {
    isGenerating: isGeneratingTriggers,
    generateContentTriggers
  } = useContentTriggersGeneration({
    formData,
    onDataChange
  });

  const {
    isGenerating: isGeneratingHeadlines,
    generateHeadlines
  } = useHeadlinesGeneration({
    formData,
    onDataChange
  });

  const {
    isGenerating: isGeneratingPhase,
    generatePhaseContent
  } = usePhaseContentGeneration({
    formData,
    scripts,
    authors,
    onDataChange
  });

  const isGenerating = isGeneratingTriggers || isGeneratingHeadlines || isGeneratingPhase;

  return {
    isGenerating,
    generateContentTriggers,
    generateHeadlines,
    generatePhaseContent
  };
};
