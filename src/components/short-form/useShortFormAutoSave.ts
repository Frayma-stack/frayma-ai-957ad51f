
import { useAutoSave } from '@/hooks/useAutoSave';
import { ContentType, ContentGoal } from './types';
import { NarrativeSelection } from '@/types/storytelling';

interface UseShortFormAutoSaveProps {
  contentType: ContentType;
  selectedClientId?: string;
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedAuthorBelief: string;
  narrativeSelections: NarrativeSelection[];
  contentGoal: ContentGoal;
  generatedContent: string;
  additionalContext: string;
  selectedSuccessStory: string;
  wordCount: number;
  emailCount: number;
  selectedIdeaId: string | null;
  triggerInput: string;
  productInputs: any;
}

export const useShortFormAutoSave = (props: UseShortFormAutoSaveProps) => {
  const autoSaveData = {
    selectedICP: props.selectedICP,
    selectedAuthor: props.selectedAuthor,
    selectedAuthorTone: props.selectedAuthorTone,
    selectedAuthorExperience: props.selectedAuthorExperience,
    selectedAuthorBelief: props.selectedAuthorBelief,
    narrativeSelections: props.narrativeSelections,
    contentGoal: props.contentGoal,
    generatedContent: props.generatedContent,
    additionalContext: props.additionalContext,
    selectedSuccessStory: props.selectedSuccessStory,
    wordCount: props.wordCount,
    emailCount: props.emailCount,
    selectedIdeaId: props.selectedIdeaId,
    triggerInput: props.triggerInput,
    productInputs: props.productInputs,
    contentType: props.contentType,
    selectedClientId: props.selectedClientId
  };

  const hasContent = Boolean(
    props.selectedICP || 
    props.selectedAuthor || 
    props.additionalContext || 
    props.generatedContent || 
    props.triggerInput ||
    props.narrativeSelections.length > 0
  );

  const autoSaveKey = `short_form_${props.contentType}_${props.selectedClientId || 'default'}`;
  
  return useAutoSave({
    key: autoSaveKey,
    data: autoSaveData,
    enabled: hasContent,
    debounceMs: 2000
  });
};
