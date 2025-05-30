import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { ICPStoryScript, Author, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import ShortFormHeader from './short-form/ShortFormHeader';
import ShortFormMainContent from './short-form/ShortFormMainContent';
import ContentGenerationDisplay from './short-form/ContentGenerationDisplay';
import { useShortFormContentCreator } from './short-form/useShortFormContentCreator';
import { usePageReloadProtection } from '@/hooks/usePageReloadProtection';
import { ContentType } from './short-form/types';

interface ShortFormContentCreatorProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  currentProductContext?: ProductContext | null;
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  successStories,
  ideas = [],
  selectedClientId,
  currentProductContext = null,
  onBack
}) => {
  console.log('📝 ShortFormContentCreator - Client-specific asset filtering:', {
    contentType,
    selectedClientId,
    originalAuthorsCount: authors.length,
    originalScriptsCount: scripts.length,
    originalSuccessStoriesCount: successStories.length,
    originalIdeasCount: ideas.length,
    currentProductContext: currentProductContext?.name || 'none'
  });

  // Apply strict client-specific filtering for ALL assets
  const filteredAuthors = selectedClientId 
    ? authors.filter(author => author.clientId === selectedClientId)
    : authors;

  const filteredScripts = selectedClientId 
    ? scripts.filter(script => script.clientId === selectedClientId)
    : scripts;

  const filteredSuccessStories = selectedClientId 
    ? successStories.filter(story => story.clientId === selectedClientId)
    : successStories;

  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

  console.log('📝 ShortFormContentCreator - After client filtering:', {
    filteredAuthorsCount: filteredAuthors.length,
    filteredScriptsCount: filteredScripts.length,
    filteredSuccessStoriesCount: filteredSuccessStories.length,
    filteredIdeasCount: filteredIdeas.length,
    restrictionApplied: !!selectedClientId
  });

  const {
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
  } = useShortFormContentCreator({
    contentType,
    scripts: filteredScripts,
    authors: filteredAuthors,
    successStories: filteredSuccessStories,
    ideas: filteredIdeas,
    selectedClientId: selectedClientId || undefined
  });

  // Protect against accidental page reloads when form has content
  const hasFormContent = Boolean(selectedICP || selectedAuthor || additionalContext || generatedContent || triggerInput);
  usePageReloadProtection({
    enabled: hasFormContent,
    message: "You have unsaved content in your form. Are you sure you want to leave this page?"
  });

  const selectedIdea = getSelectedIdea();

  console.log('📝 ShortFormContentCreator - Final data passed to components:', {
    authorsToPass: filteredAuthors.length,
    scriptsToPass: filteredScripts.length,
    successStoriesToPass: filteredSuccessStories.length,
    ideasToPass: filteredIdeas.length
  });

  return (
    <div className="space-y-4">
      <Card className="w-full bg-white shadow-md">
        <ShortFormHeader
          contentType={contentType}
          clientName={clientName}
          onBack={onBack}
        />
        
        <ShortFormMainContent
          contentType={contentType}
          scripts={filteredScripts}
          authors={filteredAuthors}
          successStories={filteredSuccessStories}
          selectedIdea={selectedIdea}
          ideas={filteredIdeas}
          selectedClientId={selectedClientId}
          currentProductContext={currentProductContext}
          selectedICP={selectedICP}
          selectedAuthor={selectedAuthor}
          selectedAuthorTone={selectedAuthorTone}
          selectedAuthorExperience={selectedAuthorExperience}
          narrativeSelections={narrativeSelections}
          contentGoal={contentGoal}
          selectedSuccessStory={selectedSuccessStory}
          wordCount={wordCount}
          emailCount={emailCount}
          additionalContext={additionalContext}
          triggerInput={triggerInput}
          selectedIdeaId={selectedIdeaId}
          availableAnchors={availableAnchors}
          productInputs={productInputs}
          isGenerating={isGenerating}
          isFormValid={isFormValid()}
          getContentTypeLabel={getContentTypeLabel}
          onICPChange={setSelectedICP}
          onAuthorChange={setSelectedAuthor}
          onAuthorToneChange={setSelectedAuthorTone}
          onAuthorExperienceChange={setSelectedAuthorExperience}
          onNarrativeSelectionsChange={setNarrativeSelections}
          onContentGoalChange={setContentGoal}
          onSuccessStoryChange={setSelectedSuccessStory}
          onWordCountChange={setWordCount}
          onEmailCountChange={setEmailCount}
          onAdditionalContextChange={setAdditionalContext}
          onTriggerInputChange={setTriggerInput}
          onIdeaSelect={setSelectedIdeaId}
          onProductInputsChange={setProductInputs}
          onGenerateContent={generateContent}
        />
      </Card>
        
      <ContentGenerationDisplay
        content={generatedContent}
        onContentChange={setGeneratedContent}
        contentType={contentType}
        contentTypeLabel={getContentTypeLabel()}
        isGenerating={isGenerating}
        isSaving={isSaving}
        lastSaved={lastSaved}
        showRestoreDialog={showRestoreDialog}
        availableDrafts={availableDrafts}
        onSetShowRestoreDialog={setShowRestoreDialog}
        onRestoreDraft={handleRestoreDraft}
        onDeleteDraft={handleDeleteDraft}
        onClearDraft={clearCurrentDraft}
      />
    </div>
  );
};

export default ShortFormContentCreator;
