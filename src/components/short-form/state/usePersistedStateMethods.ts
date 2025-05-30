
import { ContentGoal } from './types';

interface UsePersistedStateMethodsProps {
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

export const usePersistedStateMethods = ({
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
}: UsePersistedStateMethodsProps) => {
  const setSelectedICPWithPersistence = (value: string) => {
    setSelectedICP(value);
    updatePersistedValue('selectedICP', value);
  };

  const setSelectedAuthorWithPersistence = (value: string) => {
    setSelectedAuthor(value);
    updatePersistedValue('selectedAuthor', value);
  };

  const setSelectedAuthorToneWithPersistence = (value: string) => {
    setSelectedAuthorTone(value);
    updatePersistedValue('selectedAuthorTone', value);
  };

  const setSelectedAuthorExperienceWithPersistence = (value: string) => {
    setSelectedAuthorExperience(value);
    updatePersistedValue('selectedAuthorExperience', value);
  };

  const setContentGoalWithPersistence = (value: ContentGoal) => {
    setContentGoal(value);
    updatePersistedValue('contentGoal', value);
  };

  const setAdditionalContextWithPersistence = (value: string) => {
    setAdditionalContext(value);
    updatePersistedValue('additionalContext', value);
  };

  const setSelectedSuccessStoryWithPersistence = (value: string) => {
    setSelectedSuccessStory(value);
    updatePersistedValue('selectedSuccessStory', value);
  };

  const setWordCountWithPersistence = (value: number) => {
    setWordCount(value);
    updatePersistedValue('wordCount', value);
  };

  const setEmailCountWithPersistence = (value: number) => {
    setEmailCount(value);
    updatePersistedValue('emailCount', value);
  };

  const setSelectedIdeaIdWithPersistence = (value: string | null) => {
    setSelectedIdeaId(value);
    updatePersistedValue('selectedIdeaId', value);
  };

  const setTriggerInputWithPersistence = (value: string) => {
    setTriggerInput(value);
    updatePersistedValue('triggerInput', value);
  };

  return {
    setSelectedICPWithPersistence,
    setSelectedAuthorWithPersistence,
    setSelectedAuthorToneWithPersistence,
    setSelectedAuthorExperienceWithPersistence,
    setContentGoalWithPersistence,
    setAdditionalContextWithPersistence,
    setSelectedSuccessStoryWithPersistence,
    setWordCountWithPersistence,
    setEmailCountWithPersistence,
    setSelectedIdeaIdWithPersistence,
    setTriggerInputWithPersistence
  };
};
