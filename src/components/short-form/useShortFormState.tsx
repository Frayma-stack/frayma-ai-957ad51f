
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useFormPersistedState } from '@/hooks/useFormPersistedState';
import { useIdeaIntegration } from '@/hooks/useIdeaIntegration';
import { useClientNameResolver } from '@/hooks/useClientNameResolver';
import { useNarrativeAnchors } from '@/hooks/useNarrativeAnchors';

type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
}

export const useShortFormState = ({
  scripts,
  authors,
  successStories,
  ideas
}: UseShortFormStateProps) => {
  const { toast } = useToast();
  
  // Use form persistence
  const {
    persistedValues,
    updatePersistedValue,
    clearPersistedData,
    isPersistenceLoaded
  } = useFormPersistedState();

  // Local state
  const [selectedICP, setSelectedICP] = useState<string>(persistedValues.selectedICP);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(persistedValues.selectedAuthor);
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>(persistedValues.selectedAuthorTone);
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>(persistedValues.selectedAuthorExperience);
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(persistedValues.contentGoal);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [additionalContext, setAdditionalContext] = useState<string>(persistedValues.additionalContext);
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>(persistedValues.selectedSuccessStory);
  const [wordCount, setWordCount] = useState<number>(persistedValues.wordCount);
  const [emailCount, setEmailCount] = useState<number>(persistedValues.emailCount);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(persistedValues.selectedIdeaId);
  const [triggerInput, setTriggerInput] = useState<string>(persistedValues.triggerInput);

  // Use client name resolver
  const { clientName } = useClientNameResolver({ scripts, authors, successStories });

  // Use idea integration
  const { getSelectedIdea } = useIdeaIntegration({
    ideas,
    selectedIdeaId,
    updatePersistedValue,
    setAdditionalContext,
    setContentGoal,
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
      setContentGoal(persistedValues.contentGoal);
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

  // Custom setters that also update persistence
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
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    narrativeSelections,
    contentGoal,
    generatedContent,
    isGenerating,
    clientName,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
    toast,
    getSelectedIdea,
    setSelectedICP: setSelectedICPWithPersistence,
    setSelectedAuthor: setSelectedAuthorWithPersistence,
    setSelectedAuthorTone: setSelectedAuthorToneWithPersistence,
    setSelectedAuthorExperience: setSelectedAuthorExperienceWithPersistence,
    setNarrativeSelections,
    setContentGoal: setContentGoalWithPersistence,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext: setAdditionalContextWithPersistence,
    setSelectedSuccessStory: setSelectedSuccessStoryWithPersistence,
    setWordCount: setWordCountWithPersistence,
    setEmailCount: setEmailCountWithPersistence,
    setSelectedIdeaId: setSelectedIdeaIdWithPersistence,
    setTriggerInput: setTriggerInputWithPersistence,
    clearPersistedData
  };
};
