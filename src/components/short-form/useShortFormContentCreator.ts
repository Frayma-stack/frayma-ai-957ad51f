
import { useState, useEffect, useCallback } from 'react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useContentGeneration } from './useContentGeneration';
import { useNarrativeAnchors } from './useNarrativeAnchors';
import { ContentType, ContentGoal } from './types';
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
  // State management
  const [selectedICP, setSelectedICP] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>('');
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>('');
  const [selectedAuthorBelief, setSelectedAuthorBelief] = useState<string>('');
  const [narrativeSelections, setNarrativeSelections] = useState<string[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>({
    type: 'awareness',
    description: 'Build awareness and thought leadership'
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(150);
  const [emailCount, setEmailCount] = useState<number>(3);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [triggerInput, setTriggerInput] = useState<string>('');
  const [productInputs, setProductInputs] = useState({
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: [],
    customPOV: ''
  });

  // Get content type label
  const getContentTypeLabel = useCallback(() => {
    switch (contentType) {
      case 'linkedin':
        return 'LinkedIn Post';
      case 'email':
        return 'Email Sequence';
      case 'custom':
      default:
        return 'Custom Content';
    }
  }, [contentType]);

  // Auto-save configuration - only save if there's meaningful content
  const autoSaveData = {
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
    productInputs,
    contentType,
    selectedClientId
  };

  // Only enable auto-save if there's meaningful content
  const hasContent = Boolean(
    selectedICP || 
    selectedAuthor || 
    additionalContext || 
    generatedContent || 
    triggerInput ||
    narrativeSelections.length > 0
  );

  const autoSaveKey = `short_form_${contentType}_${selectedClientId || 'default'}`;
  
  const {
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft: originalHandleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useAutoSave({
    key: autoSaveKey,
    data: autoSaveData,
    enabled: hasContent,
    debounceMs: 2000
  });

  // Enhanced restore draft handler
  const handleRestoreDraft = useCallback((draft: any) => {
    if (!draft || !draft.data) return;
    
    const data = draft.data;
    
    // Safely restore each field with fallbacks
    if (data.selectedICP) setSelectedICP(data.selectedICP);
    if (data.selectedAuthor) setSelectedAuthor(data.selectedAuthor);
    if (data.selectedAuthorTone) setSelectedAuthorTone(data.selectedAuthorTone);
    if (data.selectedAuthorExperience) setSelectedAuthorExperience(data.selectedAuthorExperience);
    if (data.selectedAuthorBelief) setSelectedAuthorBelief(data.selectedAuthorBelief);
    if (Array.isArray(data.narrativeSelections)) setNarrativeSelections(data.narrativeSelections);
    if (data.contentGoal) setContentGoal(data.contentGoal);
    if (data.generatedContent) setGeneratedContent(data.generatedContent);
    if (data.additionalContext) setAdditionalContext(data.additionalContext);
    if (data.selectedSuccessStory) setSelectedSuccessStory(data.selectedSuccessStory);
    if (typeof data.wordCount === 'number') setWordCount(data.wordCount);
    if (typeof data.emailCount === 'number') setEmailCount(data.emailCount);
    if (data.selectedIdeaId) setSelectedIdeaId(data.selectedIdeaId);
    if (data.triggerInput) setTriggerInput(data.triggerInput);
    if (data.productInputs) setProductInputs(data.productInputs);
    
    originalHandleRestoreDraft(data);
  }, [originalHandleRestoreDraft]);

  // Get selected idea
  const getSelectedIdea = useCallback(() => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  }, [selectedIdeaId, ideas]);

  // Get available narrative anchors
  const { availableAnchors } = useNarrativeAnchors({
    selectedICP,
    scripts
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
    triggerInput
  });

  const generateContent = useCallback(async () => {
    setIsGenerating(true);
    try {
      const content = await performGeneration(getSelectedIdea);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Content generation failed:', error);
      setGeneratedContent('');
    } finally {
      setIsGenerating(false);
    }
  }, [performGeneration, getSelectedIdea]);

  // Form validation
  const isFormValid = useCallback(() => {
    if (!selectedICP) return false;
    if (!triggerInput && !selectedIdeaId) return false;
    return true;
  }, [selectedICP, triggerInput, selectedIdeaId]);

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
