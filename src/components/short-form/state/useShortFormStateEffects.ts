
import { useEffect } from 'react';
import { ContentGoal } from './types';

interface UseShortFormStateEffectsProps {
  isPersistenceLoaded: boolean;
  persistedValues: any;
  selectedAuthor: string;
  setSelectedICP: (value: string) => void;
  setSelectedAuthor: (value: string) => void;
  setSelectedAuthorTone: (value: string) => void;
  setSelectedAuthorExperience: (value: string) => void;
  setContentGoal: (value: ContentGoal) => void;
  setAdditionalContext: (value: string) => void;
  setSelectedSuccessStory: (value: string) => void;
  setWordCount: (value: number) => void;
  setEmailCount: (value: number) => void;
  setSelectedIdeaId: (value: string | null) => void;
  setTriggerInput: (value: string) => void;
  updatePersistedValue: (key: string, value: any) => void;
}

export const useShortFormStateEffects = ({
  isPersistenceLoaded,
  persistedValues,
  selectedAuthor,
  setSelectedICP,
  setSelectedAuthor,
  setSelectedAuthorTone,
  setSelectedAuthorExperience,
  setContentGoal,
  setAdditionalContext,
  setSelectedSuccessStory,
  setWordCount,
  setEmailCount,
  setSelectedIdeaId,
  setTriggerInput,
  updatePersistedValue
}: UseShortFormStateEffectsProps) => {
  // Update local state when persisted values load
  useEffect(() => {
    if (isPersistenceLoaded) {
      setSelectedICP(persistedValues.selectedICP);
      setSelectedAuthor(persistedValues.selectedAuthor);
      setSelectedAuthorTone(persistedValues.selectedAuthorTone);
      setSelectedAuthorExperience(persistedValues.selectedAuthorExperience);
      setContentGoal(persistedValues.contentGoal || { type: 'book_call', description: '' });
      setAdditionalContext(persistedValues.additionalContext);
      setSelectedSuccessStory(persistedValues.selectedSuccessStory);
      setWordCount(persistedValues.wordCount);
      setEmailCount(persistedValues.emailCount);
      setSelectedIdeaId(persistedValues.selectedIdeaId);
      setTriggerInput(persistedValues.triggerInput);
    }
  }, [isPersistenceLoaded, persistedValues]);
  
  // Reset author tone and experience when author changes
  useEffect(() => {
    setSelectedAuthorTone("");
    setSelectedAuthorExperience("");
    updatePersistedValue('selectedAuthorTone', "");
    updatePersistedValue('selectedAuthorExperience', "");
  }, [selectedAuthor]);
};
