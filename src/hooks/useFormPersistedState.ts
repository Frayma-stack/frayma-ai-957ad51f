
import { useFormPersistence } from '@/hooks/useFormPersistence';

type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface PersistedFormValues {
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  contentGoal: ContentGoal;
  additionalContext: string;
  selectedSuccessStory: string;
  wordCount: number;
  emailCount: number;
  selectedIdeaId: string | null;
  triggerInput: string;
}

export const useFormPersistedState = () => {
  const {
    values: persistedValues,
    updateValue: updatePersistedValue,
    clearPersistedData,
    isLoaded: isPersistenceLoaded
  } = useFormPersistence({
    key: 'short_form_content',
    defaultValues: {
      selectedICP: "",
      selectedAuthor: "",
      selectedAuthorTone: "",
      selectedAuthorExperience: "",
      contentGoal: "learn_more" as ContentGoal,
      additionalContext: "",
      selectedSuccessStory: "none",
      wordCount: 300,
      emailCount: 3,
      selectedIdeaId: null as string | null,
      triggerInput: ""
    }
  });

  return {
    persistedValues,
    updatePersistedValue,
    clearPersistedData,
    isPersistenceLoaded
  };
};
