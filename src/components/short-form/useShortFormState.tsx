
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection,
  ProductContext,
  ProductFeature,
  ProductUseCase,
  ProductDifferentiator
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useFormPersistedState } from '@/hooks/useFormPersistedState';
import { useIdeaIntegration } from '@/hooks/useIdeaIntegration';
import { useClientNameResolver } from '@/hooks/useClientNameResolver';
import { useNarrativeAnchors } from '@/hooks/useNarrativeAnchors';
import { useAutoSaveIntegration } from '@/hooks/useAutoSaveIntegration';

type ContentGoal = {
  type: 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';
  description: string;
};

interface ProductContextInputs {
  selectedProductContextType: 'features' | 'usecases' | 'differentiators' | '';
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
}

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  contentType: string;
  selectedClientId?: string;
}

export const useShortFormState = ({
  scripts,
  authors,
  successStories,
  ideas,
  contentType,
  selectedClientId
}: UseShortFormStateProps) => {
  const { toast } = useToast();
  
  // Use form persistence
  const {
    persistedValues,
    updatePersistedValue,
    clearPersistedData,
    isPersistenceLoaded
  } = useFormPersistedState();

  // Custom setters that also update persistence - DECLARE THESE FIRST
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

  // Local state
  const [selectedICP, setSelectedICP] = useState<string>(persistedValues.selectedICP);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(persistedValues.selectedAuthor);
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>(persistedValues.selectedAuthorTone);
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>(persistedValues.selectedAuthorExperience);
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(
    persistedValues.contentGoal || { type: 'book_call', description: '' }
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [additionalContext, setAdditionalContext] = useState<string>(persistedValues.additionalContext);
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>(persistedValues.selectedSuccessStory);
  const [wordCount, setWordCount] = useState<number>(persistedValues.wordCount);
  const [emailCount, setEmailCount] = useState<number>(persistedValues.emailCount);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(persistedValues.selectedIdeaId);
  const [triggerInput, setTriggerInput] = useState<string>(persistedValues.triggerInput);

  // Product Context state
  const [productInputs, setProductInputs] = useState<ProductContextInputs>({
    selectedProductContextType: '',
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: []
  });

  // Auto-save integration
  const autoSaveIntegration = useAutoSaveIntegration({
    contentType,
    clientId: selectedClientId,
    onDraftRestored: (title, content) => {
      // When a draft is restored, we don't need to update form fields
      // as the content is the generated output, not the form inputs
      toast({
        title: "Draft restored",
        description: "Your previous content has been restored.",
      });
    }
  });

  // Use client name resolver
  const { clientName } = useClientNameResolver({ scripts, authors, successStories });

  // Use idea integration
  const { getSelectedIdea } = useIdeaIntegration({
    ideas,
    selectedIdeaId,
    updatePersistedValue,
    setAdditionalContext: setAdditionalContextWithPersistence,
    setContentGoal: setContentGoalWithPersistence,
    additionalContext
  });

  // Use narrative anchors
  const { availableAnchors } = useNarrativeAnchors({
    selectedICP,
    scripts,
    narrativeSelections,
    setNarrativeSelections
  });

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

  return {
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    narrativeSelections,
    contentGoal,
    generatedContent: autoSaveIntegration.content,
    isGenerating,
    clientName,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
    productInputs,
    toast,
    getSelectedIdea,
    setSelectedICP: setSelectedICPWithPersistence,
    setSelectedAuthor: setSelectedAuthorWithPersistence,
    setSelectedAuthorTone: setSelectedAuthorToneWithPersistence,
    setSelectedAuthorExperience: setSelectedAuthorExperienceWithPersistence,
    setNarrativeSelections,
    setContentGoal: setContentGoalWithPersistence,
    setGeneratedContent: autoSaveIntegration.setContent,
    setIsGenerating,
    setAdditionalContext: setAdditionalContextWithPersistence,
    setSelectedSuccessStory: setSelectedSuccessStoryWithPersistence,
    setWordCount: setWordCountWithPersistence,
    setEmailCount: setEmailCountWithPersistence,
    setSelectedIdeaId: setSelectedIdeaIdWithPersistence,
    setTriggerInput: setTriggerInputWithPersistence,
    setProductInputs,
    clearPersistedData,
    // Auto-save functionality
    isSaving: autoSaveIntegration.isSaving,
    lastSaved: autoSaveIntegration.lastSaved,
    showRestoreDialog: autoSaveIntegration.showRestoreDialog,
    setShowRestoreDialog: autoSaveIntegration.setShowRestoreDialog,
    availableDrafts: autoSaveIntegration.availableDrafts,
    handleRestoreDraft: autoSaveIntegration.handleRestoreDraft,
    handleDeleteDraft: autoSaveIntegration.handleDeleteDraft,
    clearCurrentDraft: autoSaveIntegration.clearCurrentDraft
  };
};
