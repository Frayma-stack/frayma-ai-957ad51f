
import { useState } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useShortFormState } from './useShortFormState';
import { useShortFormContentGeneration } from './useShortFormContentGeneration';
import { useAutoSaveIntegration } from '@/hooks/useAutoSaveIntegration';
import { ContentType } from './types';

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
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    // State
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
    narrativeSelections,
    contentGoal,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
    productInputs,
    getSelectedIdea,
    
    // Actions
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setProductInputs
  } = useShortFormState({
    contentType,
    scripts,
    authors,
    successStories,
    ideas,
    selectedClientId
  });

  // Auto-save integration with proper content tracking
  const autoSaveIntegration = useAutoSaveIntegration({
    contentType,
    clientId: selectedClientId,
    authorId: selectedAuthor || undefined,
    initialContent: generatedContent,
    initialTitle: '',
    onDraftRestored: (title: string, content: string) => {
      console.log('🔄 Draft restored in content creator:', { title, content: content.substring(0, 50) + '...' });
      setGeneratedContent(content);
    }
  });

  const {
    generateContent,
    getContentTypeLabel
  } = useShortFormContentGeneration({
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
    setGeneratedContent: (content: string) => {
      console.log('📝 Generated content set:', {
        contentLength: content.length,
        contentPreview: content ? content.substring(0, 50) + '...' : 'empty'
      });
      setGeneratedContent(content);
    },
    getSelectedIdea,
    isFormValid: () => {
      const selectedIdea = getSelectedIdea();
      if (triggerInput.trim()) {
        return Boolean(selectedAuthor);
      } else if (selectedIdea) {
        return Boolean(selectedAuthor);
      } else {
        return Boolean(selectedICP && selectedAuthor && narrativeSelections.length > 0);
      }
    }
  });

  const isFormValid = () => {
    const selectedIdea = getSelectedIdea();
    if (triggerInput.trim()) {
      return Boolean(selectedAuthor);
    } else if (selectedIdea) {
      return Boolean(selectedAuthor);
    } else {
      return Boolean(selectedICP && selectedAuthor && narrativeSelections.length > 0);
    }
  };

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
    productInputs,
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
    setProductInputs,
    
    // Computed
    getContentTypeLabel,
    isFormValid,
    generateContent,
    
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
