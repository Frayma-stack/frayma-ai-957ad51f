
import { ICPStoryScript, CustomerSuccessStory, Author, BusinessContext } from '@/types/storytelling';
import { FormData } from './useGTMNarrativeData';
import { useContentTriggersGeneration } from './useContentTriggersGeneration';
import { useHeadlinesGeneration } from './useHeadlinesGeneration';
import { usePhaseContentGeneration } from './usePhaseContentGeneration';

interface UseGTMNarrativeGenerationProps {
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  authors?: Author[];
  productContexts?: BusinessContext[];
  onDataChange: (field: keyof FormData, value: any) => void;
}

export const useGTMNarrativeGeneration = ({
  formData,
  scripts,
  successStories,
  authors = [],
  productContexts = [],
  onDataChange
}: UseGTMNarrativeGenerationProps) => {
  const {
    isGenerating: isGeneratingTriggers,
    generateContentTriggers
  } = useContentTriggersGeneration({
    formData,
    productContexts,
    onDataChange
  });

  const {
    isGenerating: isGeneratingHeadlines,
    generateHeadlines
  } = useHeadlinesGeneration({
    formData,
    productContexts,
    onDataChange
  });

  const {
    isGenerating: isGeneratingPhase,
    generatePhaseContent
  } = usePhaseContentGeneration({
    formData,
    scripts,
    authors,
    productContexts,
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
