
import { useCallback } from 'react';
import { useContentGeneration } from './useContentGeneration';
import { useNarrativeAnchors } from '@/hooks/useNarrativeAnchors';
import { useShortFormValidation } from './useShortFormValidation';
import { useSelectedIdea } from './useSelectedIdea';
import { useContentTypeLabel } from './useContentTypeLabel';
import { useShortFormState } from './useShortFormState';
import { useShortFormAutoSave } from './useShortFormAutoSave';
import { useShortFormDraftRestore } from './useShortFormDraftRestore';
import { ContentType } from './types';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface UseShortFormContentCreatorProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  selectedClientId?: string;
}

export const useShortFormContentCreator = ({
  contentType,
  scripts,
  authors,
  successStories,
  ideas,
  selectedClientId
}: UseShortFormContentCreatorProps) => {
  // Core state management
  const {
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
    narrativeSelections,
    contentGoal,
    selectedSuccessStory,
    wordCount,
    emailCount,
    additionalContext,
    selectedIdeaId,
    triggerInput,
    businessContextItemType,
    businessContextItem,
    businessContextAssetId,
    generatedContent,
    isGenerating,
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setAdditionalContext,
    setSelectedIdeaId,
    setTriggerInput,
    setBusinessContextItemType,
    setBusinessContextItem,
    setBusinessContextAssetId,
    setGeneratedContent,
    setIsGenerating
  } = useShortFormState({ 
    contentType,
    scripts,
    authors,
    successStories,
    ideas,
    selectedClientId
  });

  // Utility hooks
  const { getContentTypeLabel } = useContentTypeLabel(contentType);
  const { getSelectedIdea } = useSelectedIdea({ selectedIdeaId, ideas });
  const { isFormValid } = useShortFormValidation({ selectedICP, triggerInput, selectedIdeaId });

  // Auto-save functionality
  const {
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft: originalHandleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useShortFormAutoSave({
    contentType,
    selectedClientId,
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
    narrativeSelections,
    contentGoal,
    generatedContent,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    selectedIdeaId,
    triggerInput,
    businessContextItemType,
    businessContextItem,
    businessContextAssetId
  });

  // Draft restoration
  const { handleRestoreDraft } = useShortFormDraftRestore({
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setBusinessContextItemType,
    setBusinessContextItem,
    setBusinessContextAssetId,
    originalHandleRestoreDraft
  });

  // Narrative anchors
  const { availableAnchors } = useNarrativeAnchors({
    selectedICP,
    scripts,
    narrativeSelections,
    setNarrativeSelections
  });

  // Content generation
  const { generateContent: performGeneration } = useContentGeneration({
    contentType,
    scripts,
    authors,
    successStories,
    narrativeSelections,
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedSuccessStory,
    contentGoal,
    wordCount,
    emailCount,
    additionalContext,
    triggerInput,
    setIsGenerating,
    setGeneratedContent,
    isFormValid,
    getSelectedIdea
  });

  const generateContent = useCallback(async () => {
    setIsGenerating(true);
    try {
      await performGeneration();
    } catch (error) {
      console.error('Content generation failed:', error);
      setGeneratedContent('');
    } finally {
      setIsGenerating(false);
    }
  }, [performGeneration, setGeneratedContent, setIsGenerating]);

  return {
    // State
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
    narrativeSelections,
    contentGoal,
    generatedContent,
    isGenerating,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
    businessContextItemType,
    businessContextItem,
    businessContextAssetId,
    getSelectedIdea,
    
    // Actions
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setBusinessContextItemType,
    setBusinessContextItem,
    setBusinessContextAssetId,
    
    // Computed
    getContentTypeLabel,
    isFormValid,
    generateContent,
    
    // Auto-save functionality
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  };
};
