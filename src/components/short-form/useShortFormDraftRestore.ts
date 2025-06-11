
import { useCallback } from 'react';

interface UseShortFormDraftRestoreProps {
  setSelectedICP: (value: string) => void;
  setSelectedAuthor: (value: string) => void;
  setSelectedAuthorTone: (value: string) => void;
  setSelectedAuthorExperience: (value: string) => void;
  setSelectedAuthorBelief: (value: string) => void;
  setNarrativeSelections: (selections: any[]) => void;
  setContentGoal: (goal: any) => void;
  setGeneratedContent: (content: string) => void;
  setAdditionalContext: (context: string) => void;
  setSelectedSuccessStory: (story: string) => void;
  setWordCount: (count: number) => void;
  setEmailCount: (count: number) => void;
  setSelectedIdeaId: (id: string | null) => void;
  setTriggerInput: (input: string) => void;
  setProductInputs: (inputs: any) => void;
  originalHandleRestoreDraft: (data: any) => any;
}

export const useShortFormDraftRestore = (props: UseShortFormDraftRestoreProps) => {
  const handleRestoreDraft = useCallback((draft: any) => {
    if (!draft || !draft.data) return;
    
    const data = draft.data;
    
    if (data.selectedICP) props.setSelectedICP(data.selectedICP);
    if (data.selectedAuthor) props.setSelectedAuthor(data.selectedAuthor);
    if (data.selectedAuthorTone) props.setSelectedAuthorTone(data.selectedAuthorTone);
    if (data.selectedAuthorExperience) props.setSelectedAuthorExperience(data.selectedAuthorExperience);
    if (data.selectedAuthorBelief) props.setSelectedAuthorBelief(data.selectedAuthorBelief);
    if (Array.isArray(data.narrativeSelections)) props.setNarrativeSelections(data.narrativeSelections);
    if (data.contentGoal) props.setContentGoal(data.contentGoal);
    if (data.generatedContent) props.setGeneratedContent(data.generatedContent);
    if (data.additionalContext) props.setAdditionalContext(data.additionalContext);
    if (data.selectedSuccessStory) props.setSelectedSuccessStory(data.selectedSuccessStory);
    if (typeof data.wordCount === 'number') props.setWordCount(data.wordCount);
    if (typeof data.emailCount === 'number') props.setEmailCount(data.emailCount);
    if (data.selectedIdeaId) props.setSelectedIdeaId(data.selectedIdeaId);
    if (data.triggerInput) props.setTriggerInput(data.triggerInput);
    if (data.productInputs) props.setProductInputs(data.productInputs);
    
    props.originalHandleRestoreDraft(data);
  }, [props]);

  return { handleRestoreDraft };
};
