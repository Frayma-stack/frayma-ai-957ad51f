
import { useShortFormState } from './useShortFormState';
import { useContentGeneration } from './useContentGeneration';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';

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
  const {
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
    productInputs,
    toast,
    getSelectedIdea,
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setProductInputs,
    // Auto-save functionality
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useShortFormState({ 
    scripts, 
    authors, 
    successStories, 
    ideas, 
    contentType,
    selectedClientId 
  });

  const {
    getSelectedICPScript,
    getSelectedAuthor,
    getSelectedSuccessStory,
    generateEmailContent,
    generateLinkedInContent,
    generateCustomContent
  } = useContentGeneration({
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

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  const isFormValid = (): boolean => {
    // If we have a trigger input, we need at least an author
    if (triggerInput.trim()) {
      return Boolean(selectedAuthor);
    }
    
    // If an idea is selected, we don't need ICP and narrative selections
    if (getSelectedIdea()) {
      return Boolean(selectedAuthor);
    }
    
    // Otherwise, we need the full form
    if (!selectedICP || !selectedAuthor) return false;
    
    const hasSelectedItems = narrativeSelections.some(
      selection => selection.items.length > 0
    );
    
    return hasSelectedItems;
  };

  const generateContent = () => {
    if (!isFormValid()) {
      const selectedIdea = getSelectedIdea();
      if (triggerInput.trim()) {
        toast({
          title: "Missing information",
          description: "Please select an author to generate content using your trigger.",
          variant: "destructive"
        });
      } else if (selectedIdea) {
        toast({
          title: "Missing information",
          description: "Please select an author to generate content using your saved idea.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Missing information",
          description: "Please select an ICP, author, and at least one narrative item to generate content.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = getSelectedAuthor();
      const successStory = getSelectedSuccessStory();
      const selectedIdea = getSelectedIdea();
      
      if (!author) {
        setIsGenerating(false);
        return;
      }
      
      let content = "";
      
      if (contentType === 'email') {
        content = generateEmailContent(script, author, successStory, selectedIdea, triggerInput);
      } else if (contentType === 'linkedin') {
        content = generateLinkedInContent(script, author, successStory, selectedIdea, triggerInput);
      } else if (contentType === 'custom') {
        content = generateCustomContent(script, author, successStory, selectedIdea, triggerInput);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: `${getContentTypeLabel()} generated`,
        description: "Your content has been created. Feel free to edit it as needed."
      });
    }, 1500);
  };

  return {
    // State
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
    productInputs,
    getSelectedIdea,
    
    // Actions
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
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
